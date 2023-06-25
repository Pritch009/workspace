export function pick(val, fields) {
    if (typeof val !== "object") {
        return val;
    }
    return Object.fromEntries(
        fields.map((field) => [field, val[field]]).filter(([_, val]) => val !== undefined)
    )
}

export function doNothing(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
}

export function isNotEmptyString(str) {
    return typeof str === 'string' && str.length > 0;
}