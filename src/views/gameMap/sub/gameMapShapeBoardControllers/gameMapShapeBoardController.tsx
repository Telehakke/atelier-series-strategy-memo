import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { JSX } from "react";
import {
    gameMapShapeEditModeAtom,
    gameMapShapeSelectionManagerAtom,
    selectedGameMapIdAtom,
} from "../../../../atoms";
import { GameMapId } from "../../../../models/gameMap";
import { GameMapShapeIdList } from "../../../../models/gameMapShape";
import { ControllerTypeEnum } from "../../../../models/itemSelectionManager";
import { Bg, Stroke } from "../../../commons/classNames";
import {
    MoveIconLargeButton,
    ShapesIconLargeButton,
    WrenchIconLargeButton,
    XIconLargeButton,
} from "../../../commons/iconButtons";
import ShapeAdjustmentController from "./shapeAdjustmentController";
import ShapeMovementController from "./shapeMovementController";
import ShapeSelectionController from "./shapeSelectionController";

const GameMapShapeBoardController = ({ className }: { className?: string }) => {
    const editMode = useAtomValue(gameMapShapeEditModeAtom);
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    if (selectedGameMapId == null) return <></>;

    if (selectionManager.controllerType !== ControllerTypeEnum.board)
        return <></>;

    return (
        <div className={`flex flex-col items-end gap-4 ${className}`}>
            {editMode.component(selectedGameMapId)}
            <div className="flex gap-4">
                <SelectModeButton />
                <AdjustModeButton />
                <MoveModeButton />
                <XButton />
            </div>
        </div>
    );
};

export default GameMapShapeBoardController;

/* -------------------------------------------------------------------------- */

export type GameMapShapeEditModeDetail = {
    component: (gameMapId: GameMapId) => JSX.Element;
};

export const GameMapShapeEditModeEnum: {
    readonly select: GameMapShapeEditModeDetail;
    readonly adjust: GameMapShapeEditModeDetail;
    readonly move: GameMapShapeEditModeDetail;
} = {
    select: {
        component: (gameMapId: GameMapId) => (
            <ShapeSelectionController gameMapId={gameMapId} />
        ),
    },
    adjust: {
        component: (gameMapId: GameMapId) => (
            <ShapeAdjustmentController gameMapId={gameMapId} />
        ),
    },
    move: {
        component: (gameMapId: GameMapId) => (
            <ShapeMovementController gameMapId={gameMapId} />
        ),
    },
} as const;

/* -------------------------------------------------------------------------- */

const SelectModeButton = () => {
    const [editMode, setEditMode] = useAtom(gameMapShapeEditModeAtom);
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    if (selectionManager.boardItems.length !== 1) return <></>;

    const handleClick = () => setEditMode(GameMapShapeEditModeEnum.select);

    const backgroundColor =
        editMode === GameMapShapeEditModeEnum.select
            ? `${Bg.blue500} ${Bg.hoverBlue400}`
            : `${Bg.neutral500} ${Bg.hoverNeutral400}`;

    return (
        <ShapesIconLargeButton
            className={`${backgroundColor} ${Stroke.neutral50}`}
            description="図形選択"
            onClick={handleClick}
        />
    );
};

const AdjustModeButton = () => {
    const [editMode, setEditMode] = useAtom(gameMapShapeEditModeAtom);
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    if (selectionManager.boardItems.length !== 1) return <></>;

    const handleClick = () => setEditMode(GameMapShapeEditModeEnum.adjust);

    const backgroundColor =
        editMode === GameMapShapeEditModeEnum.adjust
            ? `${Bg.blue500} ${Bg.hoverBlue400}`
            : `${Bg.neutral500} ${Bg.hoverNeutral400}`;

    return (
        <WrenchIconLargeButton
            className={`${backgroundColor} ${Stroke.neutral50}`}
            description="調整"
            onClick={handleClick}
        />
    );
};

const MoveModeButton = () => {
    const [editMode, setEditMode] = useAtom(gameMapShapeEditModeAtom);

    const handleClick = () => setEditMode(GameMapShapeEditModeEnum.move);

    const backgroundColor =
        editMode === GameMapShapeEditModeEnum.move
            ? `${Bg.blue500} ${Bg.hoverBlue400}`
            : `${Bg.neutral500} ${Bg.hoverNeutral400}`;

    return (
        <MoveIconLargeButton
            className={`${backgroundColor} ${Stroke.neutral50}`}
            description="座標移動"
            onClick={handleClick}
        />
    );
};

const XButton = () => {
    const setSelectionManager = useSetAtom(gameMapShapeSelectionManagerAtom);

    const handleClick = () =>
        setSelectionManager((v) =>
            v.copyWith({ boardItems: new GameMapShapeIdList() }),
        );

    return <XIconLargeButton description="選択解除" onClick={handleClick} />;
};
