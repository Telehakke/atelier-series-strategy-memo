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
        "name",
        "material1、material2",
        "category1、category2",
        "id",
    );
    const expected: PreparationWithID = {
        name: "name",
        materials: ["material1", "material2"],
        categories: ["category1", "category2"],
        id: "id",
    };
    expect(preparation).toEqual(expected);
});

test("find1", () => {
    const preparations: PreparationWithID[] = [
        { name: "name1", materials: [], categories: [], id: "id1" },
        { name: "name2", materials: [], categories: [], id: "id2" },
    ];
    const result = PreparationUtility.find(preparations, "id1");
    const expected: PreparationWithID = {
        name: "name1",
        materials: [],
        categories: [],
        id: "id1",
    };
    expect(result).toEqual(expected);
});

test("find2", () => {
    const preparations: PreparationWithID[] = [
        { name: "name1", materials: [], categories: [], id: "id1" },
        { name: "name2", materials: [], categories: [], id: "id2" },
    ];
    const result = PreparationUtility.find(preparations, "id3");
    expect(result).toBeNull();
});

test("findIndex1", () => {
    const preparations: PreparationWithID[] = [
        { name: "name1", materials: [], categories: [], id: "id1" },
        { name: "name2", materials: [], categories: [], id: "id2" },
    ];
    const result = PreparationUtility.findIndex(preparations, "id1");
    expect(result).toBe(0);
});

test("findIndex2", () => {
    const preparations: PreparationWithID[] = [
        { name: "name1", materials: [], categories: [], id: "id1" },
        { name: "name2", materials: [], categories: [], id: "id2" },
    ];
    const result = PreparationUtility.findIndex(preparations, "id3");
    expect(result).toBeNull();
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
    expect(result).toEqual(expected);
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
                id: "id",
            },
        ],
        memos: [],
        id: "",
    };
    const result = PreparationUtility.changed(strategyMemo, "id", {
        name: "name",
        materials: ["material"],
        categories: ["category"],
    });
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "name",
                materials: ["material"],
                categories: ["category"],
                id: "id",
            },
        ],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
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
                id: "id",
            },
        ],
        memos: [],
        id: "",
    };
    const result = PreparationUtility.removed(strategyMemo, "id");
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("movedUp", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "name1",
                materials: [],
                categories: [],
                id: "id1",
            },
            {
                name: "name2",
                materials: [],
                categories: [],
                id: "id2",
            },
        ],
        memos: [],
        id: "",
    };
    const result = PreparationUtility.movedUp(strategyMemo, "id2");
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "name2",
                materials: [],
                categories: [],
                id: "id2",
            },
            {
                name: "name1",
                materials: [],
                categories: [],
                id: "id1",
            },
        ],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("movedDown", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "name2",
                materials: [],
                categories: [],
                id: "id2",
            },
            {
                name: "name1",
                materials: [],
                categories: [],
                id: "id1",
            },
        ],
        memos: [],
        id: "",
    };
    const result = PreparationUtility.movedDown(strategyMemo, "id2");
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [
            {
                name: "name1",
                materials: [],
                categories: [],
                id: "id1",
            },
            {
                name: "name2",
                materials: [],
                categories: [],
                id: "id2",
            },
        ],
        memos: [],
        id: "",
    };
    expect(result).toEqual(expected);
});
