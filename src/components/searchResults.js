import React, { forwardRef } from "react";
import { Box } from "@mantine/core";

export const SearchResultsContainer = forwardRef(
    function SearchResultsContainer(props, ref) {
        return <Box {...props} ref={ref} />
    }
);