import { Box, Button, Flex, Grid, Modal, Select, Space, Stack, Text, Title, rem } from "@mantine/core";
import { BsFilter } from 'react-icons/bs';
import { useFilter, FilterOptions } from "../contexts/filterContext";
import { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import { OriginSelect } from "./originSelect";

export function FilterModal() {
    const [open, setOpen] = useState(false);
    const [filterState, setFilterState] = useFilter();

    const openFilter = () => {
        setOpen(true);
    }

    const closeFilter = () => {
        setOpen(false);
    }

    const clearFilter = () => {
        setFilterState({});
        closeFilter();
    }

    const count = useMemo(() => {
        const numKeys = Object.keys(filterState).filter((field) => field.localeCompare('country_code') !== 0).length;
        if (numKeys === 0) {
            return null;
        }
        return <>{numKeys}</>;
    }, [filterState]);

    return <>
        <Flex gap={rem(8)} sx={{ flex: '1 1 auto' }} align='center' justify='end'>
            {count && <Button variant='subtle' size="sm" leftIcon={<MdClose />} onClick={clearFilter}>Clear</Button>}
            <Button leftIcon={<BsFilter />} onClick={openFilter} rightIcon={count}>Filter</Button>
        </Flex>
        <Modal opened={open} onClose={closeFilter} title='Filter Breeds' centered sx={{ flexBasis: '1000px' }}>
            <Stack spacing='lg'>
                <Text size='sm'>
                    Select the options you want to filter by. If you select multiple options for a single filter, it will only show breeds that match all of the selected options.
                </Text>
                <OriginSelect />
                <Grid gutter="md">
                    {
                        FilterOptions.map(({ label, field, options }) => {
                            return <Grid.Col key={label} span={12} xs={6}>
                                <FilterOptionSelect field={field} label={label} options={options} />
                            </Grid.Col>
                        })
                    }
                </Grid>
                <Space h={rem(16)} />
                <Stack align='end'>
                    <Button onClick={closeFilter}>Close</Button>
                </Stack>
            </Stack>
        </Modal>
    </>
}

const FilterOptionSelect = ({ field, label, options }) => {
    const [filterState, setFilterState] = useFilter();
    const currentValue = useMemo(() => filterState[field], [filterState, field]);

    const onSelect = (value) => {
        setFilterState((prevState) => {
            if (prevState[field] === value) {
                delete prevState[field];
                return {
                    ...prevState
                }
            }
            return {
                ...filterState,
                [field]: value
            }
        })
    }

    return <Stack spacing='none'>
        <Text size='xs' transform="uppercase">{label}</Text>
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: rem(8)
            }}
        >
            {
                options.map(({ label, value }) => (
                    <Button
                        key={label}
                        variant={currentValue === value ? 'filled' : "outline"}
                        onClick={() => onSelect(value)}
                        sx={{ transition: '0.15s' }}
                        disabled={!(currentValue === undefined || currentValue === value)}
                    >{label}</Button>
                ))
            }
        </Box>
    </Stack >
}
