import { Box, Flex, rem, Title } from "@mantine/core";
import { SearchBar } from "./searchBar";

export function BrowseCatBreeds() {
  return (
    <Box
      className="App"
      py={rem(16)}
      display="flex"
      style={{
        flexDirection: "column",
        gap: rem(16),
        width: rem(1000),
        maxWidth: "100%",
        margin: 'auto',
        padding: rem(16),
        boxSizing: 'border-box'
      }}
    >
      <Flex justify='space-between' wrap='wrap' gap={rem(16)}>
        <Title sx={{ flex: '0 0 auto' }}>Search Cats!</Title>
      </Flex>
      <SearchBar />
    </Box >
  );
}
