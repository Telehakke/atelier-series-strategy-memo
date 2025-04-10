import { Button } from "@headlessui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { strategyMemoRepositoryAtom } from "../../../atoms";
import { GameMap, GameMapUtility } from "../../../models/gameMap";
import {
    GameMapGroup,
    GameMapGroupUtility,
} from "../../../models/gameMapGroup";
import { Bg, Border, Shadow } from "../../commons/classNames";
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
            {filteredGameMaps().map((v) => (
                <Card
                    className={`absolute -translate-1/2 p-px text-center text-[8px] text-nowrap shadow-md data-[hover]:border-1 ${Border.neutral950} ${Shadow.neutral200} ${v.id === selectedID ? Bg.blue200 : Bg.neutral50_70} ${selectedID == null || v.id === selectedID ? "" : "opacity-70"}`}
                    key={v.id}
                    gameMapGroups={gameMapGroups}
                    gameMap={v}
                    selectedID={selectedID}
                    setSelectedID={setSelectedID}
                    setSelectedIndexInGameMapGroups={
                        setSelectedIndexInGameMapGroups
                    }
                />
            ))}
            <MoveUpButton
                selectedIDInGameMapGroup={selectedIDInGameMapGroups}
                selectedID={selectedID}
                className={`absolute top-0 left-1/2 -translate-x-1/2 ${Bg.neutral50}`}
            />
            <MoveLeftButton
                selectedIDInGameMapGroup={selectedIDInGameMapGroups}
                selectedID={selectedID}
                className={`absolute top-1/2 left-0 -translate-y-1/2 ${Bg.neutral50}`}
            />
            <MoveRightButton
                selectedIDInGameMapGroup={selectedIDInGameMapGroups}
                selectedID={selectedID}
                className={`absolute top-1/2 right-0 -translate-y-1/2 ${Bg.neutral50}`}
            />
            <MoveDownButton
                selectedIDInGameMapGroup={selectedIDInGameMapGroups}
                selectedID={selectedID}
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${Bg.neutral50}`}
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
    className,
}: {
    gameMapGroups: GameMapGroup[];
    gameMap: GameMap;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedIndexInGameMapGroups: React.Dispatch<
        React.SetStateAction<number>
    >;
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
            <p>{gameMap.icon}</p>
            <p>{gameMap.name}</p>
        </Button>
    );
};

/* -------------------------------------------------------------------------- */

const MoveUpButton = ({
    selectedIDInGameMapGroup,
    selectedID,
    className,
}: {
    selectedIDInGameMapGroup: string | null;
    selectedID: string | null;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroup == null) return <></>;
    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.additionXY(v, selectedIDInGameMapGroup, selectedID, {
                x: 0,
                y: -5,
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
    className,
}: {
    selectedIDInGameMapGroup: string | null;
    selectedID: string | null;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroup == null) return <></>;
    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.additionXY(v, selectedIDInGameMapGroup, selectedID, {
                x: -5,
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
    className,
}: {
    selectedIDInGameMapGroup: string | null;
    selectedID: string | null;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroup == null) return <></>;
    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.additionXY(v, selectedIDInGameMapGroup, selectedID, {
                x: 5,
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
    className,
}: {
    selectedIDInGameMapGroup: string | null;
    selectedID: string | null;
    className?: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroup == null) return <></>;
    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.additionXY(v, selectedIDInGameMapGroup, selectedID, {
                x: 0,
                y: 5,
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
