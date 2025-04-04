import { GameMap } from "./gameMap";
import { StrategyMemo, StrategyMemoUtility } from "./strategyMemo";

export type GameMapGroup = {
    readonly name: string;
    readonly gameMaps: GameMap[];
    readonly image: string;
    readonly id: string;
};

export class GameMapGroupUtility {
    static create = (
        inputName: string,
        gameMaps: GameMap[],
        image: string,
        id: string,
    ): GameMapGroup => {
        return {
            name: inputName.trim(),
            gameMaps: gameMaps,
            image: image,
            id: id,
        };
    };

    static find = (
        gameMapGroups: GameMapGroup[],
        id: string,
    ): GameMapGroup | null => {
        return gameMapGroups.find((v) => v.id === id) ?? null;
    };

    static findIndex = (
        gameMapGroups: GameMapGroup[],
        id: string,
    ): number | null => {
        const index = gameMapGroups.findIndex((v) => v.id === id);
        return index < 0 ? null : index;
    };

    static findID = (
        gameMapGroups: GameMapGroup[],
        index: number,
    ): string | null => {
        if (gameMapGroups.length === 0) return null;
        if (gameMapGroups.length <= index) return null;

        return gameMapGroups[index].id;
    };

    static added = (
        strategyMemo: StrategyMemo,
        gameMapGroup: GameMapGroup,
    ): StrategyMemo => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups.push(gameMapGroup);
        return copied;
    };

    static changedName = (
        strategyMemo: StrategyMemo,
        id: string,
        name: string,
    ): StrategyMemo => {
        const index = this.findIndex(strategyMemo.gameMapGroups, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const gameMapGroup: GameMapGroup = {
            ...copied.gameMapGroups[index],
            name: name,
        };
        copied.gameMapGroups[index] = gameMapGroup;
        return copied;
    };

    static changedImage = (
        strategyMemo: StrategyMemo,
        id: string,
        image: string,
    ): StrategyMemo => {
        const index = this.findIndex(strategyMemo.gameMapGroups, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const gameMapGroup: GameMapGroup = {
            ...copied.gameMapGroups[index],
            image: image,
        };
        copied.gameMapGroups[index] = gameMapGroup;
        return copied;
    };

    static removed = (strategyMemo: StrategyMemo, id: string): StrategyMemo => {
        const index = this.findIndex(strategyMemo.gameMapGroups, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups.splice(index, 1);
        return copied;
    };

    static movedUp = (strategyMemo: StrategyMemo, id: string): StrategyMemo => {
        const index = this.findIndex(strategyMemo.gameMapGroups, id);
        if (index == null) return strategyMemo;

        const newIndex = index - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.gameMapGroups.splice(index, 1);
        copied.gameMapGroups.splice(newIndex, 0, item);
        return copied;
    };

    static movedDown = (
        strategyMemo: StrategyMemo,
        id: string,
    ): StrategyMemo => {
        const index = this.findIndex(strategyMemo.gameMapGroups, id);
        if (index == null) return strategyMemo;

        const newIndex = index + 1;
        if (newIndex >= strategyMemo.gameMapGroups.length) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.gameMapGroups.splice(index, 1);
        copied.gameMapGroups.splice(newIndex, 0, item);
        return copied;
    };
}
