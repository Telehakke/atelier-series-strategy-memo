import { useAtomValue } from "jotai";
import {
    gameMapDetailSelectionManagerAtom,
    gameMapFilteringValueAtom,
    gameMapsAtom,
    selectedGameMapIdAtom,
} from "../../../atoms";

import { GameMapDetailList } from "../../../models/gameMapDetail";
import GameMapDetailFilter from "../../../models/gameMapDetailFilter";
import Split from "../../../models/split";
import { Text } from "../../commons/classNames";

const GameMapDetailLinkView = ({ className }: { className?: string }) => {
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    const filteringValue = useAtomValue(gameMapFilteringValueAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);

    const filteredGameMapDetails = (): GameMapDetailList => {
        if (selectedGameMapId == null) return new GameMapDetailList();

        const gameMap = gameMaps.find(selectedGameMapId);
        if (gameMap == null) return new GameMapDetailList();

        // マップ上のアイテムが選択された場合、そのアイテムだけを表示する
        if (selectionManager.boardItems.isNotEmpty) {
            return gameMap.gameMapDetails.filter((v) =>
                selectionManager.boardItems.hasId(v.id),
            );
        }

        // マップ上のアイテムが未選択であれば、フィルタリングの結果を表示する
        return GameMapDetailFilter.filtered(
            gameMap.gameMapDetails,
            Split.byWhiteSpace(filteringValue),
        );
    };

    return (
        <div className={className}>
            {filteredGameMapDetails().map((v) => (
                <a
                    className={`block truncate leading-8 ${Text.hoverBlue500}`}
                    key={v.id.value}
                    href={`#${v.id.value}`}
                >
                    {v.name}
                </a>
            ))}
        </div>
    );
};

export default GameMapDetailLinkView;
