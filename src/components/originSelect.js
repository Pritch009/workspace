import { Button, Flex, Group, Select } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import { useMemo } from "react";
import { useFilter } from "../contexts/filterContext";
import { NationalFlag, getNationalFlagChar } from "./nationalFlag";

/**
 * Allows the selection of a given country of origin for a breed
 * This will enter FilterContext entry for country_code
 * @returns {JSX.Element}
 */
export function OriginSelect() {
    const { data: breeds } = useBreeds();
    const [filter, setFilter] = useFilter();
    const currentSelection = useMemo(() => filter.country_code, [filter]);
    const options = useMemo(() => {
        if (!breeds || breeds.length === 0) {
            return [];
        }
        return Object.entries(breeds.reduce((acc, breed) => {
            if (!(breed.country_code in acc)) {
                acc[breed.country_code] = breed.origin;
            }
            return acc;
        }, []));
    }, [breeds]);

    const onSelect = (country_code) => {
        if (currentSelection?.country_code === country_code) {
            setFilter((prev) => ({
                ...prev,
                country_code: undefined
            }));
        } else {
            setFilter((prev) => ({
                ...prev,
                country_code
            }));
        }
    };

    const clearSelection = () => {
        setFilter((prev) => {
            delete prev.country_code;
            return {
                ...prev
            }
        });
    }

    return (
        <Flex w="100%" gap='md'>
            {'country_code' in filter && <Button sx={{ flex: '0 0 auto' }} variant='outline' onClick={clearSelection} />}
            <Select
                sx={{
                    flex: '1 1 auto'
                }}
                onChange={(value) => onSelect(value)}
                placeholder="Filter by Origin"
                value={currentSelection || null}
                data={options.map(([countryCode, origin]) => (
                    {
                        value: countryCode,
                        label: `${getNationalFlagChar(countryCode)} ${origin}`
                    }
                ))}
            />
        </Flex>
    );
}