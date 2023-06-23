import { useState, createContext, useContext } from "react";

const filterContext = createContext(null);

export function FilterContext({ children }) {
    const filterState = useState({});

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