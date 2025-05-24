import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    canSelectMultipleAtom,
    gameMapsAtom,
    gameMapShapeEditModeAtom,
    gameMapShapeSelectionManagerAtom,
    isGameMapDetailEditModeAtom,
    isReadonlyAtom,
    selectedGameMapIdAtom,
    strategyMemoAtom,
} from "../../../atoms";
import { GameMapId } from "../../../models/gameMap";
import {
    GameMapShape,
    GameMapShapeId,
    GameMapShapeIdList,
    GameMapShapeList,
} from "../../../models/gameMapShape";
import { ControllerTypeEnum } from "../../../models/itemSelectionManager";
import LocalStorage from "../../../models/localStorage";
import { Bg, Stroke } from "../../commons/classNames";
import DialogView from "../../commons/dialogView";
import {
    ClipboardCopyIconLargeButton,
    ClipboardPasteIconLargeButton,
    FilesIconLargeButton,
    largeIconClassName,
    PencilIconLargeButton,
    PlusIconLargeButton,
    ShapesIconLargeButton,
    TrashIconLargeButton,
    VerticalSegmentedIconButton,
    XIconLargeButton,
} from "../../commons/iconButtons";
import { GameMapShapeEditModeEnum } from "./gameMapShapeBoardControllers/gameMapShapeBoardController";

const GameMapShapeListController = ({ className }: { className?: string }) => {
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    const [copiedItems, setCopiedItems] = useState(new GameMapShapeList());
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    if (selectedGameMapId == null) return <></>;

    if (selectionManager.controllerType === ControllerTypeEnum.list)
        return (
            <div className={className}>
                {copiedItems.isEmpty ? (
                    <ItemActionButtons
                        gameMapId={selectedGameMapId}
                        setCopiedItems={setCopiedItems}
                    />
                ) : (
                    <PasteAndXButtons
                        gameMapId={selectedGameMapId}
                        copiedItems={copiedItems}
                        setCopiedItems={setCopiedItems}
                    />
                )}
            </div>
        );

    if (selectionManager.controllerType === ControllerTypeEnum.none)
        return (
            <div className={className}>
                <div className="flex flex-col gap-4">
                    <ShowGameMapDetailButton />
                    <AddItemButton gameMapId={selectedGameMapId} />
                </div>
            </div>
        );

    return <></>;
};

export default GameMapShapeListController;

/* -------------------------------------------------------------------------- */

const ItemActionButtons = ({
    gameMapId,
    setCopiedItems,
}: {
    gameMapId: GameMapId;
    setCopiedItems: React.Dispatch<React.SetStateAction<GameMapShapeList>>;
}) => {
    const HStack = ({ children }: { children: ReactNode }) => (
        <div className={"flex gap-4"}>{children}</div>
    );

    const VStack = ({ children }: { children: ReactNode }) => (
        <div className={"flex flex-col justify-end gap-4"}>{children}</div>
    );

    return (
        <HStack>
            <VStack>
                <SelectionModeToggleButton />
            </VStack>
            <VStack>
                <EditItemButton />
                <CopyButton
                    gameMapId={gameMapId}
                    setCopiedItems={setCopiedItems}
                />
                <RemoveItemButton gameMapId={gameMapId} />
            </VStack>
            <VStack>
                <MoveItemButton gameMapId={gameMapId} />
                <XButton />
            </VStack>
        </HStack>
    );
};

/* -------------------------------------------------------------------------- */

const AddItemButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const setSelectionManager = useSetAtom(gameMapShapeSelectionManagerAtom);
    const setShapeEditMode = useSetAtom(gameMapShapeEditModeAtom);

    const handleClick = () => {
        const gameMapShape = GameMapShape.create();
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMapShapes = gameMap.gameMapShapes.added(gameMapShape);
            const newStrategyMemo = v.replacedGameMapShapes(
                gameMap,
                newGameMapShapes,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
        // アイテムを追加したら、マップ上で連動するアイテムを選択状態にする
        setSelectionManager((v) =>
            v.copyWith({
                boardItems: new GameMapShapeIdList(gameMapShape.id),
            }),
        );
        setShapeEditMode(GameMapShapeEditModeEnum.select);
    };

    return (
        <PlusIconLargeButton
            className={`${Bg.blue500} ${Bg.hoverBlue400} ${Stroke.neutral50}`}
            description="追加"
            onClick={handleClick}
        />
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = () => {
    const setSelectionManager = useSetAtom(gameMapShapeSelectionManagerAtom);
    const canSelectMultiple = useAtomValue(canSelectMultipleAtom);
    const setShapeEditMode = useSetAtom(gameMapShapeEditModeAtom);

    const handleClick = () => {
        setSelectionManager((v) =>
            v.copyWith({
                boardItems: v.listItems,
                listItems: new GameMapShapeIdList(),
            }),
        );
        if (canSelectMultiple) setShapeEditMode(GameMapShapeEditModeEnum.move);
    };

    return (
        <PencilIconLargeButton
            className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
            description="編集"
            onClick={handleClick}
        />
    );
};

/* -------------------------------------------------------------------------- */

const RemoveItemButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TrashIconLargeButton
                className={`${Bg.red500} ${Bg.hoverRed400} ${Stroke.neutral50}`}
                description="削除"
                onClick={() => setIsOpen(true)}
            />
            {isOpen && (
                <RemoveItemDialog
                    gameMapId={gameMapId}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}
        </>
    );
};

const RemoveItemDialog = ({
    gameMapId,
    isOpen,
    setIsOpen,
}: {
    gameMapId: GameMapId;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const [selectionManager, setSelectionManager] = useAtom(
        gameMapShapeSelectionManagerAtom,
    );

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMapShapes = selectionManager.listItems.reduce(
                (gameMapShapes, id) => gameMapShapes.removed(id),
                gameMap.gameMapShapes,
            );
            const newStrategyMemo = v.replacedGameMapShapes(
                gameMap,
                newGameMapShapes,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
        setSelectionManager((v) =>
            v.copyWith({
                boardItems: new GameMapShapeIdList(),
                listItems: new GameMapShapeIdList(),
            }),
        );
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の削除"
            primaryButtonLabel="削除"
            secondaryButtonLabel="キャンセル"
            handlePrimaryButtonClick={handleClick}
            shouldUseWarningColor={true}
        />
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    if (selectionManager.listItems.length !== 1) return <></>;

    const id = selectionManager.listItems.at(0)!;

    const moveItem = (
        action: (gameMapShapes: GameMapShapeList) => GameMapShapeList,
    ) => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMapShapes = action(gameMap.gameMapShapes);
            const newStrategyMemo = v.replacedGameMapShapes(
                gameMap,
                newGameMapShapes,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    const handleTopButtonClick = () =>
        moveItem((gameMapShapes) => gameMapShapes.movedUp(id));

    const handleBottomButtonClick = () =>
        moveItem((gameMapShapes) => gameMapShapes.movedDown(id));

    return (
        <VerticalSegmentedIconButton
            description="移動"
            topIcon={<ChevronUp className={largeIconClassName} />}
            bottomIcon={<ChevronDown className={largeIconClassName} />}
            onTopButtonClick={handleTopButtonClick}
            onBottomButtonClick={handleBottomButtonClick}
        />
    );
};

/* -------------------------------------------------------------------------- */

const CopyButton = ({
    gameMapId,
    setCopiedItems,
}: {
    gameMapId: GameMapId;
    setCopiedItems: React.Dispatch<React.SetStateAction<GameMapShapeList>>;
}) => {
    const selectionManager = useAtomValue(gameMapShapeSelectionManagerAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    if (gameMap == null) return <></>;

    const handleClick = () => {
        setCopiedItems(
            gameMap.gameMapShapes.filter((v) =>
                selectionManager.listItems.hasId(v.id),
            ),
        );
    };

    return (
        <ClipboardCopyIconLargeButton
            className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
            onClick={handleClick}
            description="コピー"
        />
    );
};

const PasteAndXButtons = ({
    gameMapId,
    copiedItems,
    setCopiedItems,
}: {
    gameMapId: GameMapId;
    copiedItems: GameMapShapeList;
    setCopiedItems: React.Dispatch<React.SetStateAction<GameMapShapeList>>;
}) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const setSelectionManager = useSetAtom(gameMapShapeSelectionManagerAtom);

    const handlePasteButtonClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const [newGameMapShapes, selectedIds] = copiedItems.reduce(
                ([gameMapShapes, selectedIds], gameMapShape) => {
                    const newGameMapShape = gameMapShape.copyWith({
                        id: new GameMapShapeId(uuidv4()),
                    });

                    return [
                        gameMapShapes.added(newGameMapShape),
                        selectedIds.added(newGameMapShape.id),
                    ];
                },
                [gameMap.gameMapShapes, new GameMapShapeIdList()],
            );
            const newStrategyMemo = v.replacedGameMapShapes(
                gameMap,
                newGameMapShapes,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);

            // アイテムを複製したら、マップ上で連動するアイテムを選択状態にする
            setSelectionManager((v) =>
                v.copyWith({
                    boardItems: selectedIds,
                    listItems: new GameMapShapeIdList(),
                }),
            );
            return newStrategyMemo;
        });
        setCopiedItems(new GameMapShapeList());
    };

    const handleXButtonClick = () => {
        setSelectionManager((v) =>
            v.copyWith({
                listItems: new GameMapShapeIdList(),
            }),
        );
        setCopiedItems(new GameMapShapeList());
    };

    return (
        <div className="flex gap-4">
            <ClipboardPasteIconLargeButton
                className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                description="貼り付け"
                onClick={handlePasteButtonClick}
            />
            <XIconLargeButton
                description="選択を解除"
                onClick={handleXButtonClick}
            />
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const XButton = () => {
    const setSelectionManager = useSetAtom(gameMapShapeSelectionManagerAtom);

    const handleClick = () =>
        setSelectionManager((v) =>
            v.copyWith({ listItems: new GameMapShapeIdList() }),
        );

    return <XIconLargeButton description="選択解除" onClick={handleClick} />;
};

/* -------------------------------------------------------------------------- */

const SelectionModeToggleButton = () => {
    const [canSelectMultiple, setCanSelectMultiple] = useAtom(
        canSelectMultipleAtom,
    );

    const handleClick = () => setCanSelectMultiple((v) => !v);

    const backgroundColor = canSelectMultiple
        ? `${Bg.blue500} ${Bg.hoverBlue400}`
        : `${Bg.neutral500} ${Bg.hoverNeutral400}`;

    return (
        <FilesIconLargeButton
            className={`${backgroundColor} ${Stroke.neutral50}`}
            description={canSelectMultiple ? "複数選択ON" : "複数選択OFF"}
            onClick={handleClick}
        />
    );
};

/* -------------------------------------------------------------------------- */

const ShowGameMapDetailButton = () => {
    const setIsGameMapDetailEditMode = useSetAtom(isGameMapDetailEditModeAtom);

    const handleClick = () => setIsGameMapDetailEditMode(true);

    return (
        <ShapesIconLargeButton description="描画モード" onClick={handleClick} />
    );
};
