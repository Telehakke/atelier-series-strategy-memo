import { expect, test } from "vitest";
import { ClipModeEnum, isClipMode } from "../imageFile";

test("isClipMode1", () => {
    const result = isClipMode(ClipModeEnum.all);
    expect(result).toBeTruthy();
});

test("isClipMode2", () => {
    const result = isClipMode(ClipModeEnum.left);
    expect(result).toBeTruthy();
});

test("isClipMode3", () => {
    const result = isClipMode(ClipModeEnum.right);
    expect(result).toBeTruthy();
});

test("isClipMode4", () => {
    const result = isClipMode(ClipModeEnum.center);
    expect(result).toBeTruthy();
});

test("isClipMode5", () => {
    const result = isClipMode("");
    expect(result).toBeFalsy();
});
