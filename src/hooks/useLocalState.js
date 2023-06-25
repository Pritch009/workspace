import { useMemo, useState } from "react";

/**
 * Uses local storage to store state
 * Will attempt to load from local storage on first render, 
 * and will save to local storage on every state change.
 * 
 * Changing local storage will not trigger a re-render, and will
 * be lost should the state be written to before a page refresh.
 * @param {string} key 
 * @param {any} defaultValue 
 * @param {(value: any) => any} parse 
 * @returns 
 */
export function useLocalState(key, defaultValue, parse = (val) => val) {
    const localState = useMemo(() => {
        try {
            let val = localStorage.getItem(key);
            if (val !== null) {
                val = parse(JSON.parse(val));
            }

            if (val !== null) {
                return val;
            }
        } catch (err) {
            console.error(err);
        }

        return defaultValue;
    }, []);
    const [state, setState] = useState(localState);

    const setLocalState = (action) => {
        setState((prevState) => {
            let newValue;
            if (typeof action === 'function') {
                newValue = action(prevState);
            } else {
                newValue = action;
            }
            localStorage.setItem(key, JSON.stringify(newValue));
            return newValue;
        });
    }

    return [state, setLocalState];
}