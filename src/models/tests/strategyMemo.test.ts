import { expect, test } from "vitest";
import {
    StrategyMemo,
    StrategyMemoUtility,
    StrategyMemoWithID,
} from "../strategyMemo";

test("isStrategyMemo", () => {
    const strategyMemo: StrategyMemo = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
    };
    expect(StrategyMemoUtility.isStrategyMemo(strategyMemo)).toBeTruthy();
});

test("changedGameName", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.changedGameName(strategyMemo, "name");
    const expected: StrategyMemoWithID = {
        gameName: "name",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

/* -------------------------------------------------------------------------- */

test("addedGameMapGroup", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.addedGameMapGroup(strategyMemo, {
        name: "",
        gameMaps: [],
        id: "",
    });
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("changedGameMapGroupName", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.changedGameMapGroupName(
        strategyMemo,
        0,
        "name",
    );
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "name",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("removedGameMapGroup", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.removedGameMapGroup(strategyMemo, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedGameMapGroupUp", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "1",
                gameMaps: [],
                id: "",
            },
            {
                name: "2",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.movedGameMapGroupUp(strategyMemo, 1);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "2",
                gameMaps: [],
                id: "",
            },
            {
                name: "1",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedGameMapGroupDown", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "1",
                gameMaps: [],
                id: "",
            },
            {
                name: "2",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.movedGameMapGroupDown(strategyMemo, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "2",
                gameMaps: [],
                id: "",
            },
            {
                name: "1",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

/* -------------------------------------------------------------------------- */

test("addedGameMap", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.addedGameMap(strategyMemo, 0, {
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("changedGameMap", () => {
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.changedGameMap(strategyMemo, 0, 0, {
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("removedGameMap", () => {
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.removedGameMap(strategyMemo, 0, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedGameMapUp", () => {
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.movedGameMapUp(strategyMemo, 0, 1);
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedGameMapDown", () => {
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.movedGameMapDown(strategyMemo, 0, 0);
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

/* -------------------------------------------------------------------------- */

test("addedPreparation", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.addedPreparation(strategyMemo, {
        name: "",
        materials: [],
        categories: [],
        id: "",
    });
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "",
                materials: [],
                categories: [],
                id: "",
            },
        ],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
});

test("changedPreparation", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "",
                materials: [],
                categories: [],
                id: "",
            },
        ],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.changedPreparation(strategyMemo, 0, {
        name: "name",
        materials: ["material"],
        categories: ["category"],
        id: "",
    });
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "name",
                materials: ["material"],
                categories: ["category"],
                id: "",
            },
        ],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("removedPreparation", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "",
                materials: [],
                categories: [],
                id: "",
            },
        ],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.removedPreparation(strategyMemo, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedPreparationUp", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "1",
                materials: [],
                categories: [],
                id: "",
            },
            {
                name: "2",
                materials: [],
                categories: [],
                id: "",
            },
        ],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.movedPreparationUp(strategyMemo, 1);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "2",
                materials: [],
                categories: [],
                id: "",
            },
            {
                name: "1",
                materials: [],
                categories: [],
                id: "",
            },
        ],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedPreparationDown", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "1",
                materials: [],
                categories: [],
                id: "",
            },
            {
                name: "2",
                materials: [],
                categories: [],
                id: "",
            },
        ],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.movedPreparationDown(strategyMemo, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "2",
                materials: [],
                categories: [],
                id: "",
            },
            {
                name: "1",
                materials: [],
                categories: [],
                id: "",
            },
        ],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

/* -------------------------------------------------------------------------- */

test("addedMemo", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.addedMemo(strategyMemo, {
        title: "",
        text: "",
        id: "",
    });
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "",
                text: "",
                id: "",
            },
        ],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("changedMemo", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "",
                text: "",
                id: "",
            },
        ],
        id: "",
    };
    const result = StrategyMemoUtility.changedMemo(strategyMemo, 0, {
        title: "title",
        text: "text",
        id: "",
    });
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "title",
                text: "text",
                id: "",
            },
        ],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("removedMemo", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "title",
                text: "text",
                id: "",
            },
        ],
        id: "",
    };
    const result = StrategyMemoUtility.removedMemo(strategyMemo, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedMemoUp", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "1",
                text: "",
                id: "",
            },
            {
                title: "2",
                text: "",
                id: "",
            },
        ],
        id: "",
    };
    const result = StrategyMemoUtility.movedMemoUp(strategyMemo, 1);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "2",
                text: "",
                id: "",
            },
            {
                title: "1",
                text: "",
                id: "",
            },
        ],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedMemoDown", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "1",
                text: "",
                id: "",
            },
            {
                title: "2",
                text: "",
                id: "",
            },
        ],
        id: "",
    };
    const result = StrategyMemoUtility.movedMemoDown(strategyMemo, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "2",
                text: "",
                id: "",
            },
            {
                title: "1",
                text: "",
                id: "",
            },
        ],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

/* -------------------------------------------------------------------------- */

test("changedGameMapXY1", () => {
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.additionGameMapXY(
        strategyMemo,
        0,
        0,
        5,
        -5,
    );
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("changedGameMapXY2", () => {
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.additionGameMapXY(
        strategyMemo,
        0,
        0,
        -1,
        -1,
    );
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("changedGameMapXY3", () => {
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.additionGameMapXY(
        strategyMemo,
        0,
        0,
        1,
        1,
    );
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
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});
