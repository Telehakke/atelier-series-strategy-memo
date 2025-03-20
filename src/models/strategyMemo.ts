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

    /* -------------------------------------------------------------------------- */

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

    /* -------------------------------------------------------------------------- */

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

    /* -------------------------------------------------------------------------- */

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

    /* -------------------------------------------------------------------------- */

    static addedGameMapGroup = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroup: GameMapGroupWithID,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.gameMapGroups.push(gameMapGroup);
        return copied;
    };

    static changedGameMapGroupName = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        name: string,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.gameMapGroups[gameMapGroupsIndex] = {
            ...copied.gameMapGroups[gameMapGroupsIndex],
            name: name,
        };
        return copied;
    };

    static removedGameMapGroup = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.gameMapGroups.splice(gameMapGroupsIndex, 1);
        return copied;
    };

    static movedGameMapGroupUp = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = gameMapGroupsIndex - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = this.copied(strategyMemo);
        const [item] = copied.gameMapGroups.splice(gameMapGroupsIndex, 1);
        copied.gameMapGroups.splice(newIndex, 0, item);
        return copied;
    };

    static movedGameMapGroupDown = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = gameMapGroupsIndex + 1;
        if (newIndex >= strategyMemo.gameMapGroups.length) return strategyMemo;

        const copied = this.copied(strategyMemo);
        const [item] = copied.gameMapGroups.splice(gameMapGroupsIndex, 1);
        copied.gameMapGroups.splice(newIndex, 0, item);
        return copied;
    };

    /* -------------------------------------------------------------------------- */

    static addedGameMap = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        gameMap: GameMapWithID,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps.push(gameMap);
        return copied;
    };

    static changedGameMap = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        gameMapsIndex: number,
        gameMap: GameMapWithID,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps[gameMapsIndex] =
            gameMap;
        return copied;
    };

    static removedGameMap = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        gameMapsIndex: number,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.gameMapGroups[gameMapGroupsIndex].gameMaps.splice(
            gameMapsIndex,
            1,
        );
        return copied;
    };

    static movedGameMapUp = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        gameMapsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = gameMapsIndex - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = this.copied(strategyMemo);
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

    static movedGameMapDown = (
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

        const copied = this.copied(strategyMemo);
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

    /* -------------------------------------------------------------------------- */

    static addedPreparation = (
        strategyMemo: StrategyMemoWithID,
        preparation: PreparationWithID,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.preparations.push(preparation);
        return copied;
    };

    static changedPreparation = (
        strategyMemo: StrategyMemoWithID,
        preparationsIndex: number,
        preparation: PreparationWithID,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.preparations[preparationsIndex] = preparation;
        return copied;
    };

    static removedPreparation = (
        strategyMemo: StrategyMemoWithID,
        preparationsIndex: number,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.preparations.splice(preparationsIndex, 1);
        return copied;
    };

    static movedPreparationUp = (
        strategyMemo: StrategyMemoWithID,
        preparationsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = preparationsIndex - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = this.copied(strategyMemo);
        const [item] = copied.preparations.splice(preparationsIndex, 1);
        copied.preparations.splice(newIndex, 0, item);
        return copied;
    };

    static movedPreparationDown = (
        strategyMemo: StrategyMemoWithID,
        preparationsIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = preparationsIndex + 1;
        if (newIndex >= strategyMemo.preparations.length) return strategyMemo;

        const copied = this.copied(strategyMemo);
        const [item] = copied.preparations.splice(preparationsIndex, 1);
        copied.preparations.splice(newIndex, 0, item);
        return copied;
    };

    /* -------------------------------------------------------------------------- */

    static addedMemo = (
        strategyMemo: StrategyMemoWithID,
        memo: MemoWithID,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.memos.push(memo);
        return copied;
    };

    static changedMemo = (
        strategyMemo: StrategyMemoWithID,
        memosIndex: number,
        memo: MemoWithID,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.memos[memosIndex] = memo;
        return copied;
    };

    static removedMemo = (
        strategyMemo: StrategyMemoWithID,
        memosIndex: number,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        copied.memos.splice(memosIndex, 1);
        return copied;
    };

    static movedMemoUp = (
        strategyMemo: StrategyMemoWithID,
        memosIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = memosIndex - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = this.copied(strategyMemo);
        const [item] = copied.memos.splice(memosIndex, 1);
        copied.memos.splice(newIndex, 0, item);
        return copied;
    };

    static movedMemoDown = (
        strategyMemo: StrategyMemoWithID,
        memosIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = memosIndex + 1;
        if (newIndex >= strategyMemo.memos.length) return strategyMemo;

        const copied = this.copied(strategyMemo);
        const [item] = copied.memos.splice(memosIndex, 1);
        copied.memos.splice(newIndex, 0, item);
        return copied;
    };

    /* -------------------------------------------------------------------------- */

    static additionGameMapXY = (
        strategyMemo: StrategyMemoWithID,
        gameMapGroupsIndex: number,
        gameMapsIndex: number,
        x: number,
        y: number,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
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
