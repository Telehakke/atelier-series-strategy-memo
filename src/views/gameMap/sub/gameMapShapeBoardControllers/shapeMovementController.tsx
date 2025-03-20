import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    gameMapsAtom,
    gameMapShapeSelectionManagerAtom,
    movementStepValueAtom,
    strategyMemoAtom,
} from "../../../../atoms";

import LocalStorage from "../../../../models/localStorage";

import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
} from "lucide-react";
import { ReactNode } from "react";
import { Point } from "../../../../models/dataClasses";
import { GameMapId } from "../../../../models/gameMap";
import { GameMapShapeIdList } from "../../../../models/gameMapShape";
import { Bg, Stroke, Text } from "../../../commons/classNames";
import {
    LargeIconButton,
    largeIconClassName,
} from "../../../commons/iconButtons";

const ShapeMovementController = ({ gameMapId }: { gameMapId: GameMapId }) => {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-4">
                <SelectedAllButton gameMapId={gameMapId} />
                <StepSwitchButton />
            </div>
            <div className="flex flex-col items-center gap-4">
                <MoveTopButton gameMapId={gameMapId} />
                <div className="flex gap-4">
                    <MoveLeftButton gameMapId={gameMapId} />
                    <MoveBottomButton gameMapId={gameMapId} />
                    <MoveRightButton gameMapId={gameMapId} />
                </div>
            </div>
        </div>
    );
};

export default ShapeMovementController;

/* -------------------------------------------------------------------------- */

const MoveTopButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const stepValue = useAtomValue(movementStepValueAtom);

    return (
        <MoveButton
            gameMapId={gameMapId}
            action={(point) => point.movedTop(stepValue)}
        >
            <ChevronUp className={largeIconClassName} />
        </MoveButton>
    );
};

const MoveLeftButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const stepValue = useAtomValue(movementStepValueAtom);

    return (
        <MoveButton
            gameMapId={gameMapId}
            action={(point) => point.movedLeft(stepValue)}
        >
            <ChevronLeft className={largeIconClassName} />
        </MoveButton>
    );
};

const MoveBottomButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const stepValue = useAtomValue(movementStepValueAtom);

    return (
        <MoveButton
            gameMapId={gameMapId}
            action={(point) => point.movedBottom(stepValue)}
        >
            <ChevronDown className={largeIconClassName} />
        </MoveButton>
    );
};

const MoveRightButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const stepValue = useAtomValue(movementStepValueAtom);

    return (
        <MoveButton
            gameMapId={gameMapId}
            action={(point) => point.movedRight(stepValue)}
        >
            <ChevronRight className={largeIconClassName} />
        </MoveButton>
    );
};

const MoveButton = ({
    gameMapId,
    action,
    children,
}: {
    gameMapId: GameMapId;
    action: (point: Point) => Point;
    children: ReactNode;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            let newGameMapShapes = gameMap.gameMapShapes;
            selectionManager.boardItems.forEach((id) => {
                const gameMapShape = gameMap.gameMapShapes.find(id);
                if (gameMapShape == null) return;

                const newGameMapShape = gameMapShape.copyWith({
                    point: action(gameMapShape.point),
                });
                newGameMapShapes = newGameMapShapes.replaced(
                    id,
                    newGameMapShape,
                );
            });
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
        <LargeIconButton
            className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
            onClick={handleClick}
        >
            {children}
        </LargeIconButton>
    );
};

/* -------------------------------------------------------------------------- */

const StepSwitchButton = () => {
    const [stepValue, setStepValue] = useAtom(movementStepValueAtom);

    const handleClick = () => setStepValue((v) => (v === 1 ? 5 : 1));

    return (
        <LargeIconButton description="移動速度" onClick={handleClick}>
            <p className={`text-2xl tabular-nums ${Text.neutral100}`}>
                {stepValue}x
            </p>
        </LargeIconButton>
    );
};

const SelectedAllButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const setSelectionManager = useSetAtom(gameMapShapeSelectionManagerAtom);
    const setStepValue = useSetAtom(movementStepValueAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);

    if (gameMap == null) return <></>;

    const handleClick = () => {
        setSelectionManager((v) =>
            v.copyWith({
                boardItems: new GameMapShapeIdList(
                    ...gameMap.gameMapShapes.items.map((v) => v.id),
                ),
            }),
        );
        setStepValue(1);
    };

    return (
        <LargeIconButton description="全て選択" onClick={handleClick}>
            <p className={`text-2xl ${Text.neutral100}`}>All</p>
        </LargeIconButton>
    );
};
