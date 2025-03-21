import { expect, test } from "vitest";
import { MemoUtility } from "../memo";
import { StrategyMemoWithID } from "../strategyMemo";

test("isMemo", () => {
    const memo = MemoUtility.create("title", "text", "0");
    expect(MemoUtility.isMemo(memo)).toBeTruthy();
});

test("isMemos", () => {
    const memos: MemoUtility[] = [];
    expect(MemoUtility.isMemos(memos)).toBeTruthy();
});

test("findIndex", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [{ title: "", text: "", id: "id" }],
        id: "",
    };
    const result = MemoUtility.findIndex(strategyMemo, "id");
    expect(result).toBe(0);
});
