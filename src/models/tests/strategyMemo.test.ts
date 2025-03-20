import { describe, expect, test } from "vitest";
import { Point } from "../dataClasses";
import { GameMap, GameMapId, GameMapList } from "../gameMap";
import {
    GameMapDetail,
    GameMapDetailId,
    GameMapDetailList,
} from "../gameMapDetail";
import { GameMapShape, GameMapShapeList } from "../gameMapShape";
import { Memo, MemoId, MemoList } from "../memo";
import { Preparation, PreparationId, PreparationList } from "../preparation";
import { StrategyMemo, StrategyMemoId } from "../strategyMemo";

describe("replaced", () => {
    const strategyMemo = new StrategyMemo(
        "",
        new GameMapList(),
        new PreparationList(),
        new MemoList(),
        new StrategyMemoId("id"),
    );

    test("gameName", () => {
        const name = "name";
        const result = strategyMemo.replacedGameName(name);
        const expected = new StrategyMemo(
            name,
            new GameMapList(),
            new PreparationList(),
            new MemoList(),
            new StrategyMemoId("id"),
        );
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });

    test("gameMaps", () => {
        const gameMap = new GameMap(
            "",
            new GameMapDetailList(),
            new GameMapShapeList(),
            "",
            new GameMapId("id"),
        );
        const gameMapList = new GameMapList(gameMap);
        const result = strategyMemo.replacedGameMaps(gameMapList);
        const expected = new StrategyMemo(
            "",
            gameMapList,
            new PreparationList(),
            new MemoList(),
            new StrategyMemoId("id"),
        );
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });

    test("preparations", () => {
        const preparation = new Preparation(
            "",
            [],
            [],
            false,
            new PreparationId("id"),
        );
        const preparationList = new PreparationList(preparation);
        const result = strategyMemo.replacedPreparations(preparationList);
        const expected = new StrategyMemo(
            "",
            new GameMapList(),
            preparationList,
            new MemoList(),
            new StrategyMemoId("id"),
        );
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });

    test("memos", () => {
        const memo = new Memo("", "", false, new MemoId("id"));
        const memoList = new MemoList(memo);
        const result = strategyMemo.replacedMemos(memoList);
        const expected = new StrategyMemo(
            "",
            new GameMapList(),
            new PreparationList(),
            memoList,
            new StrategyMemoId("id"),
        );
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });
});

describe("replacedGameMap", () => {
    const strategyMemo = new StrategyMemo(
        "",
        new GameMapList(
            new GameMap(
                "",
                new GameMapDetailList(),
                new GameMapShapeList(),
                "",
                new GameMapId("id"),
            ),
        ),
        new PreparationList(),
        new MemoList(),
        new StrategyMemoId(""),
    );

    test("details", () => {
        const gameMapDetails = new GameMapDetailList(
            new GameMapDetail(
                "",
                [],
                [],
                "",
                "",
                new Point(0, 0),
                new GameMapId(""),
                false,
                new GameMapDetailId(""),
            ),
        );
        const gameMap = strategyMemo.gameMaps.find(new GameMapId("id"))!;
        const result = strategyMemo.replacedGameMapDetails(
            gameMap,
            gameMapDetails,
        );
        const expected = new StrategyMemo(
            "",
            new GameMapList(
                new GameMap(
                    "",
                    gameMapDetails,
                    new GameMapShapeList(),
                    "",
                    new GameMapId("id"),
                ),
            ),
            new PreparationList(),
            new MemoList(),
            new StrategyMemoId(""),
        );
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });

    test("shapes", () => {
        const gameMapShapes = new GameMapShapeList(GameMapShape.create());
        const gameMap = strategyMemo.gameMaps.find(new GameMapId("id"))!;
        const result = strategyMemo.replacedGameMapShapes(
            gameMap,
            gameMapShapes,
        );
        const expected = new StrategyMemo(
            "",
            new GameMapList(
                new GameMap(
                    "",
                    new GameMapDetailList(),
                    gameMapShapes,
                    "",
                    new GameMapId("id"),
                ),
            ),
            new PreparationList(),
            new MemoList(),
            new StrategyMemoId(""),
        );
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });
});

test("uncheckedAll", () => {
    const checkedGameMapDetail = new GameMapDetail(
        "",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId(""),
        true,
        new GameMapDetailId(""),
    );
    const checkedPreparation = new Preparation(
        "",
        [],
        [],
        true,
        new PreparationId(""),
    );
    const checkedMemo = new Memo("", "", true, new MemoId(""));
    const checkedStrategyMemo = new StrategyMemo(
        "",
        new GameMapList(
            new GameMap(
                "",
                new GameMapDetailList(checkedGameMapDetail),
                new GameMapShapeList(),
                "",
                new GameMapId(""),
            ),
        ),
        new PreparationList(checkedPreparation),
        new MemoList(checkedMemo),
        new StrategyMemoId(""),
    );
    const result = checkedStrategyMemo.uncheckedAll();

    const uncheckedGameMapDetail = new GameMapDetail(
        "",
        [],
        [],
        "",
        "",
        new Point(0, 0),
        new GameMapId(""),
        false,
        new GameMapDetailId(""),
    );
    const uncheckedPreparation = new Preparation(
        "",
        [],
        [],
        false,
        new PreparationId(""),
    );
    const uncheckedMemo = new Memo("", "", false, new MemoId(""));
    const uncheckedStrategyMemo = new StrategyMemo(
        "",
        new GameMapList(
            new GameMap(
                "",
                new GameMapDetailList(uncheckedGameMapDetail),
                new GameMapShapeList(),
                "",
                new GameMapId(""),
            ),
        ),
        new PreparationList(uncheckedPreparation),
        new MemoList(uncheckedMemo),
        new StrategyMemoId(""),
    );
    expect(JSON.stringify(result)).toBe(JSON.stringify(uncheckedStrategyMemo));
});
