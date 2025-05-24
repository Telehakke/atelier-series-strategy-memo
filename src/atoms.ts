import { atom } from "jotai";
import { GameMapId } from "./models/gameMap";
import {
    ClipMode,
    ClipModeEnum,
    JpegQuality,
    JpegQualityEnum,
} from "./models/imageFile";
import {
    GameMapDetailSelectionManager,
    GameMapShapeSelectionManager,
} from "./models/itemSelectionManager";
import { MemoIdList } from "./models/memo";
import { PreparationIdList } from "./models/preparation";
import sampleData from "./sampleData";
import {
    GameMapShapeEditModeDetail,
    GameMapShapeEditModeEnum,
} from "./views/gameMap/sub/gameMapShapeBoardControllers/gameMapShapeBoardController";

export const strategyMemoAtom = atom(sampleData);
export const gameNameAtom = atom(sampleData.gameName);
export const gameMapsAtom = atom(sampleData.gameMaps);
export const preparationsAtom = atom(sampleData.preparations);
export const memosAtom = atom(sampleData.memos);

/* -------------------------------------------------------------------------- */

export const selectedGameMapIdAtom = atom<GameMapId | null>(null);
export const gameMapDetailSelectionManagerAtom = atom(
    new GameMapDetailSelectionManager(),
);
export const gameMapShapeSelectionManagerAtom = atom(
    new GameMapShapeSelectionManager(),
);
export const isEditGameMapDialogOpenAtom = atom(false);
export const gameMapFilteringValueAtom = atom("");
export const movementStepValueAtom = atom<1 | 5>(1);
export const isGameMapDetailEditModeAtom = atom(true);
export const gameMapShapeEditModeAtom = atom<GameMapShapeEditModeDetail>(
    GameMapShapeEditModeEnum.select,
);
export const canvasScaleAtom = atom(1);

/* -------------------------------------------------------------------------- */

export const selectedPreparationIdsAtom = atom(new PreparationIdList());
export const isEditPreparationDialogOpenAtom = atom(false);
export const preparationFilteringValueAtom = atom("");

/* -------------------------------------------------------------------------- */

export const selectedMemoIdsAtom = atom(new MemoIdList());
export const isEditMemoDialogOpenAtom = atom(false);
export const memoFilteringValueAtom = atom("");

/* -------------------------------------------------------------------------- */
export const canSelectMultipleAtom = atom(false);
export const isLeftPanelOpenAtom = atom(true);
export const jpegQualityAtom = atom<JpegQuality>(JpegQualityEnum.middle);
export const clipModeAtom = atom<ClipMode>(ClipModeEnum.all.value);
export const isReadonlyAtom = atom(false);
