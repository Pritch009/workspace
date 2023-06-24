import { useEffect, useState, useMemo } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { Box, Input, rem, Title, Text, Alert, Portal, Stack, Grid, Group, Flex, Select } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import Fuse from "fuse.js";
import { useFilter } from "../contexts/filterContext";
import { BreedLinkCard } from "./breedLinkCard";
import { FilterModal } from "./filterModal";
import { EmptyBreedImage } from "./emptyBreedImage";
import { HiddenModal } from "./hiddenModal";

const fuseOptions = {
  includeScore: true,
  shouldSort: true,
  keys: [
    { name: "name", weight: 0.8 },
    { name: 'origin', weight: 0.3 },
    { name: 'description', weight: 0.3 },
  ]
};

const SortFunctions = {
  Alphabetical: ({ breed: a }, { breed: b }) => {
    return a.name.localeCompare(b.name);
  },
  Relevancy: ({ score: a }, { score: b }) => {
    return b - a
  },
}

export function SearchBar() {
  const { data: breeds, loading: loadingBreeds, error } = useBreeds();
  const [err, setErr] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [sortFn, setSortFn] = useState('Alphabetical');
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

  const onChangeSortFn = (value) => {
    setSortFn(value);
  }

  useEffect(() => {
    if (breeds && breeds.length > 0) {
      let ordered;
      if (searchValue.length > 0) {
        const fuse = new Fuse(breeds, fuseOptions);
        let results = fuse.search(searchValue, fuseFilter);
        ordered = results.filter(({ score }) => score < 0.3).map(({ score, item }) => ({ score, breed: item }));
      } else {
        ordered = breeds
          .filter((item) => {
            for (let key in filter) {
              if (item[key] !== filter[key]) {
                return false;
              }
            }
            return true;
          })
          .map((breed) => ({ breed, score: 0 }));
      }
      setSuggestions(ordered);
    }
  }, [breeds, searchValue, fuseFilter, filter]);

  useEffect(() => {
    if (suggestions.length > 0) {
      let sorter = SortFunctions[sortFn] ?? SortFunctions.Alphabetical;
      setSuggestions(suggestions.sort(sorter))
    }
  }, [suggestions, sortFn])

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
            <SortBySelector currentValue={sortFn} onChange={onChangeSortFn} />
            <FilterModal />
            <HiddenModal />
          </Group>
          {
            suggestions.length > 0 && (
              <Grid gutter='lg' justify="start" w='auto'>
                {suggestions.map(({ breed: suggestion }, index) => (
                  <Grid.Col
                    span="auto"
                    key={suggestion.id}
                    sx={{
                      flex: '1 0 auto',
                      minWidth: rem(170),
                      maxWidth: rem(242),
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
                  </Grid.Col>
                ))}
              </Grid>
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


function SortBySelector({ currentValue, onChange }) {
  return <Select
    value={currentValue}
    onChange={onChange}
    data={
      Object.keys(SortFunctions).map((key) => ({
        label: key, value: key
      }))
    }
  />
}