import { useAtom, useAtomValue } from "jotai";
import {
    gameMapFilteringValueAtom,
    gameMapsAtom,
    selectedGameMapIdAtom,
} from "../../../atoms";
import { GameMap } from "../../../models/gameMap";
import GameMapFilter from "../../../models/gameMapFilter";
import Split from "../../../models/split";
import { Bg, Border, Divide, Text } from "../../commons/classNames";

const GameMapListView = ({ className }: { className?: string }) => {
    const gameMaps = useAtomValue(gameMapsAtom);
    const filteringValue = useAtomValue(gameMapFilteringValueAtom);
    const filteredGameMaps = GameMapFilter.filtered(
        gameMaps,
        Split.byWhiteSpace(filteringValue),
    );

    if (filteredGameMaps.length === 0) return <></>;

    return (
        <div className={className}>
            <ul
                className={`cursor-default divide-y-1 overflow-clip rounded-md border-2 ${Border.neutral950_300} ${Divide.neutral300_800}`}
            >
                {filteredGameMaps.map((v) => (
                    <ListItem key={v.id.value} gameMap={v} />
                ))}
            </ul>
        </div>
    );
};

export default GameMapListView;

/* -------------------------------------------------------------------------- */

const ListItem = ({ gameMap }: { gameMap: GameMap }) => {
    const [selectedGameMapId, setSelectedGameMapId] = useAtom(
        selectedGameMapIdAtom,
    );

    const handleClick = () => {
        setSelectedGameMapId(gameMap.id);
    };

    const isSelected = selectedGameMapId?.value === gameMap.id.value;
    const backgroundColor = isSelected ? Bg.blue500 : Bg.hoverNeutral200_800;
    const textColor = isSelected ? Text.neutral100 : Text.neutral950_100;
    const accentColor = isSelected ? Text.orange300 : Text.orange500;

    return (
        <li
            className={`px-2 py-1 ${backgroundColor} ${textColor}`}
            onClick={handleClick}
        >
            {gameMap.name}
            <span className={`ml-2 font-bold ${accentColor}`}>
                {gameMap.gameMapDetails.length}
            </span>
        </li>
    );
};
