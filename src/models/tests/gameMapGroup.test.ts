import { expect, test } from "vitest";
import { GameMapGroupUtility } from "../gameMapGroup";
import { StrategyMemoWithID } from "../strategyMemo";

test("isGameMapGroup", () => {
    const gameMapGroup = GameMapGroupUtility.create("name", [], "0");
    expect(GameMapGroupUtility.isGameMapGroup(gameMapGroup)).toBeTruthy();
});

test("isGameMapGroups", () => {
    const gameMapGroups: GameMapGroupUtility[] = [];
    expect(GameMapGroupUtility.isGameMapGroups(gameMapGroups)).toBeTruthy();
});

test("added", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.added(strategyMemo, {
        name: "",
        gameMaps: [],
        id: "",
    });
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("changedName", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.changedName(strategyMemo, 0, "name");
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "name",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("removed", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.removed(strategyMemo, 0);
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
        gameMapGroups: [
            {
                name: "1",
                gameMaps: [],
                id: "",
            },
            {
                name: "2",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.movedUp(strategyMemo, 1);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "2",
                gameMaps: [],
                id: "",
            },
            {
                name: "1",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("movedDown", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "1",
                gameMaps: [],
                id: "",
            },
            {
                name: "2",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.movedDown(strategyMemo, 0);
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "2",
                gameMaps: [],
                id: "",
            },
            {
                name: "1",
                gameMaps: [],
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});
