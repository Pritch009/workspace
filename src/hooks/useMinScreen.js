import { useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useMemo } from "react";

export function useMinScreen({ width, height } = {}) {
    const { width: screenWidth, height: screenHeight } = useViewportSize();

    return useMemo(() => {
        return screenWidth > (width ?? 0) && screenHeight > (height ?? 0);
    }, [screenWidth, screenHeight, width, height]);
}

function convertRemToPixels(rem) {
    const remPx = parseInt(rem);
    if (isNaN(remPx)) throw new Error(`Invalid rem value: ${rem}`);

    return remPx * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function useWidthBreakpoint(breakpoint) {
    const theme = useMantineTheme();

    if (!(breakpoint in theme.breakpoints)) {
        throw new Error(`Invalid breakpoint: ${breakpoint}`);
    }

    return useMinScreen({ width: convertRemToPixels(theme.breakpoints[breakpoint]) });
}