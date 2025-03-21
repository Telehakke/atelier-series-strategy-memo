import { GameMap, GameMapWithID } from "./gameMap";
import {
    GameMapGroup,
    GameMapGroupUtility,
    GameMapGroupWithID,
} from "./gameMapGroup";
import { Memo, MemoUtility, MemoWithID } from "./memo";
import {
    Preparation,
    PreparationUtility,
    PreparationWithID,
} from "./preparation";
import { isNotNull } from "./typeGuards";

export type StrategyMemo = {
    readonly gameName: string;
    readonly gameMapGroups: GameMapGroup[];
    readonly preparations: Preparation[];
    readonly memos: Memo[];
};

export type StrategyMemoWithID = {
    readonly gameName: string;
    readonly gameMapGroups: GameMapGroupWithID[];
    readonly preparations: PreparationWithID[];
    readonly memos: MemoWithID[];
    readonly id: string;
};

export class StrategyMemoUtility {
    static isStrategyMemo = (value: unknown): value is StrategyMemo => {
        if (!isNotNull(value)) return false;
        if (typeof value.gameName !== "string") return false;
        if (!GameMapGroupUtility.isGameMapGroups(value.gameMapGroups))
            return false;
        if (!PreparationUtility.isPreparations(value.preparations))
            return false;
        if (!MemoUtility.isMemos(value.memos)) return false;
        return true;
    };

    static toStrategyMemo = (value: StrategyMemoWithID): StrategyMemo => {
        return {
            gameName: value.gameName,
            gameMapGroups: value.gameMapGroups.map((v) => {
                const gameMapGroup: GameMapGroup = {
                    name: v.name,
                    gameMaps: v.gameMaps.map((v) => {
                        const gameMap: GameMap = {
                            name: v.name,
                            items: [...v.items],
                            monsters: [...v.monsters],
                            memo: v.memo,
                            icon: v.icon,
                            x: v.x,
                            y: v.y,
                        };
                        return gameMap;
                    }),
                };
                return gameMapGroup;
            }),
            preparations: value.preparations.map((v) => {
                const preparation: Preparation = {
                    name: v.name,
                    materials: [...v.materials],
                    categories: [...v.categories],
                };
                return preparation;
            }),
            memos: value.memos.map((v) => {
                const memo: Memo = {
                    title: v.title,
                    text: v.text,
                };
                return memo;
            }),
        };
    };

    static copied = (value: StrategyMemoWithID): StrategyMemoWithID => {
        return {
            gameName: value.gameName,
            gameMapGroups: value.gameMapGroups.map((v) => {
                const gameMapGroup: GameMapGroupWithID = {
                    name: v.name,
                    gameMaps: v.gameMaps.map((v) => {
                        const gameMap: GameMapWithID = {
                            name: v.name,
                            items: [...v.items],
                            monsters: [...v.monsters],
                            memo: v.memo,
                            icon: v.icon,
                            x: v.x,
                            y: v.y,
                            id: v.id,
                        };
                        return gameMap;
                    }),
                    id: v.id,
                };
                return gameMapGroup;
            }),
            preparations: value.preparations.map((v) => {
                const preparation: PreparationWithID = {
                    name: v.name,
                    materials: [...v.materials],
                    categories: [...v.categories],
                    id: v.id,
                };
                return preparation;
            }),
            memos: value.memos.map((v) => {
                const memo: MemoWithID = {
                    title: v.title,
                    text: v.text,
                    id: v.id,
                };
                return memo;
            }),
            id: value.id,
        };
    };

    static changedGameName = (
        strategyMemo: StrategyMemoWithID,
        name: string,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        return {
            ...copied,
            gameName: name,
        };
    };
}
