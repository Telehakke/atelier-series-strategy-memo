import { GameMapGroupUtility, GameMapGroupWithID } from "./gameMapGroup";
import { StrategyMemoUtility, StrategyMemoWithID } from "./strategyMemo";
import { isNotNull, isNumber, isString, isStrings } from "./typeGuards";

export type GameMap = {
    readonly name: string;
    readonly items: string[];
    readonly monsters: string[];
    readonly memo: string;
    readonly icon: string;
    readonly x: number;
    readonly y: number;
};

export type GameMapWithID = GameMap & {
    readonly id: string;
};

export class GameMapUtility {
    static isGameMap = (value: unknown): value is GameMap => {
        if (!isNotNull(value)) return false;
        if (!isString(value.name)) return false;
        if (!isStrings(value.items)) return false;
        if (!isStrings(value.monsters)) return false;
        if (!isString(value.memo)) return false;
        if (!isString(value.icon)) return false;
        if (!isNumber(value.x)) return false;
        if (!isNumber(value.y)) return false;
        return true;
    };

    static isGameMaps = (value: unknown): value is GameMap[] => {
        if (!Array.isArray(value)) return false;
        return value.every((v) => this.isGameMap(v));
    };

    static create = (
        inputName: string,
        inputItems: string,
        inputMonsters: string,
        inputMemo: string,
        inputIcon: string,
        inputX: string,
        inputY: string,
        id: string,
    ): GameMapWithID => {
        const name = inputName.trim();
        const items = inputItems
            .split(/[,、]/)
            .map((v) => v.trim())
            .filter((v) => v.length > 0);
        const monsters = inputMonsters
            .split(/[,、]/)
            .map((v) => v.trim())
            .filter((v) => v.length > 0);
        const icon = inputIcon.trim();
        let x = parseInt(inputX);
        if (isNaN(x) || x < 0 || 100 < x) {
            x = 0;
        }
        let y = parseInt(inputY);
        if (isNaN(y) || y < 0 || 100 < y) {
            y = 0;
        }
        return {
            name: name,
            items: items,
            monsters: monsters,
            memo: inputMemo,
            icon: icon,
            x: x,
            y: y,
            id: id,
        };
    };

    static find = (
        gameMapGroups: GameMapGroupWithID[],
        gameMapGroupsID: string,
        id: string,
    ): GameMapWithID | null => {
        const gameMapGroup = GameMapGroupUtility.find(
            gameMapGroups,
            gameMapGroupsID,
        );
        if (gameMapGroup == null) return null;

        return gameMapGroup.gameMaps.find((v) => v.id === id) ?? null;
    };

    static findIndex = (
        gameMapGroups: GameMapGroupWithID[],
        gameMapGroupsID: string,
        id: string,
    ): number | null => {
        const gameMapGroup = GameMapGroupUtility.find(
            gameMapGroups,
            gameMapGroupsID,
        );
        if (gameMapGroup == null) return null;

        const index = gameMapGroup.gameMaps.findIndex((v) => v.id === id);
        return index < 0 ? null : index;
    };

    static added = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsID: string,
        gameMap: GameMapWithID,
    ): StrategyMemoWithID => {
        const index = GameMapGroupUtility.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
        );
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups[index].gameMaps.push(gameMap);
        return copied;
    };

    static changed = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsID: string,
        id: string,
        input: {
            name: string;
            items: string[];
            monsters: string[];
            memo: string;
            icon: string;
            x: number;
            y: number;
        },
    ): StrategyMemoWithID => {
        const gameMapGroupsIndex = GameMapGroupUtility.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
        );
        if (gameMapGroupsIndex == null) return strategyMemo;

        const index = this.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
            id,
        );
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const gameMap: GameMapWithID = {
            ...input,
            id: copied.gameMapGroups[gameMapGroupsIndex].gameMaps[index].id,
        };
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps[index] = gameMap;
        return copied;
    };

    static removed = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsID: string,
        id: string,
    ): StrategyMemoWithID => {
        const gameMapGroupsIndex = GameMapGroupUtility.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
        );
        if (gameMapGroupsIndex == null) return strategyMemo;

        const index = this.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
            id,
        );
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps.splice(index, 1);
        return copied;
    };

    static movedUp = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsID: string,
        id: string,
    ): StrategyMemoWithID => {
        const gameMapGroupsIndex = GameMapGroupUtility.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
        );
        if (gameMapGroupsIndex == null) return strategyMemo;

        const index = this.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
            id,
        );
        if (index == null) return strategyMemo;

        const newIndex = index - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.gameMapGroups[gameMapGroupsIndex].gameMaps.splice(
            index,
            1,
        );
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps.splice(
            newIndex,
            0,
            item,
        );
        return copied;
    };

    static movedDown = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsID: string,
        id: string,
    ): StrategyMemoWithID => {
        const gameMapGroupsIndex = GameMapGroupUtility.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
        );
        if (gameMapGroupsIndex == null) return strategyMemo;

        const index = this.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
            id,
        );
        if (index == null) return strategyMemo;

        const newIndex = index + 1;
        if (
            newIndex >=
            strategyMemo.gameMapGroups[gameMapGroupsIndex].gameMaps.length
        )
            return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.gameMapGroups[gameMapGroupsIndex].gameMaps.splice(
            index,
            1,
        );
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps.splice(
            newIndex,
            0,
            item,
        );
        return copied;
    };

    static additionXY = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsID: string,
        id: string,
        input: {
            x: number;
            y: number;
        },
    ): StrategyMemoWithID => {
        const gameMapGroupsIndex = GameMapGroupUtility.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
        );
        if (gameMapGroupsIndex == null) return strategyMemo;

        const index = this.findIndex(
            strategyMemo.gameMapGroups,
            gameMapGroupsID,
            id,
        );
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const gameMap =
            copied.gameMapGroups[gameMapGroupsIndex].gameMaps[index];

        let validX = gameMap.x + input.x;
        if (validX < 0) validX = 0;
        if (validX > 100) validX = 100;
        let validY = gameMap.y + input.y;
        if (validY < 0) validY = 0;
        if (validY > 100) validY = 100;

        const newGameMap = {
            ...gameMap,
            x: validX,
            y: validY,
        };
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps[index] = newGameMap;
        return copied;
    };
}
