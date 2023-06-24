import { useEffect, useState, useMemo } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { Box, Input, rem, Title, Text, Alert, Portal, Stack, Grid, Group, Flex } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import Fuse from "fuse.js";
import { useClickOutside } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import { useFilter } from "../contexts/filterContext";
import { BreedLinkCard } from "./breedLinkCard";
import { FilterModal } from "./filterModal";
import { OriginSelect } from "./originSelect";
import { EmptyBreedImage } from "./emptyBreedImage";

const fuseOptions = {
  includeScore: true,
  shouldSort: true,
  keys: ["name", "description"],
};

export function SearchBar() {
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
    <Stack
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      {error && <Alert title="Error!" color='red'>{error?.response?.statusText ?? "Unknown error occurred, unable to reach the Cat API!"}</Alert>}
      {err && <Alert title="Error!" color='red'>{JSON.stringify(err)}</Alert>}
      {loadingBreeds && <div>Loading</div>}
      {!loadingBreeds && breeds && (
        <>
          <Input
            icon={<BsSearchHeart />}
            value={searchValue}
            onChange={onChange}
            placeholder="Search by Breed"
          />
          <Group position='apart' spacing='md'>
            <FilterModal />
          </Group>
          {
            suggestions.length > 0 && (
              <Flex justify='space-between' gap='lg' pb='lg' wrap='wrap'>
                {suggestions.map(({ item: suggestion }, index) => (
                  <Box
                    key={suggestion.id}
                    sx={{
                      flex: '1 0 auto',
                      minWidth: rem(170),
                      maxWidth: rem(220),
                      width: '20vw',
                      aspectRatio: '1/1',
                      '&:empty': {
                        display: 'none',
                      }
                    }}
                  >
                    <SearchOption
                      index={index}
                      breed={suggestion}
                    />
                  </Box>
                ))}
              </Flex>
            )
          }
          {
            suggestions.length === 0 && (
              <Stack
                w='100%'
                p={rem(32)}
                align='center'
                justify="center"
              >
                <Box sx={{
                  height: 200,
                  width: 200,
                }}>
                  <EmptyBreedImage />
                </Box>
                <Text size='sm'>
                  No results found
                </Text>
              </Stack>
            )
          }
        </>
      )
      }
    </Stack >
  );
}

function SearchOption({ breed, index, ...props }) {
  return <BreedLinkCard breed={breed} />
}
