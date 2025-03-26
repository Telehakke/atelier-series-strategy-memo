import { GameMap, GameMapUtility, GameMapWithID } from "./gameMap";
import { StrategyMemoUtility, StrategyMemoWithID } from "./strategyMemo";
import { isNotNull } from "./typeGuards";

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
        if (typeof value.name !== "string") return false;
        if (!GameMapUtility.isGameMaps(value.gameMaps)) return false;
        if (typeof value.image !== "string") return false;
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
        gameMapGroupsIndex: number,
        name: string,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups[gameMapGroupsIndex] = {
            ...copied.gameMapGroups[gameMapGroupsIndex],
            name: name,
        };
        return copied;
    };

    static changedImage = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        image: string,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups[gameMapGroupsIndex] = {
            ...copied.gameMapGroups[gameMapGroupsIndex],
            image: image,
        };
        return copied;
    };

    static removed = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups.splice(gameMapGroupsIndex, 1);
        return copied;
    };

    static movedUp = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = gameMapGroupsIndex - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.gameMapGroups.splice(gameMapGroupsIndex, 1);
        copied.gameMapGroups.splice(newIndex, 0, item);
        return copied;
    };

    static movedDown = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = gameMapGroupsIndex + 1;
        if (newIndex >= strategyMemo.gameMapGroups.length) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.gameMapGroups.splice(gameMapGroupsIndex, 1);
        copied.gameMapGroups.splice(newIndex, 0, item);
        return copied;
    };
}
