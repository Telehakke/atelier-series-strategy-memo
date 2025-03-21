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

test("added", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = MemoUtility.added(strategyMemo, {
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

test("changed", () => {
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
    const result = MemoUtility.changed(strategyMemo, 0, {
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

test("removed", () => {
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
    const result = MemoUtility.removed(strategyMemo, 0);
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
    const result = MemoUtility.movedUp(strategyMemo, 1);
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

test("movedDown", () => {
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
    const result = MemoUtility.movedDown(strategyMemo, 0);
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
