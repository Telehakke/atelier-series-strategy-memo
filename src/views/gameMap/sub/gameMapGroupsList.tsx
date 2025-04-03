import { Button, Field, Label, Select } from "@headlessui/react";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    clipModeAtom,
    jpegQualityAtom,
    strategyMemoRepositoryAtom,
} from "../../../atoms";
import {
    GameMapGroupUtility,
    GameMapGroupWithID,
} from "../../../models/gameMapGroup";
import ImageFile, {
    ClipModeEnum,
    ClipModeJA,
    isClipMode,
    JpegQuality,
} from "../../../models/imageFile";
import { StrategyMemoUtility } from "../../../models/strategyMemo";
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
    selectedIDInGameMapGroups,
    setSelectedIndexInGameMapGroups,
    setSelectedIDInCanvas,
    className,
}: {
    gameMapGroups: GameMapGroupWithID[];
    selectedIDInGameMapGroups: string | null;
    setSelectedIndexInGameMapGroups: React.Dispatch<
        React.SetStateAction<number>
    >;
    setSelectedIDInCanvas: React.Dispatch<React.SetStateAction<string | null>>;
    className?: string;
}) => {
    return (
        <div className={`flex w-45 flex-col space-y-2 ${className}`}>
            {gameMapGroups.length > 0 && (
                <>
                    <div className="flex justify-end">
                        <MoveItemUpButton
                            selectedID={selectedIDInGameMapGroups}
                            setSelectedIndex={setSelectedIndexInGameMapGroups}
                        />
                        <EditItemButton
                            selectedID={selectedIDInGameMapGroups}
                        />
                        <RemoveItemButton
                            selectedID={selectedIDInGameMapGroups}
                            setSelectedIndex={setSelectedIndexInGameMapGroups}
                        />
                    </div>
                    <div className="flex justify-end">
                        <MoveItemDownButton
                            selectedID={selectedIDInGameMapGroups}
                            setSelectedIndex={setSelectedIndexInGameMapGroups}
                        />
                        <AddImageButton
                            selectedID={selectedIDInGameMapGroups}
                        />
                        <RemoveImageButton
                            selectedID={selectedIDInGameMapGroups}
                        />
                    </div>
                    <ul
                        className={`cursor-default overflow-clip rounded-md border-2 ${Border.neutral950}`}
                    >
                        {gameMapGroups.map((v, i) => (
                            <li
                                key={v.id}
                                className={`px-2 py-1 ${v.id === selectedIDInGameMapGroups ? Bg.blue200 : Bg.hoverNeutral200}`}
                                onClick={() => {
                                    setSelectedIndexInGameMapGroups(i);
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
            <AddItemButton
                setSelectedIndex={setSelectedIndexInGameMapGroups}
                className="mx-auto"
            />
        </div>
    );
};

export default GameMapGroupsList;

/* -------------------------------------------------------------------------- */

const AddItemButton = ({
    setSelectedIndex,
    className,
}: {
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    className?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={className}>
            <PlusIconLargeButton onClick={() => setIsOpen(true)} />
            <AddItemDialog
                key={`${isOpen}`}
                setSelectedIndex={setSelectedIndex}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    );
};

const AddItemDialog = ({
    setSelectedIndex,
    isOpen,
    setIsOpen,
}: {
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);
    const [name, setName] = useState("");

    const handleButtonClick = () => {
        const gameMapGroup = GameMapGroupUtility.create(name, [], "", uuidv4());
        setStrategyMemo((v) => {
            const obj = GameMapGroupUtility.added(v, gameMapGroup);
            setSelectedIndex(obj.gameMapGroups.length - 1);
            return obj;
        });
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

const EditItemButton = ({ selectedID }: { selectedID: string | null }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (selectedID == null) return <></>;

    return (
        <>
            <PencilIconButton onClick={() => setIsOpen(true)} />
            <EditItemDialog
                key={`${isOpen}`}
                selectedID={selectedID}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    );
};

const EditItemDialog = ({
    selectedID,
    isOpen,
    setIsOpen,
}: {
    selectedID: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const gameMapGroup = GameMapGroupUtility.find(
        strategyMemo.gameMapGroups,
        selectedID,
    );
    const [name, setName] = useState(gameMapGroup?.name ?? "");

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapGroupUtility.changedName(v, selectedID, name),
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
    selectedID,
    setSelectedIndex,
}: {
    selectedID: string | null;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (selectedID == null) return <></>;

    return (
        <>
            <TrashIconButton onClick={() => setIsOpen(true)} />
            <RemoveItemDialog
                selectedID={selectedID}
                setSelectedIndex={setSelectedIndex}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    );
};

const RemoveItemDialog = ({
    selectedID,
    setSelectedIndex,
    isOpen,
    setIsOpen,
}: {
    selectedID: string;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) => GameMapGroupUtility.removed(v, selectedID));
        setSelectedIndex(0);
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
    selectedID,
    setSelectedIndex,
}: {
    selectedID: string | null;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) => GameMapGroupUtility.movedUp(v, selectedID));
        setSelectedIndex((v) => {
            let index = v - 1;
            if (index < 0) index = 0;
            return index;
        });
    };

    return <ChevronUpIconButton onClick={() => handleButtonClick()} />;
};

const MoveItemDownButton = ({
    selectedID,
    setSelectedIndex,
}: {
    selectedID: string | null;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) => {
            setSelectedIndex((i) => {
                let index = i + 1;
                if (v.gameMapGroups.length <= index) {
                    index = v.gameMapGroups.length - 1;
                }
                return index;
            });
            return GameMapGroupUtility.movedDown(v, selectedID);
        });
    };

    return <ChevronDownIconButton onClick={() => handleButtonClick()} />;
};

/* -------------------------------------------------------------------------- */

const AddImageButton = ({ selectedID }: { selectedID: string | null }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (selectedID == null) return <></>;

    return (
        <>
            <ImageIconButton onClick={() => setIsOpen(true)} />
            <AddImageDialog
                key={`${isOpen}`}
                selectedID={selectedID}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    );
};

const AddImageDialog = ({
    selectedID,
    isOpen,
    setIsOpen,
}: {
    selectedID: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const [message, setMessage] = useState(
        StrategyMemoUtility.dataSize(strategyMemo),
    );
    const [jpegQuality, setJpegQuality] = useAtom(jpegQualityAtom);
    const [clipMode, setClipMode] = useAtom(clipModeAtom);

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
                    selectedID,
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

const RemoveImageButton = ({ selectedID }: { selectedID: string | null }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (selectedID == null) return <></>;

    return (
        <>
            <ImageOffIconButton onClick={() => setIsOpen(true)} />
            <RemoveImageDialog
                selectedID={selectedID}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    );
};

const RemoveImageDialog = ({
    selectedID,
    isOpen,
    setIsOpen,
}: {
    selectedID: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) =>
            GameMapGroupUtility.changedImage(v, selectedID, ""),
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
