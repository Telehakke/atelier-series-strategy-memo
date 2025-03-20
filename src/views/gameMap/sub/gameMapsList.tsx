import { useAtom, useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GameMapUtility, GameMapWithID } from "../../../models/gameMap";
import { GameMapGroupWithID } from "../../../models/gameMapGroup";
import { StrategyMemoUtility } from "../../../models/strategyMemo";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
import { Bg, Border, Divide, Ring, Text } from "../../commons/classNames";
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
    onFiltering,
}: {
    gameMapGroup?: GameMapGroupWithID;
    gameMapGroupsIndex: number;
    onFiltering: boolean;
}) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);

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
                    />
                ))}
                {!onFiltering && (
                    <AddItemButton gameMapGroupsIndex={gameMapGroupsIndex} />
                )}
            </div>
            {selectedID != null && (
                <div className="fixed right-4 bottom-4 space-y-4">
                    {!onFiltering && (
                        <>
                            <MoveItemUpButton
                                gameMapGroup={gameMapGroup}
                                gameMapGroupsIndex={gameMapGroupsIndex}
                                selectedID={selectedID}
                            />
                            <MoveItemDownButton
                                gameMapGroup={gameMapGroup}
                                gameMapGroupsIndex={gameMapGroupsIndex}
                                selectedID={selectedID}
                            />
                        </>
                    )}
                    <EditItemButton
                        gameMapGroup={gameMapGroup}
                        gameMapGroupsIndex={gameMapGroupsIndex}
                        selectedID={selectedID}
                    />
                    <RemoveItemButton
                        gameMapGroup={gameMapGroup}
                        gameMapGroupsIndex={gameMapGroupsIndex}
                        selectedID={selectedID}
                    />
                </div>
            )}
        </>
    );
};

export default GameMapsList;

/* -------------------------------------------------------------------------- */

const Card = ({
    gameMap,
    selectedID,
    setSelectedID,
}: {
    gameMap: GameMapWithID;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    return (
        <div
            className={`mx-auto max-w-150 overflow-clip rounded-md border-2 hover:ring-4 ${Border.neutral950} ${Ring.blue500}`}
            onClick={() =>
                setSelectedID(gameMap.id === selectedID ? null : gameMap.id)
            }
        >
            <div
                className={`flex h-9 items-center justify-between gap-2 px-1 ${gameMap.id === selectedID ? Bg.blue500 : Bg.neutral950}`}
            >
                <h2
                    className={`scroll-mt-14 scroll-pt-14 truncate text-lg font-bold ${Text.neutral50}`}
                    id={gameMap.name}
                >
                    {gameMap.name}
                </h2>
            </div>
            <div className={`divide-y-2 text-sm ${Divide.neutral950}`}>
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
                    <TextWithLabel label="アイコン">
                        {gameMap.icon}
                    </TextWithLabel>
                    <TextWithLabel label="座標x">{gameMap.x}</TextWithLabel>
                    <TextWithLabel label="座標y">{gameMap.y}</TextWithLabel>
                </div>
            </div>
        </div>
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
}: {
    gameMapGroupsIndex: number;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <PlusIconLargeButton onClick={() => setIsOpen(true)} />
            <AddItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                gameMapGroupsIndex={gameMapGroupsIndex}
            />
        </>
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

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
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
        if (!gameMap.name) {
            setIsOpen(false);
            return;
        }

        setStrategyMemo((v) =>
            StrategyMemoUtility.addedGameMap(v, gameMapGroupsIndex, gameMap),
        );
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の追加"
            primaryButtonLabel="追加"
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
    gameMapGroup,
    gameMapGroupsIndex,
    selectedID,
}: {
    gameMapGroup: GameMapGroupWithID;
    gameMapGroupsIndex: number;
    selectedID: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const gameMapsIndex = gameMapGroup.gameMaps.findIndex(
        (v) => v.id === selectedID,
    );

    if (gameMapsIndex < 0) return <></>;

    return (
        <>
            <PencilIconLargeButton onClick={() => setIsOpen(true)} />
            <EditItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                gameMapGroupsIndex={gameMapGroupsIndex}
                gameMapsIndex={gameMapsIndex}
            />
        </>
    );
};

const EditItemDialog = ({
    isOpen,
    setIsOpen,
    gameMapGroupsIndex,
    gameMapsIndex,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameMapGroupsIndex: number;
    gameMapsIndex: number;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const gameMap =
        strategyMemo.gameMapGroups[gameMapGroupsIndex].gameMaps[gameMapsIndex];
    const [name, setName] = useState(gameMap.name);
    const [items, setItems] = useState(gameMap.items.join("、"));
    const [monsters, setMonsters] = useState(gameMap.monsters.join("、"));
    const [memo, setMemo] = useState(gameMap.memo);
    const [icon, setIcon] = useState(gameMap.icon);
    const [x, setX] = useState(gameMap.x.toString());
    const [y, setY] = useState(gameMap.y.toString());

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
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
        if (!newGameMap.name) {
            setIsOpen(false);
            return;
        }

        setStrategyMemo((v) =>
            StrategyMemoUtility.changedGameMap(
                v,
                gameMapGroupsIndex,
                gameMapsIndex,
                newGameMap,
            ),
        );
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の編集"
            primaryButtonLabel="変更"
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
    gameMapGroup,
    gameMapGroupsIndex,
    selectedID,
}: {
    gameMapGroup: GameMapGroupWithID;
    gameMapGroupsIndex: number;
    selectedID: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const gameMapsIndex = gameMapGroup.gameMaps.findIndex(
        (v) => v.id === selectedID,
    );

    if (gameMapsIndex < 0) return <></>;

    return (
        <>
            <TrashIconLargeButton onClick={() => setIsOpen(true)} />
            <RemoveItemDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                gameMapGroupsIndex={gameMapGroupsIndex}
                gameMapsIndex={gameMapsIndex}
            />
        </>
    );
};

const RemoveItemDialog = ({
    isOpen,
    setIsOpen,
    gameMapGroupsIndex,
    gameMapsIndex,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameMapGroupsIndex: number;
    gameMapsIndex: number;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        setStrategyMemo((v) =>
            StrategyMemoUtility.removedGameMap(
                v,
                gameMapGroupsIndex,
                gameMapsIndex,
            ),
        );
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の削除"
            primaryButtonLabel="削除"
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
        <>
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
        </>
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemUpButton = ({
    gameMapGroup,
    gameMapGroupsIndex,
    selectedID,
}: {
    gameMapGroup: GameMapGroupWithID;
    gameMapGroupsIndex: number;
    selectedID: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);
    const gameMapsIndex = gameMapGroup.gameMaps.findIndex(
        (v) => v.id === selectedID,
    );

    if (gameMapsIndex < 0) return <></>;

    return (
        <ChevronUpIconLargeButton
            onClick={() => {
                setStrategyMemo((v) =>
                    StrategyMemoUtility.movedGameMapUp(
                        v,
                        gameMapGroupsIndex,
                        gameMapsIndex,
                    ),
                );
            }}
        />
    );
};

const MoveItemDownButton = ({
    gameMapGroup,
    gameMapGroupsIndex,
    selectedID,
}: {
    gameMapGroup: GameMapGroupWithID;
    gameMapGroupsIndex: number;
    selectedID: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);
    const gameMapsIndex = gameMapGroup.gameMaps.findIndex(
        (v) => v.id === selectedID,
    );

    if (gameMapsIndex < 0) return <></>;

    return (
        <ChevronDownIconLargeButton
            onClick={() => {
                setStrategyMemo((v) =>
                    StrategyMemoUtility.movedGameMapDown(
                        v,
                        gameMapGroupsIndex,
                        gameMapsIndex,
                    ),
                );
            }}
        />
    );
};
