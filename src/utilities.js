/**
 * Pick the values from the object, and return a copy of the object with only those values.
 * @param {object} val 
 * @param {string[]} fields 
 * @returns 
 */
export function pick(val, fields) {
    if (typeof val !== "object") {
        return val;
    }
    return Object.fromEntries(
        fields.map((field) => [field, val[field]]).filter(([_, val]) => val !== undefined)
    )
}

/**
 * Does nothing on the given event.
 * @param {Event} event 
 */
export function doNothing(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
}

/**
 * Returns true if the given value is a non-empty string.
 * @param {unknown} str 
 * @returns 
 */
export function isNotEmptyString(str) {
    return typeof str === 'string' && str.length > 0;
}