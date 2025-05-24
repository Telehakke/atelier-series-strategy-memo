import { Button } from "@headlessui/react";
import { useAtom, useAtomValue } from "jotai";
import {
    canvasScaleAtom,
    gameMapsAtom,
    gameMapShapeSelectionManagerAtom,
    isGameMapDetailEditModeAtom,
} from "../../../atoms";
import { GameMapId } from "../../../models/gameMap";
import {
    GameMapShape,
    GameMapShapeIdList,
    GameMapShapeUtility,
    ShapeNameEnum,
} from "../../../models/gameMapShape";
import { Bg, Text } from "../../commons/classNames";
import {
    ArrowShape,
    CircleShape,
    CurveShape,
    LineShape,
    SquareShape,
    TwoWayArrowShape,
} from "../../commons/iconButtons";

const GameMapShapeBoard = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    if (gameMap == null) return <></>;

    return (
        <>
            {gameMap.gameMapShapes.map((v) => (
                <Card
                    className={`absolute -translate-1/2 p-px hover:scale-150`}
                    key={v.id.value}
                    gameMapShape={v}
                />
            ))}
        </>
    );
};

export default GameMapShapeBoard;

/* -------------------------------------------------------------------------- */

const Card = ({
    gameMapShape,
    className,
}: {
    gameMapShape: GameMapShape;
    className?: string;
}) => {
    const [selectionManager, setSelectionManager] = useAtom(
        gameMapShapeSelectionManagerAtom,
    );
    const isGameMapDetailEditMode = useAtomValue(isGameMapDetailEditModeAtom);
    const canvasScale = useAtomValue(canvasScaleAtom);

    // クリックでマップアイテムの選択状態を切り替える
    const handleClick = () => {
        setSelectionManager((v) =>
            v.copyWith({
                boardItems: v.boardItems.hasId(gameMapShape.id)
                    ? new GameMapShapeIdList()
                    : new GameMapShapeIdList(gameMapShape.id),
            }),
        );
    };

    // マップ上のアイテムが選択されたら強調表示する
    const isSelectedBoardItem = selectionManager.boardItems.hasId(
        gameMapShape.id,
    );
    const textColor = isSelectedBoardItem
        ? Text.neutral100
        : Text.neutral950_100;
    const backgroundColor = (): string => {
        if (isSelectedBoardItem) return Bg.blue400;
        if (!isGameMapDetailEditMode) return Bg.neutral50_950_70;
        return "";
    };

    // マップ上のアイテムが選択されたら、未選択のアイテムの表示を薄くする
    const opacity1 =
        selectionManager.boardItems.isNotEmpty && !isSelectedBoardItem
            ? "opacity-30"
            : "";

    // リストアイテムが選択されたら、未選択のアイテムの表示を薄くする
    const isSelectedListItem = selectionManager.listItems.hasId(
        gameMapShape.id,
    );
    const opacity2 =
        selectionManager.listItems.isNotEmpty && !isSelectedListItem
            ? "opacity-30"
            : "";

    // キャンバスが縮小されたら、図形も同じ比率で縮小する
    const scaleX = gameMapShape.flip
        ? `${-gameMapShape.scale.x * canvasScale}%` // 左右反転
        : `${gameMapShape.scale.x * canvasScale}%`;
    const scaleY = `${gameMapShape.scale.y * canvasScale}%`;

    const strokeWidth =
        (gameMapShape.thickness.value * 100) /
        Math.min(gameMapShape.scale.x, gameMapShape.scale.y);

    const maskImage =
        gameMapShape.drawingRange.value === 100
            ? "unset"
            : `conic-gradient(black ${gameMapShape.drawingRange.value}%, transparent ${gameMapShape.drawingRange.value}%)`;

    return (
        <Button
            className={className}
            style={{
                left: `${gameMapShape.point.x}%`,
                top: `${gameMapShape.point.y}%`,
            }}
            onClick={handleClick}
        >
            <div
                className={` ${textColor} ${backgroundColor()} ${opacity1} ${opacity2}`}
                style={{ scale: `${scaleX} ${scaleY}` }}
            >
                <Shape
                    name={gameMapShape.name}
                    style={{
                        strokeWidth: `${strokeWidth}px`,
                        color: GameMapShapeUtility.shapeColorValue(
                            gameMapShape.color,
                        ),
                        fill: gameMapShape.fill ? "currentcolor" : "none",
                        transform: `rotate(${gameMapShape.angle.value}deg)`,
                        maskImage: maskImage,
                    }}
                />
            </div>
        </Button>
    );
};

const Shape = ({
    name,
    style,
}: {
    name: string;
    style: React.CSSProperties;
}) => {
    if (name === ShapeNameEnum.square.name)
        return <SquareShape style={style} />;
    if (name === ShapeNameEnum.circle.name)
        return <CircleShape style={style} />;
    if (name === ShapeNameEnum.minus.name) return <LineShape style={style} />;
    if (name === ShapeNameEnum.moveRight.name)
        return <ArrowShape style={style} />;
    if (name === ShapeNameEnum.moveHorizontal.name)
        return <TwoWayArrowShape style={style} />;
    if (name === ShapeNameEnum.redo.name) return <CurveShape style={style} />;
    return <></>;
};
