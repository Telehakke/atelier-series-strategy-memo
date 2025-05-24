import { useAtomValue, useSetAtom } from "jotai";
import {
    Link2,
    Minus,
    MoveHorizontal,
    MoveVertical,
    Pencil,
    Plus,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import { JSX, ReactNode, useState } from "react";
import {
    gameMapsAtom,
    gameMapShapeSelectionManagerAtom,
    isReadonlyAtom,
    strategyMemoAtom,
} from "../../../../atoms";
import { Scale, Thickness } from "../../../../models/dataClasses";

import {
    GameMapShape,
    GameMapShapeId,
    GameMapShapeUtility,
    ShapeColorEnum,
} from "../../../../models/gameMapShape";
import LocalStorage from "../../../../models/localStorage";

import { GameMapId } from "../../../../models/gameMap";
import { StrategyMemo } from "../../../../models/strategyMemo";
import { Bg, Stroke } from "../../../commons/classNames";
import {
    ChartPieIconLargeButton,
    FlipHorizontal2IconLargeButton,
    HorizontalSegmentedIconButton,
    LargeIconButton,
    largeIconClassName,
    middleIconClassName,
    PaintBucketIconLargeButton,
    RotateCwIconLargeButton,
    VerticalSegmentedIconButton,
} from "../../../commons/iconButtons";

type Id = { gameMapId: GameMapId; gameMapShapeId: GameMapShapeId };

const ShapeAdjustmentController = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    if (selectionManager.boardItems.length !== 1) return <></>;

    const gameMapShapeId = selectionManager.boardItems.at(0)!;
    const id: Id = { gameMapId: gameMapId, gameMapShapeId: gameMapShapeId };

    const HStack = ({ children }: { children: ReactNode }) => (
        <div className="flex gap-4">{children}</div>
    );

    const VStack = ({ children }: { children: ReactNode }) => (
        <div className="flex flex-col gap-4">{children}</div>
    );

    return (
        <HStack>
            <ChangeLineWidthButton id={id} />
            <VStack>
                <FillButton id={id} />
                <ChangeColorButton id={id} />
            </VStack>
            <VStack>
                <HStack>
                    <FlipButton id={id} />
                    <RotateButton id={id} />
                    <IncreaseDisplayAreaButton id={id} />
                </HStack>
                <ChangeZoomButton id={id} />
            </VStack>
        </HStack>
    );
};

export default ShapeAdjustmentController;

/* -------------------------------------------------------------------------- */

const replaced = (
    strategyMemo: StrategyMemo,
    id: Id,
    action: (gameMapShape: GameMapShape) => GameMapShape,
): StrategyMemo => {
    const gameMap = strategyMemo.gameMaps.find(id.gameMapId);
    if (gameMap == null) return strategyMemo;

    const gameMapShape = gameMap.gameMapShapes.find(id.gameMapShapeId);
    if (gameMapShape == null) return strategyMemo;

    const newGameMapShape = action(gameMapShape);
    const newGameMapShapes = gameMap.gameMapShapes.replaced(newGameMapShape);
    const newStrategyMemo = strategyMemo.replacedGameMapShapes(
        gameMap,
        newGameMapShapes,
    );
    return newStrategyMemo;
};

/* -------------------------------------------------------------------------- */

const ChangeLineWidthButton = ({ id }: { id: Id }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);

    const changeLineWidth = (action: (thickness: Thickness) => Thickness) => {
        setStrategyMemo((v) => {
            const newStrategyMemo = replaced(v, id, (gameMapShape) =>
                gameMapShape.copyWith({
                    thickness: action(gameMapShape.thickness),
                }),
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    const handleTopButtonClick = () =>
        changeLineWidth((thickness) => thickness.increased());

    const handleBottomButtonClick = () =>
        changeLineWidth((Thickness) => Thickness.decreased());

    const PenPlusIcon = () => (
        <div className={`relative size-full ${Stroke.neutral50}`}>
            <Pencil className={`absolute inset-0 ${largeIconClassName}`} />
            <Plus
                className={`absolute right-1 bottom-1 ${middleIconClassName}`}
            />
        </div>
    );

    const PenMinusIcon = () => (
        <div className={`relative size-full ${Stroke.neutral50}`}>
            <Pencil className={`absolute inset-0 ${largeIconClassName}`} />
            <Minus
                className={`absolute right-1 bottom-1 ${middleIconClassName}`}
            />
        </div>
    );

    return (
        <VerticalSegmentedIconButton
            description="線の太さ"
            topIcon={<PenPlusIcon />}
            bottomIcon={<PenMinusIcon />}
            onTopButtonClick={handleTopButtonClick}
            onBottomButtonClick={handleBottomButtonClick}
        />
    );
};

/* -------------------------------------------------------------------------- */

const FillButton = ({ id }: { id: Id }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(id.gameMapId);
    if (gameMap == null) return <></>;

    const gameMapShape = gameMap.gameMapShapes.find(id.gameMapShapeId);
    if (gameMapShape == null) return <></>;

    const handleClick = () => {
        setStrategyMemo((v) => {
            const newStrategyMemo = replaced(v, id, (gameMapShape) =>
                gameMapShape.copyWith({ fill: !gameMapShape.fill }),
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
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

const ChangeColorButton = ({ id }: { id: Id }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(id.gameMapId);
    if (gameMap == null) return <></>;

    const gameMapShape = gameMap.gameMapShapes.find(id.gameMapShapeId);
    if (gameMapShape == null) return <></>;

    const color = gameMapShape.color;

    const handleClick = () => {
        setStrategyMemo((v) => {
            const nextColor = GameMapShapeUtility.nextShapeColor(color);
            const newStrategyMemo = replaced(v, id, (gameMapShape) =>
                gameMapShape.copyWith({
                    color: nextColor,
                }),
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    const colorName = GameMapShapeUtility.translateShapeColor(color);
    const backgroundColor = GameMapShapeUtility.shapeColorValue(color);
    const HalfBlackHalfWhite =
        "bg-linear-to-r from-black from-50% to-white to-50%";

    return (
        <LargeIconButton
            className={`relative ${Bg.neutral500} ${Bg.hoverNeutral400}`}
            description={colorName}
            onClick={handleClick}
        >
            <div
                className="absolute inset-0 m-auto size-10 rounded-full"
                style={{ backgroundColor: backgroundColor }}
            />
            {gameMapShape.color === ShapeColorEnum.currentColor.name && (
                <div
                    className={`absolute inset-0 m-auto size-10 rounded-full ${HalfBlackHalfWhite}`}
                />
            )}
        </LargeIconButton>
    );
};

/* -------------------------------------------------------------------------- */

type ZoomModeDetail = {
    label: string;
    zoomIn: (scale: Scale) => Scale;
    zoomOut: (scale: Scale) => Scale;
    icon: JSX.Element;
    nextZoomMode: () => ZoomModeDetail;
};

const ZoomModeEnum: {
    readonly x: ZoomModeDetail;
    readonly y: ZoomModeDetail;
    readonly xy: ZoomModeDetail;
} = {
    x: {
        label: "ズームx",
        zoomIn: (scale) => scale.zoomInX(),
        zoomOut: (scale) => scale.zoomOutX(),
        icon: <MoveHorizontal className={largeIconClassName} />,
        nextZoomMode: () => ZoomModeEnum.y,
    },
    y: {
        label: "ズームy",
        zoomIn: (scale) => scale.zoomInY(),
        zoomOut: (scale) => scale.zoomOutY(),
        icon: <MoveVertical className={largeIconClassName} />,
        nextZoomMode: () => ZoomModeEnum.xy,
    },
    xy: {
        label: "ズームxy",
        zoomIn: (scale) => scale.zoomInXY(),
        zoomOut: (scale) => scale.zoomOutXY(),
        icon: <Link2 className={largeIconClassName} />,
        nextZoomMode: () => ZoomModeEnum.x,
    },
} as const;

const ChangeZoomButton = ({ id }: { id: Id }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const [zoomModeDetail, setZoomModeDetail] = useState<ZoomModeDetail>(
        ZoomModeEnum.xy,
    );

    const changeScale = (action: (scale: Scale) => Scale) => {
        setStrategyMemo((v) => {
            const newStrategyMemo = replaced(v, id, (gameMapShape) =>
                gameMapShape.copyWith({
                    scale: action(gameMapShape.scale),
                }),
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    const handleLeftButtonClick = () => {
        changeScale((scale) => zoomModeDetail.zoomOut(scale));
    };

    const handleMiddleButtonClick = () => {
        setZoomModeDetail(zoomModeDetail.nextZoomMode());
    };

    const handleRightButtonClick = () => {
        changeScale((scale) => zoomModeDetail.zoomIn(scale));
    };

    return (
        <HorizontalSegmentedIconButton
            description={zoomModeDetail.label}
            leftIcon={<ZoomOut className={largeIconClassName} />}
            middleIcon={zoomModeDetail.icon}
            rightIcon={<ZoomIn className={largeIconClassName} />}
            onLeftButtonClick={handleLeftButtonClick}
            onMiddleButtonClick={handleMiddleButtonClick}
            onRightButtonClick={handleRightButtonClick}
        />
    );
};

/* -------------------------------------------------------------------------- */

const RotateButton = ({ id }: { id: Id }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const newStrategyMemo = replaced(v, id, (gameMapShape) =>
                gameMapShape.copyWith({
                    angle: gameMapShape.angle.rotated(),
                }),
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
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

const FlipButton = ({ id }: { id: Id }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(id.gameMapId);
    if (gameMap == null) return <></>;

    const gameMapShape = gameMap.gameMapShapes.find(id.gameMapShapeId);
    if (gameMapShape == null) return <></>;

    const handleClick = () => {
        setStrategyMemo((v) => {
            const newStrategyMemo = replaced(v, id, (gameMapShape) =>
                gameMapShape.copyWith({ flip: !gameMapShape.flip }),
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
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

const IncreaseDisplayAreaButton = ({ id }: { id: Id }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const newStrategyMemo = replaced(v, id, (gameMapShape) =>
                gameMapShape.copyWith({
                    drawingRange: gameMapShape.drawingRange.increased(),
                }),
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
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
