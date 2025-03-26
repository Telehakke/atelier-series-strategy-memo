import { expect, test } from "vitest";
import { GameMapGroupUtility } from "../gameMapGroup";
import { StrategyMemoWithID } from "../strategyMemo";

test("isGameMapGroup", () => {
    const gameMapGroup = GameMapGroupUtility.create("name", [], "", "0");
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
        image: "",
        id: "",
    });
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                image: "",
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
                image: "",
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
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("changedImage", () => {
    const strategyMemo: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    const result = GameMapGroupUtility.changedImage(
        strategyMemo,
        0,
        "data:image/png;base64,...",
    );
    const expected: StrategyMemoWithID = {
        gameName: "",
        gameMapGroups: [
            {
                name: "",
                gameMaps: [],
                image: "data:image/png;base64,...",
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
                image: "",
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
                image: "",
                id: "",
            },
            {
                name: "2",
                gameMaps: [],
                image: "",
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
                image: "",
                id: "",
            },
            {
                name: "1",
                gameMaps: [],
                image: "",
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
                image: "",
                id: "",
            },
            {
                name: "2",
                gameMaps: [],
                image: "",
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
                image: "",
                id: "",
            },
            {
                name: "1",
                gameMaps: [],
                image: "",
                id: "",
            },
        ],
        preparations: [],
        memos: [],
        id: "",
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});
