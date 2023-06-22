import React, { useState, useEffect, useMemo } from "react";
import { Box, rem, Title } from "@mantine/core";
import { SearchBar } from "./searchBar";
import { CatBreed } from "./catBreed";
import { useLocation } from "react-router-dom";

export function MainFunctional() {
  const [selected, setSelected] = useState(null);
  const location = useLocation();

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
      style={{ flexDirection: "column", gap: rem(16) }}
    >
      <Title>Search Cats!</Title>
      <SearchBar selected={selected} onSelect={onSelectSearchOption} />
      {selected && <CatBreed breed={selected} />}
    </Box>
  );
}
