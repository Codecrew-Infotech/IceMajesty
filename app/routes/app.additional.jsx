import {
  Box,
  Card,
  Layout,
  Page,
  Text,
  BlockStack,
  Divider,
  Icon,
  InlineStack,
  FooterHelp,
  Link,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useNavigation } from "@remix-run/react";
import LoadingSpinner from "./app.spinner";
import {
  AppsIcon
} from '@shopify/polaris-icons';

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return session;
};


export default function AdditionalPage() {
  const navigation = useNavigation();
  const isLoadingPage =
    navigation.state === "loading" && !navigation.formMethod;

  return isLoadingPage ? (
    <LoadingSpinner />
  ) : (
    <Page title="Installation Guide">
      <Box minHeight="82vh">
        <Layout>
          <Layout.Section>
            <style>{
              `
            .Polaris-Icon {
              margin: 0;
            }
            .Polaris-Text--root.Polaris-Text--bodyLg {
              display: flex;
            }
            `}
            </style>
            <Card>
              <BlockStack gap="300">
                <Text as="h1" variant="headingMd">
                  To enable snow effects on your store please follow these steps.
                </Text>

                <Text as="p" variant="bodyLg">
                  1. Click on customization to enable the app from the admin
                  dashboard
                </Text>
                <Text as="p" variant="bodyLg">
                  2. You will be redirected to the theme customization
                </Text>
                <Text as="p" variant="bodyLg">
                  3. Now, you can customize the location and snow color as per your requirment.
                </Text>
                <Divider />
                <Text as="h2" variant="headingMd">
                  OR
                </Text>
                <Text variant="bodyLg" as="p">
                  1. Open Online Store, then select any theme's customization
                  where you want to add the Snow Effects.
                </Text>
                <Text variant="bodyLg" as="p">
                  2. Click on App embeds (<Icon accessibilityLabel="text" source={AppsIcon}></Icon>) on the top left corner.
                </Text>
                <Text variant="bodyLg" as="p">
                  3. Enable the Animation Effects.
                </Text>
                <Text variant="bodyLg" as="p">
                  4. You can now able to see the Snow fall on home page. You can
                  change the color of the Snowflake.
                </Text>
                <Text variant="bodyLg" as="p">
                  5. Save the changes and it will reflect on preview of your
                  store.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Box>
      <FooterHelp>
        <Text variant="bodyMd">
          Need help? Contact{' '}
          <Link target="_blank" url="mailto:codecrewdeveloper@gmail.com">
            Support
          </Link>
        </Text>
      </FooterHelp>

    </Page>
  );
}
