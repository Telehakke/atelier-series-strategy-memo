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

const ShapeSelectionController = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    if (selectionManager.boardItems.length !== 1) return <></>;

    const gameMapShapeId = selectionManager.boardItems.at(0)!;

    return (
        <>
            <div className="flex justify-end gap-4">
                <ChangeShapeButton
                    className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                    shapeName={ShapeNameEnum.moveRight.value}
                >
                    <MoveRight className={largeIconClassName} />
                </ChangeShapeButton>
                <ChangeShapeButton
                    className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                    shapeName={ShapeNameEnum.moveHorizontal.value}
                >
                    <MoveHorizontal className={largeIconClassName} />
                </ChangeShapeButton>
                <ChangeShapeButton
                    className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                    shapeName={ShapeNameEnum.redoDot.value}
                >
                    <Redo className={largeIconClassName} />
                </ChangeShapeButton>
            </div>
            <div className="flex justify-end gap-4">
                <ChangeShapeButton
                    className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                    shapeName={ShapeNameEnum.square.value}
                >
                    <Square className={largeIconClassName} />
                </ChangeShapeButton>
                <ChangeShapeButton
                    className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                    shapeName={ShapeNameEnum.circle.value}
                >
                    <Circle className={largeIconClassName} />
                </ChangeShapeButton>
                <ChangeShapeButton
                    className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                    shapeName={ShapeNameEnum.minus.value}
                >
                    <Minus className={largeIconClassName} />
                </ChangeShapeButton>
            </div>
        </>
    );
};

export default ShapeSelectionController;

/* -------------------------------------------------------------------------- */

const ChangeShapeButton = ({
    gameMapId,
    gameMapShapeId,
    shapeName,
    children,
    className,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
    shapeName: ShapeName;
    children: ReactNode;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const gameMapShape = gameMap.gameMapShapes.find(gameMapShapeId);
            if (gameMapShape == null) return v;

            const newGameMapShape = gameMapShape.copyWith({
                name: shapeName,
            });
            const newGameMapShapes = gameMap.gameMapShapes.replaced(
                gameMapShape.id,
                newGameMapShape,
            );
            const newStrategyMemo = v.replacedGameMapShapes(
                gameMap,
                newGameMapShapes,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo);
            return newStrategyMemo;
        });
    };

    return (
        <LargeIconButton className={className} onClick={handleClick}>
            {children}
        </LargeIconButton>
    );
};
