import { useAtomValue, useSetAtom } from "jotai";
import { Minus, Pencil, Plus, ZoomIn, ZoomOut } from "lucide-react";
import { JSX, ReactNode, useState } from "react";
import {
    gameMapsAtom,
    gameMapShapeSelectionManagerAtom,
    strategyMemoAtom,
} from "../../../../atoms";
import { Scale, Thickness } from "../../../../models/dataClasses";

import {
    GameMapShapeId,
    GameMapShapeUtility,
    ShapeColorEnum,
} from "../../../../models/gameMapShape";
import LocalStorage from "../../../../models/localStorage";

import { GameMapId } from "../../../../models/gameMap";
import { Bg, Stroke } from "../../../commons/classNames";
import {
    ChartPieIconLargeButton,
    FlipHorizontal2IconLargeButton,
    LargeIconButton,
    largeIconClassName,
    Link2IconLargeButton,
    MoveHorizontalIconLargeButton,
    MoveVerticalIconLargeButton,
    PaintBucketIconLargeButton,
    RotateCwIconLargeButton,
} from "../../../commons/iconButtons";

const ShapeAdjustmentController = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    if (selectionManager.boardItems.length !== 1) return <></>;

    const gameMapShapeId = selectionManager.boardItems.at(0)!;

    return (
        <div className="flex gap-4">
            <div className={`flex flex-col gap-4`}>
                <IncreaseLineWidthButton
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                />
                <DecreaseLineWidthButton
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                />
            </div>
            <div className="flex flex-col gap-4">
                <FillButton
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                />
                <ChangeColorButton
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <FlipButton
                        gameMapId={gameMapId}
                        gameMapShapeId={gameMapShapeId}
                    />
                    <RotateButton
                        gameMapId={gameMapId}
                        gameMapShapeId={gameMapShapeId}
                    />
                    <IncreaseDisplayAreaButton
                        gameMapId={gameMapId}
                        gameMapShapeId={gameMapShapeId}
                    />
                </div>
                <ZoomButtons
                    gameMapId={gameMapId}
                    gameMapShapeId={gameMapShapeId}
                />
            </div>
        </div>
    );
};

export default ShapeAdjustmentController;

/* -------------------------------------------------------------------------- */

const IncreaseLineWidthButton = ({
    gameMapId,
    gameMapShapeId,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
}) => {
    return (
        <ChangeLineWidthButton
            gameMapId={gameMapId}
            gameMapShapeId={gameMapShapeId}
            description="線を太く"
            action={(thickness) => thickness.increased()}
        >
            <>
                <Pencil className={`absolute inset-0 ${largeIconClassName}`} />
                <Plus
                    className={`absolute right-1 bottom-1 ${Stroke.neutral50}`}
                />
            </>
        </ChangeLineWidthButton>
    );
};

const DecreaseLineWidthButton = ({
    gameMapId,
    gameMapShapeId,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
}) => {
    return (
        <ChangeLineWidthButton
            gameMapId={gameMapId}
            gameMapShapeId={gameMapShapeId}
            description="線を細く"
            action={(thickness) => thickness.decreased()}
        >
            <>
                <Pencil className={`absolute inset-0 ${largeIconClassName}`} />
                <Minus
                    className={`absolute right-1 bottom-1 ${Stroke.neutral50}`}
                />
            </>
        </ChangeLineWidthButton>
    );
};

const ChangeLineWidthButton = ({
    gameMapId,
    gameMapShapeId,
    description,
    action,
    children,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
    description: string;
    action: (thickness: Thickness) => Thickness;
    children: ReactNode;
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
                thickness: action(gameMapShape.thickness),
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
        <LargeIconButton
            className={`relative ${Bg.yellow500} ${Bg.hoverYellow400} ${Stroke.neutral50}`}
            description={description}
            onClick={handleClick}
        >
            {children}
        </LargeIconButton>
    );
};

/* -------------------------------------------------------------------------- */

const FillButton = ({
    gameMapId,
    gameMapShapeId,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    if (gameMap == null) return <></>;

    const gameMapShape = gameMap.gameMapShapes.find(gameMapShapeId);
    if (gameMapShape == null) return <></>;

    const handleClick = () => {
        setStrategyMemo((v) => {
            const newGameMapShape = gameMapShape.copyWith({
                fill: !gameMapShape.fill,
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

    const backgroundColor = gameMapShape.fill
        ? `${Bg.blue500} ${Bg.hoverBlue400}`
        : `${Bg.neutral500} ${Bg.hoverNeutral400}`;

    return (
        <PaintBucketIconLargeButton
            className={`${backgroundColor} ${Stroke.neutral50}`}
            description="塗りつぶし"
            onClick={handleClick}
        />
    );
};

/* -------------------------------------------------------------------------- */

const ChangeColorButton = ({
    gameMapId,
    gameMapShapeId,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    if (gameMap == null) return <></>;

    const gameMapShape = gameMap.gameMapShapes.find(gameMapShapeId);
    if (gameMapShape == null) return <></>;

    const handleClick = () => {
        setStrategyMemo((v) => {
            const color = gameMapShape.color;
            const nextColor = GameMapShapeUtility.nextShapeColor(color);
            const newGameMapShape = gameMapShape.copyWith({ color: nextColor });
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
        <LargeIconButton
            className={`relative ${Bg.neutral500} ${Bg.hoverNeutral400} ${Stroke.neutral50}`}
            description={GameMapShapeUtility.translateShapeColor(
                gameMapShape.color,
            )}
            onClick={handleClick}
        >
            <div
                className="absolute inset-0 m-auto size-10 rounded-full"
                style={{ backgroundColor: gameMapShape.color }}
            />
            {gameMapShape.color === ShapeColorEnum.currentColor.value && (
                <div className="absolute inset-0 m-auto size-10 rounded-full bg-linear-to-r from-black from-50% to-white to-50%" />
            )}
        </LargeIconButton>
    );
};

/* -------------------------------------------------------------------------- */

type ZoomModeDetail = {
    value: ZoomMode;
    zoomIn: (scale: Scale) => Scale;
    zoomOut: (scale: Scale) => Scale;
    ChangeZoomModeButton: (
        setZoomModeDetail: React.Dispatch<React.SetStateAction<ZoomModeDetail>>,
    ) => JSX.Element;
};

const ZoomModeEnum: {
    readonly x: ZoomModeDetail;
    readonly y: ZoomModeDetail;
    readonly xy: ZoomModeDetail;
} = {
    x: {
        value: "x",
        zoomIn: (scale) => scale.zoomInX(),
        zoomOut: (scale) => scale.zoomOutX(),
        ChangeZoomModeButton: (setZoomModeDetail) => (
            <MoveHorizontalIconLargeButton
                className={`${Bg.yellow500} ${Bg.hoverYellow400} ${Stroke.neutral50}`}
                description="ズームx"
                onClick={() => setZoomModeDetail(ZoomModeEnum.y)}
            />
        ),
    },
    y: {
        value: "y",
        zoomIn: (scale) => scale.zoomInY(),
        zoomOut: (scale) => scale.zoomOutY(),
        ChangeZoomModeButton: (setZoomModeDetail) => (
            <MoveVerticalIconLargeButton
                className={`${Bg.yellow500} ${Bg.hoverYellow400} ${Stroke.neutral50}`}
                description="ズームy"
                onClick={() => setZoomModeDetail(ZoomModeEnum.xy)}
            />
        ),
    },
    xy: {
        value: "xy",
        zoomIn: (scale) => scale.zoomInXY(),
        zoomOut: (scale) => scale.zoomOutXY(),
        ChangeZoomModeButton: (setZoomModeDetail) => (
            <Link2IconLargeButton
                className={`${Bg.yellow500} ${Bg.hoverYellow400} ${Stroke.neutral50}`}
                description="ズームxy"
                onClick={() => setZoomModeDetail(ZoomModeEnum.x)}
            />
        ),
    },
} as const;

type ZoomMode = keyof typeof ZoomModeEnum;

const ZoomButtons = ({
    gameMapId,
    gameMapShapeId,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
}) => {
    const [zoomModeDetail, setZoomModeDetail] = useState<ZoomModeDetail>(
        ZoomModeEnum.xy,
    );

    return (
        <div className="flex gap-4">
            {zoomModeDetail.ChangeZoomModeButton(setZoomModeDetail)}
            <ZoomOutButton
                gameMapId={gameMapId}
                gameMapShapeId={gameMapShapeId}
                zoomModeDetail={zoomModeDetail}
            />
            <ZoomInButton
                gameMapId={gameMapId}
                gameMapShapeId={gameMapShapeId}
                zoomModeDetail={zoomModeDetail}
            />
        </div>
    );
};

const ZoomInButton = ({
    gameMapId,
    gameMapShapeId,
    zoomModeDetail,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
    zoomModeDetail: ZoomModeDetail;
}) => {
    return (
        <ChangeZoomButton
            gameMapId={gameMapId}
            gameMapShapeId={gameMapShapeId}
            description="拡大"
            action={(scale) => zoomModeDetail.zoomIn(scale)}
        >
            <ZoomIn className={largeIconClassName} />
        </ChangeZoomButton>
    );
};

const ZoomOutButton = ({
    gameMapId,
    gameMapShapeId,
    zoomModeDetail: zoomModeDetail,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
    zoomModeDetail: ZoomModeDetail;
}) => {
    return (
        <ChangeZoomButton
            gameMapId={gameMapId}
            gameMapShapeId={gameMapShapeId}
            description="縮小"
            action={(scale) => zoomModeDetail.zoomOut(scale)}
        >
            <ZoomOut className={largeIconClassName} />
        </ChangeZoomButton>
    );
};

const ChangeZoomButton = ({
    gameMapId,
    gameMapShapeId,
    description,
    action,
    children,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
    description: string;
    action: (scale: Scale) => Scale;
    children: ReactNode;
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
                scale: action(gameMapShape.scale),
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
        <LargeIconButton
            className={`${Bg.yellow500} ${Bg.hoverYellow400} ${Stroke.neutral50}`}
            description={description}
            onClick={handleClick}
        >
            {children}
        </LargeIconButton>
    );
};

/* -------------------------------------------------------------------------- */

const RotateButton = ({
    gameMapId,
    gameMapShapeId,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
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
                angle: gameMapShape.angle.rotated(),
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
        <RotateCwIconLargeButton
            className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
            description="回転"
            onClick={handleClick}
        />
    );
};

/* -------------------------------------------------------------------------- */

const FlipButton = ({
    gameMapId,
    gameMapShapeId,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    if (gameMap == null) return <></>;

    const gameMapShape = gameMap.gameMapShapes.find(gameMapShapeId);
    if (gameMapShape == null) return <></>;

    const handleClick = () => {
        setStrategyMemo((v) => {
            const newGameMapShape = gameMapShape.copyWith({
                flip: !gameMapShape.flip,
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

    const backgroundColor = gameMapShape.flip
        ? `${Bg.blue500} ${Bg.hoverBlue400}`
        : `${Bg.neutral500} ${Bg.hoverNeutral400}`;

    return (
        <FlipHorizontal2IconLargeButton
            className={`${backgroundColor} ${Stroke.neutral50}`}
            description="左右反転"
            onClick={handleClick}
        />
    );
};

/* -------------------------------------------------------------------------- */

const IncreaseDisplayAreaButton = ({
    gameMapId,
    gameMapShapeId,
}: {
    gameMapId: GameMapId;
    gameMapShapeId: GameMapShapeId;
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
                progress: gameMapShape.progress.increased(),
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
        <ChartPieIconLargeButton
            className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
            description="描画範囲"
            onClick={handleClick}
        />
    );
};
