import { describe, expect, test } from "vitest";
import { ClipModeEnum, isClipMode } from "../imageFile";

describe("isClipMode", () => {
    test("1", () => {
        const result = isClipMode(ClipModeEnum.all.value);
        expect(result).toBeTruthy();
    });

    test("2", () => {
        const result = isClipMode(ClipModeEnum.left.value);
        expect(result).toBeTruthy();
    });

    test("3", () => {
        const result = isClipMode(ClipModeEnum.right.value);
        expect(result).toBeTruthy();
    });

    test("4", () => {
        const result = isClipMode(ClipModeEnum.center.value);
        expect(result).toBeTruthy();
    });

    test("5", () => {
        const result = isClipMode("");
        expect(result).toBeFalsy();
    });
});
