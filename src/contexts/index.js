import { Outlet } from "react-router-dom";
import { FilterContext } from "./filterContext";

export function ContextsWrapper({ children }) {
    return <FilterContext>
        {children}
    </FilterContext>
}