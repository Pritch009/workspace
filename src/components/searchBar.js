import { useEffect, useState, useRef } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { Box, Input, rem, Title, Text, Alert, Portal } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import Fuse from "fuse.js";
import { useClickOutside } from "@mantine/hooks";
import { useLocation } from "react-router-dom";

const fuseOptions = {
  includeScore: true,
  keys: ["name", "origin"],
};

export function SearchBar({ searchResultsContainerRef }) {
  const { data: breeds, loading: loadingBreeds, error } = useBreeds();
  const [err, setErr] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();

  const onChange = (event) => {
    const newValue = event.currentTarget.value;
    setSearchValue(newValue);
    history.replaceState({ searchText: newValue }, "", location.href);
  };

  useEffect(() => {
    if (breeds && breeds.length > 0) {
      if (searchValue.length > 0) {
        const fuse = new Fuse(breeds, fuseOptions);
        let results = fuse.search(searchValue);
        setSuggestions(results.filter(({ score }) => score < 0.3));
      } else {
        let randomOrder = breeds
          .sort(({ name: a }, { name: b }) => a.localeCompare(b))
          .map((item) => ({ item }));
        setSuggestions(randomOrder);
      }
    }
  }, [breeds, searchValue]);

  useEffect(() => {
    const { searchText } = location.state ?? {};
    setSearchValue(searchText ?? "");
  }, [location]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      {error && <Alert title="Error!">{error.response.statusText}</Alert>}
      {err && <Alert title="Error!">{JSON.stringify(err)}</Alert>}
      {loadingBreeds && <div>Loading</div>}
      {!loadingBreeds && (
        <>
          <Input
            icon={<BsSearchHeart />}
            value={searchValue}
            onChange={onChange}
          />

          <Portal target={searchResultsContainerRef.current}>
            {suggestions.map(({ item: suggestion }, index) => (
              <SearchOption
                key={suggestion.id}
                index={index}
                breed={suggestion}
              />
            ))}
          </Portal>
        </>
      )}
    </Box>
  );
}

function SearchOption({ breed, index, ...props }) {
  return (
    <Box
      component="a"
      {...props}
      href={`/breed/${breed.id}`}
      tabIndex={0}
      sx={{
        display: "flex",
        padding: rem(8),
      }}
    >
      {breed.name}
    </Box>
  );
}
