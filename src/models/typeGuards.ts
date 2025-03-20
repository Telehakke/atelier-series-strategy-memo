export const isNotNull = (value: unknown): value is Record<string, unknown> => {
    return value != null;
};

export const isStrings = (value: unknown): value is string[] => {
    if (!Array.isArray(value)) return false;
    return value.every((v) => typeof v === "string");
};
