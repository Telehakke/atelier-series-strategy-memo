import { describe, expect, test } from "vitest";
import { Point } from "../dataClasses";
import { GameMapId } from "../gameMap";
import {
    GameMapDetail,
    GameMapDetailId,
    GameMapDetailList,
} from "../gameMapDetail";
import GameMapDetailFilter from "../gameMapDetailFilter";

const item1 = new GameMapDetail(
    "name1",
    ["item1"],
    ["monster1"],
    "memo1",
    "icon1",
    new Point(0, 0),
    new GameMapId("goto1"),
    false,
    new GameMapDetailId("id1"),
);
const item2 = new GameMapDetail(
    "name2",
    ["item2"],
    ["monster2"],
    "memo2",
    "icon2",
    new Point(0, 0),
    new GameMapId("goto2"),
    false,
    new GameMapDetailId("id2"),
);
const list = new GameMapDetailList(item1, item2);

describe("filtered", () => {
    test("1", () => {
        const result = GameMapDetailFilter.filtered(list, ["name"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapDetailList(item1, item2)),
        );
    });

    test("2", () => {
        const result = GameMapDetailFilter.filtered(list, ["item"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapDetailList(item1, item2)),
        );
    });

    test("3", () => {
        const result = GameMapDetailFilter.filtered(list, ["monster"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapDetailList(item1, item2)),
        );
    });

    test("4", () => {
        const result = GameMapDetailFilter.filtered(list, ["memo"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapDetailList(item1, item2)),
        );
    });

    test("5", () => {
        const result = GameMapDetailFilter.filtered(list, ["name1"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapDetailList(item1)),
        );
    });

    test("6", () => {
        const result = GameMapDetailFilter.filtered(list, ["name3"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapDetailList()),
        );
    });
});
