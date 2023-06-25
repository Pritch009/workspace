import { useState, createContext, useContext } from "react";
import { useLocalState } from "../hooks/useLocalState";

const hideContext = createContext(null);

/**
 * Hide context provider for hiding specific breeds
 * @param {{
 *   children: import('react').ReactNode
 * }} props
 * @returns 
 */
export function HideContext({ children }) {
    const hideState = useLocalState(
        'cats.hidden',
        new Map(),
        (val) => {
            console.log(val);
            return typeof val === 'object' ? new Map(Object.entries(val)) : null;
        },
        (val) => {
            return JSON.stringify(Object.fromEntries(val));
        }
    );

    return <hideContext.Provider value={hideState}>
        {children}
    </hideContext.Provider>
}

/**
 *  Hook to access hide state 
 */
export function useHideContext() {
    const currentState = useContext(hideContext);

    if (currentState === null) {
        throw new Error("useHideContext must be used within a HideContext");
    }

    return currentState;
}

/**
 * Hook for a specific breed to check if it is hidden
 * @param {import('../APIs/cats').Breed} breed 
 * @returns 
 */
export function useIsHidden(breed) {
    const currentHideContext = useContext(hideContext);
    if (currentHideContext === null) {
        throw new Error("useIsHidden must be used within a HideContext");
    }

    const [currentState, setCurrentState] = currentHideContext;

    if (!breed) {
        return {
            isHidden: true,
            hide: () => { },
        }
    } else {
        return {
            isHidden: currentState.has(breed.id),
            hide: () => {
                currentState.set(breed.id, breed);
                setCurrentState(new Map(currentState));
            },
            show: () => {
                currentState.delete(breed.id);
                setCurrentState(new Map(currentState));
            }
        }
    }
}

