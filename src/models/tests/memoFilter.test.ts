import { describe, expect, test } from "vitest";
import { Memo, MemoId, MemoList } from "../memo";
import MemoFilter from "../memoFilter";

const item1 = new Memo("title1", "text1", false, new MemoId("id1"));
const item2 = new Memo("title2", "text2", false, new MemoId("id2"));
const list = new MemoList(item1, item2);

describe("filtered", () => {
    test("1", () => {
        const result = MemoFilter.filtered(list, ["title"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new MemoList(item1, item2)),
        );
    });

    test("2", () => {
        const result = MemoFilter.filtered(list, ["text"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new MemoList(item1, item2)),
        );
    });

    test("3", () => {
        const result = MemoFilter.filtered(list, ["title1"]);
        expect(JSON.stringify(result)).toBe(
            JSON.stringify(new MemoList(item1)),
        );
    });

    test("4", () => {
        const result = MemoFilter.filtered(list, ["title3"]);
        expect(JSON.stringify(result)).toBe(JSON.stringify(new MemoList()));
    });
});
