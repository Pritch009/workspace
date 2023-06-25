import { useEffect } from "react";

/**
 * Setting the local state of a component based on the state of another component
 * Useful to save space, but doesn't do much
 */
export function useCoupledState(observableState, mutableDispatcher) {
    useEffect(() => {
        mutableDispatcher(observableState);
    }, [observableState]);
}