import { Outlet } from "react-router-dom";
import { FilterContext } from "./filterContext";
import { Footer, MantineProvider, Stack, Text, rem } from "@mantine/core";
import { theme } from "./mantineTheme";

export function ContextsWrapper({ children }) {
    return <MantineProvider
        withNormalizeCSS
        theme={theme}
    >
        <FilterContext>
            {children}
            <Footer zIndex={5}>
                <Stack align="center" p={rem(8)}>
                    <Text size='sm'>2023 | William Pritchard</Text>
                </Stack>
            </Footer>
        </FilterContext>
    </MantineProvider>
}