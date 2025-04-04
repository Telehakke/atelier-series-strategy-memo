import { expect, test } from "vitest";
import { Memo } from "../memo";
import MemosFiltering from "../memosFiltering";

const memos: Memo[] = [
    { title: "title1", text: "text1", id: "1" },
    { title: "title2", text: "text2", id: "2" },
];
const memosFiltering = new MemosFiltering(memos);

test("filtered1", () => {
    const result = memosFiltering.filtered(["title1"]);
    const expected = [{ title: "title1", text: "text1", id: "1" }];
    expect(result).toEqual(expected);
});

test("filtered2", () => {
    const result = memosFiltering.filtered(["text1"]);
    const expected = [{ title: "title1", text: "text1", id: "1" }];
    expect(result).toEqual(expected);
});

test("filtered3", () => {
    const result = memosFiltering.filtered(["text3"]);
    const expected: Memo[] = [];
    expect(result).toEqual(expected);
});

test("filtered4", () => {
    const result = memosFiltering.filtered(["title1", "title2"]);
    const expected = [
        { title: "title1", text: "text1", id: "1" },
        { title: "title2", text: "text2", id: "2" },
    ];
    expect(result).toEqual(expected);
});
