import { expect, test } from "vitest";
import { GameMapGroupUtility } from "../gameMapGroup";

test("isGameMapGroup", () => {
    const gameMapGroup = GameMapGroupUtility.create("name", [], "0");
    expect(GameMapGroupUtility.isGameMapGroup(gameMapGroup)).toBeTruthy();
});

test("isGameMapGroups", () => {
    const gameMapGroups: GameMapGroupUtility[] = [];
    expect(GameMapGroupUtility.isGameMapGroups(gameMapGroups)).toBeTruthy();
});
