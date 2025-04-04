import { GameMapGroup } from "./gameMapGroup";

export default class GameMapGroupsFiltering {
    private gameMapGroups: GameMapGroup[];

    constructor(gameMapGroups: GameMapGroup[]) {
        this.gameMapGroups = gameMapGroups;
    }

    /**
     * GameMapGroupsの要素に入力文字列を含むものだけを抽出する
     */
    filtered = (inputs: string[]): GameMapGroup[] => {
        return this.gameMapGroups.map((gameMapGroup) => {
            const gameMaps = gameMapGroup.gameMaps.filter((gameMap) => {
                return inputs.some((input) => {
                    if (gameMap.name.includes(input)) return true;
                    if (gameMap.items.some((item) => item.includes(input)))
                        return true;
                    if (
                        gameMap.monsters.some((monster) =>
                            monster.includes(input),
                        )
                    )
                        return true;
                    if (gameMap.memo.includes(input)) return true;
                    return false;
                });
            });
            return {
                name: gameMapGroup.name,
                gameMaps: gameMaps,
                image: gameMapGroup.image,
                id: gameMapGroup.id,
            };
        });
    };

    filteredByGameMapID = (id: string): GameMapGroup[] => {
        return this.gameMapGroups.map((gameMapGroup) => {
            const gameMaps = gameMapGroup.gameMaps.filter(
                (gameMap) => gameMap.id === id,
            );
            return {
                name: gameMapGroup.name,
                gameMaps: gameMaps,
                image: gameMapGroup.image,
                id: gameMapGroup.id,
            };
        });
    };
}
