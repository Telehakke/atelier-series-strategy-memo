import { describe, expect, test } from "vitest";
import { Angle, DrawingRange, Point, Scale, Thickness } from "../dataClasses";

import { GameMap, GameMapId, GameMapList } from "../gameMap";
import {
    GameMapDetail,
    GameMapDetailId,
    GameMapDetailList,
} from "../gameMapDetail";
import {
    GameMapShape,
    GameMapShapeId,
    GameMapShapeList,
    ShapeColorEnum,
    ShapeNameEnum,
} from "../gameMapShape";
import { Memo, MemoId, MemoList } from "../memo";
import { Preparation, PreparationId, PreparationList } from "../preparation";
import { StrategyMemo, StrategyMemoId } from "../strategyMemo";
import {
    StrategyMemoRecord,
    StrategyMemoRecordUtility,
} from "../strategyMemoRecord";

describe("copied", () => {
    test("1", () => {
        const result = StrategyMemoRecordUtility.copied();
        const expected: StrategyMemoRecord = {
            gameName: "",
            gameMaps: [],
            preparations: [],
            memos: [],
            id: result.id,
        };
        expect(result).toEqual(expected);
    });

    test("2", () => {
        const strategyMemoRecord: StrategyMemoRecord = {
            gameName: "gameName",
            gameMaps: [
                {
                    name: "name",
                    gameMapDetails: [
                        {
                            name: "name",
                            items: ["item"],
                            monsters: ["monster"],
                            memo: "memo",
                            icon: "icon",
                            x: 1,
                            y: 1,
                            goto: "goto",
                            checked: true,
                            id: "id",
                        },
                    ],
                    gameMapShapes: [
                        {
                            name: "name",
                            thickness: 1,
                            color: "color",
                            fill: true,
                            scaleX: 1,
                            scaleY: 1,
                            angle: 1,
                            flip: true,
                            drawingRange: 1,
                            x: 1,
                            y: 1,
                            id: "id",
                        },
                    ],
                    image: "image",
                    id: "id",
                },
            ],
            preparations: [
                {
                    name: "name",
                    materials: ["material"],
                    categories: ["category"],
                    checked: true,
                    id: "id",
                },
            ],
            memos: [
                {
                    title: "title",
                    text: "text",
                    checked: true,
                    id: "id",
                },
            ],
            id: "id",
        };
        const result = StrategyMemoRecordUtility.copied(strategyMemoRecord);
        expect(result).toEqual(strategyMemoRecord);
    });
});

describe("convert", () => {
    const strategyMemoRecord: StrategyMemoRecord = {
        gameName: "gameName",
        gameMaps: [
            {
                name: "name",
                gameMapDetails: [
                    {
                        name: "name",
                        items: ["item"],
                        monsters: ["monster"],
                        memo: "memo",
                        icon: "icon",
                        x: 1,
                        y: 1,
                        goto: "goto",
                        checked: true,
                        id: "id",
                    },
                ],
                gameMapShapes: [
                    {
                        name: "circle",
                        thickness: 1,
                        color: "currentColor",
                        fill: true,
                        scaleX: 100,
                        scaleY: 100,
                        angle: 1,
                        flip: true,
                        drawingRange: 100,
                        x: 1,
                        y: 1,
                        id: "id",
                    },
                ],
                image: "image",
                id: "id",
            },
        ],
        preparations: [
            {
                name: "name",
                materials: ["material"],
                categories: ["category"],
                checked: true,
                id: "id",
            },
        ],
        memos: [
            {
                title: "title",
                text: "text",
                checked: true,
                id: "id",
            },
        ],
        id: "id",
    };

    const strategyMemo = new StrategyMemo(
        "gameName",
        new GameMapList(
            new GameMap(
                "name",
                new GameMapDetailList(
                    new GameMapDetail(
                        "name",
                        ["item"],
                        ["monster"],
                        "memo",
                        "icon",
                        new Point(1, 1),
                        new GameMapId("goto"),
                        true,
                        new GameMapDetailId("id"),
                    ),
                ),
                new GameMapShapeList(
                    new GameMapShape(
                        ShapeNameEnum.circle.name,
                        new Thickness(1),
                        ShapeColorEnum.currentColor.name,
                        true,
                        new Scale(100, 100),
                        new Angle(1),
                        true,
                        new DrawingRange(100),
                        new Point(1, 1),
                        new GameMapShapeId("id"),
                    ),
                ),
                "image",
                new GameMapId("id"),
            ),
        ),
        new PreparationList(
            new Preparation(
                "name",
                ["material"],
                ["category"],
                true,
                new PreparationId("id"),
            ),
        ),
        new MemoList(new Memo("title", "text", true, new MemoId("id"))),
        new StrategyMemoId("id"),
    );

    test("convertToStrategyMemoRecord", () => {
        const result =
            StrategyMemoRecordUtility.convertToStrategyMemoRecord(strategyMemo);
        expect(JSON.stringify(result)).toBe(JSON.stringify(strategyMemoRecord));
    });

    test("convertToStrategyMemo", () => {
        const result =
            StrategyMemoRecordUtility.convertToStrategyMemo(strategyMemoRecord);
        expect(JSON.stringify(result)).toBe(JSON.stringify(strategyMemo));
    });
});
