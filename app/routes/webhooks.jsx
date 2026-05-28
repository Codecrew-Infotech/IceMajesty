import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
      console.log(`Received customers data request for ${shop}`);
      console.log(JSON.stringify(payload, null, 2));

    case "CUSTOMERS_REDACT":
      console.log(`Received customers redact for ${shop}`);
      console.log(JSON.stringify(payload, null, 2));

    case "SHOP_REDACT":
      if (!session) {
        return new Response("", { status: 400 });
      }
      console.log(`Received shop redact for ${shop}`);
      console.log(JSON.stringify(payload, null, 2));

    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
