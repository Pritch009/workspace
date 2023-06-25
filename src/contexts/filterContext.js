import { useState, createContext, useContext } from "react";
import { useLocalState } from "../hooks/useLocalState";
import { pick } from "../utilities";

/**
 * @typedef {Object} Filter
 * @property {number} hairless
 * @property {number} rare
 * @property {number} suppressed_tail
 * @property {number} short_legs
 * @property {number} hypoallergenic
 * @property {number} experimental
 * @property {number} natural
 * @property {number} lap
 * @property {string} country_code
 */

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

/**
 * Handles the filter to be applied to search results
 * @param {{ children: import('react').ReactNode }} props 
 * @returns 
 */
export function FilterContext({ children }) {
    const filterState = useLocalState('cats.browse.filter', {}, (filterState) => {
        if (typeof filterState !== 'object') {
            return null;
        }
        return pick(filterState, FilterOptions.map(({ field }) => field));
    });

    return <filterContext.Provider value={filterState}>
        {children}
    </filterContext.Provider>
}

/**
 * Hook to access filter state
 * @returns {[Filter, import('react').Dispatch<import('react').SetStateAction<Filter>>]}
 */
export function useFilter() {
    const filterState = useContext(filterContext);

    if (filterState === null) {
        throw new Error("useFilter must be used within a FilterContext");
    }

    return filterState;
}