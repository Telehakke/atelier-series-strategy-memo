import { v4 as uuidv4 } from "uuid";
import { StrategyMemo, StrategyMemoUtility } from "./strategyMemo";

export type Preparation = {
    readonly name: string;
    readonly materials: string[];
    readonly categories: string[];
    readonly id: string;
};

export class PreparationUtility {
    static create = (
        inputName: string,
        inputMaterials: string,
        inputCategories: string,
        id: string,
    ): Preparation => {
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

    static copied = (preparation: Preparation): Preparation => {
        return {
            name: preparation.name,
            materials: [...preparation.materials],
            categories: [...preparation.categories],
            id: uuidv4(),
        };
    };

    static find = (
        preparations: Preparation[],
        id: string,
    ): Preparation | null => {
        return preparations.find((v) => v.id === id) ?? null;
    };

    static findIndex = (
        preparations: Preparation[],
        id: string,
    ): number | null => {
        const index = preparations.findIndex((v) => v.id === id);
        return index < 0 ? null : index;
    };

    static added = (
        strategyMemo: StrategyMemo,
        preparation: Preparation,
    ): StrategyMemo => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.preparations.push(preparation);
        return copied;
    };

    static changed = (
        strategyMemo: StrategyMemo,
        id: string,
        input: {
            name: string;
            materials: string[];
            categories: string[];
        },
    ): StrategyMemo => {
        const index = this.findIndex(strategyMemo.preparations, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const preparation: Preparation = {
            ...input,
            id: copied.preparations[index].id,
        };
        copied.preparations[index] = preparation;
        return copied;
    };

    static removed = (strategyMemo: StrategyMemo, id: string): StrategyMemo => {
        const index = this.findIndex(strategyMemo.preparations, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.preparations.splice(index, 1);
        return copied;
    };

    static movedUp = (strategyMemo: StrategyMemo, id: string): StrategyMemo => {
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
        strategyMemo: StrategyMemo,
        id: string,
    ): StrategyMemo => {
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
