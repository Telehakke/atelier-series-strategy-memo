const splitByWhiteSpace = (input: string): string[] => {
    const result = input.split(/\s+/).filter((v) => v.length > 0);
    return result.length === 0 ? [""] : result;
};

export default splitByWhiteSpace;
