import { useMemo, useState } from "react";

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
        console.log('setLocalState', action);
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