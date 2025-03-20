import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    gameMapShapeEditModeAtom,
    gameMapShapeSelectionManagerAtom,
    selectedGameMapIdAtom,
} from "../../../../atoms";
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
        <div className={className}>
            <div className="flex flex-col items-end gap-4">
                {editMode === GameMapShapeEditModeEnum.select && (
                    <ShapeSelectionController gameMapId={selectedGameMapId} />
                )}
                {editMode === GameMapShapeEditModeEnum.adjust && (
                    <ShapeAdjustmentController gameMapId={selectedGameMapId} />
                )}
                {editMode === GameMapShapeEditModeEnum.move && (
                    <ShapeMovementController gameMapId={selectedGameMapId} />
                )}
                <div className="flex gap-4">
                    <SelectModeButton />
                    <AdjustModeButton />
                    <MoveModeButton />
                    <XButton />
                </div>
            </div>
        </div>
    );
};

export default GameMapShapeBoardController;

/* -------------------------------------------------------------------------- */

export const GameMapShapeEditModeEnum = {
    select: "select",
    adjust: "adjust",
    move: "move",
} as const;

export type GameMapShapeEditMode = keyof typeof GameMapShapeEditModeEnum;

const SelectModeButton = () => {
    const [editMode, setEditMode] = useAtom(gameMapShapeEditModeAtom);
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    if (selectionManager.boardItems.length !== 1) return <></>;

    const handleClick = () => setEditMode(GameMapShapeEditModeEnum.select);

    const isSelected = editMode === GameMapShapeEditModeEnum.select;
    const backgroundColor = isSelected ? Bg.blue500 : Bg.neutral500;
    const hoverColor = isSelected ? Bg.hoverBlue400 : Bg.hoverNeutral400;

    return (
        <ShapesIconLargeButton
            className={`${backgroundColor} ${hoverColor} ${Stroke.neutral50}`}
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

    const isSelected = editMode === GameMapShapeEditModeEnum.adjust;
    const backgroundColor = isSelected ? Bg.blue500 : Bg.neutral500;
    const hoverColor = isSelected ? Bg.hoverBlue400 : Bg.hoverNeutral400;

    return (
        <WrenchIconLargeButton
            className={`${backgroundColor} ${hoverColor} ${Stroke.neutral50}`}
            description="調整"
            onClick={handleClick}
        />
    );
};

const MoveModeButton = () => {
    const [editMode, setEditMode] = useAtom(gameMapShapeEditModeAtom);

    const handleClick = () => setEditMode(GameMapShapeEditModeEnum.move);

    const isSelected = editMode === GameMapShapeEditModeEnum.move;
    const backgroundColor = isSelected ? Bg.blue500 : Bg.neutral500;
    const hoverColor = isSelected ? Bg.hoverBlue400 : Bg.hoverNeutral400;

    return (
        <MoveIconLargeButton
            className={`${backgroundColor} ${hoverColor} ${Stroke.neutral50}`}
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
