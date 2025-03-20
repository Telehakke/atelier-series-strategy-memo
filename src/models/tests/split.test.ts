import { describe, expect, test } from "vitest";
import { default as Split } from "../split";

describe("byComma", () => {
    test("1", () => {
        const result = Split.byComma("1, 2, 3 ");
        expect(result).toEqual(["1", "2", "3"]);
    });

    test("2", () => {
        const result = Split.byComma("1、 2、 3 ");
        expect(result).toEqual(["1", "2", "3"]);
    });

    test("3", () => {
        const result = Split.byComma("1,2,,3");
        expect(result).toEqual(["1", "2", "3"]);
    });

    test("4", () => {
        const result = Split.byComma(",");
        expect(result).toEqual([]);
    });
});

describe("byWhiteSpace", () => {
    test("1", () => {
        const result = Split.byWhiteSpace("1 2  3 ");
        expect(result).toEqual(["1", "2", "3"]);
    });

    test("2", () => {
        const result = Split.byWhiteSpace("1　2　　3　");
        expect(result).toEqual(["1", "2", "3"]);
    });

    test("3", () => {
        const result = Split.byWhiteSpace(" ");
        expect(result).toEqual([]);
    });
});
