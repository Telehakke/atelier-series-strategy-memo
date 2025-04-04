import { expect, test } from "vitest";
import { GameMapGroup } from "../gameMapGroup";
import GameMapGroupsFiltering from "../gameMapGroupsFiltering";

const gameMapGroups: GameMapGroup[] = [
    {
        name: "ワールドマップ",
        gameMaps: [
            {
                name: "キルヘン・ベル",
                items: ["井戸水"],
                monsters: [],
                memo: "",
                icon: "🔴",
                x: 50,
                y: 50,
                goto: "",
                id: "0",
            },
            {
                name: "雛鳥の林",
                items: ["正体不明のタマゴ", "赤うに", "うに", "夕焼け草"],
                monsters: ["ゴースト", "緑プニ", "青プニ"],
                memo: "",
                icon: "🔴",
                x: 40,
                y: 50,
                goto: "",
                id: "1",
            },
            {
                name: "巡礼街道",
                items: ["カーエン石", "コバルト草", "魔法の草"],
                monsters: ["緑プニ", "青プニ"],
                memo: "",
                icon: "🔴",
                x: 50,
                y: 60,
                goto: "",
                id: "2",
            },
        ],
        image: "",
        id: "0",
    },
];
const gameMapGroupsFiltering = new GameMapGroupsFiltering(gameMapGroups);

test("filtered", () => {
    const result = gameMapGroupsFiltering.filtered([
        "キルヘン・ベル",
        "雛鳥の林",
    ]);
    const expected: GameMapGroup[] = [
        {
            name: "ワールドマップ",
            gameMaps: [
                {
                    name: "キルヘン・ベル",
                    items: ["井戸水"],
                    monsters: [],
                    memo: "",
                    icon: "🔴",
                    x: 50,
                    y: 50,
                    goto: "",
                    id: "0",
                },
                {
                    name: "雛鳥の林",
                    items: ["正体不明のタマゴ", "赤うに", "うに", "夕焼け草"],
                    monsters: ["ゴースト", "緑プニ", "青プニ"],
                    memo: "",
                    icon: "🔴",
                    x: 40,
                    y: 50,
                    goto: "",
                    id: "1",
                },
            ],
            image: "",
            id: "0",
        },
    ];
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

test("filteredByGameMapID", () => {
    const result = gameMapGroupsFiltering.filteredByGameMapID("0");
    const expected: GameMapGroup[] = [
        {
            name: "ワールドマップ",
            gameMaps: [
                {
                    name: "キルヘン・ベル",
                    items: ["井戸水"],
                    monsters: [],
                    memo: "",
                    icon: "🔴",
                    x: 50,
                    y: 50,
                    goto: "",
                    id: "0",
                },
            ],
            image: "",
            id: "0",
        },
    ];
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});
