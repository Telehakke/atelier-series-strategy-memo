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
        "雛鳥の林",
        "正体不明のタマゴ、赤うに、うに、夕焼け草",
        "ゴースト、緑プニ、青プニ",
        "",
        "🔴",
        "50",
        "50",
        "0",
    );
    const expected: GameMapWithID = {
        name: "雛鳥の林",
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
                image: "",
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

test("added", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.added(strategyMemo, 0, {
        name: "",
        items: [],
        monsters: [],
        memo: "",
        icon: "",
        x: 0,
        y: 0,
        id: "",
    });
    const expected: StrategyMemoWithID = {
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
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("changed", () => {
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
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.changed(strategyMemo, 0, 0, {
        name: "name",
        items: ["item"],
        monsters: ["monster"],
        memo: "memo",
        icon: "icon",
        x: 1,
        y: 2,
        id: "",
    });
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [
                    {
                        name: "name",
                        items: ["item"],
                        monsters: ["monster"],
                        memo: "memo",
                        icon: "icon",
                        x: 1,
                        y: 2,
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("removed", () => {
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
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.removed(strategyMemo, 0, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedUp", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [
                    {
                        name: "1",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "",
                    },
                    {
                        name: "2",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.movedUp(strategyMemo, 0, 1);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [
                    {
                        name: "2",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "",
                    },
                    {
                        name: "1",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("moved", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [
                    {
                        name: "1",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "",
                    },
                    {
                        name: "2",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.movedDown(strategyMemo, 0, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [
                    {
                        name: "2",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "",
                    },
                    {
                        name: "1",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("additionXY1", () => {
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
                        x: 50,
                        y: 50,
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.additionXY(strategyMemo, 0, 0, 5, -5);
    const expected: StrategyMemoWithID = {
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
                        x: 55,
                        y: 45,
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("additionXY2", () => {
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
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.additionXY(strategyMemo, 0, 0, -1, -1);
    const expected: StrategyMemoWithID = {
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
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("additionXY3", () => {
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
                        x: 100,
                        y: 100,
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.additionXY(strategyMemo, 0, 0, 1, 1);
    const expected: StrategyMemoWithID = {
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
                        x: 100,
                        y: 100,
                        id: "",
                    },
                ],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});
