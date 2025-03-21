import { expect, test } from "vitest";
import { GameMapUtility, GameMapWithID } from "../gameMap";
import { StrategyMemoWithID } from "../strategyMemo";

test("isGameMap", () => {
    const gameMap = GameMapUtility.create(
        "name",
        "item",
        "monster",
        "memo",
        "icon",
        "0",
        "1",
        "0",
    );
    expect(GameMapUtility.isGameMap(gameMap)).toBeTruthy();
});

test("isGameMaps", () => {
    const gameMaps: GameMapUtility[] = [];
    expect(GameMapUtility.isGameMaps(gameMaps)).toBeTruthy();
});

test("create", () => {
    const gameMap = GameMapUtility.create(
        "雛鳥の森",
        "正体不明のタマゴ、赤うに、うに、夕焼け草",
        "ゴースト、緑プニ、青プニ",
        "",
        "🔴",
        "50",
        "50",
        "0",
    );
    const expected: GameMapWithID = {
        name: "雛鳥の森",
        items: ["正体不明のタマゴ", "赤うに", "うに", "夕焼け草"],
        monsters: ["ゴースト", "緑プニ", "青プニ"],
        memo: "",
        icon: "🔴",
        x: 50,
        y: 50,
        id: "0",
    };
    expect(gameMap).toEqual(expected);
});

test("findIndex", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [
                    {
                        name: "",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "id",
                    },
                ],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.findIndex(strategyMemo, 0, "id");
    expect(result).toBe(0);
});
