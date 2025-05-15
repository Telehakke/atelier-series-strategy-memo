import { describe, expect, test } from "vitest";
import { Angle, Point, Progress, Scale, Thickness } from "../dataClasses";
import { GameMap, GameMapId, GameMapList } from "../gameMap";
import {
    GameMapDetail,
    GameMapDetailId,
    GameMapDetailList,
} from "../gameMapDetail";
import {
    GameMapShape,
    GameMapShapeId,
    GameMapShapeList,
    ShapeColorEnum,
    ShapeNameEnum,
} from "../gameMapShape";

describe("copyWith", () => {
    const item = new GameMap(
        "",
        new GameMapDetailList(),
        new GameMapShapeList(),
        "",
        new GameMapId("id"),
    );

    test("1", () => {
        const result = item.copyWith();
        expect(JSON.stringify(result)).toBe(JSON.stringify(item));
    });

    test("2", () => {
        const newItem = new GameMap(
            "name",
            new GameMapDetailList(
                new GameMapDetail(
                    "",
                    [],
                    [],
                    "",
                    "",
                    new Point(0, 0),
                    new GameMapId(""),
                    false,
                    new GameMapDetailId(""),
                ),
            ),
            new GameMapShapeList(
                new GameMapShape(
                    ShapeNameEnum.circle.name,
                    new Thickness(0),
                    ShapeColorEnum.black.name,
                    false,
                    new Scale(0, 0),
                    new Angle(0),
                    false,
                    new Progress(0),
                    new Point(0, 0),
                    new GameMapShapeId(""),
                ),
            ),
            "image",
            new GameMapId("id"),
        );
        const result = item.copyWith({
            name: newItem.name,
            gameMapDetails: newItem.gameMapDetails,
            gameMapShapes: newItem.gameMapShapes,
            image: newItem.image,
            id: newItem.id,
        });
        expect(JSON.stringify(result)).toBe(JSON.stringify(newItem));
    });
});

describe("find", () => {
    const item = new GameMap(
        "",
        new GameMapDetailList(),
        new GameMapShapeList(),
        "",
        new GameMapId("id"),
    );
    const list = new GameMapList(item);

    test("1", () => {
        const result = list.find(item.id);
        expect(JSON.stringify(result)).toBe(JSON.stringify(item));
    });

    test("2", () => {
        const result = list.find(new GameMapId("id1"));
        expect(result).toBeNull();
    });
});

describe("findIndex", () => {
    const item = new GameMap(
        "",
        new GameMapDetailList(),
        new GameMapShapeList(),
        "",
        new GameMapId("id"),
    );
    const list = new GameMapList(item);

    test("1", () => {
        const result = list.findIndex(item.id);
        expect(result).toBe(0);
    });

    test("2", () => {
        const result = list.findIndex(new GameMapId("id1"));
        expect(result).toBeNull();
    });
});

describe("findID", () => {
    const item = new GameMap(
        "",
        new GameMapDetailList(),
        new GameMapShapeList(),
        "",
        new GameMapId("id"),
    );
    const list = new GameMapList(item);

    test("1", () => {
        const result = list.findId(0);
        expect(result?.value).toBe(item.id.value);
    });

    test("2", () => {
        const result = list.findId(1);
        expect(result).toBeNull();
    });
});

test("added", () => {
    const item = new GameMap(
        "",
        new GameMapDetailList(),
        new GameMapShapeList(),
        "",
        new GameMapId("id"),
    );
    const list = new GameMapList();
    const result = list.added(item);
    const expected = new GameMapList(item);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("changed", () => {
    const item1 = new GameMap(
        "",
        new GameMapDetailList(),
        new GameMapShapeList(),
        "",
        new GameMapId("id1"),
    );
    const item2 = new GameMap(
        "",
        new GameMapDetailList(),
        new GameMapShapeList(),
        "",
        new GameMapId("id2"),
    );
    const list = new GameMapList(item1);
    const result = list.replaced(item1.id, item2);
    const expected = new GameMapList(item2);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("removed", () => {
    const item = new GameMap(
        "",
        new GameMapDetailList(),
        new GameMapShapeList(),
        "",
        new GameMapId("id"),
    );
    const list = new GameMapList(item);
    const result = list.removed(item.id);
    const expected = new GameMapList();
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
});

describe("move", () => {
    const item1 = new GameMap(
        "",
        new GameMapDetailList(),
        new GameMapShapeList(),
        "",
        new GameMapId("id1"),
    );
    const item2 = new GameMap(
        "",
        new GameMapDetailList(),
        new GameMapShapeList(),
        "",
        new GameMapId("id2"),
    );
    const list = new GameMapList(item1, item2);

    test("movedUp", () => {
        const result = list.movedUp(item2.id);
        const expected = new GameMapList(item2, item1);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    test("movedDown", () => {
        const result = list.movedDown(item1.id);
        const expected = new GameMapList(item2, item1);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
});
