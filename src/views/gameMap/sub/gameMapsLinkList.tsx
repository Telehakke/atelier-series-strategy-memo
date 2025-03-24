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
                    className={`mb-2 block truncate ${Text.hoverBlue500}`}
                    key={v.id}
                    href={`#${v.name}`}
                >
                    {v.name}
                </a>
            ))}
        </div>
    );
};

export default GameMapsLinkList;
