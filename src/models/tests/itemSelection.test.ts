import { describe, expect, test } from "vitest";
import { GameMapDetailId, GameMapDetailIdList } from "../gameMapDetail";
import { GameMapShapeId, GameMapShapeIdList } from "../gameMapShape";
import {
    ControllerTypeEnum,
    GameMapDetailSelectionManager,
    GameMapShapeSelectionManager,
} from "../itemSelectionManager";

describe("GameMapDetailSelectionManager", () => {
    const empty = new GameMapDetailIdList();
    const notEmpty = new GameMapDetailIdList(new GameMapDetailId(""));

    test("controllerType1", () => {
        const selectionManager = new GameMapDetailSelectionManager(
            notEmpty,
            notEmpty,
        );
        const result = selectionManager.controllerType;
        expect(result).toBe(ControllerTypeEnum.list);
    });

    test("controllerType2", () => {
        const selectionManager = new GameMapDetailSelectionManager(
            notEmpty,
            empty,
        );
        const result = selectionManager.controllerType;
        expect(result).toBe(ControllerTypeEnum.board);
    });

    test("controllerType3", () => {
        const selectionManager = new GameMapDetailSelectionManager(
            empty,
            notEmpty,
        );
        const result = selectionManager.controllerType;
        expect(result).toBe(ControllerTypeEnum.list);
    });

    test("controllerType4", () => {
        const selectionManager = new GameMapDetailSelectionManager(
            empty,
            empty,
        );
        const result = selectionManager.controllerType;
        expect(result).toBe(ControllerTypeEnum.none);
    });
});

describe("GameMapShapeSelectionManager", () => {
    const empty = new GameMapShapeIdList();
    const notEmpty = new GameMapShapeIdList(new GameMapShapeId(""));

    test("controllerType1", () => {
        const selectionManager = new GameMapShapeSelectionManager(
            notEmpty,
            notEmpty,
        );
        const result = selectionManager.controllerType;
        expect(result).toBe(ControllerTypeEnum.list);
    });

    test("controllerType2", () => {
        const selectionManager = new GameMapShapeSelectionManager(
            notEmpty,
            empty,
        );
        const result = selectionManager.controllerType;
        expect(result).toBe(ControllerTypeEnum.board);
    });

    test("controllerType3", () => {
        const selectionManager = new GameMapShapeSelectionManager(
            empty,
            notEmpty,
        );
        const result = selectionManager.controllerType;
        expect(result).toBe(ControllerTypeEnum.list);
    });

    test("controllerType4", () => {
        const selectionManager = new GameMapShapeSelectionManager(empty, empty);
        const result = selectionManager.controllerType;
        expect(result).toBe(ControllerTypeEnum.none);
    });
});
