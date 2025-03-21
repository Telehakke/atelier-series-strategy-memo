import { Button } from "@headlessui/react";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { GameMapUtility, GameMapWithID } from "../../../models/gameMap";
import { GameMapGroupWithID } from "../../../models/gameMapGroup";
import { StrategyMemoUtility } from "../../../models/strategyMemo";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
import { Bg, Border, Shadow } from "../../commons/classNames";
import {
    SquareChevronDownIconButton,
    SquareChevronLeftIconButton,
    SquareChevronRightIconButton,
    SquareChevronUpIconButton,
} from "../../commons/iconButtons";

const GameMapCanvas = ({
    gameMapGroup,
    gameMapGroupsIndex,
    className,
}: {
    gameMapGroup?: GameMapGroupWithID;
    gameMapGroupsIndex?: number;
    className?: string;
}) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // 方眼を描く
        const ctx = canvas.current?.getContext("2d");
        if (ctx == null) return;

        ctx.strokeStyle = "#7f7f7f";
        ctx.lineWidth = 2;
        for (let i = 100; i <= 900; i += 100) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 1000);
            ctx.stroke();

            ctx.moveTo(0, i);
            ctx.lineTo(1000, i);
            ctx.stroke();
        }
    }, [gameMapGroup]);

    if (gameMapGroup == null || gameMapGroupsIndex == null) return <></>;

    return (
        <>
            <div
                className={`relative mx-auto aspect-square max-w-150 overflow-clip border-1 ${Bg.neutral50} ${Border.neutral950} ${className}`}
            >
                <canvas
                    className="size-full opacity-20"
                    ref={canvas}
                    width="1000px"
                    height="1000px"
                />

                {gameMapGroup.gameMaps.map((v) => (
                    <Card
                        className={`absolute -translate-1/2 p-1 text-center text-[8px] text-nowrap shadow-md data-[hover]:border-1 ${Border.neutral950} ${Shadow.neutral200} ${v.id === selectedID ? Bg.blue200 : Bg.neutral50}`}
                        key={v.id}
                        gameMap={v}
                        selectedID={selectedID}
                        setSelectedID={setSelectedID}
                    />
                ))}
                {selectedID != null &&
                gameMapGroup.gameMaps.some((v) => v.id === selectedID) ? (
                    <>
                        <MoveUpButton
                            gameMapGroupsIndex={gameMapGroupsIndex}
                            selectedID={selectedID}
                            className={`absolute top-0 left-1/2 -translate-x-1/2 ${Bg.neutral50}`}
                        />
                        <MoveLeftButton
                            gameMapGroupsIndex={gameMapGroupsIndex}
                            selectedID={selectedID}
                            className={`absolute top-1/2 left-0 -translate-y-1/2 ${Bg.neutral50}`}
                        />

                        <MoveRightButton
                            gameMapGroupsIndex={gameMapGroupsIndex}
                            selectedID={selectedID}
                            className={`absolute top-1/2 right-0 -translate-y-1/2 ${Bg.neutral50}`}
                        />
                        <MoveDownButton
                            gameMapGroupsIndex={gameMapGroupsIndex}
                            selectedID={selectedID}
                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${Bg.neutral50}`}
                        />
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

export default GameMapCanvas;

/* -------------------------------------------------------------------------- */

const Card = ({
    gameMap,
    selectedID,
    setSelectedID,
    className,
}: {
    gameMap: GameMapWithID;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    className?: string;
}) => {
    return (
        <Button
            className={className}
            key={gameMap.id}
            style={{ left: `${gameMap.x}%`, top: `${gameMap.y}%` }}
            onClick={() => {
                setSelectedID(gameMap.id === selectedID ? null : gameMap.id);
            }}
        >
            <p>{gameMap.icon}</p>
            <p>{gameMap.name}</p>
        </Button>
    );
};

const MoveUpButton = ({
    gameMapGroupsIndex,
    selectedID,
    className,
}: {
    gameMapGroupsIndex: number;
    selectedID: string;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) => {
            const index = GameMapUtility.findIndex(
                v,
                gameMapGroupsIndex,
                selectedID,
            );
            if (index == null) return v;

            return StrategyMemoUtility.additionGameMapXY(
                v,
                gameMapGroupsIndex,
                index,
                0,
                -5,
            );
        });
    };

    return (
        <SquareChevronUpIconButton
            className={className}
            onClick={() => handleButtonClick()}
        />
    );
};

const MoveLeftButton = ({
    gameMapGroupsIndex,
    selectedID,
    className,
}: {
    gameMapGroupsIndex: number;
    selectedID: string;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) => {
            const index = GameMapUtility.findIndex(
                v,
                gameMapGroupsIndex,
                selectedID,
            );
            if (index == null) return v;

            return StrategyMemoUtility.additionGameMapXY(
                v,
                gameMapGroupsIndex,
                index,
                -5,
                0,
            );
        });
    };

    return (
        <SquareChevronLeftIconButton
            className={className}
            onClick={() => handleButtonClick()}
        />
    );
};

const MoveRightButton = ({
    gameMapGroupsIndex,
    selectedID,
    className,
}: {
    gameMapGroupsIndex: number;
    selectedID: string;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) => {
            const index = GameMapUtility.findIndex(
                v,
                gameMapGroupsIndex,
                selectedID,
            );
            if (index == null) return v;

            return StrategyMemoUtility.additionGameMapXY(
                v,
                gameMapGroupsIndex,
                index,
                5,
                0,
            );
        });
    };

    return (
        <SquareChevronRightIconButton
            className={className}
            onClick={() => handleButtonClick()}
        />
    );
};

const MoveDownButton = ({
    gameMapGroupsIndex,
    selectedID,
    className,
}: {
    gameMapGroupsIndex: number;
    selectedID: string;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) => {
            const index = GameMapUtility.findIndex(
                v,
                gameMapGroupsIndex,
                selectedID,
            );
            if (index == null) return v;

            return StrategyMemoUtility.additionGameMapXY(
                v,
                gameMapGroupsIndex,
                index,
                0,
                5,
            );
        });
    };

    return (
        <SquareChevronDownIconButton
            className={className}
            onClick={() => handleButtonClick()}
        />
    );
};
