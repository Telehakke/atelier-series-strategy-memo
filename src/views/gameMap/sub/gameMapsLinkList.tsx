import {
    GameMapGroup,
    GameMapGroupUtility,
} from "../../../models/gameMapGroup";
import { Text } from "../../commons/classNames";

const GameMapsLinkList = ({
    gameMapGroups,
    selectedID,
    className,
}: {
    gameMapGroups: GameMapGroup[];
    selectedID: string | null;
    className?: string;
}) => {
    if (selectedID == null) return <></>;

    const index = GameMapGroupUtility.findIndex(gameMapGroups, selectedID);
    if (index == null) return <></>;

    const gameMapGroup = gameMapGroups[index];

    return (
        <div className={`w-45 ${className}`}>
            {gameMapGroup.gameMaps.map((v) => (
                <a
                    className={`block truncate leading-8 ${Text.hoverBlue500}`}
                    key={v.id}
                    href={`#${v.id}`}
                >
                    {v.name}
                </a>
            ))}
        </div>
    );
};

export default GameMapsLinkList;
