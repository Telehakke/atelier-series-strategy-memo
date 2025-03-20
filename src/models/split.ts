export default class Split {
    static byComma = (text: string): string[] => {
        return text
            .split(/[,、]/)
            .map((v) => v.trim())
            .filter((v) => v.length > 0);
    };

    static byWhiteSpace = (text: string): string[] => {
        return text.split(/\s+/).filter((v) => v.length > 0);
    };
}
