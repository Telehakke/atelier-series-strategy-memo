import { useAtomValue } from "jotai";
import {
    gameMapsAtom,
    isGameMapDetailEditModeAtom,
    isLeftPanelOpenAtom,
    isReadonlyAtom,
    selectedGameMapIdAtom,
} from "../../atoms";
import { Bg, Border, Divide } from "../commons/classNames";
import { ReadonlyButton } from "../share";
import GameMapCanvas from "./sub/gameMapCanvas";
import GameMapDetailBoardController from "./sub/gameMapDetailBoardController";
import GameMapDetailLinkView from "./sub/gameMapDetailLinkView";
import GameMapDetailListController from "./sub/gameMapDetailListController";
import GameMapDetailListView from "./sub/gameMapDetailListView";
import GameMapFilteringTextField from "./sub/gameMapFilteringTextField";
import GameMapListController, {
    AddGameMapButton,
} from "./sub/gameMapListController";
import GameMapListView from "./sub/gameMapListView";
import GameMapShapeBoardController from "./sub/gameMapShapeBoardControllers/gameMapShapeBoardController";
import GameMapShapeListController from "./sub/gameMapShapeListController";
import GameMapShapeListView from "./sub/gameMapShapeListView";

const GameMapView = () => {
    return (
        <>
            <LeftPanel />
            <div className="space-y-2">
                <GameMapCanvas />
                <ListView />
            </div>
            <Controller />
        </>
    );
};

export default GameMapView;

/* -------------------------------------------------------------------------- */

const LeftPanel = () => {
    const isLeftPanelOpened = useAtomValue(isLeftPanelOpenAtom);
    const isReadonly = useAtomValue(isReadonlyAtom);

    return (
        <div
            className={`fixed top-0 left-0 z-5 flex h-full flex-col gap-2 border-r-2 p-2 pt-14 ${Bg.neutral50_950} ${Border.neutral300_800} ${isLeftPanelOpened ? "" : "hidden"}`}
        >
            {!isReadonly && <GameMapListController />}
            <div
                className={`divide-y-2 overflow-auto ${Divide.neutral300_800}`}
                style={{
                    scrollbarWidth: "thin",
                }}
            >
                <div className="flex flex-col gap-2 pb-2">
                    <GameMapListView />
                    {!isReadonly && (
                        <AddGameMapButton className="self-center" />
                    )}
                </div>
                <div>
                    <GameMapFilteringTextField className="my-1" />
                </div>
                <GameMapDetailLinkView className="py-2" />
            </div>
        </div>
    );
};

const ListView = () => {
    const isGameMapDetailEditMode = useAtomValue(isGameMapDetailEditModeAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    if (selectedGameMapId == null) return <></>;

    const gameMap = gameMaps.find(selectedGameMapId);
    if (gameMap == null) return <></>;

    if (isGameMapDetailEditMode)
        return <GameMapDetailListView gameMap={gameMap} />;

    return <GameMapShapeListView gameMap={gameMap} />;
};

const Controller = () => {
    const isGameMapDetailEditMode = useAtomValue(isGameMapDetailEditModeAtom);
    const isReadonly = useAtomValue(isReadonlyAtom);

    if (isReadonly)
        return <ReadonlyButton className="fixed right-4 bottom-4" />;

    if (isGameMapDetailEditMode)
        return (
            <>
                <GameMapDetailListController className="fixed right-4 bottom-4" />
                <GameMapDetailBoardController className="fixed right-4 bottom-4" />
            </>
        );

    return (
        <>
            <GameMapShapeListController className="fixed right-4 bottom-4" />
            <GameMapShapeBoardController className="fixed right-4 bottom-4" />
        </>
    );
};
