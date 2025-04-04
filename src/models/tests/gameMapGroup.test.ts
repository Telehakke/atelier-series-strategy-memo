import { expect, test } from "vitest";
import { GameMapGroup, GameMapGroupUtility } from "../gameMapGroup";
import { StrategyMemo } from "../strategyMemo";

test("find1", () => {
    const gameMapGroups: GameMapGroup[] = [
        {
            name: "name1",
            gameMaps: [],
            image: "image1",
            id: "id1",
        },
        {
            name: "name2",
            gameMaps: [],
            image: "image2",
            id: "id2",
        },
    ];
    const result = GameMapGroupUtility.find(gameMapGroups, "id1");
    const expected: GameMapGroup = {
        name: "name1",
        gameMaps: [],
        image: "image1",
        id: "id1",
    };
    expect(result).toEqual(expected);
});

test("find2", () => {
    const gameMapGroups: GameMapGroup[] = [
        {
            name: "name1",
            gameMaps: [],
            image: "image1",
            id: "id1",
        },
        {
            name: "name2",
            gameMaps: [],
            image: "image2",
            id: "id2",
        },
    ];
    const result = GameMapGroupUtility.find(gameMapGroups, "id3");
    expect(result).toBeNull();
});

test("findIndex1", () => {
    const gameMapGroups: GameMapGroup[] = [
        {
            name: "name1",
            gameMaps: [],
            image: "image1",
            id: "id1",
        },
        {
            name: "name2",
            gameMaps: [],
            image: "image2",
            id: "id2",
        },
    ];
    const result = GameMapGroupUtility.findIndex(gameMapGroups, "id1");
    expect(result).toBe(0);
});

test("findIndex2", () => {
    const gameMapGroups: GameMapGroup[] = [
        {
            name: "name1",
            gameMaps: [],
            image: "image1",
            id: "id1",
        },
        {
            name: "name2",
            gameMaps: [],
            image: "image2",
            id: "id2",
        },
    ];
    const result = GameMapGroupUtility.findIndex(gameMapGroups, "id3");
    expect(result).toBeNull();
});

test("findID1", () => {
    const gameMapGroups: GameMapGroup[] = [
        {
            name: "name1",
            gameMaps: [],
            image: "image1",
            id: "id1",
        },
        {
            name: "name2",
            gameMaps: [],
            image: "image2",
            id: "id2",
        },
    ];
    const result = GameMapGroupUtility.findID(gameMapGroups, 0);
    expect(result).toBe("id1");
});

test("findID2", () => {
    const gameMapGroups: GameMapGroup[] = [
        {
            name: "name1",
            gameMaps: [],
            image: "image1",
            id: "id1",
        },
        {
            name: "name2",
            gameMaps: [],
            image: "image2",
            id: "id2",
        },
    ];
    const result = GameMapGroupUtility.findID(gameMapGroups, 2);
    expect(result).toBeNull();
});

test("findID3", () => {
    const gameMapGroups: GameMapGroup[] = [];
    const result = GameMapGroupUtility.findID(gameMapGroups, 0);
    expect(result).toBeNull();
});

test("added", () => {
    const strategyMemo: StrategyMemo = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.added(strategyMemo, {
        name: "",
        gameMaps: [],
        image: "",
        id: "",
    });
    const expected: StrategyMemo = {
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
    expect(result).toEqual(expected);
});

test("changedName", () => {
    const strategyMemo: StrategyMemo = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                image: "",
                id: "id",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.changedName(strategyMemo, "id", "name");
    const expected: StrategyMemo = {
        gameName: "",
        gameMapGroups: [
            {
                name: "name",
                gameMaps: [],
                image: "",
                id: "id",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("changedImage", () => {
    const strategyMemo: StrategyMemo = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                image: "",
                id: "id",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.changedImage(
        strategyMemo,
        "id",
        "data:image/png;base64,...",
    );
    const expected: StrategyMemo = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                image: "data:image/png;base64,...",
                id: "id",
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
                gameMaps: [],
                image: "",
                id: "id",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.removed(strategyMemo, "id");
    const expected: StrategyMemo = {
        gameName: "",
        gameMapGroups: [],
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
                name: "name1",
                gameMaps: [],
                image: "image1",
                id: "id1",
            },
            {
                name: "name2",
                gameMaps: [],
                image: "image2",
                id: "id2",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.movedUp(strategyMemo, "id2");
    const expected: StrategyMemo = {
        gameName: "",
        gameMapGroups: [
            {
                name: "name2",
                gameMaps: [],
                image: "image2",
                id: "id2",
            },
            {
                name: "name1",
                gameMaps: [],
                image: "image1",
                id: "id1",
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
                name: "name2",
                gameMaps: [],
                image: "image2",
                id: "id2",
            },
            {
                name: "name1",
                gameMaps: [],
                image: "image1",
                id: "id1",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.movedDown(strategyMemo, "id2");
    const expected: StrategyMemo = {
        gameName: "",
        gameMapGroups: [
            {
                name: "name1",
                gameMaps: [],
                image: "image1",
                id: "id1",
            },
            {
                name: "name2",
                gameMaps: [],
                image: "image2",
                id: "id2",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});
