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

    static findIndex = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        id: string,
    ): number | null => {
        const index = strategyMemo.gameMapGroups[
            gameMapGroupsIndex
        ].gameMaps.findIndex((v) => v.id === id);
        return index < 0 ? null : index;
    };

    static added = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        gameMap: GameMapWithID,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps.push(gameMap);
        return copied;
    };

    static changed = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        gameMapsIndex: number,
        gameMap: GameMapWithID,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps[gameMapsIndex] =
            gameMap;
        return copied;
    };

    static removed = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        gameMapsIndex: number,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps.splice(
            gameMapsIndex,
            1,
        );
        return copied;
    };

    static movedUp = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        gameMapsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = gameMapsIndex - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.gameMapGroups[gameMapGroupsIndex].gameMaps.splice(
            gameMapsIndex,
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
        gameMapGroupsIndex: number,
        gameMapsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = gameMapsIndex + 1;
        if (
            newIndex >=
            strategyMemo.gameMapGroups[gameMapGroupsIndex].gameMaps.length
        )
            return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.gameMapGroups[gameMapGroupsIndex].gameMaps.splice(
            gameMapsIndex,
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
        gameMapGroupsIndex: number,
        gameMapsIndex: number,
        x: number,
        y: number,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        const gameMap =
            copied.gameMapGroups[gameMapGroupsIndex].gameMaps[gameMapsIndex];

        let validX = gameMap.x + x;
        if (validX < 0) validX = 0;
        if (validX > 100) validX = 100;
        let validY = gameMap.y + y;
        if (validY < 0) validY = 0;
        if (validY > 100) validY = 100;

        const newGameMap = {
            ...gameMap,
            x: validX,
            y: validY,
        };
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps[gameMapsIndex] =
            newGameMap;
        return copied;
    };
}
