import { atomWithStorage } from "jotai/utils";
import { StrategyMemoWithID } from "./models/strategyMemo";

export const strategyMemoRepositoryAtom = atomWithStorage<StrategyMemoWithID>(
    "strategyMemo",
    {
        gameName: "ソフィーのアトリエ",
        gameMapGroups: [
            {
                name: "ワールドマップ",
                gameMaps: [
                    {
                        name: "キルヘン・ベル",
                        items: ["井戸水", "カーエン石"],
                        monsters: [],
                        memo: "",
                        icon: "🔴",
                        x: 50,
                        y: 50,
                        id: "ef80217e-57c5-4224-8996-8bf2d39fdd2b",
                    },
                    {
                        name: "雛鳥の林",
                        items: [
                            "正体不明のタマゴ",
                            "夕焼け草",
                            "うに",
                            "赤うに",
                        ],
                        monsters: ["青プニ", "緑プニ", "ゴースト"],
                        memo: "",
                        icon: "🔴",
                        x: 60,
                        y: 40,
                        id: "d3a3fa33-0eb9-412c-850c-c5e5c32cd701",
                    },
                    {
                        name: "巡礼街道",
                        items: ["コバルト草", "カーエン石", "魔法の草"],
                        monsters: ["青プニ", "緑プニ"],
                        memo: "",
                        icon: "🔴",
                        x: 55,
                        y: 60,
                        id: "a05bfe28-a87a-4a46-8607-5e5c0702d59d",
                    },
                ],
                id: "a082cdac-7e45-467f-a18c-12c9e720d3a0",
            },
        ],
        preparations: [
            {
                name: "中和剤・赤",
                materials: ["（火薬）", "（水）"],
                categories: ["（中和剤）"],
                id: "49a31f92-f100-4e6d-9758-7164c7bb7ea2",
            },
            {
                name: "ラーメル麦粉",
                materials: ["ラーメル麦", "（紙）", "（鉱石）"],
                categories: ["（食材）", "（火薬）"],
                id: "4ebf6287-2b76-4bb4-80b8-5544b0309c29",
            },
            {
                name: "ゼッテル",
                materials: ["（植物類）", "（水）", "（中和剤）"],
                categories: ["（紙）", "（燃料）"],
                id: "f70f1a09-9f42-450f-9529-d1d570644942",
            },
        ],
        memos: [],
        id: "ed157ee3-b8b5-4d97-a324-a18d2459d287",
    },
);
