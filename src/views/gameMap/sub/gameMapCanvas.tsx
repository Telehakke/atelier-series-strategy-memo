import { Button } from "@headlessui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { strategyMemoRepositoryAtom } from "../../../atoms";
import { GameMap, GameMapUtility } from "../../../models/gameMap";
import {
    GameMapGroup,
    GameMapGroupUtility,
} from "../../../models/gameMapGroup";
import { Bg, Border } from "../../commons/classNames";
import {
    SquareChevronDownIconButton,
    SquareChevronLeftIconButton,
    SquareChevronRightIconButton,
    SquareChevronUpIconButton,
} from "../../commons/iconButtons";

const GameMapCanvas = ({
    gameMapGroups,
    selectedIDInGameMapGroups,
    setSelectedIndexInGameMapGroups,
    selectedID,
    setSelectedID,
    className,
}: {
    gameMapGroups: GameMapGroup[];
    selectedIDInGameMapGroups: string | null;
    setSelectedIndexInGameMapGroups: React.Dispatch<
        React.SetStateAction<number>
    >;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    className?: string;
}) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const [fontSize, setFontSize] = useState("8px");
    const [stepValueOfMove, setStepValueOfMove] = useState(5);
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
    }, [canvas]);

    if (selectedIDInGameMapGroups == null) return <></>;

    const gameMapGroupsIndex = GameMapGroupUtility.findIndex(
        gameMapGroups,
        selectedIDInGameMapGroups,
    );
    if (gameMapGroupsIndex == null) return <></>;

    const gameMapGroup = gameMapGroups[gameMapGroupsIndex];

    const hasImage = (): boolean => {
        return gameMapGroup.image.length > 0;
    };

    const filteredGameMaps = (): GameMap[] => {
        if (selectedID == null) {
            return gameMapGroups[gameMapGroupsIndex].gameMaps;
        }

        return strategyMemo.gameMapGroups[gameMapGroupsIndex].gameMaps;
    };

    return (
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
            {hasImage() && (
                <img
                    className="absolute inset-0 size-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                    src={gameMapGroup.image}
                />
            )}
            <div
                className="absolute inset-0 size-full"
                onClick={() => setFontSize(fontSize === "8px" ? "16px" : "8px")}
            ></div>
            {filteredGameMaps().map((v) => (
                <Card
                    className={`absolute -translate-1/2 p-px text-center text-nowrap data-[hover]:scale-150 ${v.id === selectedID ? Bg.blue200 : Bg.neutral50_70} ${selectedID == null || v.id === selectedID ? "" : "opacity-70"}`}
                    key={v.id}
                    gameMapGroups={gameMapGroups}
                    gameMap={v}
                    selectedID={selectedID}
                    setSelectedID={setSelectedID}
                    setSelectedIndexInGameMapGroups={
                        setSelectedIndexInGameMapGroups
                    }
                    fontSize={fontSize}
                />
            ))}
            <MoveUpButton
                selectedIDInGameMapGroup={selectedIDInGameMapGroups}
                selectedID={selectedID}
                stepValueOfMove={stepValueOfMove}
                className={`absolute top-0 left-1/2 -translate-x-1/2 ${Bg.neutral200}`}
            />
            <MoveLeftButton
                selectedIDInGameMapGroup={selectedIDInGameMapGroups}
                selectedID={selectedID}
                stepValueOfMove={stepValueOfMove}
                className={`absolute top-1/2 left-0 -translate-y-1/2 ${Bg.neutral200}`}
            />
            <MoveRightButton
                selectedIDInGameMapGroup={selectedIDInGameMapGroups}
                selectedID={selectedID}
                stepValueOfMove={stepValueOfMove}
                className={`absolute top-1/2 right-0 -translate-y-1/2 ${Bg.neutral200}`}
            />
            <MoveDownButton
                selectedIDInGameMapGroup={selectedIDInGameMapGroups}
                selectedID={selectedID}
                stepValueOfMove={stepValueOfMove}
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${Bg.neutral200}`}
            />
            <SwitchStepButton
                selectedID={selectedID}
                stepValueOfMove={stepValueOfMove}
                setStepValueOfMove={setStepValueOfMove}
            />
        </div>
    );
};

export default GameMapCanvas;

/* -------------------------------------------------------------------------- */

const Card = ({
    gameMapGroups,
    gameMap,
    selectedID,
    setSelectedID,
    setSelectedIndexInGameMapGroups,
    fontSize,
    className,
}: {
    gameMapGroups: GameMapGroup[];
    gameMap: GameMap;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedIndexInGameMapGroups: React.Dispatch<
        React.SetStateAction<number>
    >;
    fontSize: string;
    className?: string;
}) => {
    return (
        <Button
            className={className}
            key={gameMap.id}
            style={{ left: `${gameMap.x}%`, top: `${gameMap.y}%` }}
            onClick={() => {
                const gotoIndex = GameMapGroupUtility.findIndex(
                    gameMapGroups,
                    gameMap.goto,
                );
                if (gotoIndex != null) {
                    setSelectedIndexInGameMapGroups(gotoIndex);
                    return;
                }

                setSelectedID(gameMap.id === selectedID ? null : gameMap.id);
            }}
        >
            <p style={{ fontSize: fontSize }}>{gameMap.icon}</p>
            <p style={{ fontSize: fontSize }}>{gameMap.name}</p>
        </Button>
    );
};

/* -------------------------------------------------------------------------- */

const MoveUpButton = ({
    selectedIDInGameMapGroup,
    selectedID,
    stepValueOfMove,
    className,
}: {
    selectedIDInGameMapGroup: string | null;
    selectedID: string | null;
    stepValueOfMove: number;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroup == null) return <></>;
    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.additionXY(v, selectedIDInGameMapGroup, selectedID, {
                x: 0,
                y: -stepValueOfMove,
            }),
        );
    };

    return (
        <SquareChevronUpIconButton
            className={className}
            onClick={() => handleButtonClick()}
        />
    );
};

const MoveLeftButton = ({
    selectedIDInGameMapGroup,
    selectedID,
    stepValueOfMove,
    className,
}: {
    selectedIDInGameMapGroup: string | null;
    selectedID: string | null;
    stepValueOfMove: number;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroup == null) return <></>;
    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.additionXY(v, selectedIDInGameMapGroup, selectedID, {
                x: -stepValueOfMove,
                y: 0,
            }),
        );
    };

    return (
        <SquareChevronLeftIconButton
            className={className}
            onClick={() => handleButtonClick()}
        />
    );
};

const MoveRightButton = ({
    selectedIDInGameMapGroup,
    selectedID,
    stepValueOfMove,
    className,
}: {
    selectedIDInGameMapGroup: string | null;
    selectedID: string | null;
    stepValueOfMove: number;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroup == null) return <></>;
    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.additionXY(v, selectedIDInGameMapGroup, selectedID, {
                x: stepValueOfMove,
                y: 0,
            }),
        );
    };

    return (
        <SquareChevronRightIconButton
            className={className}
            onClick={() => handleButtonClick()}
        />
    );
};

const MoveDownButton = ({
    selectedIDInGameMapGroup,
    selectedID,
    stepValueOfMove,
    className,
}: {
    selectedIDInGameMapGroup: string | null;
    selectedID: string | null;
    stepValueOfMove: number;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroup == null) return <></>;
    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.additionXY(v, selectedIDInGameMapGroup, selectedID, {
                x: 0,
                y: stepValueOfMove,
            }),
        );
    };

    return (
        <SquareChevronDownIconButton
            className={className}
            onClick={() => handleButtonClick()}
        />
    );
};

const SwitchStepButton = ({
    selectedID,
    stepValueOfMove,
    setStepValueOfMove,
}: {
    selectedID: string | null;
    stepValueOfMove: number;
    setStepValueOfMove: React.Dispatch<React.SetStateAction<number>>;
}) => {
    if (selectedID == null) return <></>;

    return (
        <Button
            className={`absolute right-0 bottom-0 size-10 rounded-full ${Bg.neutral200} ${Bg.hoverNeutral300}`}
            onClick={() => setStepValueOfMove(stepValueOfMove === 1 ? 5 : 1)}
        >
            {stepValueOfMove}x
        </Button>
    );
};
