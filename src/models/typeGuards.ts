export const isNotNull = (value: unknown): value is Record<string, unknown> => {
    return value != null;
};

export const isString = (value: unknown): value is string => {
    return typeof value === "string";
};

export const isStrings = (value: unknown): value is string[] => {
    if (!Array.isArray(value)) return false;
    return value.every((v) => typeof v === "string");
};

export const isNumber = (value: unknown): value is number => {
    return typeof value === "number";
};

export const isArray = (value: unknown): value is Array<unknown> => {
    return Array.isArray(value);
};

export const isBoolean = (value: unknown): value is boolean => {
    return typeof value === "boolean";
};
