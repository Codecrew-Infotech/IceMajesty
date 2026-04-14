import { Box, Page, Spinner } from "@shopify/polaris";

export default function LoadingSpinner() {
    return (
        <Page>
            <Box>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "85vh",
                    }}
                >
                    <Spinner accessibilityLabel="Loading settings" />
                </div>
            </Box>
        </Page>
    );
}
