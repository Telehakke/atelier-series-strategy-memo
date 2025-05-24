import { Button, Field, Label, Select } from "@headlessui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    clipModeAtom,
    gameMapsAtom,
    isReadonlyAtom,
    jpegQualityAtom,
    selectedGameMapIdAtom,
    strategyMemoAtom,
} from "../../../atoms";
import ErrorChecker from "../../../models/errorChecker";
import { GameMap, GameMapId, GameMapList } from "../../../models/gameMap";
import ImageFile, {
    ClipModeEnum,
    isClipMode,
    JpegQuality,
    JpegQualityEnum,
} from "../../../models/imageFile";
import LocalStorage from "../../../models/localStorage";

import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { GameMapDetailList } from "../../../models/gameMapDetail";
import { GameMapShapeList } from "../../../models/gameMapShape";
import { Bg, Border, Stroke } from "../../commons/classNames";
import DialogView from "../../commons/dialogView";
import {
    ImageIconButton,
    ImageOffIconButton,
    MiddleIconButton,
    middleIconClassName,
    PencilIconButton,
    TrashIconButton,
} from "../../commons/iconButtons";
import TextField from "../../commons/textField";

const GameMapListController = () => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);

    const HStack = ({ children }: { children: ReactNode }) => (
        <div className="flex items-center justify-center gap-2">{children}</div>
    );

    const VStack = ({ children }: { children: ReactNode }) => (
        <div className="flex flex-col gap-2">{children}</div>
    );

    return (
        <HStack>
            <AddGameMapButton />
            {!isReadonly && selectedGameMapId != null && (
                <>
                    <VStack>
                        <EditItemButton gameMapId={selectedGameMapId} />
                        <RemoveItemButton gameMapId={selectedGameMapId} />
                    </VStack>
                    <VStack>
                        <AddImageButton gameMapId={selectedGameMapId} />
                        <RemoveImageButton gameMapId={selectedGameMapId} />
                    </VStack>
                    <VStack>
                        <MoveItemUpButton gameMapId={selectedGameMapId} />
                        <MoveItemDownButton gameMapId={selectedGameMapId} />
                    </VStack>
                </>
            )}
        </HStack>
    );
};

export default GameMapListController;

/* -------------------------------------------------------------------------- */

const AddGameMapButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <MiddleIconButton
                className={`${Bg.blue500} ${Bg.hoverBlue400} ${Stroke.neutral50}`}
                onClick={() => setIsOpen(true)}
            >
                <Plus className={middleIconClassName} />
            </MiddleIconButton>
            {isOpen && <AddItemDialog isOpen={isOpen} setIsOpen={setIsOpen} />}
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
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const setSelectedGameMapId = useSetAtom(selectedGameMapIdAtom);
    const [name, setName] = useState("");

    const handleClick = () => {
        const gameMap = GameMap.create({
            name: name,
            gameMapDetails: new GameMapDetailList(),
            gameMapShapes: new GameMapShapeList(),
            image: "",
            id: new GameMapId(uuidv4()),
        });
        setStrategyMemo((v) => {
            const newGameMaps = v.gameMaps.added(gameMap);
            const newStrategyMemo = v.replacedGameMaps(newGameMaps);
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });

        // 追加したアイテムを選択状態にする
        setSelectedGameMapId(gameMap.id);
        setIsOpen(false);
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
            <TextField
                label="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <PencilIconButton onClick={() => setIsOpen(true)} />
            {isOpen && (
                <EditItemDialog
                    gameMapId={gameMapId}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}
        </>
    );
};

const EditItemDialog = ({
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
    const [gameMaps, setGameMaps] = useAtom(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    const [name, setName] = useState(gameMap?.name ?? "");

    if (gameMap == null) return <></>;

    const handleClick = () => {
        const editedGameMap = gameMap.copyWith({ name: name });
        setStrategyMemo((v) => {
            const newGameMaps = v.gameMaps.replaced(editedGameMap);
            const newStrategyMemo = v.replacedGameMaps(newGameMaps);
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
        setIsOpen(false);
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
            <TextField
                label="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const RemoveItemButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TrashIconButton onClick={() => setIsOpen(true)} />
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
    const setSelectedGameMapListIds = useSetAtom(selectedGameMapIdAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMaps = v.gameMaps.removed(gameMap.id);
            const newStrategyMemo = v.replacedGameMaps(newGameMaps);
            const firstGameMap = newStrategyMemo.gameMaps.at(0);
            setSelectedGameMapListIds(firstGameMap?.id ?? null);
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
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
        ></DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemUpButton = ({ gameMapId }: { gameMapId: GameMapId }) => (
    <MoveItemButton
        gameMapId={gameMapId}
        action={(gameMaps) => gameMaps.movedUp(gameMapId)}
    >
        <ChevronUp className={middleIconClassName} />
    </MoveItemButton>
);

const MoveItemDownButton = ({ gameMapId }: { gameMapId: GameMapId }) => (
    <MoveItemButton
        gameMapId={gameMapId}
        action={(gameMaps) => gameMaps.movedDown(gameMapId)}
    >
        <ChevronDown className={middleIconClassName} />
    </MoveItemButton>
);

const MoveItemButton = ({
    gameMapId,
    action,
    children,
}: {
    gameMapId: GameMapId;
    action: (gameMaps: GameMapList) => GameMapList;
    children: ReactNode;
}) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMaps = action(v.gameMaps);
            const newStrategyMemo = v.replacedGameMaps(newGameMaps);
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    return (
        <MiddleIconButton onClick={handleClick}>{children}</MiddleIconButton>
    );
};

/* -------------------------------------------------------------------------- */

const AddImageButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <ImageIconButton onClick={() => setIsOpen(true)} />
            {isOpen && (
                <AddImageDialog
                    gameMapId={gameMapId}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}
        </>
    );
};

const AddImageDialog = ({
    gameMapId,
    isOpen,
    setIsOpen,
}: {
    gameMapId: GameMapId;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const strategyMemo = useAtomValue(strategyMemoAtom);
    const [message, setMessage] = useState(strategyMemo.dataSize());

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="マップ画像の追加"
            secondaryButtonLabel="閉じる"
        >
            <div className="space-y-4">
                <p>{message}</p>
                <FileOpenDialog gameMapId={gameMapId} setMessage={setMessage} />
                <JpegQualitySegmentedButton />
                <ClipModeSelectBox />
            </div>
        </DialogView>
    );
};

const FileOpenDialog = ({
    gameMapId,
    setMessage,
}: {
    gameMapId: GameMapId;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const jpegQuality = useAtomValue(jpegQualityAtom);
    const clipMode = useAtomValue(clipModeAtom);

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files == null || files.length === 0) return;

        const file = files[0];
        if (!ImageFile.isImage(file)) {
            setMessage("⚠️JPEGまたはPNGファイルを選択してください");
            return;
        }

        const imageFile = new ImageFile(file);
        const base64 = await imageFile.toBase64(jpegQuality, clipMode);
        if (base64 == null) return;

        try {
            setStrategyMemo((v) => {
                const gameMap = v.gameMaps.find(gameMapId);
                if (gameMap == null) return v;

                const newGameMap = gameMap.copyWith({ image: base64 });
                const newGameMaps = v.gameMaps.replaced(newGameMap);
                const newStrategyMemo = v.replacedGameMaps(newGameMaps);
                setGameMaps(newStrategyMemo.gameMaps);
                LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
                setMessage(newStrategyMemo.dataSize());
                return newStrategyMemo;
            });
        } catch (error) {
            if (ErrorChecker.isQuotaExceededError(error)) {
                setMessage(ErrorChecker.quotaExceededErrorMessage);
                return;
            }

            console.log(error);
        } finally {
            event.target.value = "";
        }
    };

    return (
        <div>
            <label
                className={`rounded-md border-2 px-2 py-1.5 ${Border.neutral400_700} ${Bg.hoverNeutral200_800}`}
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
    );
};

const JpegQualitySegmentedButton = () => {
    const [jpegQuality, setJpegQuality] = useAtom(jpegQualityAtom);

    const backgroundColor = (input: JpegQuality): string => {
        if (input.value === jpegQuality.value) return Bg.blue500;
        return Bg.hoverNeutral200_800;
    };

    return (
        <div className="flex items-center gap-4">
            <div>
                <Button
                    className={`rounded-l-md border-2 px-2 py-1.5 ${Border.neutral400_700} ${backgroundColor(JpegQualityEnum.low)}`}
                    onClick={() => setJpegQuality(JpegQualityEnum.low)}
                >
                    低
                </Button>
                <Button
                    className={`border-y-2 px-2 py-1.5 ${Border.neutral400_700} ${backgroundColor(JpegQualityEnum.middle)}`}
                    onClick={() => setJpegQuality(JpegQualityEnum.middle)}
                >
                    中
                </Button>
                <Button
                    className={`rounded-r-md border-2 px-2 py-1.5 ${Border.neutral400_700} ${backgroundColor(JpegQualityEnum.high)}`}
                    onClick={() => setJpegQuality(JpegQualityEnum.high)}
                >
                    高
                </Button>
            </div>
            <p>品質：{jpegQuality.label}</p>
        </div>
    );
};

const ClipModeSelectBox = () => {
    const [clipMode, setClipMode] = useAtom(clipModeAtom);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!isClipMode(event.target.value)) return;

        setClipMode(event.target.value);
    };

    return (
        <Field className="flex items-center gap-4">
            <Label>切り取り位置</Label>
            <Select
                className={`rounded-md border-2 px-2 py-1.5 ${Border.neutral400_700}`}
                value={clipMode}
                onChange={handleChange}
            >
                <option value={ClipModeEnum.all.value}>
                    {ClipModeEnum.all.label}
                </option>
                <option value={ClipModeEnum.left.value}>
                    {ClipModeEnum.left.label}
                </option>
                <option value={ClipModeEnum.right.value}>
                    {ClipModeEnum.right.label}
                </option>
                <option value={ClipModeEnum.center.value}>
                    {ClipModeEnum.center.label}
                </option>
            </Select>
        </Field>
    );
};

/* -------------------------------------------------------------------------- */

const RemoveImageButton = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <ImageOffIconButton onClick={() => setIsOpen(true)} />
            {isOpen && (
                <RemoveImageDialog
                    gameMapId={gameMapId}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}
        </>
    );
};

const RemoveImageDialog = ({
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

    const handleButtonClick = () => {
        setStrategyMemo((v) => {
            const gameMap = v.gameMaps.find(gameMapId);
            if (gameMap == null) return v;

            const newGameMap = gameMap.copyWith({ image: "" });
            const newGameMaps = v.gameMaps.replaced(newGameMap);
            const newStrategyMemo = v.replacedGameMaps(newGameMaps);
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="マップ画像の削除"
            primaryButtonLabel="削除"
            secondaryButtonLabel="キャンセル"
            handlePrimaryButtonClick={handleButtonClick}
            shouldUseWarningColor={true}
        />
    );
};
