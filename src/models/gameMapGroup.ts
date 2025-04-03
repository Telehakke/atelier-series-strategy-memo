import { GameMap, GameMapUtility, GameMapWithID } from "./gameMap";
import { StrategyMemoUtility, StrategyMemoWithID } from "./strategyMemo";
import { isNotNull, isString } from "./typeGuards";

export type GameMapGroup = {
    readonly name: string;
    readonly gameMaps: GameMap[];
    readonly image: string;
};

export type GameMapGroupWithID = {
    readonly name: string;
    readonly gameMaps: GameMapWithID[];
    readonly image: string;
    readonly id: string;
};

export class GameMapGroupUtility {
    static isGameMapGroup = (value: unknown): value is GameMapGroup => {
        if (!isNotNull(value)) return false;
        if (!isString(value.name)) return false;
        if (!GameMapUtility.isGameMaps(value.gameMaps)) return false;
        if (!isString(value.image)) return false;
        return true;
    };

    static isGameMapGroups = (value: unknown): value is GameMapGroup[] => {
        if (!Array.isArray(value)) return false;
        return value.every((v) => this.isGameMapGroup(v));
    };

    static create = (
        inputName: string,
        gameMaps: GameMapWithID[],
        image: string,
        id: string,
    ): GameMapGroupWithID => {
        return {
            name: inputName.trim(),
            gameMaps: gameMaps,
            image: image,
            id: id,
        };
    };

    static find = (
        gameMapGroups: GameMapGroupWithID[],
        id: string,
    ): GameMapGroupWithID | null => {
        return gameMapGroups.find((v) => v.id === id) ?? null;
    };

    static findIndex = (
        gameMapGroups: GameMapGroupWithID[],
        id: string,
    ): number | null => {
        const index = gameMapGroups.findIndex((v) => v.id === id);
        return index < 0 ? null : index;
    };

    static findID = (
        gameMapGroups: GameMapGroupWithID[],
        index: number,
    ): string | null => {
        if (gameMapGroups.length === 0) return null;
        if (gameMapGroups.length <= index) return null;

        return gameMapGroups[index].id;
    };

    static added = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroup: GameMapGroupWithID,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups.push(gameMapGroup);
        return copied;
    };

    static changedName = (
        strategyMemo: StrategyMemoWithID,
        id: string,
        name: string,
    ): StrategyMemoWithID => {
        const index = this.findIndex(strategyMemo.gameMapGroups, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const gameMapGroup: GameMapGroupWithID = {
            ...copied.gameMapGroups[index],
            name: name,
        };
        copied.gameMapGroups[index] = gameMapGroup;
        return copied;
    };

    static changedImage = (
        strategyMemo: StrategyMemoWithID,
        id: string,
        image: string,
    ): StrategyMemoWithID => {
        const index = this.findIndex(strategyMemo.gameMapGroups, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const gameMapGroup: GameMapGroupWithID = {
            ...copied.gameMapGroups[index],
            image: image,
        };
        copied.gameMapGroups[index] = gameMapGroup;
        return copied;
    };

    static removed = (
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): StrategyMemoWithID => {
        const index = this.findIndex(strategyMemo.gameMapGroups, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups.splice(index, 1);
        return copied;
    };

    static movedUp = (
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): StrategyMemoWithID => {
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
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): StrategyMemoWithID => {
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
