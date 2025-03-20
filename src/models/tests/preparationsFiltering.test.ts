import { expect, test } from "vitest";
import { PreparationWithID } from "../preparation";
import PreparationsFiltering from "../preparationsFiltering";

const preparations: PreparationWithID[] = [
    {
        name: "失敗作の灰",
        materials: [],
        categories: ["（エリキシル）", "（魔法の道具）"],
        id: "1",
    },
    {
        name: "中和剤・赤",
        materials: ["（火薬）", "（水）"],
        categories: ["（中和剤）"],
        id: "2",
    },
    {
        name: "中和剤・青",
        materials: ["（鉱石）", "（水）"],
        categories: ["（中和剤）"],
        id: "3",
    },
];
const preparationsFiltering = new PreparationsFiltering(preparations);

test("filteredNameThatCanBeUsedAsMaterial", () => {
    const result =
        preparationsFiltering.filteredNameThatCanBeUsedAsMaterial("（火薬）");
    expect(result).toEqual(["中和剤・赤"]);
});

test("filteredNamesAcceptingMaterial1", () => {
    const result =
        preparationsFiltering.filteredNamesAcceptingMaterial("（中和剤）");
    expect(result).toEqual(["中和剤・赤", "中和剤・青"]);
});

test("filteredNamesAcceptingMaterial2", () => {
    const result =
        preparationsFiltering.filteredNamesAcceptingMaterial("失敗作の灰");
    expect(result).toEqual(["失敗作の灰"]);
});
