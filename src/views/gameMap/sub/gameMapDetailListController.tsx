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
    LargeIconButton,
    largeIconClassName,
    MoveIconLargeButton,
    PencilIconLargeButton,
    PlusIconLargeButton,
    TrashIconLargeButton,
    XIconLargeButton,
} from "../../commons/iconButtons";
import TextEditor from "../../commons/textEditor";
import TextField from "../../commons/textField";

const GameMapDetailListController = ({ className }: { className?: string }) => {
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    const [copiedItems, setCopiedItems] = useState(new GameMapDetailList());
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    if (selectedGameMapId == null) return <></>;

    if (
        selectionManager.controllerType === ControllerTypeEnum.list &&
        copiedItems.isEmpty
    )
        return (
            <div className={`flex gap-4 ${className}`}>
                <div className="flex flex-col justify-end gap-4">
                    <MoveButton />
                    <SelectionModeToggleButton />
                </div>
                <div className="flex flex-col justify-end gap-4">
                    <EditItemButton gameMapId={selectedGameMapId} />
                    <CopyButton
                        gameMapId={selectedGameMapId}
                        setCopiedItems={setCopiedItems}
                    />
                    <RemoveItemButton gameMapId={selectedGameMapId} />
                </div>
                <div className="flex flex-col justify-end gap-4">
                    <MoveItemUpButton gameMapId={selectedGameMapId} />
                    <MoveItemDownButton gameMapId={selectedGameMapId} />
                    <XButton />
                </div>
            </div>
        );

    if (
        selectionManager.controllerType === ControllerTypeEnum.list &&
        copiedItems.isNotEmpty
    )
        return (
            <div className={className}>
                <PasteAndXButtons
                    gameMapId={selectedGameMapId}
                    copiedItems={copiedItems}
                    setCopiedItems={setCopiedItems}
                />
            </div>
        );

    if (selectionManager.controllerType === ControllerTypeEnum.none)
        return (
            <div className={className}>
                <div className="flex flex-col gap-4">
                    <ShowGameMapShapeButton />
                    <AddItemButton gameMapId={selectedGameMapId} />
                </div>
            </div>
        );

    return <></>;
};

export default GameMapDetailListController;

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
        const gameMapDetail = GameMapDetail.create(
            name,
            items,
            monsters,
            memo,
            icon,
            x,
            y,
            new GameMapId(goto),
            false,
            new GameMapDetailId(uuidv4()),
        );

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
                LocalStorage.setStrategyMemo(newStrategyMemo);
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
            <div className="space-y-2">
                <p>{message}</p>
                <GameMapInput
                    name={name}
                    setName={setName}
                    items={items}
                    setItems={setItems}
                    monsters={monsters}
                    setMonsters={setMonsters}
                    memo={memo}
                    setMemo={setMemo}
                    icon={icon}
                    setIcon={setIcon}
                    x={x}
                    setX={setX}
                    y={y}
                    setY={setY}
                    goto={goto}
                    setGoto={setGoto}
                />
            </div>
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useAtom(
        isEditGameMapDialogOpenAtom,
    );
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    if (selectionManager.listItems.length !== 1) return <></>;

    return (
        <>
            <PencilIconLargeButton
                className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                description="編集"
                onClick={() => setIsEditDialogOpen(true)}
            />
            {isEditDialogOpen && (
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
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setSelectionManager = useSetAtom(gameMapDetailSelectionManagerAtom);
    const [isEditDialogOpen, setIsEditDialogOpen] = useAtom(
        isEditGameMapDialogOpenAtom,
    );
    const [gameMaps, setGameMaps] = useAtom(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    const gameMapDetail = gameMap?.gameMapDetails.find(gameMapDetailId) ?? null;
    const [name, setName] = useState(gameMapDetail?.name ?? "");
    const [items, setItems] = useState(gameMapDetail?.items.join("、") ?? "");
    const [monsters, setMonsters] = useState(
        gameMapDetail?.monsters.join("、") ?? "",
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
        const editedGameMapDetail = GameMapDetail.create(
            name,
            items,
            monsters,
            memo,
            icon,
            x,
            y,
            new GameMapId(goto),
            gameMapDetail.checked,
            gameMapDetail.id,
        );

        try {
            setStrategyMemo((v) => {
                const newGameMapDetails = gameMap.gameMapDetails.replaced(
                    gameMapDetail.id,
                    editedGameMapDetail,
                );
                const newStrategyMemo = v.replacedGameMapDetails(
                    gameMap,
                    newGameMapDetails,
                );
                setGameMaps(newStrategyMemo.gameMaps);
                LocalStorage.setStrategyMemo(newStrategyMemo);
                return newStrategyMemo;
            });
            setSelectionManager((v) =>
                v.copyWith({
                    boardItems: new GameMapDetailIdList(),
                    listItems: new GameMapDetailIdList(),
                }),
            );
            setIsEditDialogOpen(false);
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
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            title="項目の編集"
            primaryButtonLabel="変更"
            secondaryButtonLabel="キャンセル"
            handlePrimaryButtonClick={handleClick}
        >
            <div className="space-y-2">
                <p>{message}</p>
                <GameMapInput
                    name={name}
                    setName={setName}
                    items={items}
                    setItems={setItems}
                    monsters={monsters}
                    setMonsters={setMonsters}
                    memo={memo}
                    setMemo={setMemo}
                    icon={icon}
                    setIcon={setIcon}
                    x={x}
                    setX={setX}
                    y={y}
                    setY={setY}
                    goto={goto}
                    setGoto={setGoto}
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
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const [selectionManager, setSelectionManager] = useAtom(
        gameMapDetailSelectionManagerAtom,
    );

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            let newGameMapDetails = gameMap.gameMapDetails;
            selectionManager.listItems.forEach((id) => {
                newGameMapDetails = newGameMapDetails.removed(id);
            });
            const newStrategyMemo = v.replacedGameMapDetails(
                gameMap,
                newGameMapDetails,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo);
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

const GameMapInput = ({
    name,
    setName,
    items,
    setItems,
    monsters,
    setMonsters,
    memo,
    setMemo,
    icon,
    setIcon,
    x,
    setX,
    y,
    setY,
    goto,
    setGoto,
}: {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    items: string;
    setItems: React.Dispatch<React.SetStateAction<string>>;
    monsters: string;
    setMonsters: React.Dispatch<React.SetStateAction<string>>;
    memo: string;
    setMemo: React.Dispatch<React.SetStateAction<string>>;
    icon: string;
    setIcon: React.Dispatch<React.SetStateAction<string>>;
    x: string;
    setX: React.Dispatch<React.SetStateAction<string>>;
    y: string;
    setY: React.Dispatch<React.SetStateAction<string>>;
    goto: string;
    setGoto: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const gameMaps = useAtomValue(gameMapsAtom);

    return (
        <div className="flex flex-col gap-2">
            <TextField
                label="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="アイテム"
                value={items}
                onChange={(e) => setItems(e.target.value)}
            />
            <TextField
                label="モンスター"
                value={monsters}
                onChange={(e) => setMonsters(e.target.value)}
            />
            <TextEditor
                className="h-20"
                label="メモ"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
            />
            <div className="flex gap-2">
                <div className="grid w-2/3 grid-cols-3 gap-2">
                    <TextField
                        label="アイコン"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                    />
                    <TextField
                        label="座標x"
                        value={x}
                        onChange={(e) => setX(e.target.value)}
                    />
                    <TextField
                        label="座標y"
                        value={y}
                        onChange={(e) => setY(e.target.value)}
                    />
                </div>
                <Field className="w-1/3">
                    <Label className={`text-sm ${Text.neutral500}`}>
                        移動先
                    </Label>
                    <Select
                        className={`h-9 w-full rounded-md border-2 ${Border.neutral500}`}
                        value={goto}
                        onChange={(e) => setGoto(e.target.value)}
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

const MoveItemUpButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    return (
        <MoveItemButton
            gameMapId={gameMapId}
            description="下へ移動"
            action={(gameMapDetails, id) => gameMapDetails.movedUp(id)}
        >
            <ChevronUp className={largeIconClassName} />
        </MoveItemButton>
    );
};

const MoveItemDownButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    return (
        <MoveItemButton
            gameMapId={gameMapId}
            description="下へ移動"
            action={(gameMapDetails, id) => gameMapDetails.movedDown(id)}
        >
            <ChevronDown className={largeIconClassName} />
        </MoveItemButton>
    );
};

const MoveItemButton = ({
    gameMapId,
    description,
    action,
    children,
}: {
    gameMapId: GameMapId;
    description: string;
    action: (
        gameMapDetails: GameMapDetailList,
        id: GameMapDetailId,
    ) => GameMapDetailList;
    children: ReactNode;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    if (selectionManager.listItems.length !== 1) return <></>;

    const id = selectionManager.listItems.at(0)!;

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMapDetails = action(gameMap.gameMapDetails, id);
            const newStrategyMemo = v.replacedGameMapDetails(
                gameMap,
                newGameMapDetails,
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
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const setSelectionManager = useSetAtom(gameMapDetailSelectionManagerAtom);

    const handlePasteButtonClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            let selectedIds = new GameMapDetailIdList();
            let newGameMapDetails = gameMap.gameMapDetails;
            copiedItems.forEach((gameMapDetail) => {
                const newGameMapDetail = gameMapDetail.copyWith({
                    id: new GameMapDetailId(uuidv4()),
                });
                selectedIds = selectedIds.added(newGameMapDetail.id);
                newGameMapDetails = newGameMapDetails.added(newGameMapDetail);
            });
            const newStrategyMemo = v.replacedGameMapDetails(
                gameMap,
                newGameMapDetails,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo);

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

    const backgroundColor = canSelectMultiple ? Bg.blue500 : Bg.neutral500;
    const hoverColor = canSelectMultiple ? Bg.hoverBlue400 : Bg.hoverNeutral400;

    return (
        <FilesIconLargeButton
            className={`${backgroundColor} ${hoverColor} ${Stroke.neutral50}`}
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
