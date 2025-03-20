import { isNotNull, isStrings } from "./typeGuards";

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
        if (typeof value.name !== "string") return false;
        if (!isStrings(value.items)) return false;
        if (!isStrings(value.monsters)) return false;
        if (typeof value.memo !== "string") return false;
        if (typeof value.icon !== "string") return false;
        if (typeof value.x !== "number") return false;
        if (typeof value.y !== "number") return false;
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
}
