import { GameMap, GameMapUtility, GameMapWithID } from "./gameMap";
import { isNotNull } from "./typeGuards";

export type GameMapGroup = {
    readonly name: string;
    readonly gameMaps: GameMap[];
};

export type GameMapGroupWithID = {
    readonly name: string;
    readonly gameMaps: GameMapWithID[];
    readonly id: string;
};

export class GameMapGroupUtility {
    static isGameMapGroup = (value: unknown): value is GameMapGroup => {
        if (!isNotNull(value)) return false;
        if (typeof value.name !== "string") return false;
        if (!GameMapUtility.isGameMaps(value.gameMaps)) return false;
        return true;
    };

    static isGameMapGroups = (value: unknown): value is GameMapGroup[] => {
        if (!Array.isArray(value)) return false;
        return value.every((v) => this.isGameMapGroup(v));
    };

    static create = (
        inputName: string,
        gameMaps: GameMapWithID[],
        id: string,
    ): GameMapGroupWithID => {
        return {
            name: inputName.trim(),
            gameMaps: gameMaps,
            id: id,
        };
    };
}
