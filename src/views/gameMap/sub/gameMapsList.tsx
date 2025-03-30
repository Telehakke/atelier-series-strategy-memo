import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GameMapUtility, GameMapWithID } from "../../../models/gameMap";
import { GameMapGroupWithID } from "../../../models/gameMapGroup";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
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
    gameMapGroup,
    gameMapGroupsIndex,
    setSelectedIDInCanvas,
}: {
    gameMapGroup?: GameMapGroupWithID;
    gameMapGroupsIndex: number;
    setSelectedIDInCanvas: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);
    const [isEditItemDialogOpen, setIsEditDialogOpen] = useState(false);

    if (gameMapGroup == null) return;

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
                {selectedID != null &&
                    gameMapGroup.gameMaps.some((v) => v.id === selectedID) && (
                        <>
                            <MoveItemUpButton
                                gameMapGroupsIndex={gameMapGroupsIndex}
                                selectedID={selectedID}
                            />
                            <MoveItemDownButton
                                gameMapGroupsIndex={gameMapGroupsIndex}
                                selectedID={selectedID}
                            />
                            <EditItemButton
                                gameMapGroupsIndex={gameMapGroupsIndex}
                                selectedID={selectedID}
                                isEditItemDialogOpen={isEditItemDialogOpen}
                                setIsEditItemDialogOpen={setIsEditDialogOpen}
                            />
                            <RemoveItemButton
                                gameMapGroupsIndex={gameMapGroupsIndex}
                                selectedID={selectedID}
                                setSelectedIDInCanvas={setSelectedIDInCanvas}
                            />
                        </>
                    )}
                <AddItemButton
                    className="grid justify-items-center"
                    gameMapGroupsIndex={gameMapGroupsIndex}
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
    gameMapGroupsIndex,
    className,
}: {
    gameMapGroupsIndex: number;
    className?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={className}>
            <PlusIconLargeButton onClick={() => setIsOpen(true)} />
            <AddItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                gameMapGroupsIndex={gameMapGroupsIndex}
            />
        </div>
    );
};

const AddItemDialog = ({
    isOpen,
    setIsOpen,
    gameMapGroupsIndex,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameMapGroupsIndex: number;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);
    const [name, setName] = useState("");
    const [items, setItems] = useState("");
    const [monsters, setMonsters] = useState("");
    const [memo, setMemo] = useState("");
    const [icon, setIcon] = useState("🔴");
    const [x, setX] = useState("50");
    const [y, setY] = useState("50");

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
        setStrategyMemo((v) =>
            GameMapUtility.added(v, gameMapGroupsIndex, gameMap),
        );
        setIsOpen(false);
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
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = ({
    gameMapGroupsIndex,
    selectedID,
    isEditItemDialogOpen,
    setIsEditItemDialogOpen,
}: {
    gameMapGroupsIndex: number;
    selectedID: string;
    isEditItemDialogOpen: boolean;
    setIsEditItemDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const index = GameMapUtility.findIndex(
        strategyMemo,
        gameMapGroupsIndex,
        selectedID,
    );

    return (
        <>
            <PencilIconLargeButton
                onClick={() => setIsEditItemDialogOpen(true)}
            />
            {index != null && (
                <EditItemDialog
                    key={`${isEditItemDialogOpen}`}
                    isOpen={isEditItemDialogOpen}
                    setIsOpen={setIsEditItemDialogOpen}
                    gameMapGroupsIndex={gameMapGroupsIndex}
                    index={index}
                />
            )}
        </>
    );
};

const EditItemDialog = ({
    isOpen,
    setIsOpen,
    gameMapGroupsIndex,
    index,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameMapGroupsIndex: number;
    index: number;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const gameMap =
        strategyMemo.gameMapGroups[gameMapGroupsIndex].gameMaps[index];
    const [name, setName] = useState(gameMap.name);
    const [items, setItems] = useState(gameMap.items.join("、"));
    const [monsters, setMonsters] = useState(gameMap.monsters.join("、"));
    const [memo, setMemo] = useState(gameMap.memo);
    const [icon, setIcon] = useState(gameMap.icon);
    const [x, setX] = useState(gameMap.x.toString());
    const [y, setY] = useState(gameMap.y.toString());

    const handleButtonClick = () => {
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
        setStrategyMemo((v) =>
            GameMapUtility.changed(v, gameMapGroupsIndex, index, newGameMap),
        );
        setIsOpen(false);
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
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const RemoveItemButton = ({
    gameMapGroupsIndex,
    selectedID,
    setSelectedIDInCanvas,
}: {
    gameMapGroupsIndex: number;
    selectedID: string;
    setSelectedIDInCanvas: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const index = GameMapUtility.findIndex(
        strategyMemo,
        gameMapGroupsIndex,
        selectedID,
    );
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TrashIconLargeButton onClick={() => setIsOpen(true)} />
            {index != null && (
                <RemoveItemDialog
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    gameMapGroupsIndex={gameMapGroupsIndex}
                    index={index}
                    setSelectedIDInCanvas={setSelectedIDInCanvas}
                />
            )}
        </>
    );
};

const RemoveItemDialog = ({
    isOpen,
    setIsOpen,
    gameMapGroupsIndex,
    index,
    setSelectedIDInCanvas,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameMapGroupsIndex: number;
    index: number;
    setSelectedIDInCanvas: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.removed(v, gameMapGroupsIndex, index),
        );
        setIsOpen(false);
        setSelectedIDInCanvas(null);
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
    gameMapGroupsIndex,
    selectedID,
}: {
    gameMapGroupsIndex: number;
    selectedID: string;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const index = GameMapUtility.findIndex(
        strategyMemo,
        gameMapGroupsIndex,
        selectedID,
    );

    if (index == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.movedUp(v, gameMapGroupsIndex, index),
        );
    };

    return <ChevronUpIconLargeButton onClick={() => handleButtonClick()} />;
};

const MoveItemDownButton = ({
    gameMapGroupsIndex,
    selectedID,
}: {
    gameMapGroupsIndex: number;
    selectedID: string;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const index = GameMapUtility.findIndex(
        strategyMemo,
        gameMapGroupsIndex,
        selectedID,
    );

    if (index == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapUtility.movedDown(v, gameMapGroupsIndex, index),
        );
    };

    return <ChevronDownIconLargeButton onClick={() => handleButtonClick()} />;
};
