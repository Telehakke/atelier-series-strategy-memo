import { v4 as uuidv4 } from "uuid";
import { Angle, DrawingRange, Point, Scale, Thickness } from "./dataClasses";
import { Id, IdList, ListWithId, WithId } from "./id";
import { isString } from "./typeGuards";

export class GameMapShapeId implements Id {
    readonly _type: string = "GameMapShapeId";
    readonly value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export class GameMapShapeIdList extends IdList<GameMapShapeId> {
    readonly _type: string = "GameMapShapeIdList";

    added = (id: GameMapShapeId): GameMapShapeIdList =>
        new GameMapShapeIdList(...this.helperAdded(id));

    removed = (targetId: GameMapShapeId): GameMapShapeIdList =>
        new GameMapShapeIdList(...this.helperRemoved(targetId));
}

/* -------------------------------------------------------------------------- */

type ShapeNameDetail = {
    name: ShapeName;
    label: string;
};

export const ShapeNameEnum: {
    readonly square: ShapeNameDetail;
    readonly circle: ShapeNameDetail;
    readonly minus: ShapeNameDetail;
    readonly moveRight: ShapeNameDetail;
    readonly moveHorizontal: ShapeNameDetail;
    readonly redo: ShapeNameDetail;
} = {
    square: { name: "square", label: "四角" },
    circle: { name: "circle", label: "円" },
    minus: { name: "minus", label: "直線" },
    moveRight: { name: "moveRight", label: "矢印" },
    moveHorizontal: { name: "moveHorizontal", label: "両矢印" },
    redo: { name: "redo", label: "カーブ" },
} as const;

export type ShapeName = keyof typeof ShapeNameEnum;

export const isShapeName = (value: unknown): value is ShapeName => {
    if (!isString(value)) return false;
    return Object.keys(ShapeNameEnum).some((v) => v === value);
};

/* -------------------------------------------------------------------------- */

type ShapeColorDetail = {
    name: ShapeColor;
    label: string;
    nextName: ShapeColor;
    value: string;
};

export const ShapeColorEnum: {
    currentColor: ShapeColorDetail;
    red: ShapeColorDetail;
    blue: ShapeColorDetail;
    green: ShapeColorDetail;
    black: ShapeColorDetail;
    white: ShapeColorDetail;
} = {
    currentColor: {
        name: "currentColor",
        label: "黒・白",
        nextName: "red",
        value: "currentColor",
    },
    red: {
        name: "red",
        label: "赤",
        nextName: "blue",
        value: "oklch(63.7% 0.237 25.331)",
    },
    blue: {
        name: "blue",
        label: "青",
        nextName: "green",
        value: "oklch(62.3% 0.214 259.815)",
    },
    green: {
        name: "green",
        label: "緑",
        nextName: "black",
        value: "oklch(72.3% 0.219 149.579)",
    },
    black: { name: "black", label: "黒", nextName: "white", value: "black" },
    white: {
        name: "white",
        label: "白",
        nextName: "currentColor",
        value: "white",
    },
} as const;

export type ShapeColor = keyof typeof ShapeColorEnum;

export const isShapeColor = (value: unknown): value is ShapeColor => {
    if (!isString(value)) return false;
    return Object.keys(ShapeColorEnum).some((v) => v === value);
};

/* -------------------------------------------------------------------------- */

export class GameMapShape implements WithId {
    readonly _type: string = "GameMapShape";
    readonly name: ShapeName;
    readonly thickness: Thickness;
    readonly color: ShapeColor;
    readonly fill: boolean;
    readonly scale: Scale;
    readonly angle: Angle;
    readonly flip: boolean;
    readonly drawingRange: DrawingRange;
    readonly point: Point;
    readonly id: GameMapShapeId;

    constructor(
        name: ShapeName,
        thickness: Thickness,
        color: ShapeColor,
        fill: boolean,
        scale: Scale,
        angle: Angle,
        flip: boolean,
        drawingRange: DrawingRange,
        point: Point,
        id: GameMapShapeId,
    ) {
        this.name = name;
        this.thickness = thickness;
        this.color = color;
        this.fill = fill;
        this.scale = scale;
        this.angle = angle;
        this.flip = flip;
        this.drawingRange = drawingRange;
        this.point = point;
        this.id = id;
    }

    static create = (): GameMapShape =>
        new GameMapShape(
            ShapeNameEnum.square.name,
            new Thickness(2),
            ShapeColorEnum.currentColor.name,
            false,
            new Scale(100, 100),
            new Angle(0),
            false,
            new DrawingRange(100),
            new Point(50, 50),
            new GameMapShapeId(uuidv4()),
        );

    copyWith = (obj?: {
        name?: ShapeName;
        thickness?: Thickness;
        color?: ShapeColor;
        fill?: boolean;
        scale?: Scale;
        angle?: Angle;
        flip?: boolean;
        drawingRange?: DrawingRange;
        point?: Point;
        id?: GameMapShapeId;
    }): GameMapShape =>
        obj == null
            ? this
            : new GameMapShape(
                  obj.name ?? this.name,
                  obj.thickness ?? this.thickness,
                  obj.color ?? this.color,
                  obj.fill ?? this.fill,
                  obj.scale ?? this.scale,
                  obj.angle ?? this.angle,
                  obj.flip ?? this.flip,
                  obj.drawingRange ?? this.drawingRange,
                  obj.point ?? this.point,
                  obj.id ?? this.id,
              );
}

export class GameMapShapeList extends ListWithId<GameMapShape, GameMapShapeId> {
    readonly _type: string = "GameMapShapeList";

    filter = (
        predicate: (
            value: GameMapShape,
            index: number,
            array: readonly GameMapShape[],
        ) => boolean,
    ): GameMapShapeList =>
        new GameMapShapeList(...this.helperFilter(predicate));

    added = (item: GameMapShape): GameMapShapeList =>
        new GameMapShapeList(...this.helperAdded(item));

    replaced = (newItem: GameMapShape): GameMapShapeList =>
        new GameMapShapeList(...this.helperReplaced(newItem));

    removed = (targetId: GameMapShapeId): GameMapShapeList =>
        new GameMapShapeList(...this.helperRemoved(targetId));

    movedUp = (targetId: GameMapShapeId): GameMapShapeList =>
        new GameMapShapeList(...this.helperMovedUp(targetId));

    movedDown = (targetId: GameMapShapeId): GameMapShapeList =>
        new GameMapShapeList(...this.helperMovedDown(targetId));
}

/* -------------------------------------------------------------------------- */

export class GameMapShapeUtility {
    static translateShapeName = (name: ShapeName): string =>
        Object.values(ShapeNameEnum).find((v) => v.name === name)?.label ?? "";

    static translateShapeColor = (color: ShapeColor): string =>
        Object.values(ShapeColorEnum).find((v) => v.name === color)?.label ??
        "";

    static nextShapeColor = (currentColor: ShapeColor): ShapeColor =>
        Object.values(ShapeColorEnum).find((v) => v.name === currentColor)
            ?.nextName ?? "currentColor";

    static shapeColorValue = (color: ShapeColor): string =>
        Object.values(ShapeColorEnum).find((v) => v.name === color)?.value ??
        "currentColor";
}
