import { useEffect, useState } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { Box, Input, rem, Title, Text, Alert } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import Fuse from "fuse.js";
import { useClickOutside } from "@mantine/hooks";

const fuseOptions = {
  includeScore: true,
  keys: ["name", "origin"],
};

export function SearchBar({ onSelect, selected }) {
  const { data: breeds, loading: loadingBreeds, error } = useBreeds();
  const [err, setErr] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const ref = useClickOutside(() => {
    setFocused(false);
  });

  const onChange = (event) => {
    setSearchValue(event.currentTarget.value);
    if (!focused) setFocused(true);
  };

  const onSelectOption = (suggestion) => {
    setSuggestions([]);
    onSelect(suggestion);
    setSearchValue(suggestion.name);
    setFocused(false);
  };

  const onFocus = () => {
    setFocused(true);
  };

  useEffect(() => {
    if (focused && breeds && breeds?.length > 0) {
      const fuse = new Fuse(breeds, fuseOptions);
      let results = fuse.search(searchValue);
      setSuggestions(results.filter(({ score }) => score < 0.3));
    }
  }, [focused, breeds, searchValue]);

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
            onFocus={onFocus}
            icon={<BsSearchHeart />}
            value={searchValue}
            onChange={onChange}
          />
          {focused && (
            <Box
              ref={ref}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                background: "red",
                "&:empty": {
                  display: "none",
                },
              }}
            >
              {suggestions.map(({ item: suggestion }, index) => (
                <SearchOption
                  key={suggestion.id}
                  index={index}
                  onSelect={() => onSelectOption(suggestion)}
                >
                  {suggestion.name}
                </SearchOption>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

function SearchOption({ children, index, onSelect, ...props }) {
  const onKeyDown = ({ key }) => {
    switch (key) {
      case "Enter":
        onSelect();
        break;
      default:
        break;
    }
  };
  return (
    <Box
      {...props}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      sx={{
        display: "flex",
        padding: rem(8),
      }}
    >
      {children}
    </Box>
  );
}
