import { useAtomValue, useSetAtom } from "jotai";
import {
    Circle,
    Minus,
    MoveHorizontal,
    MoveRight,
    Redo,
    Square,
} from "lucide-react";
import { ReactNode } from "react";
import {
    gameMapsAtom,
    gameMapShapeSelectionManagerAtom,
    isReadonlyAtom,
    strategyMemoAtom,
} from "../../../../atoms";

import {
    GameMapShapeId,
    ShapeName,
    ShapeNameEnum,
} from "../../../../models/gameMapShape";
import LocalStorage from "../../../../models/localStorage";

import { GameMapId } from "../../../../models/gameMap";
import { Bg, Stroke } from "../../../commons/classNames";
import {
    LargeIconButton,
    largeIconClassName,
} from "../../../commons/iconButtons";

type Id = { gameMapId: GameMapId; gameMapShapeId: GameMapShapeId };

const ShapeSelectionController = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    if (selectionManager.boardItems.length !== 1) return <></>;

    const gameMapShapeId = selectionManager.boardItems.at(0)!;
    const id: Id = {
        gameMapId: gameMapId,
        gameMapShapeId: gameMapShapeId,
    };

    return (
        <>
            <div className="flex gap-4">
                <ChangeToMoveRight id={id} />
                <ChangeToMoveHorizontal id={id} />
                <ChangeToRedo id={id} />
            </div>
            <div className="flex gap-4">
                <ChangeToSquare id={id} />
                <ChangeToCircle id={id} />
                <ChangeToMinus id={id} />
            </div>
        </>
    );
};

export default ShapeSelectionController;

/* -------------------------------------------------------------------------- */

const ChangeToMoveRight = ({ id }: { id: Id }) => (
    <ChangeShapeButton id={id} shapeName={ShapeNameEnum.moveRight.name}>
        <MoveRight className={largeIconClassName} />
    </ChangeShapeButton>
);

const ChangeToMoveHorizontal = ({ id }: { id: Id }) => (
    <ChangeShapeButton id={id} shapeName={ShapeNameEnum.moveHorizontal.name}>
        <MoveHorizontal className={largeIconClassName} />
    </ChangeShapeButton>
);

const ChangeToRedo = ({ id }: { id: Id }) => (
    <ChangeShapeButton id={id} shapeName={ShapeNameEnum.redo.name}>
        <Redo className={largeIconClassName} />
    </ChangeShapeButton>
);

const ChangeToSquare = ({ id }: { id: Id }) => (
    <ChangeShapeButton id={id} shapeName={ShapeNameEnum.square.name}>
        <Square className={largeIconClassName} />
    </ChangeShapeButton>
);

const ChangeToCircle = ({ id }: { id: Id }) => (
    <ChangeShapeButton id={id} shapeName={ShapeNameEnum.circle.name}>
        <Circle className={largeIconClassName} />
    </ChangeShapeButton>
);

const ChangeToMinus = ({ id }: { id: Id }) => (
    <ChangeShapeButton id={id} shapeName={ShapeNameEnum.minus.name}>
        <Minus className={largeIconClassName} />
    </ChangeShapeButton>
);

const ChangeShapeButton = ({
    id,
    shapeName,
    children,
}: {
    id: Id;
    shapeName: ShapeName;
    children: ReactNode;
}) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(id.gameMapId);
            if (gameMap == null) return v;

            const gameMapShape = gameMap.gameMapShapes.find(id.gameMapShapeId);
            if (gameMapShape == null) return v;

            const newGameMapShape = gameMapShape.copyWith({
                name: shapeName,
            });
            const newGameMapShapes =
                gameMap.gameMapShapes.replaced(newGameMapShape);
            const newStrategyMemo = v.replacedGameMapShapes(
                gameMap,
                newGameMapShapes,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    return (
        <LargeIconButton
            className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
            onClick={handleClick}
        >
            {children}
        </LargeIconButton>
    );
};
