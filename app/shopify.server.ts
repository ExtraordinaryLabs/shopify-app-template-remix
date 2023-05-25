import {
  BillingInterval,
  DeliveryMethod,
  LogSeverity,
  shopifyApp,
} from "@shopify/shopify-app-remix";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";

// TODO figure out why this shows as an error in vscode only
// @ts-ignore
import prisma from "~/db.server";

export const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: process.env.SCOPES?.split(",")!,
  appUrl: process.env.SHOPIFY_APP_URL!,
  authPathPrefix: process.env.SHOPIFY_APP_AUTH_AUTHORIZATION_PATH,
  sessionStorage: new PrismaSessionStorage(prisma),
  restResources,
  logger: {
    level: LogSeverity.Debug,
  },
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
    },
  },
  billing: {
    monthly: {
      amount: 5,
      currencyCode: "EUR",
      interval: BillingInterval.Every30Days,
    },
  },
});