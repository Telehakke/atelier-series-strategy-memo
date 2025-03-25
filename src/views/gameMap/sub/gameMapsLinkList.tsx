import { GameMapGroupWithID } from "../../../models/gameMapGroup";
import { Text } from "../../commons/classNames";

const GameMapsLinkList = ({
    gameMapGroup,
    className,
}: {
    gameMapGroup?: GameMapGroupWithID;
    className?: string;
}) => {
    return (
        <div className={`w-45 ${className}`}>
            {gameMapGroup?.gameMaps.map((v) => (
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
