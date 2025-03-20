import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    ChevronDownIconButton,
    ChevronUpIconButton,
    PencilIconButton,
    PlusIconLargeButton,
    TrashIconButton,
} from "../../commons/iconButtons";

import DialogView from "../../commons/dialogView";
import TextField from "../../commons/textField";

import {
    GameMapGroupUtility,
    GameMapGroupWithID,
} from "../../../models/gameMapGroup";
import { StrategyMemoUtility } from "../../../models/strategyMemo";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
import { Bg, Border, Text } from "../../commons/classNames";

const GameMapGroupsList = ({
    gameMapGroups,
    gameMapGroupsIndex,
    setGameMapGroupsIndex,
    className,
}: {
    gameMapGroups: GameMapGroupWithID[];
    gameMapGroupsIndex: number;
    setGameMapGroupsIndex: React.Dispatch<React.SetStateAction<number>>;
    className?: string;
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {gameMapGroups.length > 0 && (
                <>
                    <div className="flex justify-end gap-2">
                        <MoveItemUpButton
                            gameMapGroupsIndex={gameMapGroupsIndex}
                            setGameMapGroupsIndex={setGameMapGroupsIndex}
                        />
                        <MoveItemDownButton
                            gameMapGroupsIndex={gameMapGroupsIndex}
                            setGameMapGroupsIndex={setGameMapGroupsIndex}
                        />
                        <EditItemButton
                            gameMapGroupsIndex={gameMapGroupsIndex}
                        />
                        <RemoveItemButton
                            gameMapGroupsIndex={gameMapGroupsIndex}
                            setGameMapGroupsIndex={setGameMapGroupsIndex}
                        />
                    </div>
                    <ul
                        className={`cursor-default overflow-clip rounded-md border-2 ${Border.neutral950}`}
                    >
                        {gameMapGroups.map((v, i) => (
                            <li
                                key={v.id}
                                className={`px-2 ${gameMapGroupsIndex === i ? Bg.blue200 : Bg.hoverNeutral200}`}
                                onClick={() => setGameMapGroupsIndex(i)}
                            >
                                {v.name}
                                <span
                                    className={`ml-2 font-bold ${Text.orange500}`}
                                >
                                    {v.gameMaps.length}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <AddItemButton />
        </div>
    );
};

export default GameMapGroupsList;

/* -------------------------------------------------------------------------- */

const AddItemButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <PlusIconLargeButton onClick={() => setIsOpen(true)} />
            <AddItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    );
};

const AddItemDialog = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);
    const [value, setValue] = useState("");

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        const gameMapGroup = GameMapGroupUtility.create(value, [], uuidv4());
        if (!gameMapGroup.name) {
            setIsOpen(false);
            return;
        }

        setStrategyMemo((v) =>
            StrategyMemoUtility.addedGameMapGroup(v, gameMapGroup),
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
            <TextField
                label="名前"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = ({
    gameMapGroupsIndex,
}: {
    gameMapGroupsIndex: number;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <PencilIconButton onClick={() => setIsOpen(true)} />
            <EditItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                gameMapGroupsIndex={gameMapGroupsIndex}
            />
        </>
    );
};

const EditItemDialog = ({
    isOpen,
    setIsOpen,
    gameMapGroupsIndex,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameMapGroupsIndex: number;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const gameMapGroup = strategyMemo.gameMapGroups[gameMapGroupsIndex];
    const [name, setName] = useState(gameMapGroup.name);

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        if (!name) {
            setIsOpen(false);
            return;
        }

        setStrategyMemo((v) =>
            StrategyMemoUtility.changedGameMapGroupName(
                v,
                gameMapGroupsIndex,
                name,
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
            <TextField
                label="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const RemoveItemButton = ({
    gameMapGroupsIndex,
    setGameMapGroupsIndex,
}: {
    gameMapGroupsIndex: number;
    setGameMapGroupsIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TrashIconButton onClick={() => setIsOpen(true)} />
            <RemoveItemDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                gameMapGroupsIndex={gameMapGroupsIndex}
                setGameMapGroupsIndex={setGameMapGroupsIndex}
            />
        </>
    );
};

const RemoveItemDialog = ({
    isOpen,
    setIsOpen,
    gameMapGroupsIndex,
    setGameMapGroupsIndex,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameMapGroupsIndex: number;
    setGameMapGroupsIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        setStrategyMemo((v) =>
            StrategyMemoUtility.removedGameMapGroup(v, gameMapGroupsIndex),
        );
        setGameMapGroupsIndex(0);
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
        ></DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemUpButton = ({
    gameMapGroupsIndex,
    setGameMapGroupsIndex,
}: {
    gameMapGroupsIndex: number;
    setGameMapGroupsIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (gameMapGroupsIndex < 0) return <></>;

    return (
        <ChevronUpIconButton
            onClick={() => {
                setStrategyMemo((v) =>
                    StrategyMemoUtility.movedGameMapGroupUp(
                        v,
                        gameMapGroupsIndex,
                    ),
                );
                setGameMapGroupsIndex((v) => {
                    const index = v - 1;
                    if (index < 0) return v;

                    return index;
                });
            }}
        />
    );
};

const MoveItemDownButton = ({
    gameMapGroupsIndex,
    setGameMapGroupsIndex,
}: {
    gameMapGroupsIndex: number;
    setGameMapGroupsIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);

    if (gameMapGroupsIndex < 0) return <></>;

    return (
        <ChevronDownIconButton
            onClick={() => {
                setStrategyMemo((v) =>
                    StrategyMemoUtility.movedGameMapGroupDown(
                        v,
                        gameMapGroupsIndex,
                    ),
                );
                setGameMapGroupsIndex((v) => {
                    const index = v + 1;
                    if (index >= strategyMemo.gameMapGroups.length) return v;

                    return index;
                });
            }}
        />
    );
};
