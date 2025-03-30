import { useState } from "react";
import { GameMapGroupWithID } from "../../models/gameMapGroup";
import GameMapGroupsFiltering from "../../models/gameMapGroupsFiltering";
import splitByWhiteSpace from "../../models/splitByWhiteSpace";
import { Bg, Divide } from "../commons/classNames";
import FilteringTextField from "../commons/filteringTextField";
import PanelOpenCloseButton from "../commons/panelOpenCloseButton";
import GameMapCanvas from "./sub/gameMapCanvas";
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
    const [filteringValue, setFilteringValue] = useState("");
    const [selectedIDInCanvas, setSelectedIDInCanvas] = useState<string | null>(
        null,
    );
    const gameMapGroupsFiltering = new GameMapGroupsFiltering(gameMapGroups);
    const filteredGameMapGroups =
        selectedIDInCanvas != null
            ? gameMapGroupsFiltering.filteredByGameMapID(selectedIDInCanvas)
            : gameMapGroupsFiltering.filtered(
                  splitByWhiteSpace(filteringValue),
              );

    return (
        <>
            <div
                className={`fixed top-0 left-0 z-5 flex h-full gap-2 p-2 pt-14 ${Bg.neutral50}`}
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
                            setSelectedIDInCanvas={setSelectedIDInCanvas}
                        />
                        <FilteringTextField
                            className="py-2"
                            filteringValue={filteringValue}
                            setFilteringValue={setFilteringValue}
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
            <div className="ml-13">
                <GameMapCanvas
                    className="mb-2"
                    key={gameMapGroupsIndex}
                    filteredGameMapGroup={
                        filteredGameMapGroups[gameMapGroupsIndex]
                    }
                    gameMapGroupsIndex={gameMapGroupsIndex}
                    selectedID={selectedIDInCanvas}
                    setSelectedID={setSelectedIDInCanvas}
                />
                <GameMapsList
                    gameMapGroup={filteredGameMapGroups[gameMapGroupsIndex]}
                    gameMapGroupsIndex={gameMapGroupsIndex}
                    setSelectedIDInCanvas={setSelectedIDInCanvas}
                />
            </div>
        </>
    );
};

export default GameMapView;
