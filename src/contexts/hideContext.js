import { useState, createContext, useContext } from "react";

const hideContext = createContext(null);

export function HideContext({ children }) {
    const hideState = useState(new Map());

    return <hideContext.Provider value={hideState}>
        {children}
    </hideContext.Provider>
}

export function useHideContext() {
    const currentState = useContext(hideContext);

    if (currentState === null) {
        throw new Error("useHideContext must be used within a HideContext");
    }

    return currentState;
}

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

