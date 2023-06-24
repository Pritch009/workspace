export function pick(val, fields) {
    if (typeof val !== "object") {
        return val;
    }
    return Object.fromEntries(
        fields.map((field) => [field, val[field]])
    )
}

export function doNothing(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
}