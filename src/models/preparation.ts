import { isNotNull, isStrings } from "./typeGuards";

export type Preparation = {
    readonly name: string;
    readonly materials: string[];
    readonly categories: string[];
};

export type PreparationWithID = Preparation & {
    readonly id: string;
};

export class PreparationUtility {
    static isPreparation = (value: unknown): value is Preparation => {
        if (!isNotNull(value)) return false;
        if (typeof value.name !== "string") return false;
        if (!isStrings(value.materials)) return false;
        if (!isStrings(value.categories)) return false;
        return true;
    };

    static isPreparations = (value: unknown): value is Preparation[] => {
        if (!Array.isArray(value)) return false;
        return value.every((v) => this.isPreparation(v));
    };

    static create = (
        inputName: string,
        inputMaterials: string,
        inputCategories: string,
        id: string,
    ): PreparationWithID => {
        const name = inputName.trim();
        const materials = inputMaterials
            .split(/[,、]/)
            .map((v) => v.trim())
            .filter((v) => v.length > 0);
        const categories = inputCategories
            .split(/[,、]/)
            .map((v) => v.trim())
            .filter((v) => v.length > 0);
        return {
            name: name,
            materials: materials,
            categories: categories,
            id: id,
        };
    };
}
