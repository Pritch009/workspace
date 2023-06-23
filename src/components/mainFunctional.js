import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, Group, rem, Title } from "@mantine/core";
import { SearchBar } from "./searchBar";
import { useLocation } from "react-router-dom";
import { FilterModal } from "./filterModal";

export function MainFunctional() {
  const [selected, setSelected] = useState(null);
  const location = useLocation();
  const searchResultsContainerRef = useRef(null);

  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);

  const onSelectSearchOption = (suggestion) => {
    setSelected(suggestion);
  };

  useEffect(() => {
    const intervalToClearAnnoyingOverlay = setInterval(() => {
      try {
        document.querySelector("body > iframe")?.remove();
      } catch (err) {
        console.error("error: " + err);
      }
    }, 2000);

    return () => {
      clearInterval(intervalToClearAnnoyingOverlay);
    };
  }, []);

  return (
    <Box
      className="App"
      py={rem(16)}
      display="flex"
      style={{
        flexDirection: "column",
        gap: rem(16),
        maxWidth: rem(1000),
        margin: 'auto'
      }}
    >
      <Group position="apart">
        <Title>Search Cats!</Title>
        <FilterModal />
      </Group>
      <SearchBar />
    </Box >
  );
}
