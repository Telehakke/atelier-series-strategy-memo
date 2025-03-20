import { describe, expect, test } from "vitest";
import { Preparation, PreparationId, PreparationList } from "../preparation";
import PreparationFilter from "../preparationFilter";

const item1 = new Preparation(
    "失敗作の灰",
    [],
    ["（エリキシル）", "（魔法の道具）"],
    false,
    new PreparationId("1"),
);
const item2 = new Preparation(
    "中和剤・赤",
    ["（火薬）", "（水）"],
    ["（中和剤）"],
    false,
    new PreparationId("2"),
);
const item3 = new Preparation(
    "中和剤・青",
    ["（鉱石）", "（水）"],
    ["（中和剤）"],
    false,
    new PreparationId("3"),
);
const list = new PreparationList(item1, item2, item3);

describe("filtered", () => {
    test("1", () => {
        const result = PreparationFilter.filtered(list, ["失敗作の灰"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new PreparationList(item1)),
        );
    });

    test("2", () => {
        const result = PreparationFilter.filtered(list, [
            "（エリキシル）",
            "（中和剤）",
        ]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new PreparationList(item1, item2, item3)),
        );
    });
});

describe("filteredNamesThatCanBeUsedAsMaterial", () => {
    test("1", () => {
        const result = PreparationFilter.filteredNamesThatCanBeUsedAsMaterial(
            list,
            "（火薬）",
        );
        expect(result).toEqual([item2.name]);
    });
});

describe("filteredNamesAcceptingMateria", () => {
    test("1", () => {
        const result = PreparationFilter.filteredNamesAcceptingMaterial(
            list,
            "（中和剤）",
        );
        expect(result).toEqual([item2.name, item3.name]);
    });

    test("2", () => {
        const result = PreparationFilter.filteredNamesAcceptingMaterial(
            list,
            "失敗作の灰",
        );
        expect(result).toEqual([item1.name]);
    });
});
