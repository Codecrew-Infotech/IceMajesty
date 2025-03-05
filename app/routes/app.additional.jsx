import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  // await authenticate.admin(request);

  return admin;
};

export default function AdditionalPage() {
  const data = useLoaderData();
  console.log("data", data);
  return (
    <Page>
      <ui-title-bar title="Installation Guide" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                To enable snow effects on your store please follow this steps 🎉
              </Text>

              <Text as="p">
                Click on customization to enable the app from the admin
                dashboard
              </Text>
              <Text as="h2" variant="headingMd">
                OR
              </Text>
              <Text variant="bodyMd" as="p">
                1. Open Online Store, then select any theme's customization
                where you want to add the Snow Effects.
              </Text>
              <Text variant="bodyMd" as="p">
                2. Click on App embeds.
              </Text>
              <Text variant="bodyMd" as="p">
                3. Enable the Animation Effects.
              </Text>
              <Text variant="bodyMd" as="p">
                4. You can now able to see the Snow fall on home page. You can
                change the color of the Snowflake.
              </Text>
              <Text variant="bodyMd" as="p">
                5. Save the changes and it will reflect on preview of your
                store.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
