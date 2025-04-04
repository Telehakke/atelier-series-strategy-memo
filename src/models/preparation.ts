import { v4 as uuidv4 } from "uuid";
import { StrategyMemoUtility, StrategyMemoWithID } from "./strategyMemo";
import { isNotNull, isString, isStrings } from "./typeGuards";

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
        if (!isString(value.name)) return false;
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

    static copied = (preparation: PreparationWithID): PreparationWithID => {
        return {
            name: preparation.name,
            materials: [...preparation.materials],
            categories: [...preparation.categories],
            id: uuidv4(),
        };
    };

    static find = (
        preparations: PreparationWithID[],
        id: string,
    ): PreparationWithID | null => {
        return preparations.find((v) => v.id === id) ?? null;
    };

    static findIndex = (
        preparations: PreparationWithID[],
        id: string,
    ): number | null => {
        const index = preparations.findIndex((v) => v.id === id);
        return index < 0 ? null : index;
    };

    static added = (
        strategyMemo: StrategyMemoWithID,
        preparation: PreparationWithID,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.preparations.push(preparation);
        return copied;
    };

    static changed = (
        strategyMemo: StrategyMemoWithID,
        id: string,
        input: {
            name: string;
            materials: string[];
            categories: string[];
        },
    ): StrategyMemoWithID => {
        const index = this.findIndex(strategyMemo.preparations, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const preparation: PreparationWithID = {
            ...input,
            id: copied.preparations[index].id,
        };
        copied.preparations[index] = preparation;
        return copied;
    };

    static removed = (
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): StrategyMemoWithID => {
        const index = this.findIndex(strategyMemo.preparations, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.preparations.splice(index, 1);
        return copied;
    };

    static movedUp = (
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): StrategyMemoWithID => {
        const index = this.findIndex(strategyMemo.preparations, id);
        if (index == null) return strategyMemo;

        const newIndex = index - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.preparations.splice(index, 1);
        copied.preparations.splice(newIndex, 0, item);
        return copied;
    };

    static movedDown = (
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): StrategyMemoWithID => {
        const index = this.findIndex(strategyMemo.preparations, id);
        if (index == null) return strategyMemo;

        const newIndex = index + 1;
        if (newIndex >= strategyMemo.preparations.length) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.preparations.splice(index, 1);
        copied.preparations.splice(newIndex, 0, item);
        return copied;
    };
}
