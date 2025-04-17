import { useState } from "react";
import { GameMapGroup, GameMapGroupUtility } from "../../models/gameMapGroup";
import GameMapGroupsFiltering from "../../models/gameMapGroupsFiltering";
import splitByWhiteSpace from "../../models/splitByWhiteSpace";
import { Bg, Border, Divide } from "../commons/classNames";
import FilteringTextField from "../commons/filteringTextField";
import GameMapCanvas from "./sub/gameMapCanvas";
import GameMapGroupsList from "./sub/gameMapGroupsList";
import GameMapsLinkList from "./sub/gameMapsLinkList";
import GameMapsList from "./sub/gameMapsList";

const GameMapView = ({
    gameMapGroups,
    isPanelOpen,
}: {
    gameMapGroups: GameMapGroup[];
    isPanelOpen: boolean;
}) => {
    const [selectedIndexInGameMapGroups, setSelectedIndexInGameMapGroups] =
        useState(0);
    const [selectedIDInCanvas, setSelectedIDInCanvas] = useState<string | null>(
        null,
    );
    const [selectedIDInList, setSelectedIDInList] = useState<string | null>(
        null,
    );
    const [filteringValue, setFilteringValue] = useState("");
    const gameMapGroupsFiltering = new GameMapGroupsFiltering(gameMapGroups);
    const filteredGameMapGroups =
        selectedIDInCanvas != null
            ? gameMapGroupsFiltering.filteredByGameMapID(selectedIDInCanvas)
            : gameMapGroupsFiltering.filtered(
                  splitByWhiteSpace(filteringValue),
              );
    const selectedIDInGameMapGroups = GameMapGroupUtility.findID(
        gameMapGroups,
        selectedIndexInGameMapGroups,
    );

    return (
        <>
            {isPanelOpen && (
                <div
                    className={`fixed top-0 left-0 z-5 flex h-full gap-2 border-r-2 p-2 pt-14 ${Bg.neutral50} ${Border.neutral300}`}
                >
                    <div
                        className={`divide-y-2 overflow-scroll ${Divide.neutral300}`}
                    >
                        <GameMapGroupsList
                            className="pb-2"
                            gameMapGroups={filteredGameMapGroups}
                            selectedIDInGameMapGroups={
                                selectedIDInGameMapGroups
                            }
                            setSelectedIndexInGameMapGroups={
                                setSelectedIndexInGameMapGroups
                            }
                            setSelectedIDInCanvas={setSelectedIDInCanvas}
                            setSelectedIDInList={setSelectedIDInList}
                        />
                        <FilteringTextField
                            className="py-2"
                            filteringValue={filteringValue}
                            setFilteringValue={setFilteringValue}
                        />
                        <GameMapsLinkList
                            className="py-2"
                            gameMapGroups={filteredGameMapGroups}
                            selectedID={selectedIDInGameMapGroups}
                        />
                    </div>
                </div>
            )}
            <div>
                <GameMapCanvas
                    className="mb-2"
                    key={selectedIDInGameMapGroups}
                    gameMapGroups={filteredGameMapGroups}
                    selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                    setSelectedIndexInGameMapGroups={
                        setSelectedIndexInGameMapGroups
                    }
                    selectedIDInCanvas={selectedIDInCanvas}
                    setSelectedIDInCanvas={setSelectedIDInCanvas}
                    selectedIDInList={selectedIDInList}
                />
                <GameMapsList
                    gameMapGroups={filteredGameMapGroups}
                    selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                    setSelectedIDInCanvas={setSelectedIDInCanvas}
                    selectedIDInList={selectedIDInList}
                    setSelectedIDInList={setSelectedIDInList}
                />
            </div>
        </>
    );
};

export default GameMapView;
