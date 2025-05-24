import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    gameMapDetailSelectionManagerAtom,
    gameMapsAtom,
    isReadonlyAtom,
    movementStepValueAtom,
    selectedGameMapIdAtom,
    strategyMemoAtom,
} from "../../../atoms";

import LocalStorage from "../../../models/localStorage";

import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
} from "lucide-react";
import { ReactNode } from "react";
import { Point } from "../../../models/dataClasses";
import { GameMapId } from "../../../models/gameMap";
import { GameMapDetailIdList } from "../../../models/gameMapDetail";
import { ControllerTypeEnum } from "../../../models/itemSelectionManager";
import { Bg, Stroke, Text } from "../../commons/classNames";
import {
    LargeIconButton,
    largeIconClassName,
    XIconLargeButton,
} from "../../commons/iconButtons";

const GameMapDetailBoardController = ({
    className,
}: {
    className?: string;
}) => {
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    if (selectedGameMapId == null) return <></>;

    if (selectionManager.controllerType !== ControllerTypeEnum.board)
        return <></>;

    const HStack = ({ children }: { children: ReactNode }) => (
        <div className="flex gap-4">{children}</div>
    );
    const VStack = ({ children }: { children: ReactNode }) => (
        <div className="flex flex-col items-center gap-4">{children}</div>
    );

    return (
        <div className={className}>
            <VStack>
                <MoveTopButton gameMapId={selectedGameMapId} />
                <HStack>
                    <MoveLeftButton gameMapId={selectedGameMapId} />
                    <MoveBottomButton gameMapId={selectedGameMapId} />
                    <MoveRightButton gameMapId={selectedGameMapId} />
                </HStack>
                <HStack>
                    <StepSwitchButton />
                    <SelectedAllButton gameMapId={selectedGameMapId} />
                    <XButton />
                </HStack>
            </VStack>
        </div>
    );
};

export default GameMapDetailBoardController;

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
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMapDetails = selectionManager.boardItems.reduce(
                (gameMapDetails, id) => {
                    const gameMapDetail = gameMap.gameMapDetails.find(id);
                    if (gameMapDetail == null) return gameMapDetails;

                    const newGameMapDetail = gameMapDetail.copyWith({
                        point: action(gameMapDetail.point),
                    });
                    return gameMapDetails.replaced(newGameMapDetail);
                },
                gameMap.gameMapDetails,
            );
            const newStrategyMemo = v.replacedGameMapDetails(
                gameMap,
                newGameMapDetails,
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
    const setSelectionManager = useSetAtom(gameMapDetailSelectionManagerAtom);
    const setStepValue = useSetAtom(movementStepValueAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    if (gameMap == null) return <></>;

    const handleClick = () => {
        setSelectionManager((v) =>
            v.copyWith({
                boardItems: new GameMapDetailIdList(
                    ...gameMap.gameMapDetails.items.map((v) => v.id),
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

const XButton = () => {
    const setSelectionManager = useSetAtom(gameMapDetailSelectionManagerAtom);

    const handleClick = () =>
        setSelectionManager((v) =>
            v.copyWith({ boardItems: new GameMapDetailIdList() }),
        );

    return <XIconLargeButton description="選択解除" onClick={handleClick} />;
};
