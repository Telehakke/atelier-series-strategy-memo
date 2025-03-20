import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import {
    canvasScaleAtom,
    gameMapsAtom,
    isGameMapDetailEditModeAtom,
    selectedGameMapIdAtom,
} from "../../../atoms";

import { GameMapId } from "../../../models/gameMap";
import { Bg, Border } from "../../commons/classNames";
import GameMapDetailBoard from "./gameMapDetailBoard";
import GameMapShapeBoard from "./gameMapShapeBoard";

const GameMapCanvas = ({ className }: { className?: string }) => {
    const divElement = useRef<HTMLDivElement | null>(null);
    const isGameMapDetailEditMode = useAtomValue(isGameMapDetailEditModeAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    const setCanvasScale = useSetAtom(canvasScaleAtom);

    useEffect(() => {
        // キャンバスがリサイズされたら縮小率を記録する
        const observer = new ResizeObserver((entries) => {
            entries.forEach((e) => {
                const width = e.target.getBoundingClientRect().width;
                setCanvasScale(width / 600);
            });
        });
        if (divElement.current != null) {
            observer.observe(divElement.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [setCanvasScale]);

    if (selectedGameMapId == null) return <></>;

    return (
        <div
            className={`relative mx-auto max-w-150 overflow-clip border-1 ${Bg.neutral50_950} ${Border.neutral950_300} ${className}`}
            ref={divElement}
        >
            <Canvas />
            <Image
                className="absolute inset-0 size-full object-contain"
                gameMapId={selectedGameMapId}
            />
            {/* マップの図形を編集中は、マップ詳細ラベルのレイヤーを下げる */}
            {!isGameMapDetailEditMode && (
                <>
                    <div className="opacity-30">
                        <GameMapDetailBoard gameMapId={selectedGameMapId} />
                    </div>
                    <div className="absolute inset-0 size-full"></div>
                </>
            )}
            <GameMapShapeBoard gameMapId={selectedGameMapId} />
            {isGameMapDetailEditMode && (
                <GameMapDetailBoard gameMapId={selectedGameMapId} />
            )}
        </div>
    );
};

export default GameMapCanvas;

/* -------------------------------------------------------------------------- */

const Canvas = () => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const length = 200;

    useEffect(() => {
        // 方眼を描く
        if (canvas.current == null) return;

        const ctx = canvas.current.getContext("2d");
        if (ctx == null) return;

        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 1;
        const step = length / 10;
        for (let i = step + 0.5; i <= length; i += step) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, length);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(length, i);
            ctx.stroke();
            ctx.closePath();
        }
    }, [canvas]);

    return (
        <canvas
            className="size-full dark:invert"
            ref={canvas}
            width={`${length}px`}
            height={`${length}px`}
            style={{ imageRendering: "pixelated" }}
        />
    );
};

/* -------------------------------------------------------------------------- */

const Image = ({
    gameMapId,
    className,
}: {
    gameMapId: GameMapId;
    className?: string;
}) => {
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    if (gameMap == null) return <></>;

    if (gameMap.image.length === 0) return <></>;

    return (
        <img
            className={className}
            style={{ imageRendering: "pixelated" }}
            src={gameMap.image}
        />
    );
};
