import { useAtom, useAtomValue } from "jotai";
import { ReactNode } from "react";
import {
    canSelectMultipleAtom,
    gameMapShapeSelectionManagerAtom,
    selectedGameMapIdAtom,
} from "../../../atoms";
import { GameMap } from "../../../models/gameMap";
import {
    GameMapShape,
    GameMapShapeIdList,
    GameMapShapeUtility,
} from "../../../models/gameMapShape";
import CardBase from "../../commons/cardBase";
import { Bg, Text } from "../../commons/classNames";

const GameMapShapeListView = ({ gameMap }: { gameMap: GameMap }) => {
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);

    // マップ上のアイテムが選択された場合はそのアイテムだけを表示する
    const filteredGameMapShapes = selectionManager.boardItems.isNotEmpty
        ? gameMap.gameMapShapes.filter((v) =>
              selectionManager.boardItems.hasId(v.id),
          )
        : gameMap.gameMapShapes.items;

    return (
        <div className="flex flex-col items-center gap-2 pb-60">
            {filteredGameMapShapes.map((v) => (
                <Card key={v.id.value} gameMapShape={v} />
            ))}
        </div>
    );
};

export default GameMapShapeListView;

/* -------------------------------------------------------------------------- */

const Card = ({ gameMapShape }: { gameMapShape: GameMapShape }) => {
    const canSelectMultiple = useAtomValue(canSelectMultipleAtom);
    const [selectionManager, setSelectionManager] = useAtom(
        gameMapShapeSelectionManagerAtom,
    );
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    if (selectedGameMapId == null) return <></>;

    // クリックでリストアイテムの選択状態を切り替える
    const handleClick = () => {
        if (canSelectMultiple) {
            setSelectionManager((v) =>
                v.copyWith({
                    listItems: v.listItems.hasId(gameMapShape.id)
                        ? v.listItems.removed(gameMapShape.id)
                        : v.listItems.added(gameMapShape.id),
                }),
            );
            return;
        }

        setSelectionManager((v) =>
            v.copyWith({
                listItems: v.listItems.hasId(gameMapShape.id)
                    ? new GameMapShapeIdList()
                    : new GameMapShapeIdList(gameMapShape.id),
            }),
        );
    };

    // ダブルクリックで編集モードに移行する
    const handleDoubleClick = () => {
        if (canSelectMultiple) return;

        setSelectionManager((v) =>
            v.copyWith({
                boardItems: new GameMapShapeIdList(gameMapShape.id),
                listItems: new GameMapShapeIdList(),
            }),
        );
    };

    return (
        <CardBase
            title={GameMapShapeUtility.translateShapeName(gameMapShape.name)}
            id={gameMapShape.id.value}
            selected={selectionManager.listItems.hasId(gameMapShape.id)}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <Contents gameMapShape={gameMapShape} />
        </CardBase>
    );
};

const Contents = ({ gameMapShape }: { gameMapShape: GameMapShape }) => {
    const TextWithLabel = ({
        label,
        children,
    }: {
        label: string;
        children?: ReactNode;
    }) => {
        return (
            <div className="p-1">
                <p className={`font-bold ${Text.neutral500}`}>{label}</p>
                <p className={`whitespace-pre-wrap ${Bg.neutral100_900}`}>
                    {children}
                </p>
            </div>
        );
    };

    const X = () => (
        <TextWithLabel label="座標x">{gameMapShape.point.x}</TextWithLabel>
    );

    const Y = () => (
        <TextWithLabel label="座標y">{gameMapShape.point.y}</TextWithLabel>
    );

    const LineWidth = () => (
        <TextWithLabel label="線幅">
            {gameMapShape.thickness.value}
        </TextWithLabel>
    );

    const Color = () => (
        <TextWithLabel label="色">
            {GameMapShapeUtility.translateShapeColor(gameMapShape.color)}
        </TextWithLabel>
    );

    const IsFill = () => (
        <TextWithLabel label="塗り">
            {gameMapShape.fill ? "Yes" : "No"}
        </TextWithLabel>
    );

    const ZoomX = () => (
        <TextWithLabel label="ズームx">{gameMapShape.scale.x}%</TextWithLabel>
    );

    const ZoomY = () => (
        <TextWithLabel label="ズームy">{gameMapShape.scale.y}%</TextWithLabel>
    );

    const Angle = () => (
        <TextWithLabel label="角度">{gameMapShape.angle.value}</TextWithLabel>
    );

    const IsFlip = () => (
        <TextWithLabel label="反転">
            {gameMapShape.flip ? "Yes" : "No"}
        </TextWithLabel>
    );

    const DrawingRange = () => (
        <TextWithLabel label="描画範囲">
            {gameMapShape.drawingRange.value}%
        </TextWithLabel>
    );

    return (
        <div className="flex gap-2 max-sm:flex-col max-sm:gap-0">
            <div className="flex gap-2">
                <X />
                <Y />
                <LineWidth />
                <Color />
                <IsFill />
            </div>
            <div className="flex gap-2">
                <ZoomX />
                <ZoomY />
                <Angle />
                <IsFlip />
                <DrawingRange />
            </div>
        </div>
    );
};
