import { expect, test } from "vitest";
import splitByWhiteSpace from "../splitByWhiteSpace";

test("splitByWhiteSpace1", () => {
    const result = splitByWhiteSpace("1 2  3 ");
    expect(result).toEqual(["1", "2", "3"]);
});

test("splitByWhiteSpace2", () => {
    const result = splitByWhiteSpace("1　2　　3　");
    expect(result).toEqual(["1", "2", "3"]);
});

test("splitByWhiteSpace3", () => {
    const result = splitByWhiteSpace(" ");
    expect(result).toEqual([""]);
});
