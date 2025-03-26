import { Button } from "@headlessui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { GameMapUtility, GameMapWithID } from "../../../models/gameMap";
import { GameMapGroupWithID } from "../../../models/gameMapGroup";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
import { Bg, Border, Shadow } from "../../commons/classNames";
import {
    SquareChevronDownIconButton,
    SquareChevronLeftIconButton,
    SquareChevronRightIconButton,
    SquareChevronUpIconButton,
} from "../../commons/iconButtons";

const GameMapCanvas = ({
    filteredGameMapGroup,
    gameMapGroupsIndex,
    selectedID,
    setSelectedID,
    className,
}: {
    filteredGameMapGroup?: GameMapGroupWithID;
    gameMapGroupsIndex?: number;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    className?: string;
}) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // 方眼を描く
        const ctx = canvas.current?.getContext("2d");
        if (ctx == null) return;

        ctx.strokeStyle = "#7f7f7f";
        ctx.lineWidth = 1;
        for (let i = 20.5; i <= 200; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 200);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(200, i);
            ctx.stroke();
            ctx.closePath();
        }
    }, [filteredGameMapGroup]);

    if (filteredGameMapGroup == null || gameMapGroupsIndex == null)
        return <></>;

    const gameMapGroup = strategyMemo.gameMapGroups[gameMapGroupsIndex];

    return (
        <>
            <div
                className={`relative mx-auto aspect-square max-w-150 overflow-clip border-1 ${Bg.neutral50} ${Border.neutral950} ${className}`}
            >
                <canvas
                    className="size-full opacity-20"
                    ref={canvas}
                    width="200px"
                    height="200px"
                    style={{ imageRendering: "pixelated" }}
                />
                {gameMapGroup.image.length > 0 && (
                    <img
                        className="absolute inset-0 size-full"
                        style={{ imageRendering: "pixelated" }}
                        src={gameMapGroup.image}
                    />
                )}
                {gameMapGroup.gameMaps
                    .filter((gameMap) => {
                        if (selectedID != null) return true;
                        return filteredGameMapGroup.gameMaps.some(
                            (filteredGameMap) =>
                                gameMap.id === filteredGameMap.id,
                        );
                    })
                    .map((v) => (
                        <Card
                            className={`absolute -translate-1/2 p-1 text-center text-[8px] text-nowrap shadow-md data-[hover]:border-1 ${Border.neutral950} ${Shadow.neutral200} ${v.id === selectedID ? Bg.blue200 : Bg.neutral50}`}
                            key={v.id}
                            gameMap={v}
                            selectedID={selectedID}
                            setSelectedID={setSelectedID}
                        />
                    ))}
                {selectedID != null &&
                filteredGameMapGroup.gameMaps.some(
                    (v) => v.id === selectedID,
                ) ? (
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

            return GameMapUtility.additionXY(
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

            return GameMapUtility.additionXY(
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

            return GameMapUtility.additionXY(
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

            return GameMapUtility.additionXY(
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
