import { Outlet } from "react-router-dom";
import { FilterContext } from "./filterContext";
import { Footer, MantineProvider, Stack, Text, rem } from "@mantine/core";
import { theme } from "./mantineTheme";
import { HideContext } from "./hideContext";

/**
 * Wraps all contexts around the app
 * @param {{
 *   children: import('react').ReactNode
 * }} param0 
 * @returns 
 */
export function ContextsWrapper({ children }) {
    return <MantineProvider
        withNormalizeCSS
        theme={theme}
    >
        <HideContext>
            <FilterContext>
                {children}
                <Footer zIndex={5}>
                    <Stack align="center" p={rem(8)}>
                        <Text size='sm'>2023 | William Pritchard</Text>
                    </Stack>
                </Footer>
            </FilterContext>
        </HideContext>
    </MantineProvider>
}