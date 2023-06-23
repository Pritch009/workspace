import { Select } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import { useMemo } from "react";
import { useFilter } from "../contexts/filterContext";
import { NationalFlag, getNationalFlagChar } from "./nationalFlag";

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
        console.log('Selected ', country_code);
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

    console.log('options', options);
    console.log('breeds', breeds);

    console.log(Array.from(new Set(breeds.map(({ country_code }) => country_code))).sort().toString());

    return <Select
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
}