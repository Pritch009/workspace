import { Box, Button, Modal, Select, Text, rem } from "@mantine/core";
import { BsFilter } from 'react-icons/bs';
import { useFilter } from "../contexts/filterContext";
import { useMemo, useState } from "react";


const FilterOptions = [
    {
        label: 'Hairless',
        field: 'hairless',
        options: [
            { label: 'Hairless', value: 1 },
            { label: 'Not hairless', value: 0 }
        ]
    },
    {
        label: 'Rare',
        field: 'rare',
        options: [
            { label: 'Rare', value: 1 },
            { label: 'Common', value: 0 }
        ]
    },
    {
        label: 'Suppressed Tail',
        field: 'suppressed_tail',
        options: [
            { label: 'Suppressed Tail', value: 1 },
            { label: 'Not Suppressed Tail', value: 0 }
        ]
    },
    {
        label: 'Short Legs',
        field: 'short_legs',
        options: [
            { label: 'Short Legs', value: 1 },
            { label: 'Normal Legs', value: 0 }
        ]
    },
    {
        label: 'Hypoallergenic',
        field: 'hypoallergenic',
        options: [
            { label: 'Hypoallergenic', value: 1 }
        ]
    },
    {
        label: 'Experimental',
        field: 'experimental',
        options: [
            { label: 'Experimental', value: 1 }
        ]
    },
    {
        label: 'Natural',
        field: 'natural',
        options: [
            { label: 'Natural', value: 1 }
        ]
    },
    {
        label: 'Lap Kitties',
        field: 'lap',
        options: [
            { label: 'Lap Kitties', value: 1 },
        ]
    }
]


export function FilterModal() {
    const [open, setOpen] = useState(false);

    const openFilter = () => {
        setOpen(true);
    }

    const closeFilter = () => {
        setOpen(false);
    }

    return <>
        <Button leftIcon={<BsFilter />} onClick={openFilter}>Filter</Button>
        <Modal opened={open} onClose={closeFilter} title='Filter Breeds' centered styles={{ inner: { boxSizing: 'border-box' } }}>
            <Box sx={{ display: 'grid', gap: rem(16) }}>
                {
                    FilterOptions.map(({ label, field, options }) => {
                        return <FilterOptionSelect key={label} field={field} label={label} options={options} />
                    })
                }
            </Box>
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

    return <Box>
        <Text>{label}</Text>
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: rem(8)
            }}
        >
            {
                options.map(({ label, value }) => (
                    (currentValue === undefined || currentValue === value) && <Button
                        key={label}
                        variant={currentValue === value ? 'filled' : "outline"}
                        onClick={() => onSelect(value)}
                    >{label}</Button>
                ))
            }
        </Box>
    </Box >
}
