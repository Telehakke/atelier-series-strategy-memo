import { expect, test } from "vitest";
import { MemoUtility } from "../memo";

test("isMemo", () => {
    const memo = MemoUtility.create("title", "text", "0");
    expect(MemoUtility.isMemo(memo)).toBeTruthy();
});

test("isMemos", () => {
    const memos: MemoUtility[] = [];
    expect(MemoUtility.isMemos(memos)).toBeTruthy();
});
