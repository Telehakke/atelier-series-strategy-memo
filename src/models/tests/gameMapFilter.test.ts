import { describe, expect, test } from "vitest";
import { Point } from "../dataClasses";
import { GameMap, GameMapId, GameMapList } from "../gameMap";
import {
    GameMapDetail,
    GameMapDetailId,
    GameMapDetailList,
} from "../gameMapDetail";
import GameMapFilter from "../gameMapFilter";
import { GameMapShapeList } from "../gameMapShape";

const gameMapDetail1 = new GameMapDetail(
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
const gameMapDetail2 = new GameMapDetail(
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
const gameMap = new GameMap(
    "",
    new GameMapDetailList(gameMapDetail1, gameMapDetail2),
    new GameMapShapeList(),
    "",
    new GameMapId("id"),
);
const gameMapList = new GameMapList(gameMap);

describe("filtered", () => {
    test("1", () => {
        const result = GameMapFilter.filtered(gameMapList, ["name"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapList(gameMap)),
        );
    });

    test("2", () => {
        const result = GameMapFilter.filtered(gameMapList, ["item"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapList(gameMap)),
        );
    });

    test("3", () => {
        const result = GameMapFilter.filtered(gameMapList, ["monster"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapList(gameMap)),
        );
    });

    test("4", () => {
        const result = GameMapFilter.filtered(gameMapList, ["memo"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapList(gameMap)),
        );
    });

    test("5", () => {
        const result = GameMapFilter.filtered(gameMapList, ["name1"]);
        const gameMap = new GameMap(
            "",
            new GameMapDetailList(gameMapDetail1),
            new GameMapShapeList(),
            "",
            new GameMapId("id"),
        );
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapList(gameMap)),
        );
    });

    test("6", () => {
        const result = GameMapFilter.filtered(gameMapList, ["name3"]);
        const gameMap = new GameMap(
            "",
            new GameMapDetailList(),
            new GameMapShapeList(),
            "",
            new GameMapId("id"),
        );
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new GameMapList(gameMap)),
        );
    });
});
