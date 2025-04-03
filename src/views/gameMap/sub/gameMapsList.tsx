import { useAtom, useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { strategyMemoRepositoryAtom } from "../../../atoms";
import { GameMapUtility, GameMapWithID } from "../../../models/gameMap";
import {
    GameMapGroupUtility,
    GameMapGroupWithID,
} from "../../../models/gameMapGroup";
import CardBase from "../../commons/cardBase";
import { Bg, Text } from "../../commons/classNames";
import DialogView from "../../commons/dialogView";
import {
    ChevronDownIconLargeButton,
    ChevronUpIconLargeButton,
    PencilIconLargeButton,
    PlusIconLargeButton,
    TrashIconLargeButton,
} from "../../commons/iconButtons";
import TextEditor from "../../commons/textEditor";
import TextField from "../../commons/textField";

const GameMapsList = ({
    gameMapGroups,
    selectedIDInGameMapGroups,
    setSelectedIDInCanvas,
}: {
    gameMapGroups: GameMapGroupWithID[];
    selectedIDInGameMapGroups: string | null;
    setSelectedIDInCanvas: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);
    const [isEditItemDialogOpen, setIsEditDialogOpen] = useState(false);

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
                        gameMap={v}
                        selectedID={selectedID}
                        setSelectedID={setSelectedID}
                        setIsEditDialogOpen={setIsEditDialogOpen}
                    />
                ))}
            </div>
            <div className="fixed right-4 bottom-4 flex flex-col space-y-4">
                <MoveItemUpButton
                    selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                    selectedID={selectedID}
                />
                <MoveItemDownButton
                    selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                    selectedID={selectedID}
                />
                <EditItemButton
                    selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                    selectedID={selectedID}
                    setSelectedID={setSelectedID}
                    isEditItemDialogOpen={isEditItemDialogOpen}
                    setIsEditItemDialogOpen={setIsEditDialogOpen}
                />
                <RemoveItemButton
                    selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                    selectedID={selectedID}
                    setSelectedID={setSelectedID}
                    setSelectedIDInCanvas={setSelectedIDInCanvas}
                />
                <AddItemButton
                    className="grid justify-items-center"
                    selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                    setSelectedID={setSelectedID}
                />
            </div>
        </>
    );
};

export default GameMapsList;

/* -------------------------------------------------------------------------- */

const Card = ({
    gameMap,
    selectedID,
    setSelectedID,
    setIsEditDialogOpen,
}: {
    gameMap: GameMapWithID;
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
    selectedIDInGameMapGroups,
    setSelectedID,
    className,
}: {
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
                selectedIDInGameMapGroups={selectedIDInGameMapGroups}
                setSelectedID={setSelectedID}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    );
};

const AddItemDialog = ({
    selectedIDInGameMapGroups,
    setSelectedID,
    isOpen,
    setIsOpen,
}: {
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
                />
            </div>
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = ({
    selectedIDInGameMapGroups,
    selectedID,
    setSelectedID,
    isEditItemDialogOpen,
    setIsEditItemDialogOpen,
}: {
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
    selectedIDInGameMapGroups,
    selectedID,
    setSelectedID,
    isOpen,
    setIsOpen,
}: {
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
