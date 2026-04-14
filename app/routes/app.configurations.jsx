import { useState, useCallback, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import {
    Card,
    Layout,
    Page,
    Text,
    BlockStack,
    Select,
    Box,
    RadioButton,
    InlineGrid,
    RangeSlider,
    FooterHelp,
    Link,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import LoadingSpinner from "./app.spinner";

export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    const { shop } = session;

    let config;
    try {
        config = await db.configuration.findUnique({
            where: { shop },
        });

        if (!config) {
            config = await db.configuration.create({
                data: {
                    shop,
                    customLocation: "allpages",
                    animationType: "snowfall",
                    animationCount: 80,
                    animationSize: 20,
                },
            });
        }
    } catch (error) {
        console.error("Database error in loader:", error);
        // Fallback to default config if DB fails
        config = {
            shop,
            customLocation: "allpages",
            animationType: "snowfall",
            animationCount: 80,
            animationSize: 20,
        };
    }

    return json({ config });
};

export const action = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const { shop } = session;
    const formData = await request.formData();

    const customLocation = formData.get("customLocation");
    const animationType = formData.get("animationType");
    const animationCount = parseInt(formData.get("animationCount"), 10) || 80;
    const animationSize = parseInt(formData.get("animationSize"), 10) || 20;

    try {
        await db.configuration.upsert({
            where: { shop },
            update: { customLocation, animationType, animationCount, animationSize },
            create: { shop, customLocation, animationType, animationCount, animationSize },
        });
    } catch (error) {
        console.error("Database error in action:", error);
        return json({ error: "Failed to save configuration to database" }, { status: 500 });
    }

    // More robust GraphQL query format
    const shopResponse = await admin.graphql(
        `#graphql
        query getShopId {
          shop {
            id
          }
        }`
    );
    const shopData = await shopResponse.json();
    const shopId = shopData?.data?.shop?.id;

    if (!shopId) {
        return json({ error: "Could not find shop ID" }, { status: 400 });
    }

    const metafieldValue = JSON.stringify({
        custom_location: customLocation,
        animation_type: animationType,
        animation_count: animationCount,
        animation_size: animationSize,
    });

    await admin.graphql(
        `#graphql
        mutation CreateMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafieldsSetInput) {
            metafields {
              id
            }
            userErrors {
              field
              message
            }
          }
        }`,
        {
            variables: {
                metafieldsSetInput: [
                    {
                        namespace: "icemajesty",
                        key: "settings",
                        type: "json",
                        value: metafieldValue,
                        ownerId: shopId,
                    },
                ],
            },
        }
    );

    return json({ success: true });
};

export default function Configurations() {
    const { config } = useLoaderData();
    const actionData = useActionData();
    const navigation = useNavigation();
    const isLoadingPage =
        navigation.state === "loading" && !navigation.formMethod;

    // Local state for UI components
    const [customLocation, setCustomLocation] = useState(config.customLocation || "allpages");
    const [animationType, setAnimationType] = useState(config.animationType || "snowfall");
    const [animationCount, setAnimationCount] = useState(config.animationCount || 80);
    const [animationSize, setAnimationSize] = useState(config.animationSize || 20);

    // Sync state when config changes (after successful save)
    useEffect(() => {
        setCustomLocation(config.customLocation || "allpages");
        setAnimationType(config.animationType || "snowfall");
        setAnimationCount(config.animationCount || 80);
        setAnimationSize(config.animationSize || 20);
    }, [config]);

    // Show Toast on success
    useEffect(() => {
        if (actionData?.success) {
            shopify.toast.show("Settings Saved Successfully");
        }
    }, [actionData]);

    const handleLocationChange = useCallback((value) => setCustomLocation(value), []);
    const handleAnimationTypeChange = useCallback((_checked, id) => setAnimationType(id), []);
    const handleAnimationCountChange = useCallback((value) => setAnimationCount(value), []);
    const handleAnimationSizeChange = useCallback((value) => setAnimationSize(value), []);

    const locationOptions = [
        { label: "All Pages", value: "allpages" },
        { label: "Home Page", value: "homepage" },
        { label: "Product Page", value: "productpage" },
        { label: "Collection Page", value: "collectionpage" },
    ];
    const AnimationTypes = [
        { label: "❄️ Snowfall", id: "snowfall", value: "snowfall" },
        { label: "⭐ Stars", id: "stars", value: "stars" },
        { label: "🍁 Leaves", id: "leaves", value: "leaves" },
        { label: "❤️ Hearts", id: "hearts", value: "hearts" },
        { label: "🏷️ Sale", id: "sale", value: "sale" },
        { label: "🎄 Christmas Tree", id: "christmasTree", value: "christmasTree" },
        { label: "🎁 Gift", id: "gift", value: "gift" },
        { label: "🎉 Party Poppers", id: "partyPoppers", value: "partyPoppers" },
        { label: "🎨 Color Dots", id: "holi", value: "holi" },
        { label: "🪔 Diya Lamp", id: "diyaLamp", value: "diyaLamp" },
    ];

    return isLoadingPage ? (
        <LoadingSpinner />
    ) : (
        <Page title="Snowfall Animation Settings">
            <style>{`
            .Polaris-TextField--disabled { 
                color: #000000; 
            } 
            .Polaris-TextField--disabled .Polaris-TextField__Input { 
                color: #000000; 
                text-transform: uppercase;
                letter-spacing: 1px;
                -webkit-text-fill-color: #000000; 
                border: var(--p-border-width-0165) solid var(--p-color-input-border);
                border-radius: var(--p-border-radius-200);
            } 
            .Polaris-RangeSlider-SingleThumb__Prefix {
                font-weight: 600;
            }
            .Polaris-Connected__Item:not(:first-child) { 
                margin-left: 10px; 
            }`}</style>
            <Box minHeight="82vh">
                <Layout>
                    <Layout.Section>
                        <Form method="POST" data-save-bar>
                            <BlockStack gap="300">
                                <InlineGrid columns={3} align="space-between" blockAlign="center" gap="400">
                                    <Card>
                                        <Box minWidth="48%">
                                            <BlockStack gap="200">
                                                <Text as="p" fontWeight="semibold">Select Page</Text>
                                                <Select
                                                    name="customLocation"
                                                    options={locationOptions}
                                                    onChange={handleLocationChange}
                                                    value={customLocation}
                                                />
                                            </BlockStack>
                                        </Box>
                                    </Card>

                                    <Card>
                                        <Box>
                                            <BlockStack gap="200">
                                                <Text as="p" fontWeight="semibold">Number of Animation Effect</Text>
                                                <input type="hidden" name="animationCount" value={animationCount} />
                                                <RangeSlider
                                                    value={animationCount}
                                                    onChange={handleAnimationCountChange}
                                                    name="animationCount"
                                                    output={true}
                                                    min={20}
                                                    max={150}
                                                    prefix={animationCount}
                                                    step={1}
                                                />
                                            </BlockStack>
                                        </Box>
                                    </Card>

                                    <Card>
                                        <Box>
                                            <BlockStack gap="200">
                                                <Text as="p" fontWeight="semibold">Size of Animation Effect</Text>
                                                <input type="hidden" name="animationSize" value={animationSize} />
                                                <RangeSlider
                                                    value={animationSize}
                                                    onChange={handleAnimationSizeChange}
                                                    name="animationSize"
                                                    output
                                                    min={15}
                                                    max={50}
                                                    prefix={animationSize}
                                                    step={1}
                                                />
                                            </BlockStack>
                                        </Box>
                                    </Card>
                                </InlineGrid>

                                <Card>
                                    <Box>
                                        <BlockStack gap="200">
                                            <Text as="p" fontWeight="semibold">Animation Effect</Text>

                                            <BlockStack>
                                                {AnimationTypes.map((animation) => (
                                                    <RadioButton
                                                        label={animation.label}
                                                        id={animation.id}
                                                        name="animationType"
                                                        value={animation.value}
                                                        checked={animation.value === animationType}
                                                        onChange={handleAnimationTypeChange}
                                                    />
                                                ))}
                                            </BlockStack>
                                        </BlockStack>
                                    </Box>
                                </Card>
                            </BlockStack>
                        </Form>
                    </Layout.Section>
                </Layout>
            </Box>
            <FooterHelp>
                Need Help? Contact{' '}
                <Link target="_blank" url="mailto:codecrewdeveloper@gmail.com">
                    Support
                </Link>
            </FooterHelp>
        </Page>
    );
}