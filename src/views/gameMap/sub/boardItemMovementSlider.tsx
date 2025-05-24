import { Input } from "@headlessui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    gameMapDetailSelectionManagerAtom,
    gameMapsAtom,
    gameMapShapeSelectionManagerAtom,
    isGameMapDetailEditModeAtom,
    isReadonlyAtom,
    selectedGameMapIdAtom,
    strategyMemoAtom,
} from "../../../atoms";
import { Point } from "../../../models/dataClasses";
import LocalStorage from "../../../models/localStorage";

export const BoardItemMovementXSlider = ({
    className,
}: {
    className?: string;
}) => {
    const isGameMapDetailEditMode = useAtomValue(isGameMapDetailEditModeAtom);

    if (isGameMapDetailEditMode)
        return <DetailMovementXSlider className={className} />;

    return <ShapeMovementXSlider className={className} />;
};

export const BoardItemMovementYSlider = ({
    className,
}: {
    className?: string;
}) => {
    const isGameMapDetailEditMode = useAtomValue(isGameMapDetailEditModeAtom);

    if (isGameMapDetailEditMode)
        return <DetailMovementYSlider className={className} />;

    return <ShapeMovementYSlider className={className} />;
};

/* -------------------------------------------------------------------------- */

const DetailMovementXSlider = ({ className }: { className?: string }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const [gameMaps, setGameMaps] = useAtom(gameMapsAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    if (isReadonly) return <></>;
    if (selectedGameMapId == null) return <></>;
    if (selectionManager.boardItems.length !== 1) return <></>;

    const gameMap = gameMaps.find(selectedGameMapId);
    if (gameMap == null) return <></>;

    const gameMapDetail = gameMap.gameMapDetails.find(
        selectionManager.boardItems.at(0)!,
    );
    if (gameMapDetail == null) return <></>;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStrategyMemo((v) => {
            const newGameMapDetail = gameMapDetail.copyWith({
                point: new Point(
                    event.target.valueAsNumber,
                    gameMapDetail.point.y,
                ),
            });
            const newGameMapDetails =
                gameMap.gameMapDetails.replaced(newGameMapDetail);
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
        <Input
            className={`w-full max-w-150 touch-none ${className}`}
            type="range"
            min={Point.min}
            max={Point.max}
            value={gameMapDetail.point.x}
            onChange={handleChange}
        />
    );
};

const DetailMovementYSlider = ({ className }: { className?: string }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const [gameMaps, setGameMaps] = useAtom(gameMapsAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    if (isReadonly) return <></>;
    if (selectedGameMapId == null) return <></>;
    if (selectionManager.boardItems.length !== 1) return <></>;

    const gameMap = gameMaps.find(selectedGameMapId);
    if (gameMap == null) return <></>;

    const gameMapDetail = gameMap.gameMapDetails.find(
        selectionManager.boardItems.at(0)!,
    );
    if (gameMapDetail == null) return <></>;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStrategyMemo((v) => {
            const newGameMapDetail = gameMapDetail.copyWith({
                point: new Point(
                    gameMapDetail.point.x,
                    event.target.valueAsNumber,
                ),
            });
            const newGameMapDetails =
                gameMap.gameMapDetails.replaced(newGameMapDetail);
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
        <Input
            className={`h-full max-h-150 touch-none ${className}`}
            type="range"
            style={{ writingMode: "vertical-lr" }}
            min={Point.min}
            max={Point.max}
            value={gameMapDetail.point.y}
            onChange={handleChange}
        />
    );
};

/* -------------------------------------------------------------------------- */

const ShapeMovementXSlider = ({ className }: { className?: string }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const [gameMaps, setGameMaps] = useAtom(gameMapsAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    if (isReadonly) return <></>;
    if (selectedGameMapId == null) return <></>;
    if (selectionManager.boardItems.length !== 1) return <></>;

    const gameMap = gameMaps.find(selectedGameMapId);
    if (gameMap == null) return <></>;

    const gameMapShape = gameMap.gameMapShapes.find(
        selectionManager.boardItems.at(0)!,
    );
    if (gameMapShape == null) return <></>;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStrategyMemo((v) => {
            const newGameMapShape = gameMapShape.copyWith({
                point: new Point(
                    event.target.valueAsNumber,
                    gameMapShape.point.y,
                ),
            });
            const newGameMapShapes =
                gameMap.gameMapShapes.replaced(newGameMapShape);
            const newStrategyMemo = v.replacedGameMapShapes(
                gameMap,
                newGameMapShapes,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    return (
        <Input
            className={`w-full max-w-150 touch-none ${className}`}
            type="range"
            min={Point.min}
            max={Point.max}
            value={gameMapShape.point.x}
            onChange={handleChange}
        />
    );
};

const ShapeMovementYSlider = ({ className }: { className?: string }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const [gameMaps, setGameMaps] = useAtom(gameMapsAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    if (isReadonly) return <></>;
    if (selectedGameMapId == null) return <></>;
    if (selectionManager.boardItems.length !== 1) return <></>;

    const gameMap = gameMaps.find(selectedGameMapId);
    if (gameMap == null) return <></>;

    const gameMapShape = gameMap.gameMapShapes.find(
        selectionManager.boardItems.at(0)!,
    );
    if (gameMapShape == null) return <></>;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStrategyMemo((v) => {
            const newGameMapShape = gameMapShape.copyWith({
                point: new Point(
                    gameMapShape.point.x,
                    event.target.valueAsNumber,
                ),
            });
            const newGameMapShapes =
                gameMap.gameMapShapes.replaced(newGameMapShape);
            const newStrategyMemo = v.replacedGameMapShapes(
                gameMap,
                newGameMapShapes,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    return (
        <Input
            className={`h-full max-h-150 touch-none ${className}`}
            type="range"
            style={{ writingMode: "vertical-lr" }}
            min={Point.min}
            max={Point.max}
            value={gameMapShape.point.y}
            onChange={handleChange}
        />
    );
};
