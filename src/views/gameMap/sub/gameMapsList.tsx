import { Field, Label, Select } from "@headlessui/react";
import { useAtom, useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { strategyMemoRepositoryAtom } from "../../../atoms";
import { GameMap, GameMapUtility } from "../../../models/gameMap";
import {
    GameMapGroup,
    GameMapGroupUtility,
} from "../../../models/gameMapGroup";
import CardBase from "../../commons/cardBase";
import { Bg, Border, Text } from "../../commons/classNames";
import DialogView from "../../commons/dialogView";
import {
    ChevronDownIconLargeButton,
    ChevronUpIconLargeButton,
    ClipboardCopyIconLargeButton,
    ClipboardPasteIconLargeButton,
    PencilIconLargeButton,
    PlusIconLargeButton,
    TrashIconLargeButton,
    XIconLargeButton,
} from "../../commons/iconButtons";
import TextEditor from "../../commons/textEditor";
import TextField from "../../commons/textField";

const GameMapsList = ({
    gameMapGroups,
    selectedIDInGameMapGroups,
    setSelectedIDInCanvas,
}: {
    gameMapGroups: GameMapGroup[];
    selectedIDInGameMapGroups: string | null;
    setSelectedIDInCanvas: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);
    const [isEditItemDialogOpen, setIsEditDialogOpen] = useState(false);
    const [copiedItem, setCopiedItem] = useState<GameMap | null>(null);

    if (selectedIDInGameMapGroups == null) return <></>;

    const index = GameMapGroupUtility.findIndex(
        gameMapGroups,
        selectedIDInGameMapGroups,
    );
    if (index == null) return <></>;

    const gameMapGroup = gameMapGroups[index];

    return (
        <>
            <div className={`space-y-2 pb-8`}>
                {gameMapGroup.gameMaps.map((v) => (
                    <Card
                        key={v.id}
                        gameMapGroups={gameMapGroups}
                        gameMap={v}
                        selectedID={selectedID}
                        setSelectedID={setSelectedID}
                        setIsEditDialogOpen={setIsEditDialogOpen}
                    />
                ))}
            </div>
            <div className="fixed right-4 bottom-4 flex gap-4">
                {copiedItem == null ? (
                    <>
                        <div className="flex flex-col gap-4">
                            <EditItemButton
                                gameMapGroups={gameMapGroups}
                                selectedIDInGameMapGroups={
                                    selectedIDInGameMapGroups
                                }
                                selectedID={selectedID}
                                setSelectedID={setSelectedID}
                                isEditItemDialogOpen={isEditItemDialogOpen}
                                setIsEditItemDialogOpen={setIsEditDialogOpen}
                            />
                            <CopyAndPasteItemButton
                                selectedIDInGameMapGroups={
                                    selectedIDInGameMapGroups
                                }
                                selectedID={selectedID}
                                setSelectedID={setSelectedID}
                                copiedItem={copiedItem}
                                setCopiedItem={setCopiedItem}
                            />
                            <RemoveItemButton
                                selectedIDInGameMapGroups={
                                    selectedIDInGameMapGroups
                                }
                                selectedID={selectedID}
                                setSelectedID={setSelectedID}
                                setSelectedIDInCanvas={setSelectedIDInCanvas}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <MoveItemUpButton
                                selectedIDInGameMapGroups={
                                    selectedIDInGameMapGroups
                                }
                                selectedID={selectedID}
                            />
                            <MoveItemDownButton
                                selectedIDInGameMapGroups={
                                    selectedIDInGameMapGroups
                                }
                                selectedID={selectedID}
                            />
                            <AddItemButton
                                className="grid justify-items-center"
                                gameMapGroups={gameMapGroups}
                                selectedIDInGameMapGroups={
                                    selectedIDInGameMapGroups
                                }
                                setSelectedID={setSelectedID}
                            />
                        </div>
                    </>
                ) : (
                    <CopyAndPasteItemButton
                        selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                        selectedID={selectedID}
                        setSelectedID={setSelectedID}
                        copiedItem={copiedItem}
                        setCopiedItem={setCopiedItem}
                    />
                )}
            </div>
        </>
    );
};

export default GameMapsList;

/* -------------------------------------------------------------------------- */

const Card = ({
    gameMapGroups,
    gameMap,
    selectedID,
    setSelectedID,
    setIsEditDialogOpen,
}: {
    gameMapGroups: GameMapGroup[];
    gameMap: GameMap;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <CardBase
            title={gameMap.name}
            id={gameMap.id}
            selected={gameMap.id === selectedID}
            onClick={() => {
                setSelectedID(gameMap.id === selectedID ? null : gameMap.id);
            }}
            onDoubleClick={() => {
                setSelectedID(gameMap.id);
                setIsEditDialogOpen(true);
            }}
        >
            <TextWithLabel label="アイテム">
                {gameMap.items.map((item, i) => (
                    <span className="inline-block text-nowrap" key={i}>
                        {`【${item}】`}
                    </span>
                ))}
            </TextWithLabel>
            <TextWithLabel label="モンスター">
                {gameMap.monsters.map((monster, i) => (
                    <span className="inline-block text-nowrap" key={i}>
                        {`【${monster}】`}
                    </span>
                ))}
            </TextWithLabel>
            <TextWithLabel label="メモ">{gameMap.memo}</TextWithLabel>
            <div className="flex gap-2">
                <TextWithLabel label="アイコン">{gameMap.icon}</TextWithLabel>
                <TextWithLabel label="座標x">{gameMap.x}</TextWithLabel>
                <TextWithLabel label="座標y">{gameMap.y}</TextWithLabel>
                <TextWithLabel label="移動先">
                    {
                        GameMapGroupUtility.find(gameMapGroups, gameMap.goto)
                            ?.name
                    }
                </TextWithLabel>
            </div>
        </CardBase>
    );
};

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
            <p className={`whitespace-pre-wrap ${Bg.neutral100}`}>{children}</p>
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const AddItemButton = ({
    gameMapGroups,
    selectedIDInGameMapGroups,
    setSelectedID,
    className,
}: {
    gameMapGroups: GameMapGroup[];
    selectedIDInGameMapGroups: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    className?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (selectedIDInGameMapGroups == null) return <></>;

    return (
        <div className={className}>
            <PlusIconLargeButton onClick={() => setIsOpen(true)} />
            <AddItemDialog
                key={`${isOpen}`}
                gameMapGroups={gameMapGroups}
                selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                setSelectedID={setSelectedID}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    );
};

const AddItemDialog = ({
    gameMapGroups,
    selectedIDInGameMapGroups,
    setSelectedID,
    isOpen,
    setIsOpen,
}: {
    gameMapGroups: GameMapGroup[];
    selectedIDInGameMapGroups: string;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);
    const [name, setName] = useState("");
    const [items, setItems] = useState("");
    const [monsters, setMonsters] = useState("");
    const [memo, setMemo] = useState("");
    const [icon, setIcon] = useState("");
    const [x, setX] = useState("50");
    const [y, setY] = useState("50");
    const [goto, setGoto] = useState("");
    const [message, setMessage] = useState("");

    const handleButtonClick = () => {
        const gameMap = GameMapUtility.create(
            name,
            items,
            monsters,
            memo,
            icon,
            x,
            y,
            goto,
            uuidv4(),
        );

        try {
            setStrategyMemo((v) =>
                GameMapUtility.added(v, selectedIDInGameMapGroups, gameMap),
            );
            setSelectedID(null);
            setIsOpen(false);
        } catch (error) {
            if (String(error).includes("QuotaExceededError")) {
                setMessage("⚠️データ量の上限に達したため保存に失敗しました");
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
            onPrimaryButtonClick={handleButtonClick}
        >
            <div className="space-y-2">
                <p>{message}</p>
                <GameMapInput
                    gameMapGroups={gameMapGroups}
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

const EditItemButton = ({
    gameMapGroups,
    selectedIDInGameMapGroups,
    selectedID,
    setSelectedID,
    isEditItemDialogOpen,
    setIsEditItemDialogOpen,
}: {
    gameMapGroups: GameMapGroup[];
    selectedIDInGameMapGroups: string | null;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    isEditItemDialogOpen: boolean;
    setIsEditItemDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    if (selectedIDInGameMapGroups == null) return <></>;
    if (selectedID == null) return <></>;

    return (
        <>
            <PencilIconLargeButton
                onClick={() => setIsEditItemDialogOpen(true)}
            />
            <EditItemDialog
                key={`${isEditItemDialogOpen}`}
                gameMapGroups={gameMapGroups}
                selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                selectedID={selectedID}
                setSelectedID={setSelectedID}
                isOpen={isEditItemDialogOpen}
                setIsOpen={setIsEditItemDialogOpen}
            />
        </>
    );
};

const EditItemDialog = ({
    gameMapGroups,
    selectedIDInGameMapGroups,
    selectedID,
    setSelectedID,
    isOpen,
    setIsOpen,
}: {
    gameMapGroups: GameMapGroup[];
    selectedIDInGameMapGroups: string;
    selectedID: string;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const gameMap = GameMapUtility.find(
        strategyMemo.gameMapGroups,
        selectedIDInGameMapGroups,
        selectedID,
    );
    const [name, setName] = useState(gameMap?.name ?? "");
    const [items, setItems] = useState(gameMap?.items.join("、") ?? "");
    const [monsters, setMonsters] = useState(
        gameMap?.monsters.join("、") ?? "",
    );
    const [memo, setMemo] = useState(gameMap?.memo ?? "");
    const [icon, setIcon] = useState(gameMap?.icon ?? "");
    const [x, setX] = useState(gameMap?.x.toString() ?? "");
    const [y, setY] = useState(gameMap?.y.toString() ?? "");
    const [goto, setGoto] = useState(gameMap?.goto ?? "");
    const [message, setMessage] = useState("");

    const handleButtonClick = () => {
        if (gameMap == null) return;

        const newGameMap = GameMapUtility.create(
            name,
            items,
            monsters,
            memo,
            icon,
            x,
            y,
            goto,
            gameMap.id,
        );

        try {
            setStrategyMemo((v) =>
                GameMapUtility.changed(
                    v,
                    selectedIDInGameMapGroups,
                    selectedID,
                    newGameMap,
                ),
            );
            setSelectedID(null);
            setIsOpen(false);
        } catch (error) {
            if (String(error).includes("QuotaExceededError")) {
                setMessage("⚠️データ量の上限に達したため保存に失敗しました");
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
            onPrimaryButtonClick={handleButtonClick}
        >
            <div className="space-y-2">
                <p>{message}</p>
                <GameMapInput
                    gameMapGroups={gameMapGroups}
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

const RemoveItemButton = ({
    selectedIDInGameMapGroups,
    selectedID,
    setSelectedID,
    setSelectedIDInCanvas,
}: {
    selectedIDInGameMapGroups: string | null;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedIDInCanvas: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (selectedIDInGameMapGroups == null) return <></>;
    if (selectedID == null) return <></>;

    return (
        <>
            <TrashIconLargeButton onClick={() => setIsOpen(true)} />
            <RemoveItemDialog
                selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                selectedID={selectedID}
                setSelectedID={setSelectedID}
                setSelectedIDInCanvas={setSelectedIDInCanvas}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    );
};

const RemoveItemDialog = ({
    selectedIDInGameMapGroups,
    selectedID,
    setSelectedID,
    setSelectedIDInCanvas,
    isOpen,
    setIsOpen,
}: {
    selectedIDInGameMapGroups: string;
    selectedID: string;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedIDInCanvas: React.Dispatch<React.SetStateAction<string | null>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.removed(v, selectedIDInGameMapGroups, selectedID),
        );
        setSelectedID(null);
        setSelectedIDInCanvas(null);
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の削除"
            primaryButtonLabel="削除"
            secondaryButtonLabel="キャンセル"
            onPrimaryButtonClick={handleButtonClick}
            shouldUseWarningColor={true}
        />
    );
};

/* -------------------------------------------------------------------------- */

const GameMapInput = ({
    gameMapGroups,
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
    gameMapGroups: GameMapGroup[];
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
    return (
        <div className="space-y-2">
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
                        className={`w-full rounded-md border-2 px-1 py-1 ${Border.neutral500}`}
                        value={goto}
                        onChange={(event) => setGoto(event.target.value)}
                    >
                        <option value="">-</option>
                        {gameMapGroups.map((v) => (
                            <option key={v.id} value={v.id}>
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

const MoveItemUpButton = ({
    selectedIDInGameMapGroups,
    selectedID,
}: {
    selectedIDInGameMapGroups: string | null;
    selectedID: string | null;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroups == null) return <></>;
    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.movedUp(v, selectedIDInGameMapGroups, selectedID),
        );
    };

    return <ChevronUpIconLargeButton onClick={() => handleButtonClick()} />;
};

const MoveItemDownButton = ({
    selectedIDInGameMapGroups,
    selectedID,
}: {
    selectedIDInGameMapGroups: string | null;
    selectedID: string | null;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroups == null) return <></>;
    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.movedDown(v, selectedIDInGameMapGroups, selectedID),
        );
    };

    return <ChevronDownIconLargeButton onClick={() => handleButtonClick()} />;
};

/* -------------------------------------------------------------------------- */

const CopyAndPasteItemButton = ({
    selectedIDInGameMapGroups,
    selectedID,
    setSelectedID,
    copiedItem,
    setCopiedItem,
}: {
    selectedIDInGameMapGroups: string | null;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    copiedItem: GameMap | null;
    setCopiedItem: React.Dispatch<React.SetStateAction<GameMap | null>>;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);

    if (selectedIDInGameMapGroups == null) return <></>;

    if (copiedItem != null)
        return (
            <div className="flex gap-4">
                <ClipboardPasteIconLargeButton
                    onClick={() => {
                        const preparation = GameMapUtility.copied(copiedItem);
                        setStrategyMemo((v) =>
                            GameMapUtility.added(
                                v,
                                selectedIDInGameMapGroups,
                                preparation,
                            ),
                        );
                    }}
                />
                <XIconLargeButton
                    onClick={() => {
                        setSelectedID(null);
                        setCopiedItem(null);
                    }}
                />
            </div>
        );

    if (selectedID != null)
        return (
            <ClipboardCopyIconLargeButton
                onClick={() => {
                    setCopiedItem(
                        GameMapUtility.find(
                            strategyMemo.gameMapGroups,
                            selectedIDInGameMapGroups,
                            selectedID,
                        ),
                    );
                }}
            />
        );

    return <></>;
};
