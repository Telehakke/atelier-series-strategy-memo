import { useState } from "react";
import { GameMapGroupWithID } from "../../models/gameMapGroup";
import GameMapGroupsFiltering from "../../models/gameMapGroupsFiltering";
import { Bg, Divide } from "../commons/classNames";
import PanelOpenCloseButton from "../commons/panelOpenCloseButton";
import GameMapCanvas from "./sub/gameMapCanvas";
import GameMapGroupsFilterInput from "./sub/gameMapGroupsFilterInput";
import GameMapGroupsList from "./sub/gameMapGroupsList";
import GameMapsLinkList from "./sub/gameMapsLinkList";
import GameMapsList from "./sub/gameMapsList";

const GameMapView = ({
    gameMapGroups,
    isPanelOpen,
    setIsPanelOpen,
}: {
    gameMapGroups: GameMapGroupWithID[];
    isPanelOpen: boolean;
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [gameMapGroupsIndex, setGameMapGroupsIndex] = useState(0);
    const [onFiltering, setOnFiltering] = useState(false);
    const [filteringValue, setFilteringValue] = useState("");
    const gameMapGroupsFiltering = new GameMapGroupsFiltering(gameMapGroups);
    const filteredGameMapGroups =
        gameMapGroupsFiltering.filtered(filteringValue);

    return (
        <>
            <div
                className={`fixed top-0 left-0 z-5 flex h-full max-w-60 gap-2 p-2 pt-13 ${Bg.neutral50}`}
            >
                {isPanelOpen && (
                    <div
                        className={`divide-y-2 overflow-scroll ${Divide.neutral300}`}
                    >
                        <GameMapGroupsList
                            className="pb-2"
                            gameMapGroups={filteredGameMapGroups}
                            gameMapGroupsIndex={gameMapGroupsIndex}
                            setGameMapGroupsIndex={setGameMapGroupsIndex}
                        />
                        <GameMapGroupsFilterInput
                            className="py-2"
                            filteringValue={filteringValue}
                            setFilteringValue={setFilteringValue}
                            setOnFiltering={setOnFiltering}
                        />
                        <GameMapsLinkList
                            className="py-2"
                            gameMapGroup={
                                filteredGameMapGroups[gameMapGroupsIndex]
                            }
                        />
                    </div>
                )}
                <PanelOpenCloseButton
                    className="h-full self-center"
                    isOpen={isPanelOpen}
                    setIsOpen={setIsPanelOpen}
                />
            </div>
            <div className="ml-11">
                <GameMapCanvas
                    className="mb-2"
                    key={gameMapGroupsIndex}
                    gameMapGroup={filteredGameMapGroups[gameMapGroupsIndex]}
                    gameMapGroupsIndex={gameMapGroupsIndex}
                />
                <GameMapsList
                    gameMapGroup={filteredGameMapGroups[gameMapGroupsIndex]}
                    gameMapGroupsIndex={gameMapGroupsIndex}
                    onFiltering={onFiltering}
                />
            </div>
        </>
    );
};

export default GameMapView;
