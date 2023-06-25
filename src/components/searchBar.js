import { useEffect, useState, useMemo } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { Box, Input, rem, Text, Alert, Stack, Grid, Group, Flex, Select, Pagination, Loader } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import Fuse from "fuse.js";
import { useFilter } from "../contexts/filterContext";
import { BreedLinkCard } from "./breedLinkCard";
import { FilterModal } from "./filterModal";
import { EmptyBreedImage } from "./emptyBreedImage";
import { HiddenModal } from "./hiddenModal";
import { useCoupledState } from "../hooks/useCoupledState";
import { useLocalState } from "../hooks/useLocalState";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";

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
  Relevancy: ({ score: a }, { score: b }) => b - a,
  Alphabetical: ({ breed: a }, { breed: b }) => a.name.localeCompare(b.name),
  'High Energy': compareBreedFields('energy_level', true),
  'Low Energy': compareBreedFields('energy_level', false),
  'High Maintenance': compareBreedFields('grooming', true),
  'Low Maintenance': compareBreedFields('grooming', false),
}

function compareBreedFields(field, ascending) {
  return ({ breed: a }, { breed: b }) => {
    let v1 = a[field];
    let v2 = b[field];

    return ascending ? v2 - v1 : v1 - v2;
  }
}

const MotionGridCol = motion(Grid.Col);

export function SearchBar() {
  const { data: breeds, loading: loadingBreeds, error } = useBreeds();
  const [err, setErr] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortFn, setSortFn] = useLocalState(
    '',
    'Relevancy',
    (value) => (typeof value === 'string') ? value : null
  );
  const [pageSize, setPageSize] = useLocalState(
    'cats.browse.pageSize',
    PageSizeOptions[1],
    (value) => {
      const parsed = parseInt(value);
      if (isNaN(parsed)) {
        return null;
      }
      return parsed;
    }
  );
  const [page, setPage] = useState(0);
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
  }, [filter]);

  /// All suggestions that match the search query
  /// We may not reduce here because we want to preserve the order of the results
  /// Filtering is managed by Fuse
  const suggestions = useMemo(() => {
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
      return ordered;
    }
    return [];
  }, [breeds, searchValue, fuseFilter, filter]);

  /// Number of pages of results
  const numPages = useMemo(() => Math.ceil(suggestions.length / pageSize), [suggestions, pageSize]);

  /// Sorting the suggestions may change the overall order, but not the number of results
  const sortedSuggestions = useMemo(() => {
    let sorter = SortFunctions[sortFn] ?? SortFunctions.Alphabetical;
    return suggestions.sort(sorter);
  }, [suggestions, sortFn]);

  /// Used for pagination
  const suggestionWindow = useMemo(() => {
    return sortedSuggestions.slice(page * pageSize, (page + 1) * pageSize);
  }, [sortedSuggestions, page, pageSize]);

  const onChange = (event) => {
    const newValue = event.currentTarget.value;
    setSearchValue(newValue);
    setPage(0);
  };

  const onChangePageSize = (value) => {
    setPageSize(value);
    setPage(0);
  }

  const onChangeSortFn = (value) => {
    setSortFn(value);
    setPage(0);
  }

  const onSetPage = (page) => {
    setPage(page - 1);
  }

  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        flex: '1 1 auto',
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
          <Flex position='apart' gap='md' align="end" wrap='wrap'>
            <Flex gap='md' align='end' sx={{ flex: '1 0 200px' }}>
              <PageSizeSelector currentValue={pageSize} onChange={onChangePageSize} />
              <SortBySelector currentValue={sortFn} onChange={onChangeSortFn} />
            </Flex>
            <FilterModal />
            <HiddenModal />
          </Flex>
          {
            loadingBreeds ? (
              <Stack w='100%' size='xl' align="center" justify="center" sx={{ flex: '1 1 auto' }}>
                <Loader />
              </Stack>
            )
              : suggestionWindow.length > 0 ? (
                <>
                  <Grid mt={rem(8)} gutter='lg' justify="start" w='auto' align="start" sx={{ flex: '1 1 auto', alignContent: 'start' }}>
                    <AnimatePresence>
                      {suggestionWindow
                        .map(({ breed: suggestion }, index) => (
                          <MotionGridCol
                            initial='hidden'
                            animate='visible'
                            variants={BreedCardVariants(index)}
                            key={suggestion.id}
                            span={6}
                            xs={4}
                            ms={3}
                            sx={{
                              flex: `1 0 ${rem(242)}`,
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
                          </MotionGridCol>
                        ))
                      }
                    </AnimatePresence>
                  </Grid>
                  {
                    numPages > 1 && (
                      <Flex justify='center' p={rem(32)}>
                        <Pagination
                          page={page + 1}
                          onChange={onSetPage}
                          total={numPages}
                          siblings={1}
                          color='blue'
                          radius='md'
                          withControls={false}
                        />
                      </Flex>
                    )
                  }
                </>
              ) : (
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
      )}
    </Stack >
  );
}

const BreedCardVariants = (index) => ({
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.05,
    }
  }
});

function SearchOption({ breed, index, ...props }) {
  return <BreedLinkCard breed={breed} />
}


function SortBySelector({ currentValue, onChange }) {
  return <Select
    value={currentValue}
    onChange={onChange}
    label='Sort By'
    data={
      Object.keys(SortFunctions).map((key) => ({
        label: key, value: key
      }))
    }
  />
}

const PageSizeOptions = [5, 10, 25, 50, 100];
function PageSizeSelector({ currentValue, onChange }) {
  return <Select
    w='fit-content'
    value={currentValue}
    onChange={onChange}
    label='Page Size'
    data={
      PageSizeOptions.map((value) => ({
        label: value, value
      }))
    }
  />
}