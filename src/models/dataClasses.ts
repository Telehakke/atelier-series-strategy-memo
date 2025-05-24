export class Point {
    readonly _type = "Point";
    private readonly _x: number;
    private readonly _y: number;

    constructor(x: number, y: number) {
        let validX = x;
        if (x < Point.min) validX = Point.min;
        if (x > Point.max) validX = Point.max;

        let validY = y;
        if (y < Point.min) validY = Point.min;
        if (y > Point.max) validY = Point.max;

        this._x = validX;
        this._y = validY;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    static readonly min = 0;
    static readonly max = 100;

    movedLeft = (step: number) => new Point(this._x - step, this._y);
    movedRight = (step: number) => new Point(this._x + step, this._y);
    movedTop = (step: number) => new Point(this._x, this._y - step);
    movedBottom = (step: number) => new Point(this._x, this._y + step);
}

export class Thickness {
    readonly _type = "Thickness";
    private readonly _value: number;

    constructor(value: number) {
        let validValue = value;
        if (value < Thickness.min) validValue = Thickness.min;
        if (value > Thickness.max) validValue = Thickness.max;
        this._value = validValue;
    }

    get value() {
        return this._value;
    }

    static readonly min = 1;
    static readonly max = 10;

    increased = (): Thickness => new Thickness(this._value + 1);
    decreased = (): Thickness => new Thickness(this._value - 1);
}

export class Scale {
    readonly _type = "Scale";
    private readonly _x: number;
    private readonly _y: number;

    constructor(x: number, y: number) {
        let validX = x;
        if (x < Scale.min) validX = Scale.min;
        if (x > Scale.max) validX = Scale.max;

        let validY = y;
        if (y < Scale.min) validY = Scale.min;
        if (y > Scale.max) validY = Scale.max;

        this._x = validX;
        this._y = validY;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    static readonly step = 50;
    static readonly min = 100;
    static readonly max = 10000;

    zoomInX = (): Scale => new Scale(this._x + Scale.step, this._y);
    zoomInY = (): Scale => new Scale(this._x, this._y + Scale.step);
    zoomInXY = (): Scale =>
        new Scale(this._x + Scale.step, this._y + Scale.step);
    zoomOutX = (): Scale => new Scale(this._x - Scale.step, this.y);
    zoomOutY = (): Scale => new Scale(this._x, this._y - Scale.step);
    zoomOutXY = (): Scale =>
        new Scale(this._x - Scale.step, this._y - Scale.step);
}

export class Angle {
    readonly _type = "Angle";
    private readonly _value: number;

    constructor(value: number) {
        let validValue = value;
        if (value < Angle.min) validValue = Angle.min;
        if (value > Angle.max) validValue = Angle.min;
        this._value = validValue;
    }

    get value() {
        return this._value;
    }

    private static readonly step = 22.5;
    static readonly min = 0;
    static readonly max = 359;

    rotated = (): Angle => new Angle(this._value + Angle.step);
}

export class DrawingRange {
    readonly _type = "Progress";
    private readonly _value: number;

    constructor(value: number) {
        let validValue = value;
        if (value < DrawingRange.min) validValue = DrawingRange.min;
        if (value > DrawingRange.max) validValue = DrawingRange.min;
        this._value = validValue;
    }

    get value() {
        return this._value;
    }

    private static readonly step = 12.5;
    static readonly min = this.step;
    static readonly max = 100;

    increased = (): DrawingRange =>
        new DrawingRange(this._value + DrawingRange.step);
}
