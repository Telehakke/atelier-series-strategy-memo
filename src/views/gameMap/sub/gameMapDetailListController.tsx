import { Field, Label, Select } from "@headlessui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    canSelectMultipleAtom,
    gameMapDetailSelectionManagerAtom,
    gameMapsAtom,
    isEditGameMapDialogOpenAtom,
    isGameMapDetailEditModeAtom,
    isReadonlyAtom,
    selectedGameMapIdAtom,
    strategyMemoAtom,
} from "../../../atoms";
import ErrorChecker from "../../../models/errorChecker";

import {
    GameMapDetail,
    GameMapDetailId,
    GameMapDetailIdList,
    GameMapDetailList,
} from "../../../models/gameMapDetail";
import LocalStorage from "../../../models/localStorage";

import { ChevronDown, ChevronUp } from "lucide-react";
import { GameMapId } from "../../../models/gameMap";
import { ControllerTypeEnum } from "../../../models/itemSelectionManager";
import { Bg, Border, Stroke, Text } from "../../commons/classNames";
import DialogView from "../../commons/dialogView";
import {
    ClipboardCopyIconLargeButton,
    ClipboardPasteIconLargeButton,
    FilesIconLargeButton,
    largeIconClassName,
    MoveIconLargeButton,
    PencilIconLargeButton,
    PlusIconLargeButton,
    TrashIconLargeButton,
    VerticalSegmentedIconButton,
    XIconLargeButton,
} from "../../commons/iconButtons";
import TextEditor from "../../commons/textEditor";
import TextField from "../../commons/textField";

const GameMapDetailListController = ({ className }: { className?: string }) => {
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    const [copiedItems, setCopiedItems] = useState(new GameMapDetailList());
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
                <div className={"flex flex-col gap-4"}>
                    <ShowGameMapShapeButton />
                    <AddItemButton gameMapId={selectedGameMapId} />
                </div>
            </div>
        );

    return <></>;
};

export default GameMapDetailListController;

/* -------------------------------------------------------------------------- */

const ItemActionButtons = ({
    gameMapId,
    setCopiedItems,
}: {
    gameMapId: GameMapId;
    setCopiedItems: React.Dispatch<React.SetStateAction<GameMapDetailList>>;
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
                <MoveButton />
                <SelectionModeToggleButton />
            </VStack>
            <VStack>
                <EditItemButton gameMapId={gameMapId} />
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
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <PlusIconLargeButton
                className={`${Bg.blue500} ${Bg.hoverBlue400} ${Stroke.neutral50}`}
                description="追加"
                onClick={() => setIsOpen(true)}
            />
            {isOpen && (
                <AddItemDialog
                    gameMapId={gameMapId}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}
        </>
    );
};

const AddItemDialog = ({
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
    const setSelectionManager = useSetAtom(gameMapDetailSelectionManagerAtom);

    const [name, setName] = useState("");
    const [items, setItems] = useState("");
    const [monsters, setMonsters] = useState("");
    const [memo, setMemo] = useState("");
    const [icon, setIcon] = useState("");
    const [x, setX] = useState("50");
    const [y, setY] = useState("50");
    const [goto, setGoto] = useState("");
    const [message, setMessage] = useState("");

    const handleClick = () => {
        const gameMapDetail = GameMapDetail.create({
            name: name,
            items: items,
            monsters: monsters,
            memo: memo,
            icon: icon,
            x: x,
            y: y,
            goto: new GameMapId(goto),
            checked: false,
            id: new GameMapDetailId(uuidv4()),
        });

        try {
            setStrategyMemo((v) => {
                const gameMap = v.gameMaps.find(gameMapId);
                if (gameMap == null) return v;

                const newGameMapDetails =
                    gameMap.gameMapDetails.added(gameMapDetail);
                const newStrategyMemo = v.replacedGameMapDetails(
                    gameMap,
                    newGameMapDetails,
                );
                setGameMaps(newStrategyMemo.gameMaps);
                LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
                return newStrategyMemo;
            });
            // アイテムを追加したら、マップ上で連動するアイテムを選択状態にする
            setSelectionManager((v) =>
                v.copyWith({
                    boardItems: new GameMapDetailIdList(gameMapDetail.id),
                }),
            );
            setIsOpen(false);
        } catch (error) {
            if (ErrorChecker.isQuotaExceededError(error)) {
                setMessage(ErrorChecker.quotaExceededErrorMessage);
                return;
            }

            console.log(error);
        }
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の追加"
            primaryButtonLabel="追加"
            secondaryButtonLabel="キャンセル"
            handlePrimaryButtonClick={handleClick}
        >
            <div className="flex flex-col gap-2">
                <p>{message}</p>
                <GameMapInput
                    state={{
                        name: name,
                        items: items,
                        monsters: monsters,
                        memo: memo,
                        icon: icon,
                        x: x,
                        y: y,
                        goto: goto,
                        setName: setName,
                        setItems: setItems,
                        setMonsters: setMonsters,
                        setMemo: setMemo,
                        setIcon: setIcon,
                        setX: setX,
                        setY: setY,
                        setGoto: setGoto,
                    }}
                />
            </div>
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const [isOpen, setIsOpen] = useAtom(isEditGameMapDialogOpenAtom);
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    if (selectionManager.listItems.length !== 1) return <></>;

    return (
        <>
            <PencilIconLargeButton
                className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                description="編集"
                onClick={() => setIsOpen(true)}
            />
            {isOpen && (
                <EditItemDialog
                    gameMapId={gameMapId}
                    gameMapDetailId={selectionManager.listItems.at(0)!}
                />
            )}
        </>
    );
};

const EditItemDialog = ({
    gameMapId,
    gameMapDetailId,
}: {
    gameMapId: GameMapId;
    gameMapDetailId: GameMapDetailId;
}) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setSelectionManager = useSetAtom(gameMapDetailSelectionManagerAtom);
    const [isOpen, setIsOpen] = useAtom(isEditGameMapDialogOpenAtom);

    const [gameMaps, setGameMaps] = useAtom(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    const gameMapDetail = gameMap?.gameMapDetails.find(gameMapDetailId) ?? null;
    const [name, setName] = useState(gameMapDetail?.name ?? "");
    const [items, setItems] = useState(
        gameMapDetail?.itemsToCommaSeparatedStr ?? "",
    );
    const [monsters, setMonsters] = useState(
        gameMapDetail?.monstersToCommaSeparatedStr ?? "",
    );
    const [memo, setMemo] = useState(gameMapDetail?.memo ?? "");
    const [icon, setIcon] = useState(gameMapDetail?.icon ?? "");
    const [x, setX] = useState(gameMapDetail?.point.x.toString() ?? "");
    const [y, setY] = useState(gameMapDetail?.point.y.toString() ?? "");
    const [goto, setGoto] = useState(gameMapDetail?.goto.value ?? "");
    const [message, setMessage] = useState("");

    if (gameMap == null) return <></>;
    if (gameMapDetail == null) return <></>;

    const handleClick = () => {
        const editedGameMapDetail = GameMapDetail.create({
            name: name,
            items: items,
            monsters: monsters,
            memo: memo,
            icon: icon,
            x: x,
            y: y,
            goto: new GameMapId(goto),
            checked: gameMapDetail.checked,
            id: gameMapDetail.id,
        });

        try {
            setStrategyMemo((v) => {
                const newGameMapDetails =
                    gameMap.gameMapDetails.replaced(editedGameMapDetail);
                const newStrategyMemo = v.replacedGameMapDetails(
                    gameMap,
                    newGameMapDetails,
                );
                setGameMaps(newStrategyMemo.gameMaps);
                LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
                return newStrategyMemo;
            });
            setSelectionManager((v) =>
                v.copyWith({
                    boardItems: new GameMapDetailIdList(),
                    listItems: new GameMapDetailIdList(),
                }),
            );
            setIsOpen(false);
        } catch (error) {
            if (ErrorChecker.isQuotaExceededError(error)) {
                setMessage(ErrorChecker.quotaExceededErrorMessage);
                return;
            }

            console.log(error);
        }
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の編集"
            primaryButtonLabel="変更"
            secondaryButtonLabel="キャンセル"
            handlePrimaryButtonClick={handleClick}
        >
            <div className="space-y-2">
                <p>{message}</p>
                <GameMapInput
                    state={{
                        name: name,
                        items: items,
                        monsters: monsters,
                        memo: memo,
                        icon: icon,
                        x: x,
                        y: y,
                        goto: goto,
                        setName: setName,
                        setItems: setItems,
                        setMonsters: setMonsters,
                        setMemo: setMemo,
                        setIcon: setIcon,
                        setX: setX,
                        setY: setY,
                        setGoto: setGoto,
                    }}
                />
            </div>
        </DialogView>
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
        gameMapDetailSelectionManagerAtom,
    );

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMapDetails = selectionManager.listItems.reduce(
                (gameMapDetails, id) => gameMapDetails.removed(id),
                gameMap.gameMapDetails,
            );
            const newStrategyMemo = v.replacedGameMapDetails(
                gameMap,
                newGameMapDetails,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
        setSelectionManager((v) =>
            v.copyWith({
                boardItems: new GameMapDetailIdList(),
                listItems: new GameMapDetailIdList(),
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

type InputState = {
    name: string;
    items: string;
    monsters: string;
    memo: string;
    icon: string;
    x: string;
    y: string;
    goto: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    setItems: React.Dispatch<React.SetStateAction<string>>;
    setMonsters: React.Dispatch<React.SetStateAction<string>>;
    setMemo: React.Dispatch<React.SetStateAction<string>>;
    setIcon: React.Dispatch<React.SetStateAction<string>>;
    setX: React.Dispatch<React.SetStateAction<string>>;
    setY: React.Dispatch<React.SetStateAction<string>>;
    setGoto: React.Dispatch<React.SetStateAction<string>>;
};

const GameMapInput = ({ state }: { state: InputState }) => {
    const gameMaps = useAtomValue(gameMapsAtom);

    return (
        <div className="flex flex-col gap-2">
            <TextField
                label="名前"
                value={state.name}
                onChange={(e) => state.setName(e.target.value)}
            />
            <TextField
                label="アイテム"
                value={state.items}
                onChange={(e) => state.setItems(e.target.value)}
            />
            <TextField
                label="モンスター"
                value={state.monsters}
                onChange={(e) => state.setMonsters(e.target.value)}
            />
            <TextEditor
                className="h-20"
                label="メモ"
                value={state.memo}
                onChange={(e) => state.setMemo(e.target.value)}
            />
            <div className="flex gap-2">
                <div className="grid w-2/3 grid-cols-3 gap-2">
                    <TextField
                        label="アイコン"
                        value={state.icon}
                        onChange={(e) => state.setIcon(e.target.value)}
                    />
                    <TextField
                        label="座標x"
                        value={state.x}
                        onChange={(e) => state.setX(e.target.value)}
                    />
                    <TextField
                        label="座標y"
                        value={state.y}
                        onChange={(e) => state.setY(e.target.value)}
                    />
                </div>
                <Field className="w-1/3">
                    <Label className={`text-sm ${Text.neutral500}`}>
                        移動先
                    </Label>
                    <Select
                        className={`h-9 w-full rounded-md border-2 ${Border.neutral500}`}
                        value={state.goto}
                        onChange={(e) => state.setGoto(e.target.value)}
                    >
                        <option>-</option>
                        {gameMaps.items.map((v) => (
                            <option key={v.id.value} value={v.id.value}>
                                {v.name}
                            </option>
                        ))}
                    </Select>
                </Field>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    if (selectionManager.listItems.length !== 1) return <></>;

    const id = selectionManager.listItems.at(0)!;

    const moveItem = (
        action: (gameMapDetails: GameMapDetailList) => GameMapDetailList,
    ) =>
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMapDetails = action(gameMap.gameMapDetails);
            const newStrategyMemo = v.replacedGameMapDetails(
                gameMap,
                newGameMapDetails,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });

    const handleTopButtonClick = () =>
        moveItem((gameMapDetails) => gameMapDetails.movedUp(id));

    const handleBottomButtonClick = () =>
        moveItem((gameMapDetails) => gameMapDetails.movedDown(id));

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
    setCopiedItems: React.Dispatch<React.SetStateAction<GameMapDetailList>>;
}) => {
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    if (gameMap == null) return <></>;

    const handleClick = () => {
        setCopiedItems(
            gameMap.gameMapDetails.filter((v) =>
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
    copiedItems: GameMapDetailList;
    setCopiedItems: React.Dispatch<React.SetStateAction<GameMapDetailList>>;
}) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const setSelectionManager = useSetAtom(gameMapDetailSelectionManagerAtom);

    const handlePasteButtonClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const [newGameMapDetails, selectedIds] = copiedItems.reduce(
                ([gameMapDetails, selectedIds], gameMapDetail) => {
                    const newGameMapDetail = gameMapDetail.copyWith({
                        id: new GameMapDetailId(uuidv4()),
                    });

                    return [
                        gameMapDetails.added(newGameMapDetail),
                        selectedIds.added(newGameMapDetail.id),
                    ];
                },
                [gameMap.gameMapDetails, new GameMapDetailIdList()],
            );
            const newStrategyMemo = v.replacedGameMapDetails(
                gameMap,
                newGameMapDetails,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);

            // アイテムを複製したら、マップ上で連動するアイテムを選択状態にする
            setSelectionManager((v) =>
                v.copyWith({
                    boardItems: selectedIds,
                    listItems: new GameMapDetailIdList(),
                }),
            );
            return newStrategyMemo;
        });
        setCopiedItems(new GameMapDetailList());
    };

    const handleXButtonClick = () => {
        setSelectionManager((v) =>
            v.copyWith({
                listItems: new GameMapDetailIdList(),
            }),
        );
        setCopiedItems(new GameMapDetailList());
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
    const setSelectionManager = useSetAtom(gameMapDetailSelectionManagerAtom);

    const handleClick = () =>
        setSelectionManager((v) =>
            v.copyWith({ listItems: new GameMapDetailIdList() }),
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

const MoveButton = () => {
    const setSelectionManager = useSetAtom(gameMapDetailSelectionManagerAtom);

    const handleClick = () => {
        setSelectionManager((v) =>
            v.copyWith({
                boardItems: v.listItems,
                listItems: new GameMapDetailIdList(),
            }),
        );
    };

    return <MoveIconLargeButton description="座標移動" onClick={handleClick} />;
};

/* -------------------------------------------------------------------------- */

const ShowGameMapShapeButton = () => {
    const setIsGameMapDetailEditMode = useSetAtom(isGameMapDetailEditModeAtom);

    const handleClick = () => setIsGameMapDetailEditMode(false);

    return (
        <PencilIconLargeButton description="記録モード" onClick={handleClick} />
    );
};
