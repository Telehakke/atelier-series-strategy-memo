import { GameMapGroupWithID } from "../../../models/gameMapGroup";
import { Text } from "../../commons/classNames";

const GameMapsLinkList = ({
    gameMapGroup,
    className,
}: {
    gameMapGroup?: GameMapGroupWithID;
    className?: string;
}) => {
    if (gameMapGroup == null) return <></>;

    return (
        <>
            {gameMapGroup.gameMaps.length > 0 && (
                <div className={className}>
                    {gameMapGroup.gameMaps.map((v) => (
                        <a
                            className={`block truncate ${Text.hoverBlue500}`}
                            key={v.id}
                            href={`#${v.name}`}
                        >
                            {v.name}
                        </a>
                    ))}
                </div>
            )}
        </>
    );
};

export default GameMapsLinkList;
