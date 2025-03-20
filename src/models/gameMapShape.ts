import { v4 as uuidv4 } from "uuid";
import { Angle, Point, Progress, Scale, Thickness } from "./dataClasses";
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
    value: ShapeName;
    label: string;
};

export const ShapeNameEnum: {
    readonly square: ShapeNameDetail;
    readonly circle: ShapeNameDetail;
    readonly minus: ShapeNameDetail;
    readonly moveRight: ShapeNameDetail;
    readonly moveHorizontal: ShapeNameDetail;
    readonly redoDot: ShapeNameDetail;
} = {
    square: { value: "square", label: "四角" },
    circle: { value: "circle", label: "円" },
    minus: { value: "minus", label: "直線" },
    moveRight: { value: "moveRight", label: "矢印" },
    moveHorizontal: { value: "moveHorizontal", label: "両矢印" },
    redoDot: { value: "redoDot", label: "カーブ" },
} as const;

export type ShapeName = keyof typeof ShapeNameEnum;

export const isShapeName = (value: unknown): value is ShapeName => {
    if (!isString(value)) return false;
    return Object.keys(ShapeNameEnum).some((v) => v === value);
};

/* -------------------------------------------------------------------------- */

type ShapeColorDetail = {
    value: ShapeColor;
    label: string;
    nextValue: ShapeColor;
};

export const ShapeColorEnum: {
    currentColor: ShapeColorDetail;
    red: ShapeColorDetail;
    blue: ShapeColorDetail;
    green: ShapeColorDetail;
    black: ShapeColorDetail;
    white: ShapeColorDetail;
} = {
    currentColor: { value: "currentColor", label: "黒・白", nextValue: "red" },
    red: { value: "red", label: "赤", nextValue: "blue" },
    blue: { value: "blue", label: "青", nextValue: "green" },
    green: { value: "green", label: "緑", nextValue: "black" },
    black: { value: "black", label: "黒", nextValue: "white" },
    white: { value: "white", label: "白", nextValue: "currentColor" },
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
    readonly progress: Progress;
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
        progress: Progress,
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
        this.progress = progress;
        this.point = point;
        this.id = id;
    }

    static create = (): GameMapShape =>
        new GameMapShape(
            ShapeNameEnum.square.value,
            new Thickness(2),
            ShapeColorEnum.currentColor.value,
            false,
            new Scale(100, 100),
            new Angle(0),
            false,
            new Progress(100),
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
        progress?: Progress;
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
                  obj.progress ?? this.progress,
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

    replaced = (
        targetId: GameMapShapeId,
        newItem: GameMapShape,
    ): GameMapShapeList =>
        new GameMapShapeList(...this.helperReplaced(targetId, newItem));

    removed = (targetId: GameMapShapeId): GameMapShapeList =>
        new GameMapShapeList(...this.helperRemoved(targetId));

    movedUp = (targetId: GameMapShapeId): GameMapShapeList =>
        new GameMapShapeList(...this.helperMovedUp(targetId));

    movedDown = (targetId: GameMapShapeId): GameMapShapeList =>
        new GameMapShapeList(...this.helperMovedDown(targetId));
}

/* -------------------------------------------------------------------------- */

export class GameMapShapeUtility {
    static translateShapeName = (name: string): string =>
        Object.values(ShapeNameEnum).find((v) => v.value === name)?.label ?? "";

    static translateShapeColor = (color: string): string =>
        Object.values(ShapeColorEnum).find((v) => v.value === color)?.label ??
        "";

    static nextShapeColor = (currentColor: string): ShapeColor =>
        Object.values(ShapeColorEnum).find((v) => v.value === currentColor)
            ?.nextValue ?? "currentColor";
}
