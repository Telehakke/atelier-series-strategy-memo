import { describe, expect, test } from "vitest";
import { Preparation, PreparationId, PreparationList } from "../preparation";

test("create", () => {
    const item = new Preparation(
        "name",
        ["material1", "material2"],
        ["category1", "category2"],
        false,
        new PreparationId("id"),
    );
    const newItems = Preparation.create({
        name: item.name,
        materials: item.materialsToCommaSeparatedStr,
        categories: item.categoriesToCommaSeparatedStr,
        checked: item.checked,
        id: item.id,
    });
    expect(JSON.stringify(newItems)).toBe(JSON.stringify(item));
});

describe("find", () => {
    const item = new Preparation("", [], [], false, new PreparationId("id"));
    const list = new PreparationList(item);

    test("1", () => {
        const result = list.find(item.id);
        expect(JSON.stringify(result)).toBe(JSON.stringify(item));
    });

    test("2", () => {
        const result = list.find(new PreparationId("id1"));
        expect(result).toBeNull();
    });
});

describe("findIndex", () => {
    const item = new Preparation("", [], [], false, new PreparationId("id"));
    const list = new PreparationList(item);

    test("1", () => {
        const result = list.findIndex(item.id);
        expect(result).toBe(0);
    });

    test("2", () => {
        const result = list.findIndex(new PreparationId("id1"));
        expect(result).toBeNull();
    });
});

test("added", () => {
    const item = new Preparation("", [], [], false, new PreparationId("id"));
    const list = new PreparationList();
    const result = list.added(item);
    const expected = new PreparationList(item);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("replaced", () => {
    const item = new Preparation("", [], [], false, new PreparationId("id1"));
    const list = new PreparationList(item);
    const newItem = new Preparation("name", [], [], false, item.id);
    const result = list.replaced(newItem);
    const expected = new PreparationList(newItem);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("removed", () => {
    const item = new Preparation("", [], [], false, new PreparationId("id"));
    const list = new PreparationList(item);
    const result = list.removed(item.id);
    const expected = new PreparationList();
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

describe("moved", () => {
    const item1 = new Preparation("", [], [], false, new PreparationId("id1"));
    const item2 = new Preparation("", [], [], false, new PreparationId("id2"));
    const list = new PreparationList(item1, item2);

    test("Up", () => {
        const result = list.movedUp(item2.id);
        const expected = new PreparationList(item2, item1);
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });

    test("Down", () => {
        const result = list.movedDown(item1.id);
        const expected = new PreparationList(item2, item1);
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });
});
