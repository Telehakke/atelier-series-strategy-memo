import { v4 as uuidv4 } from "uuid";
import { Point } from "./models/dataClasses";
import { GameMap, GameMapId, GameMapList } from "./models/gameMap";
import {
    GameMapDetail,
    GameMapDetailId,
    GameMapDetailList,
} from "./models/gameMapDetail";
import { GameMapShapeList } from "./models/gameMapShape";
import { MemoList } from "./models/memo";
import {
    Preparation,
    PreparationId,
    PreparationList,
} from "./models/preparation";
import { StrategyMemo, StrategyMemoId } from "./models/strategyMemo";

const sampleData = new StrategyMemo(
    "ソフィーのアトリエ",
    new GameMapList(
        new GameMap(
            "ワールドマップ",
            new GameMapDetailList(
                new GameMapDetail(
                    "キルヘン・ベル",
                    ["井戸水", "カーエン石"],
                    [],
                    "",
                    "🔴",
                    new Point(50, 50),
                    new GameMapId(""),
                    false,
                    new GameMapDetailId(uuidv4()),
                ),
                new GameMapDetail(
                    "雛鳥の林",
                    ["正体不明のタマゴ", "夕焼け草", "うに", "赤うに"],
                    ["青プニ", "緑プニ", "ゴースト"],
                    "",
                    "🔴",
                    new Point(60, 40),
                    new GameMapId(""),
                    false,
                    new GameMapDetailId(uuidv4()),
                ),
                new GameMapDetail(
                    "巡礼街道",
                    ["コバルト草", "カーエン石", "魔法の草"],
                    ["青プニ", "緑プニ"],
                    "",
                    "🔴",
                    new Point(55, 60),
                    new GameMapId(""),
                    false,
                    new GameMapDetailId(uuidv4()),
                ),
            ),
            new GameMapShapeList(),
            "",
            new GameMapId(uuidv4()),
        ),
    ),
    new PreparationList(
        new Preparation(
            "中和剤・赤",
            ["（火薬）", "（水）"],
            ["（中和剤）"],
            false,
            new PreparationId(uuidv4()),
        ),
        new Preparation(
            "ラーメル麦粉",
            ["ラーメル麦", "（紙）", "（鉱石）"],
            ["（食材）", "（火薬）"],
            false,
            new PreparationId(uuidv4()),
        ),
        new Preparation(
            "ゼッテル",
            ["（植物類）", "（水）", "（中和剤）"],
            ["（紙）", "（燃料）"],
            false,
            new PreparationId(uuidv4()),
        ),
    ),
    new MemoList(),
    new StrategyMemoId(uuidv4()),
);

export default sampleData;
