import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    ChevronDownIconButton,
    ChevronUpIconButton,
    ImageOffIconButton,
    PencilIconButton,
    PlusIconLargeButton,
    TrashIconButton,
} from "../../commons/iconButtons";

import DialogView from "../../commons/dialogView";
import TextField from "../../commons/textField";

import { Image } from "lucide-react";
import {
    GameMapGroupUtility,
    GameMapGroupWithID,
} from "../../../models/gameMapGroup";
import ImageFile from "../../../models/imageFile";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
import { Bg, Border, Stroke, Text } from "../../commons/classNames";

const GameMapGroupsList = ({
    gameMapGroups,
    gameMapGroupsIndex,
    setGameMapGroupsIndex,
    setSelectedIDInCanvas,
    className,
}: {
    gameMapGroups: GameMapGroupWithID[];
    gameMapGroupsIndex: number;
    setGameMapGroupsIndex: React.Dispatch<React.SetStateAction<number>>;
    setSelectedIDInCanvas: React.Dispatch<React.SetStateAction<string | null>>;
    className?: string;
}) => {
    return (
        <div className={`flex w-45 flex-col space-y-2 ${className}`}>
            {gameMapGroups.length > 0 && (
                <>
                    <div className="flex justify-end">
                        <MoveItemUpButton
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
                    <div className="flex justify-end">
                        <MoveItemDownButton
                            gameMapGroupsIndex={gameMapGroupsIndex}
                            setGameMapGroupsIndex={setGameMapGroupsIndex}
                        />
                        <ImageOpenDialog
                            gameMapGroupsIndex={gameMapGroupsIndex}
                        />
                        <RemoveImageButton
                            gameMapGroupsIndex={gameMapGroupsIndex}
                        />
                    </div>
                    <ul
                        className={`cursor-default overflow-clip rounded-md border-2 ${Border.neutral950}`}
                    >
                        {gameMapGroups.map((v, i) => (
                            <li
                                key={v.id}
                                className={`px-2 py-1 ${gameMapGroupsIndex === i ? Bg.blue200 : Bg.hoverNeutral200}`}
                                onClick={() => {
                                    setGameMapGroupsIndex(i);
                                    setSelectedIDInCanvas(null);
                                }}
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
            <AddItemButton className="mx-auto" />
        </div>
    );
};

export default GameMapGroupsList;

/* -------------------------------------------------------------------------- */

const AddItemButton = ({ className }: { className?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={className}>
            <PlusIconLargeButton onClick={() => setIsOpen(true)} />
            <AddItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
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
    const [name, setName] = useState("");

    const handleButtonClick = () => {
        const gameMapGroup = GameMapGroupUtility.create(name, [], "", uuidv4());
        setStrategyMemo((v) => GameMapGroupUtility.added(v, gameMapGroup));
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
            <TextField
                label="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapGroupUtility.changedName(v, gameMapGroupsIndex, name),
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

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapGroupUtility.removed(v, gameMapGroupsIndex),
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
            secondaryButtonLabel="キャンセル"
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

    return (
        <ChevronUpIconButton
            onClick={() => {
                setStrategyMemo((v) =>
                    GameMapGroupUtility.movedUp(v, gameMapGroupsIndex),
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

    return (
        <ChevronDownIconButton
            onClick={() => {
                setStrategyMemo((v) =>
                    GameMapGroupUtility.movedDown(v, gameMapGroupsIndex),
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

/* -------------------------------------------------------------------------- */

const ImageOpenDialog = ({
    gameMapGroupsIndex,
}: {
    gameMapGroupsIndex: number;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (
        event,
    ) => {
        const files = event.target.files;
        if (files == null || files.length === 0) return;

        const imageFile = new ImageFile(files[0]);
        const base64 = await imageFile.toBase64(100, 100);
        if (base64 == null) return;

        setStrategyMemo((v) =>
            GameMapGroupUtility.changedImage(v, gameMapGroupsIndex, base64),
        );
    };

    return (
        <>
            <label
                className={`rounded-full p-2 ${Bg.hoverNeutral200}`}
                htmlFor="image-file-open"
            >
                <Image className={`${Stroke.neutral700}`} />
            </label>
            <input
                className="hidden"
                id="image-file-open"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleChange}
            />
        </>
    );
};

/* -------------------------------------------------------------------------- */

const RemoveImageButton = ({
    gameMapGroupsIndex,
}: {
    gameMapGroupsIndex: number;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <ImageOffIconButton onClick={() => setIsOpen(true)} />
            <RemoveImageDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                gameMapGroupsIndex={gameMapGroupsIndex}
            />
        </>
    );
};

const RemoveImageDialog = ({
    isOpen,
    setIsOpen,
    gameMapGroupsIndex,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameMapGroupsIndex: number;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapGroupUtility.changedImage(v, gameMapGroupsIndex, ""),
        );
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="マップ画像の削除"
            primaryButtonLabel="削除"
            secondaryButtonLabel="キャンセル"
            onPrimaryButtonClick={handleButtonClick}
            shouldUseWarningColor={true}
        />
    );
};
