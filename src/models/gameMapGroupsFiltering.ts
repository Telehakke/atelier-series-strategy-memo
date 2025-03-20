import { GameMapGroupWithID } from "./gameMapGroup";

export default class GameMapGroupsFiltering {
    private gameMapGroups: GameMapGroupWithID[];

    constructor(gameMapGroups: GameMapGroupWithID[]) {
        this.gameMapGroups = gameMapGroups;
    }

    /**
     * GameMapGroupsの要素に入力文字列を含むものだけを抽出する
     */
    filtered = (input: string): GameMapGroupWithID[] => {
        return this.gameMapGroups.map((gameMapGroup) => {
            const gameMaps = gameMapGroup.gameMaps.filter((gameMap) => {
                if (gameMap.name.includes(input)) return true;
                if (gameMap.items.some((item) => item.includes(input)))
                    return true;
                if (gameMap.monsters.some((monster) => monster.includes(input)))
                    return true;
                if (gameMap.memo.includes(input)) return true;
                return false;
            });
            return {
                name: gameMapGroup.name,
                gameMaps: gameMaps,
                id: gameMapGroup.id,
            };
        });
    };
}
