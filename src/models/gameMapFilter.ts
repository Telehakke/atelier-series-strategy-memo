import { GameMapList } from "./gameMap";
import GameMapDetailFilter from "./gameMapDetailFilter";

export default class GameMapFilter {
    static filtered = (
        list: GameMapList,
        texts: readonly string[],
    ): GameMapList => {
        if (texts.length === 0) return list;

        const gameMaps = list.map((gameMap) => {
            const filtered = GameMapDetailFilter.filtered(
                gameMap.gameMapDetails,
                texts,
            );
            const newGameMap = gameMap.copyWith({ gameMapDetails: filtered });
            return newGameMap;
        });
        return new GameMapList(...gameMaps);
    };
}
