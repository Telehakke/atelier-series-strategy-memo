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

    static findIndex = (
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): number | null => {
        const index = strategyMemo.preparations.findIndex((v) => v.id === id);
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
        preparationsIndex: number,
        preparation: PreparationWithID,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.preparations[preparationsIndex] = preparation;
        return copied;
    };

    static removed = (
        strategyMemo: StrategyMemoWithID,
        preparationsIndex: number,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.preparations.splice(preparationsIndex, 1);
        return copied;
    };

    static movedUp = (
        strategyMemo: StrategyMemoWithID,
        preparationsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = preparationsIndex - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.preparations.splice(preparationsIndex, 1);
        copied.preparations.splice(newIndex, 0, item);
        return copied;
    };

    static movedDown = (
        strategyMemo: StrategyMemoWithID,
        preparationsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = preparationsIndex + 1;
        if (newIndex >= strategyMemo.preparations.length) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.preparations.splice(preparationsIndex, 1);
        copied.preparations.splice(newIndex, 0, item);
        return copied;
    };
}
