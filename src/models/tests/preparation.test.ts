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
