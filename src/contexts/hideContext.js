import { useState, createContext, useContext } from "react";

const hideContext = createContext();

export function HideContext({ children }) {
    const [hidden, setHidden] = useState(new Map());

    return <hideContext.Provider value={{ hidden, setHidden }}>
        {children}
    </hideContext.Provider>
}

export function useHideContext(breed) {
    const currentState = useContext(hideContext);

    if (!breed) {
        return {
            isHidden: true,
            hide: () => { },
        }
    } else {
        return {
            isHidden: currentState.hidden.get(breed.id),
            hide: () => {
                currentState.hidden.set(breed.id, true);
                currentState.setHidden(new Map(currentState.hidden));
            },
        }
    }
}

