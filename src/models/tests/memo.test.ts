import { expect, test } from "vitest";
import { MemoUtility, MemoWithID } from "../memo";
import { StrategyMemoWithID } from "../strategyMemo";

test("isMemo", () => {
    const memo = MemoUtility.create("title", "text", "0");
    expect(MemoUtility.isMemo(memo)).toBeTruthy();
});

test("isMemos", () => {
    const memos: MemoUtility[] = [];
    expect(MemoUtility.isMemos(memos)).toBeTruthy();
});

test("find1", () => {
    const memos: MemoWithID[] = [
        { title: "title1", text: "text1", id: "id1" },
        { title: "title2", text: "text2", id: "id2" },
    ];
    const result = MemoUtility.find(memos, "id1");
    const expected: MemoWithID = { title: "title1", text: "text1", id: "id1" };
    expect(result).toEqual(expected);
});

test("find2", () => {
    const memos: MemoWithID[] = [
        { title: "title1", text: "text1", id: "id1" },
        { title: "title2", text: "text2", id: "id2" },
    ];
    const result = MemoUtility.find(memos, "id3");
    expect(result).toBeNull();
});

test("findIndex1", () => {
    const memos: MemoWithID[] = [
        { title: "title1", text: "text1", id: "id1" },
        { title: "title2", text: "text2", id: "id2" },
    ];
    const result = MemoUtility.findIndex(memos, "id1");
    expect(result).toBe(0);
});

test("findIndex2", () => {
    const memos: MemoWithID[] = [
        { title: "title1", text: "text1", id: "id1" },
        { title: "title2", text: "text2", id: "id2" },
    ];
    const result = MemoUtility.findIndex(memos, "id3");
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
    expect(result).toEqual(expected);
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
                id: "id",
            },
        ],
        id: "",
    };
    const result = MemoUtility.changed(strategyMemo, "id", {
        title: "title",
        text: "text",
    });
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "title",
                text: "text",
                id: "id",
            },
        ],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("removed", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "",
                text: "",
                id: "id",
            },
        ],
        id: "",
    };
    const result = MemoUtility.removed(strategyMemo, "id");
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
        preparations: [],
        memos: [
            {
                title: "title1",
                text: "text1",
                id: "id1",
            },
            {
                title: "title2",
                text: "text2",
                id: "id2",
            },
        ],
        id: "",
    };
    const result = MemoUtility.movedUp(strategyMemo, "id2");
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "title2",
                text: "text2",
                id: "id2",
            },
            {
                title: "title1",
                text: "text1",
                id: "id1",
            },
        ],
        id: "",
    };
    expect(result).toEqual(expected);
});

test("movedDown", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "title2",
                text: "text2",
                id: "id2",
            },
            {
                title: "title1",
                text: "text1",
                id: "id1",
            },
        ],
        id: "",
    };
    const result = MemoUtility.movedDown(strategyMemo, "id2");
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [
            {
                title: "title1",
                text: "text1",
                id: "id1",
            },
            {
                title: "title2",
                text: "text2",
                id: "id2",
            },
        ],
        id: "",
    };
    expect(result).toEqual(expected);
});
