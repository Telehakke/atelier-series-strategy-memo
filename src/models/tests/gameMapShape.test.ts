import { describe, expect, test } from "vitest";
import { Angle, Point, Progress, Scale, Thickness } from "../dataClasses";
import {
    GameMapShape,
    GameMapShapeId,
    GameMapShapeList,
    GameMapShapeUtility,
    isShapeColor,
    isShapeName,
    ShapeColorEnum,
    ShapeNameEnum,
} from "../gameMapShape";

describe("isShapeName", () => {
    test("1", () => {
        const result = isShapeName(ShapeNameEnum.square.value);
        expect(result).toBeTruthy();
    });

    test("2", () => {
        const result = isShapeName(ShapeNameEnum.circle.value);
        expect(result).toBeTruthy();
    });

    test("3", () => {
        const result = isShapeName(ShapeNameEnum.minus.value);
        expect(result).toBeTruthy();
    });

    test("4", () => {
        const result = isShapeName(ShapeNameEnum.moveRight.value);
        expect(result).toBeTruthy();
    });

    test("5", () => {
        const result = isShapeName(ShapeNameEnum.moveHorizontal.value);
        expect(result).toBeTruthy();
    });

    test("6", () => {
        const result = isShapeName(ShapeNameEnum.redoDot.value);
        expect(result).toBeTruthy();
    });

    test("7", () => {
        const result = isShapeName("unknown");
        expect(result).toBeFalsy();
    });
});

describe("isShapeColor", () => {
    test("1", () => {
        const result = isShapeColor(ShapeColorEnum.currentColor.value);
        expect(result).toBeTruthy();
    });

    test("2", () => {
        const result = isShapeColor(ShapeColorEnum.red.value);
        expect(result).toBeTruthy();
    });

    test("3", () => {
        const result = isShapeColor(ShapeColorEnum.blue.value);
        expect(result).toBeTruthy();
    });

    test("4", () => {
        const result = isShapeColor(ShapeColorEnum.green.value);
        expect(result).toBeTruthy();
    });

    test("5", () => {
        const result = isShapeColor(ShapeColorEnum.black.value);
        expect(result).toBeTruthy();
    });

    test("6", () => {
        const result = isShapeColor(ShapeColorEnum.white.value);
        expect(result).toBeTruthy();
    });

    test("7", () => {
        const result = isShapeColor("unknown");
        expect(result).toBeFalsy();
    });
});

describe("copyWith", () => {
    const item = new GameMapShape(
        ShapeNameEnum.circle.value,
        new Thickness(Thickness.min),
        ShapeColorEnum.black.value,
        false,
        new Scale(Scale.min, Scale.min),
        new Angle(Angle.min),
        false,
        new Progress(Progress.min),
        new Point(Point.min, Point.min),
        new GameMapShapeId("id"),
    );

    test("1", () => {
        const result = item.copyWith();
        expect(JSON.stringify(result)).toBe(JSON.stringify(item));
    });

    test("2", () => {
        const newItem = new GameMapShape(
            ShapeNameEnum.minus.value,
            new Thickness(Thickness.min + 1),
            ShapeColorEnum.blue.value,
            false,
            new Scale(Scale.min + 1, Scale.min + 1),
            new Angle(Angle.min + 1),
            false,
            new Progress(Progress.min + 1),
            new Point(Point.min + 1, Point.min + 1),
            new GameMapShapeId("id"),
        );
        const result = item.copyWith({
            name: newItem.name,
            thickness: newItem.thickness,
            color: newItem.color,
            fill: newItem.fill,
            scale: newItem.scale,
            angle: newItem.angle,
            flip: newItem.flip,
            progress: newItem.progress,
            point: newItem.point,
            id: newItem.id,
        });
        expect(JSON.stringify(result)).toBe(JSON.stringify(newItem));
    });
});

describe("find", () => {
    const item = new GameMapShape(
        ShapeNameEnum.circle.value,
        new Thickness(0),
        ShapeColorEnum.black.value,
        false,
        new Scale(0, 0),
        new Angle(0),
        false,
        new Progress(0),
        new Point(0, 0),
        new GameMapShapeId("id"),
    );
    const list = new GameMapShapeList(item);

    test("1", () => {
        const result = list.find(item.id);
        expect(JSON.stringify(result)).toBe(JSON.stringify(item));
    });

    test("2", () => {
        const result = list.find(new GameMapShapeId("id1"));
        expect(result).toBeNull();
    });
});

describe("findIndex", () => {
    const item = new GameMapShape(
        ShapeNameEnum.circle.value,
        new Thickness(0),
        ShapeColorEnum.black.value,
        false,
        new Scale(0, 0),
        new Angle(0),
        false,
        new Progress(0),
        new Point(0, 0),
        new GameMapShapeId("id"),
    );
    const list = new GameMapShapeList(item);

    test("1", () => {
        const result = list.findIndex(item.id);
        expect(result).toBe(0);
    });

    test("findIndex2", () => {
        const result = list.findIndex(new GameMapShapeId("id1"));
        expect(result).toBeNull();
    });
});

test("added", () => {
    const item = new GameMapShape(
        ShapeNameEnum.circle.value,
        new Thickness(0),
        ShapeColorEnum.black.value,
        false,
        new Scale(0, 0),
        new Angle(0),
        false,
        new Progress(0),
        new Point(0, 0),
        new GameMapShapeId("id"),
    );
    const list = new GameMapShapeList();
    const result = list.added(item);
    const expected = new GameMapShapeList(item);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("replaced", () => {
    const item1 = new GameMapShape(
        ShapeNameEnum.circle.value,
        new Thickness(0),
        ShapeColorEnum.black.value,
        false,
        new Scale(0, 0),
        new Angle(0),
        false,
        new Progress(0),
        new Point(0, 0),
        new GameMapShapeId("id1"),
    );
    const item2 = new GameMapShape(
        ShapeNameEnum.circle.value,
        new Thickness(0),
        ShapeColorEnum.black.value,
        false,
        new Scale(0, 0),
        new Angle(0),
        false,
        new Progress(0),
        new Point(0, 0),
        new GameMapShapeId("id2"),
    );
    const list = new GameMapShapeList(item1);
    const result = list.replaced(item1.id, item2);
    const expected = new GameMapShapeList(item2);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("removed", () => {
    const item = new GameMapShape(
        ShapeNameEnum.circle.value,
        new Thickness(0),
        ShapeColorEnum.black.value,
        false,
        new Scale(0, 0),
        new Angle(0),
        false,
        new Progress(0),
        new Point(0, 0),
        new GameMapShapeId("id"),
    );
    const list = new GameMapShapeList(item);
    const result = list.removed(item.id);
    const expected = new GameMapShapeList();
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

describe("moved", () => {
    const item1 = new GameMapShape(
        ShapeNameEnum.circle.value,
        new Thickness(0),
        ShapeColorEnum.black.value,
        false,
        new Scale(0, 0),
        new Angle(0),
        false,
        new Progress(0),
        new Point(0, 0),
        new GameMapShapeId("id1"),
    );
    const item2 = new GameMapShape(
        ShapeNameEnum.circle.value,
        new Thickness(0),
        ShapeColorEnum.black.value,
        false,
        new Scale(0, 0),
        new Angle(0),
        false,
        new Progress(0),
        new Point(0, 0),
        new GameMapShapeId("id2"),
    );
    const list = new GameMapShapeList(item1, item2);

    test("up", () => {
        const result = list.movedUp(item2.id);
        const expected = new GameMapShapeList(item2, item1);
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });

    test("down", () => {
        const result = list.movedDown(item1.id);
        const expected = new GameMapShapeList(item2, item1);
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });
});

describe("translateShapeName", () => {
    test("1", () => {
        const result = GameMapShapeUtility.translateShapeName(
            ShapeNameEnum.square.value,
        );
        expect(result).toBe(ShapeNameEnum.square.label);
    });

    test("2", () => {
        const result = GameMapShapeUtility.translateShapeName("unknown");
        expect(result).toBe("");
    });
});

describe("translateShapeColor", () => {
    test("1", () => {
        const result = GameMapShapeUtility.translateShapeColor(
            ShapeColorEnum.black.value,
        );
        expect(result).toBe(ShapeColorEnum.black.label);
    });

    test("2", () => {
        const result = GameMapShapeUtility.translateShapeName("unknown");
        expect(result).toBe("");
    });
});

describe("nextShapeColor", () => {
    test("1", () => {
        const result = GameMapShapeUtility.nextShapeColor(
            ShapeColorEnum.currentColor.value,
        );
        expect(result).toBe(ShapeColorEnum.red.value);
    });

    test("2", () => {
        const result = GameMapShapeUtility.nextShapeColor(
            ShapeColorEnum.red.value,
        );
        expect(result).toBe(ShapeColorEnum.blue.value);
    });

    test("3", () => {
        const result = GameMapShapeUtility.nextShapeColor(
            ShapeColorEnum.blue.value,
        );
        expect(result).toBe(ShapeColorEnum.green.value);
    });

    test("4", () => {
        const result = GameMapShapeUtility.nextShapeColor(
            ShapeColorEnum.green.value,
        );
        expect(result).toBe(ShapeColorEnum.black.value);
    });

    test("5", () => {
        const result = GameMapShapeUtility.nextShapeColor(
            ShapeColorEnum.black.value,
        );
        expect(result).toBe(ShapeColorEnum.white.value);
    });

    test("6", () => {
        const result = GameMapShapeUtility.nextShapeColor(
            ShapeColorEnum.white.value,
        );
        expect(result).toBe(ShapeColorEnum.currentColor.value);
    });

    test("7", () => {
        const result = GameMapShapeUtility.nextShapeColor("unknown");
        expect(result).toBe(ShapeColorEnum.currentColor.value);
    });
});
