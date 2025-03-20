import { GameMapDetailList } from "./gameMapDetail";

export default class GameMapDetailFilter {
    static filtered = (
        list: GameMapDetailList,
        texts: readonly string[],
    ): GameMapDetailList => {
        if (texts.length === 0) return list;

        return list.filter((gameMapDetail) =>
            texts.some((text) => {
                if (gameMapDetail.name.includes(text)) return true;
                if (gameMapDetail.items.some((v) => v.includes(text)))
                    return true;
                if (gameMapDetail.monsters.some((v) => v.includes(text)))
                    return true;
                if (gameMapDetail.memo.includes(text)) return true;
                return false;
            }),
        );
    };
}
