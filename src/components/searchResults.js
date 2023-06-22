import React, { forwardRef } from "react";
import { Box } from "@mantine/core";

export const SearchResultsContainer = forwardRef(
    function SearchResultsContainer({ sx, ...props }, ref) {
        return <Box
            {...props}
            sx={[
                sx,
                {
                    '& > div': {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr'
                    }
                }
            ]}
            ref={ref}
        />
    }
);