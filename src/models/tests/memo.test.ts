import { expect, test } from "vitest";
import { Memo, MemoUtility } from "../memo";
import { StrategyMemo } from "../strategyMemo";

test("find1", () => {
    const memos: Memo[] = [
        { title: "title1", text: "text1", id: "id1" },
        { title: "title2", text: "text2", id: "id2" },
    ];
    const result = MemoUtility.find(memos, "id1");
    const expected: Memo = { title: "title1", text: "text1", id: "id1" };
    expect(result).toEqual(expected);
});

test("find2", () => {
    const memos: Memo[] = [
        { title: "title1", text: "text1", id: "id1" },
        { title: "title2", text: "text2", id: "id2" },
    ];
    const result = MemoUtility.find(memos, "id3");
    expect(result).toBeNull();
});

test("findIndex1", () => {
    const memos: Memo[] = [
        { title: "title1", text: "text1", id: "id1" },
        { title: "title2", text: "text2", id: "id2" },
    ];
    const result = MemoUtility.findIndex(memos, "id1");
    expect(result).toBe(0);
});

test("findIndex2", () => {
    const memos: Memo[] = [
        { title: "title1", text: "text1", id: "id1" },
        { title: "title2", text: "text2", id: "id2" },
    ];
    const result = MemoUtility.findIndex(memos, "id3");
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
    const result = MemoUtility.added(strategyMemo, {
        title: "",
        text: "",
        id: "",
    });
    const expected: StrategyMemo = {
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
    const strategyMemo: StrategyMemo = {
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
    const expected: StrategyMemo = {
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
    const strategyMemo: StrategyMemo = {
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
    const expected: StrategyMemo = {
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
    const strategyMemo: StrategyMemo = {
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
    const expected: StrategyMemo = {
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
