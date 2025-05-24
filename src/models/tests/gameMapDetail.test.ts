import { describe, expect, test } from "vitest";
import { Point } from "../dataClasses";
import { GameMapId } from "../gameMap";
import {
    GameMapDetail,
    GameMapDetailId,
    GameMapDetailList,
} from "../gameMapDetail";

describe("copyWith", () => {
    const item = new GameMapDetail(
        "",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId("id"),
        false,
        new GameMapDetailId("id"),
    );

    test("1", () => {
        const result = item.copyWith();
        expect(JSON.stringify(result)).toBe(JSON.stringify(item));
    });

    test("2", () => {
        const newItem = new GameMapDetail(
            "name",
            ["item"],
            ["monster"],
            "memo",
            "icon",
            new Point(1, 1),
            new GameMapId("id1"),
            false,
            new GameMapDetailId("id1"),
        );
        const result = item.copyWith({
            name: newItem.name,
            items: newItem.items,
            monsters: newItem.monsters,
            memo: newItem.memo,
            icon: newItem.icon,
            point: newItem.point,
            goto: newItem.goto,
            checked: newItem.checked,
            id: newItem.id,
        });
        expect(JSON.stringify(result)).toBe(JSON.stringify(newItem));
    });
});

test("create", () => {
    const item = new GameMapDetail(
        "name",
        ["item1", "item2"],
        ["monster1", "monster2"],
        "memo",
        "icon",
        new Point(1, 2),
        new GameMapId("goto"),
        false,
        new GameMapDetailId("id"),
    );
    const newItem = GameMapDetail.create({
        name: item.name,
        items: item.itemsToCommaSeparatedStr,
        monsters: item.monstersToCommaSeparatedStr,
        memo: item.memo,
        icon: item.icon,
        x: item.point.x.toString(),
        y: item.point.y.toString(),
        goto: item.goto,
        checked: item.checked,
        id: item.id,
    });
    expect(JSON.stringify(newItem)).toEqual(JSON.stringify(item));
});

describe("find", () => {
    const item = new GameMapDetail(
        "",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId("id"),
        false,
        new GameMapDetailId("id"),
    );
    const list = new GameMapDetailList(item);

    test("1", () => {
        const result = list.find(item.id);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(item));
    });

    test("2", () => {
        const result = list.find(new GameMapDetailId("id1"));
        expect(result).toBeNull();
    });
});

describe("findIndex", () => {
    const item = new GameMapDetail(
        "",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId("id"),
        false,
        new GameMapDetailId("id"),
    );
    const list = new GameMapDetailList(item);

    test("1", () => {
        const result = list.findIndex(item.id);
        expect(result).toBe(0);
    });

    test("2", () => {
        const result = list.findIndex(new GameMapDetailId("id1"));
        expect(result).toBeNull();
    });
});

test("added", () => {
    const item = new GameMapDetail(
        "",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId("id"),
        false,
        new GameMapDetailId("id"),
    );
    const list = new GameMapDetailList();
    const result = list.added(item);
    const expected = new GameMapDetailList(item);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
});

test("replaced", () => {
    const item = new GameMapDetail(
        "",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId("id"),
        false,
        new GameMapDetailId("id1"),
    );
    const list = new GameMapDetailList(item);
    const newItem = new GameMapDetail(
        "name",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId("id"),
        false,
        item.id,
    );
    const result = list.replaced(newItem);
    const expected = new GameMapDetailList(newItem);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
});

test("removed", () => {
    const item = new GameMapDetail(
        "",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId("id"),
        false,
        new GameMapDetailId("id"),
    );
    const list = new GameMapDetailList(item);
    const result = list.removed(item.id);
    const expected = new GameMapDetailList();
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
});

describe("moved", () => {
    const item1 = new GameMapDetail(
        "",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId("id"),
        false,
        new GameMapDetailId("id1"),
    );
    const item2 = new GameMapDetail(
        "",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId("id"),
        false,
        new GameMapDetailId("id2"),
    );
    const list = new GameMapDetailList(item1, item2);

    test("Up", () => {
        const result = list.movedUp(item2.id);
        const expected = new GameMapDetailList(item2, item1);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    test("Down", () => {
        const result = list.movedDown(item1.id);
        const expected = new GameMapDetailList(item2, item1);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
});
