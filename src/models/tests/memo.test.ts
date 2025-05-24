import { describe, expect, test } from "vitest";
import { Memo, MemoId, MemoList } from "../memo";

describe("find", () => {
    const item = new Memo("", "", false, new MemoId("id"));
    const list = new MemoList(item);

    test("1", () => {
        const result = list.find(item.id);
        expect(JSON.stringify(result)).toBe(JSON.stringify(item));
    });

    test("2", () => {
        const result = list.find(new MemoId("id1"));
        expect(result).toBeNull();
    });
});

describe("findIndex", () => {
    const item = new Memo("", "", false, new MemoId("id"));
    const list = new MemoList(item);

    test("1", () => {
        const result = list.findIndex(item.id);
        expect(result).toBe(0);
    });

    test("2", () => {
        const result = list.findIndex(new MemoId("id1"));
        expect(result).toBeNull();
    });
});

test("added", () => {
    const item = new Memo("", "", false, new MemoId("id"));
    const list = new MemoList();
    const result = list.added(item);
    const expected = new MemoList(item);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("replaced", () => {
    const item = new Memo("", "", false, new MemoId("id1"));
    const list = new MemoList(item);
    const newItem = new Memo("", "", false, item.id);
    const result = list.replaced(newItem);
    const expected = new MemoList(newItem);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("removed", () => {
    const item = new Memo("", "", false, new MemoId("id"));
    const list = new MemoList(item);
    const result = list.removed(item.id);
    const expected = new MemoList();
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

describe("moved", () => {
    const item1 = new Memo("", "", false, new MemoId("id1"));
    const item2 = new Memo("", "", false, new MemoId("id2"));
    const list = new MemoList(item1, item2);

    test("Up", () => {
        const result = list.movedUp(item2.id);
        const expected = new MemoList(item2, item1);
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });

    test("Down", () => {
        const result = list.movedDown(item1.id);
        const expected = new MemoList(item2, item1);
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });
});
