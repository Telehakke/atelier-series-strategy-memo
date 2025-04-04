import { expect, test } from "vitest";
import { StrategyMemo, StrategyMemoUtility } from "../strategyMemo";

test("copied1", () => {
    const result = StrategyMemoUtility.copied(null, "0");
    const expected: StrategyMemo = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "0",
    };
    expect(result).toEqual(expected);
});

test("copied2", () => {
    const result = StrategyMemoUtility.copied({}, "0");
    const expected: StrategyMemo = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "0",
    };
    expect(result).toEqual(expected);
});

test("copied3", () => {
    const strategyMemo: StrategyMemo = {
        gameName: "name",
        gameMapGroups: [
            {
                name: "name",
                gameMaps: [
                    {
                        name: "name",
                        items: [],
                        monsters: [],
                        memo: "memo",
                        icon: "icon",
                        x: 0,
                        y: 0,
                        id: "id",
                    },
                ],
                image: "image",
                id: "id",
            },
        ],
        preparations: [
            {
                name: "name",
                materials: [],
                categories: [],
                id: "id",
            },
        ],
        memos: [
            {
                title: "title",
                text: "text",
                id: "id",
            },
        ],
        id: "id",
    };
    const result = StrategyMemoUtility.copied(strategyMemo);
    const expected: StrategyMemo = {
        gameName: "name",
        gameMapGroups: [
            {
                name: "name",
                gameMaps: [
                    {
                        name: "name",
                        items: [],
                        monsters: [],
                        memo: "memo",
                        icon: "icon",
                        x: 0,
                        y: 0,
                        id: "id",
                    },
                ],
                image: "image",
                id: "id",
            },
        ],
        preparations: [
            {
                name: "name",
                materials: [],
                categories: [],
                id: "id",
            },
        ],
        memos: [
            {
                title: "title",
                text: "text",
                id: "id",
            },
        ],
        id: "id",
    };
    expect(result).toEqual(expected);
});

test("changedGameName", () => {
    const strategyMemo: StrategyMemo = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = StrategyMemoUtility.changedGameName(strategyMemo, "name");
    const expected: StrategyMemo = {
        gameName: "name",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});
