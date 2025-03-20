import { describe, expect, test } from "vitest";
import { Angle, Point, Progress, Scale, Thickness } from "../dataClasses";

describe("Point", () => {
    test("1", () => {
        const result = new Point(0, 0);
        expect([result.x, result.y]).toEqual([0, 0]);
    });

    test("2", () => {
        const min = Point.min;
        const result = new Point(min - 1, min - 1);
        expect([result.x, result.y]).toEqual([min, min]);
    });

    test("3", () => {
        const max = Point.max;
        const result = new Point(max + 1, max + 1);
        expect([result.x, result.y]).toEqual([max, max]);
    });

    describe("moved", () => {
        const point = new Point(1, 1);
        test("left", () => {
            const result = point.movedLeft(1);
            expect([result.x, result.y]).toEqual([0, 1]);
        });

        test("right", () => {
            const result = point.movedRight(1);
            expect([result.x, result.y]).toEqual([2, 1]);
        });

        test("top", () => {
            const result = point.movedTop(1);
            expect([result.x, result.y]).toEqual([1, 0]);
        });

        test("bottom", () => {
            const result = point.movedBottom(1);
            expect([result.x, result.y]).toEqual([1, 2]);
        });
    });
});

describe("Thickness", () => {
    test("1", () => {
        const result = new Thickness(1);
        expect(result.value).toBe(1);
    });

    test("2", () => {
        const min = Thickness.min;
        const result = new Thickness(min - 1);
        expect(result.value).toBe(min);
    });

    test("3", () => {
        const max = Thickness.max;
        const result = new Thickness(max + 1);
        expect(result.value).toBe(max);
    });
});

describe("Scale", () => {
    test("1", () => {
        const result = new Scale(100, 100);
        expect([result.x, result.y]).toEqual([100, 100]);
    });

    test("2", () => {
        const min = Scale.min;
        const result = new Scale(min - 1, min - 1);
        expect([result.x, result.y]).toEqual([min, min]);
    });

    test("3", () => {
        const max = Scale.max;
        const result = new Scale(max + 1, max + 1);
        expect([result.x, result.y]).toEqual([max, max]);
    });
    describe("zoom", () => {
        const scale = new Scale(200, 200);
        test("inX", () => {
            const result = scale.zoomInX();
            expect([result.x, result.y]).toEqual([200 + Scale.step, 200]);
        });

        test("inY", () => {
            const result = scale.zoomInY();
            expect([result.x, result.y]).toEqual([200, 200 + Scale.step]);
        });

        test("inXY", () => {
            const result = scale.zoomInXY();
            expect([result.x, result.y]).toEqual([
                200 + Scale.step,
                200 + Scale.step,
            ]);
        });

        test("outX", () => {
            const result = scale.zoomOutX();
            expect([result.x, result.y]).toEqual([200 - Scale.step, 200]);
        });

        test("outY", () => {
            const result = scale.zoomOutY();
            expect([result.x, result.y]).toEqual([200, 200 - Scale.step]);
        });

        test("outXY", () => {
            const result = scale.zoomOutXY();
            expect([result.x, result.y]).toEqual([
                200 - Scale.step,
                200 - Scale.step,
            ]);
        });
    });
});

describe("Angle", () => {
    test("1", () => {
        const result = new Angle(0);
        expect(result.value).toBe(0);
    });

    test("2", () => {
        const min = Angle.min;
        const result = new Angle(min - 1);
        expect(result.value).toBe(min);
    });

    test("3", () => {
        const result = new Angle(Angle.max + 1);
        expect(result.value).toBe(Angle.min);
    });
});

describe("Progress", () => {
    test("1", () => {
        const result = new Progress(12.5);
        expect(result.value).toBe(12.5);
    });

    test("2", () => {
        const min = Progress.min;
        const result = new Progress(min - 1);
        expect(result.value).toBe(min);
    });

    test("3", () => {
        const result = new Progress(Progress.max + 1);
        expect(result.value).toBe(Progress.min);
    });
});
