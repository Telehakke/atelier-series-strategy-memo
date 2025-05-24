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
import GameMapListController from "./sub/gameMapListController";
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
    const isLeftPanelOpen = useAtomValue(isLeftPanelOpenAtom);

    const flex = "flex flex-col gap-2";
    const fixedToLeft = "fixed top-13 left-0 z-5";
    const border = `border-r-2 ${Border.neutral300_800}`;
    const showPanel = `${isLeftPanelOpen ? "" : "hidden"}`;

    return (
        <div
            className={`h-full w-51 p-2 ${flex} ${fixedToLeft} ${border} ${showPanel} ${Bg.neutral50_950}`}
        >
            <GameMapListController />
            <div
                className={`space-y-2 divide-y-2 overflow-auto overscroll-contain ${Divide.neutral300_800}`}
                style={{ scrollbarWidth: "thin" }}
            >
                <GameMapListView className="pb-2" />
                <GameMapFilteringTextField className="pb-2" />
                <GameMapDetailLinkView className="pb-13" />
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
