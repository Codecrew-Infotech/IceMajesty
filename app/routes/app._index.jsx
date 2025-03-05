import { useEffect } from "react";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  LegacyCard,
  EmptyState,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  // await authenticate.admin(request);

  return session;
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
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  const { shop } = useLoaderData();

  const handleClickCustomize = () => {
    window.open(
      `https://${shop}/admin/themes/current/editor?context=apps`,
      "_blank"
    );
  };

  return (
    <Page>
      <ui-title-bar title="IceMajesty"></ui-title-bar>
      <BlockStack gap="500">
        <LegacyCard sectioned>
          <EmptyState
            heading="Welcome to Christmas snowfall effects! 👋"
            secondaryAction={{
              content: "Learn more",
              url: "/app/additional",
              style: " width: 20%; ",
            }}
            image="https://cdn.shopify.com/s/files/1/0560/1535/6003/files/christmas-logo.jpg?v=1704699212"
          >
            <p>
              Boost your christmas with beautiful snowfall during the season.
            </p>
            <div style={{ marginTop: "20px" }}>
              <Button variant="primary" onClick={handleClickCustomize}>
                Customization
              </Button>
            </div>
          </EmptyState>
        </LegacyCard>
      </BlockStack>
    </Page>
  );
}
