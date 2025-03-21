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
