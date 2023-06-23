import { useEffect, useState, useMemo } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { Box, Input, rem, Title, Text, Alert, Portal } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import Fuse from "fuse.js";
import { useClickOutside } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import { useFilter } from "../contexts/filterContext";

const fuseOptions = {
  includeScore: true,
  shouldSort: true,
  keys: ["name", "origin", "description"],
};

export function SearchBar({ }) {
  const { data: breeds, loading: loadingBreeds, error } = useBreeds();
  const [err, setErr] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filter] = useFilter();
  const fuseFilter = useMemo(() => {
    if (Object.keys(filter).length === 0) {
      return {};
    }
    return {
      $and: [
        Object.entries(filter).map(([key, value]) => ({
          [key]: { $eq: value },
        })),
      ]
    }
  }, [filter])

  const onChange = (event) => {
    const newValue = event.currentTarget.value;
    setSearchValue(newValue);
    history.replaceState({ searchText: newValue }, "", location.href);
  };

  useEffect(() => {
    if (breeds && breeds.length > 0) {
      if (searchValue.length > 0) {
        const fuse = new Fuse(breeds, fuseOptions);
        let results = fuse.search(searchValue, fuseFilter);
        setSuggestions(results.filter(({ score }) => score < 0.3));
      } else {
        let randomOrder = breeds
          .filter((item) => {
            for (let key in filter) {
              if (item[key] !== filter[key]) {
                return false;
              }
            }
            return true;
          })
          .sort(({ name: a }, { name: b }) => a.localeCompare(b))
          .map((item) => ({ item }));
        setSuggestions(randomOrder);
      }
    }
  }, [breeds, searchValue, fuseFilter, filter]);

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

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr'
            }}
          >
            {suggestions.map(({ item: suggestion }, index) => (
              <SearchOption
                key={suggestion.id}
                index={index}
                breed={suggestion}
              />
            ))}
          </Box>
        </>
      )
      }
    </Box >
  );
}

function SearchOption({ breed, index, ...props }) {
  return (
    <Box
      component={Link}
      {...props}
      to={`/breed/${breed.id}`}
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
