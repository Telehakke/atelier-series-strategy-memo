import { expect, test } from "vitest";
import { PreparationUtility, PreparationWithID } from "../preparation";
import { StrategyMemoWithID } from "../strategyMemo";

test("isPreparation", () => {
    const preparation = PreparationUtility.create(
        "name",
        "material",
        "category",
        "0",
    );
    expect(PreparationUtility.isPreparation(preparation)).toBeTruthy();
});

test("isPreparations", () => {
    const preparations: PreparationUtility[] = [];
    expect(PreparationUtility.isPreparations(preparations)).toBeTruthy();
});

test("create", () => {
    const preparation = PreparationUtility.create(
        "失敗作の灰",
        "",
        "（エリキシル）、（魔法の道具）",
        "0",
    );
    const expected: PreparationWithID = {
        name: "失敗作の灰",
        materials: [],
        categories: ["（エリキシル）", "（魔法の道具）"],
        id: "0",
    };
    expect(preparation).toEqual(expected);
});

test("findIndex", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [{ name: "", materials: [], categories: [], id: "id" }],
        memos: [],
        id: "",
    };
    const result = PreparationUtility.findIndex(strategyMemo, "id");
    expect(result).toBe(0);
});

test("added", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = PreparationUtility.added(strategyMemo, {
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

test("changed", () => {
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
    const result = PreparationUtility.changed(strategyMemo, 0, {
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

test("removed", () => {
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
    const result = PreparationUtility.removed(strategyMemo, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedUp", () => {
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
    const result = PreparationUtility.movedUp(strategyMemo, 1);
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

test("movedDown", () => {
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
    const result = PreparationUtility.movedDown(strategyMemo, 0);
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
