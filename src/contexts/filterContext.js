import { useState, createContext, useContext } from "react";
import { useLocalState } from "../hooks/useLocalState";
import { pick } from "../utilities";

export const FilterOptions = [
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
        label: 'Leg Size',
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


const filterContext = createContext(null);

export function FilterContext({ children }) {
    const filterState = useLocalState('cats.browse.filter', {}, (filterState) => {
        if (typeof filterState !== 'object') {
            return null;
        }
        return pick(filterState, Object.keys(FilterOptions).map(({ field }) => field));
    });

    return <filterContext.Provider value={filterState}>
        {children}
    </filterContext.Provider>
}

export function useFilter() {
    const filterState = useContext(filterContext);

    if (filterState === null) {
        throw new Error("useFilter must be used within a FilterContext");
    }

    return filterState;
}