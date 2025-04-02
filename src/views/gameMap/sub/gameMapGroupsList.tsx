import { Button, Field, Label, Select } from "@headlessui/react";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    GameMapGroupUtility,
    GameMapGroupWithID,
} from "../../../models/gameMapGroup";
import ImageFile, {
    ClipMode,
    ClipModeEnum,
    ClipModeJA,
    isClipMode,
    JpegQuality,
} from "../../../models/imageFile";
import { StrategyMemoUtility } from "../../../models/strategyMemo";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
import { Bg, Border, Text } from "../../commons/classNames";
import DialogView from "../../commons/dialogView";
import {
    ChevronDownIconButton,
    ChevronUpIconButton,
    ImageIconButton,
    ImageOffIconButton,
    PencilIconButton,
    PlusIconLargeButton,
    TrashIconButton,
} from "../../commons/iconButtons";
import TextField from "../../commons/textField";

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
                        <AddImageButton
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

const AddImageButton = ({
    gameMapGroupsIndex,
}: {
    gameMapGroupsIndex: number;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <ImageIconButton onClick={() => setIsOpen(true)} />
            <AddImageDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                gameMapGroupsIndex={gameMapGroupsIndex}
            />
        </>
    );
};

const AddImageDialog = ({
    isOpen,
    setIsOpen,
    gameMapGroupsIndex,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameMapGroupsIndex: number;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const [message, setMessage] = useState(
        StrategyMemoUtility.dataSize(strategyMemo),
    );
    const [jpegQuality, setJpegQuality] = useState<number>(JpegQuality.middle);
    const [clipMode, setClipMode] = useState<ClipMode>(ClipModeEnum.all);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (
        event,
    ) => {
        const files = event.target.files;
        if (files == null || files.length === 0) return;

        const file = files[0];
        if (!ImageFile.isImage(file)) {
            setMessage("⚠️JPEGまたはPNGファイルを選択してください");
            return;
        }

        const imageFile = new ImageFile(files[0]);
        const base64 = await imageFile.toBase64(jpegQuality / 100, clipMode);
        if (base64 == null) return;

        try {
            setStrategyMemo((v) => {
                const obj = GameMapGroupUtility.changedImage(
                    v,
                    gameMapGroupsIndex,
                    base64,
                );
                setMessage(StrategyMemoUtility.dataSize(obj));
                return obj;
            });
        } catch (error) {
            if (String(error).includes("QuotaExceededError")) {
                setMessage("⚠️データ量の上限に達したため保存に失敗しました");
                return;
            }

            console.log(error);
        } finally {
            event.target.value = "";
        }
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="マップ画像の追加"
            secondaryButtonLabel="閉じる"
        >
            <div className="space-y-4">
                <p>{message}</p>
                <div>
                    <label
                        className={`rounded-md border-2 px-2 py-1.5 ${Border.neutral400} ${Bg.hoverNeutral200}`}
                        htmlFor="image-file-open"
                    >
                        ファイルを開く
                    </label>
                    <input
                        className="hidden"
                        id="image-file-open"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div>
                        <Button
                            className={`rounded-l-md border-2 px-2 py-1.5 ${Border.neutral400} ${Bg.hoverNeutral200}`}
                            onClick={() => setJpegQuality(JpegQuality.low)}
                        >
                            低
                        </Button>
                        <Button
                            className={`border-y-2 px-2 py-1.5 ${Border.neutral400} ${Bg.hoverNeutral200}`}
                            onClick={() => setJpegQuality(JpegQuality.middle)}
                        >
                            中
                        </Button>
                        <Button
                            className={`rounded-r-md border-2 px-2 py-1.5 ${Border.neutral400} ${Bg.hoverNeutral200}`}
                            onClick={() => setJpegQuality(JpegQuality.high)}
                        >
                            高
                        </Button>
                    </div>
                    <p>品質：{jpegQuality}</p>
                </div>
                <div>
                    <Field className="space-x-2">
                        <Label>切り取り位置</Label>
                        <Select
                            className={`rounded-md border-2 px-2 py-1.5 ${Border.neutral400}`}
                            value={clipMode}
                            onChange={(event) => {
                                if (!isClipMode(event.target.value)) return;

                                setClipMode(event.target.value);
                            }}
                        >
                            <option value={ClipModeEnum.all}>
                                {ClipModeJA.all}
                            </option>
                            <option value={ClipModeEnum.left}>
                                {ClipModeJA.left}
                            </option>
                            <option value={ClipModeEnum.right}>
                                {ClipModeJA.right}
                            </option>
                            <option value={ClipModeEnum.center}>
                                {ClipModeJA.center}
                            </option>
                        </Select>
                    </Field>
                </div>
            </div>
        </DialogView>
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
