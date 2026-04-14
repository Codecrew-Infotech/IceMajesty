import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  InlineStack,
  Grid,
  Banner,
  Badge,
} from "@shopify/polaris";
import { apiVersion, authenticate } from "../shopify.server";
import appData from "./app.recommended_apps";
import LoadingSpinner from "./app.spinner";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  try {
    const { shop } = session;
    const appID = process.env.SHOPIFY_API_KEY || "";

    const response = await admin.graphql(
      `#graphql
        query {
          themes(first: 20) {
            edges {
              node {
                name
                id
                role
              }
            }
          }
        }`,
    );

    const data = await response.json();

    const mainTheme = data?.data?.themes?.edges?.find(
      (theme) => theme?.node?.role === "MAIN",
    );

    const themeId = mainTheme?.node?.id;

    const responseOfShop = await fetch(
      `https://${shop}/admin/api/${apiVersion}/shop.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": session?.accessToken,
        },
      },
    );

    if (!responseOfShop.ok) {
      throw new Error(
        `Failed to fetch shop details: ${responseOfShop.status} ${responseOfShop.statusText}`,
      );
    }

    const shopDetails = await responseOfShop.json();

    let isAppEmbedded = false;
    let appEmbedDetails = null;

    if (themeId && appID) {
      try {
        const numericThemeId = themeId.split("/").pop();

        const appEmbedsResponse = await fetch(
          `https://${shop}/admin/api/${apiVersion}/themes/${numericThemeId}/assets.json?asset[key]=config/settings_data.json`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": session?.accessToken,
            },
          },
        );

        if (appEmbedsResponse.ok) {
          const appEmbedsData = await appEmbedsResponse.json();
          const settingsData = JSON.parse(appEmbedsData.asset.value);

          const currentBlocks = settingsData.current?.blocks || {};

          const appBlock = Object.values(currentBlocks).find(
            (block) => block.type && block.type.includes("image_block"),
          );

          if (appBlock) {
            isAppEmbedded = Object.values(currentBlocks).some(
              (block) =>
                block.type.includes("image_block") &&
                block.disabled === false,
            );
            appEmbedDetails = {
              blockId: Object.keys(currentBlocks).find(
                (key) => currentBlocks[key] === appBlock,
              ),
              blockType: appBlock.type,
              settings: appBlock.settings || {},
              disabled: appBlock.disabled || false,
            };
          }
        }
      } catch (embedError) {
        console.error("Error checking app embed:", embedError);
      }
    }

    return json({
      shopDetails,
      shop,
      themeId,
      appID,
      isAppEmbedded,
      appEmbedDetails,
      mainThemeName: mainTheme?.node?.name,
    });
  } catch (error) {
    console.error("Loader error", error);
    return json({
      shopDetails: null,
      shop: null,
      themeId: null,
      appID: null,
      isAppEmbedded: false,
      appEmbedDetails: null,
      mainThemeName: null,
    });
  }
  // return session;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
};

export default function Index() {
  const { shopDetails, shop, themeId, appID, isAppEmbedded, mainThemeName } = useLoaderData();
  const [shopOwnerName, setShopOwnerName] = useState("");


  const storeDomain = shopDetails?.shop?.myshopify_domain?.split(".")[0];
  const theme_id = themeId?.split("/")?.pop();
  const blockType = "image_block";
  const navigation = useNavigation();
  const isLoadingPage =
    navigation.state === "loading" && !navigation.formMethod;

  useEffect(() => {
    const shop = shopDetails?.shop?.shop_owner;
    setShopOwnerName(shop);
  }, [shopDetails]);

  const greetings = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Afternoon";
    } else {
      return "Evening";
    }
  };

  return isLoadingPage ? (
    <LoadingSpinner />
  ) : (
    <Page>
      <Layout>

        <Layout.Section>
          {isAppEmbedded && mainThemeName ? (
            <Banner
              title="App Embed Status"
              tone="success"
            >
              <InlineStack
                gap={200}
                align="space-between"
                blockAlign="center"
              >
                <InlineStack
                  gap={200}
                  align="space-between"
                  blockAlign="center"
                >
                  <Box as="span">Live Theme:</Box>
                  <Text fontWeight="bold">{mainThemeName}</Text>
                  <Badge tone="success">Active</Badge>
                </InlineStack>
              </InlineStack>
            </Banner>
          ) : (
            <Banner
              tone="warning"
              title="Enable App Embed"
            >
              <InlineStack gap="200" align="space-between">
                <Text>
                  Enable App Embeds to use the app featured in your store.
                </Text>
                <Box>
                  <Button
                    variant="primary"
                    url={`https://admin.shopify.com/store/${storeDomain}/themes/${theme_id}/editor?context=apps&activateAppId=${appID}/${blockType}`}
                    fullWidth={false}
                    target="_blank"
                  >
                    Enable
                  </Button>
                </Box>
              </InlineStack>
            </Banner>
          )}
        </Layout.Section>

        <Layout.Section>
          <Card>
            <InlineStack blockAlign="center" align="space-between">
              <Box>
                <InlineStack blockAlign="center">
                  <Text as="h1" variant="headingXl">
                    Good {greetings()},&nbsp;
                  </Text>
                  {shopOwnerName && (
                    <Text
                      as="h1"
                      variant="headingXl"
                      style={{ display: "none" }}
                    >
                      {shopOwnerName} 👋
                    </Text>
                  )}
                </InlineStack>
                <Box paddingBlockStart="100">
                  <Text as="p" variant="bodyLg">
                    Welcome to IceMajesty
                  </Text>
                </Box>
              </Box>
              <img
                src="https://cdn.shopify.com/s/files/1/0560/1535/6003/files/IceMajestic-Logo.png?v=1708673247"
                alt="IceMajesty"
                style={{ maxWidth: 70, height: 70, marginRight: "20px" }}
              />
            </InlineStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Box padding="500">
              <BlockStack gap="300">
                <Box>
                  <InlineStack align="center">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0560/1535/6003/files/christmas-logo.jpg?v=1704699212"
                      alt="Christmas"
                      style={{
                        width: 180,
                        height: 180,
                        borderRadius: 5,
                      }}
                    />
                  </InlineStack>
                </Box>
                <Box paddingBlockStart="200">
                  <InlineStack align="center">
                    <Text as="h2" variant="headingLg">
                      Welcome to Christmas snowfall effects!
                    </Text>
                  </InlineStack>
                </Box>
                <Box>
                  <InlineStack align="center">
                    <Text as="p" variant="bodyLg">
                      Boost your christmas with beautiful snowfall during the season.
                    </Text>
                  </InlineStack>
                </Box>
                <Box paddingBlockStart="100">
                  <InlineStack gap="200" align="center">
                    <Button size="large" variant="primary" url="/app/configurations">
                      Configure
                    </Button>
                    <Button size="large" url="/app/additional">
                      How to use
                    </Button>
                  </InlineStack>
                </Box>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Box paddingBlockEnd="500">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="headingMd" as="h2">
                    Recommended apps
                  </Text>
                  <Button
                    url="https://apps.shopify.com/partners/gaurang2"
                    external
                    target="_blank"
                  >
                    More Apps
                  </Button>
                </InlineStack>

                <Grid>
                  {appData.map((app, index) => (
                    <Grid.Cell
                      key={index}
                      columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                    >
                      <Card title="Sales" sectioned>
                        <InlineStack wrap={false} gap="400">
                          <Box>
                            <img
                              src={app.imageUrl}
                              alt={app.imageAlt}
                              style={{
                                width: "5rem",
                                height: "5rem",
                                borderRadius: "10px",
                              }}
                            />
                          </Box>
                          <BlockStack inlineAlign="start" gap="100">
                            <Text variant="headingMd" as="h2">
                              <div>{app.title}</div>
                            </Text>
                            <Text variant="bodyMd" as="p">
                              <div style={{ marginBottom: "5px" }}>
                                {app.description}
                              </div>
                            </Text>
                            <Button
                              url={app.appUrl}
                              external={true}
                              target="_blank"
                              fullWidth={false}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                Install Now
                              </div>
                            </Button>
                          </BlockStack>
                        </InlineStack>
                      </Card>
                    </Grid.Cell>
                  ))}
                </Grid>
              </BlockStack>
            </Card>
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
