import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    gameMapsAtom,
    gameMapShapeSelectionManagerAtom,
    isReadonlyAtom,
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
    const HStack = ({ children }: { children: ReactNode }) => (
        <div className="flex gap-4">{children}</div>
    );

    const VStack = ({ children }: { children: ReactNode }) => (
        <div className="flex flex-col items-center gap-4">{children}</div>
    );

    return (
        <HStack>
            <VStack>
                <SelectedAllButton gameMapId={gameMapId} />
                <StepSwitchButton />
            </VStack>
            <VStack>
                <MoveTopButton gameMapId={gameMapId} />
                <HStack>
                    <MoveLeftButton gameMapId={gameMapId} />
                    <MoveBottomButton gameMapId={gameMapId} />
                    <MoveRightButton gameMapId={gameMapId} />
                </HStack>
            </VStack>
        </HStack>
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
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMapShapes = selectionManager.boardItems.reduce(
                (gameMapShapes, id) => {
                    const gameMapShape = gameMap.gameMapShapes.find(id);
                    if (gameMapShape == null) return gameMapShapes;

                    const newGameMapShape = gameMapShape.copyWith({
                        point: action(gameMapShape.point),
                    });
                    return gameMapShapes.replaced(newGameMapShape);
                },
                gameMap.gameMapShapes,
            );
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
                    ...gameMap.gameMapShapes.map((v) => v.id),
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
