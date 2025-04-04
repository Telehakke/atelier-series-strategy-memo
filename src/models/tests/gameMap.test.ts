import { expect, test } from "vitest";
import { GameMap, GameMapUtility } from "../gameMap";
import { GameMapGroup } from "../gameMapGroup";
import { StrategyMemo } from "../strategyMemo";

test("create", () => {
    const gameMap = GameMapUtility.create(
        "name",
        "item1、item2",
        "monster1、monster2",
        "memo",
        "icon",
        "1",
        "2",
        "id1",
    );
    const expected: GameMap = {
        name: "name",
        items: ["item1", "item2"],
        monsters: ["monster1", "monster2"],
        memo: "memo",
        icon: "icon",
        x: 1,
        y: 2,
        id: "id1",
    };
    expect(gameMap).toEqual(expected);
});

test("find1", () => {
    const gameMapGroups: GameMapGroup[] = [
        {
            name: "",
            gameMaps: [
                {
                    name: "name",
                    items: [],
                    monsters: [],
                    memo: "memo",
                    icon: "icon",
                    x: 1,
                    y: 2,
                    id: "id",
                },
            ],
            image: "",
            id: "groupID",
        },
    ];
    const result = GameMapUtility.find(gameMapGroups, "groupID", "id");
    const expected: GameMap = {
        name: "name",
        items: [],
        monsters: [],
        memo: "memo",
        icon: "icon",
        x: 1,
        y: 2,
        id: "id",
    };
    expect(result).toEqual(expected);
});

test("find2", () => {
    const gameMapGroups: GameMapGroup[] = [
        {
            name: "",
            gameMaps: [
                {
                    name: "name",
                    items: [],
                    monsters: [],
                    memo: "memo",
                    icon: "icon",
                    x: 1,
                    y: 2,
                    id: "id",
                },
            ],
            image: "",
            id: "groupID",
        },
    ];
    const result = GameMapUtility.find(gameMapGroups, "groupID", "id1");
    expect(result).toBeNull();
});

test("findIndex1", () => {
    const gameMapGroups: GameMapGroup[] = [
        {
            name: "",
            gameMaps: [
                {
                    name: "name",
                    items: [],
                    monsters: [],
                    memo: "memo",
                    icon: "icon",
                    x: 1,
                    y: 2,
                    id: "id",
                },
            ],
            image: "",
            id: "groupID",
        },
    ];
    const result = GameMapUtility.findIndex(gameMapGroups, "groupID", "id");
    expect(result).toBe(0);
});

test("findIndex2", () => {
    const gameMapGroups: GameMapGroup[] = [
        {
            name: "",
            gameMaps: [
                {
                    name: "name",
                    items: [],
                    monsters: [],
                    memo: "memo",
                    icon: "icon",
                    x: 1,
                    y: 2,
                    id: "id",
                },
            ],
            image: "",
            id: "groupID",
        },
    ];
    const result = GameMapUtility.findIndex(gameMapGroups, "groupID", "id1");
    expect(result).toBeNull();
});

test("added", () => {
    const strategyMemo: StrategyMemo = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.added(strategyMemo, "gameMapID", {
        name: "",
        items: [],
        monsters: [],
        memo: "",
        icon: "",
        x: 0,
        y: 0,
        id: "",
    });
    const expected: StrategyMemo = {
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
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("changed", () => {
    const strategyMemo: StrategyMemo = {
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
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.changed(strategyMemo, "gameMapID", "id", {
        name: "name",
        items: ["item"],
        monsters: ["monster"],
        memo: "memo",
        icon: "icon",
        x: 1,
        y: 2,
    });
    const expected: StrategyMemo = {
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
                        id: "id",
                    },
                ],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("removed", () => {
    const strategyMemo: StrategyMemo = {
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
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.removed(strategyMemo, "gameMapID", "id");
    const expected: StrategyMemo = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("movedUp", () => {
    const strategyMemo: StrategyMemo = {
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
                        id: "id1",
                    },
                    {
                        name: "2",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "id2",
                    },
                ],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.movedUp(strategyMemo, "gameMapID", "id2");
    const expected: StrategyMemo = {
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
                        id: "id2",
                    },
                    {
                        name: "1",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "id1",
                    },
                ],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("movedDown", () => {
    const strategyMemo: StrategyMemo = {
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
                        id: "id2",
                    },
                    {
                        name: "1",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "id1",
                    },
                ],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.movedDown(strategyMemo, "gameMapID", "id2");
    const expected: StrategyMemo = {
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
                        id: "id1",
                    },
                    {
                        name: "2",
                        items: [],
                        monsters: [],
                        memo: "",
                        icon: "",
                        x: 0,
                        y: 0,
                        id: "id2",
                    },
                ],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("additionXY1", () => {
    const strategyMemo: StrategyMemo = {
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
                        id: "id",
                    },
                ],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.additionXY(strategyMemo, "gameMapID", "id", {
        x: 5,
        y: -5,
    });
    const expected: StrategyMemo = {
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
                        id: "id",
                    },
                ],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("additionXY2", () => {
    const strategyMemo: StrategyMemo = {
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
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.additionXY(strategyMemo, "gameMapID", "id", {
        x: -1,
        y: -1,
    });
    const expected: StrategyMemo = {
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
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("additionXY3", () => {
    const strategyMemo: StrategyMemo = {
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
                        id: "id",
                    },
                ],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapUtility.additionXY(strategyMemo, "gameMapID", "id", {
        x: 1,
        y: 1,
    });
    const expected: StrategyMemo = {
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
                        id: "id",
                    },
                ],
                image: "",
                id: "gameMapID",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});
