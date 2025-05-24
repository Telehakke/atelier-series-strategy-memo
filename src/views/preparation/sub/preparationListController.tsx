import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    canSelectMultipleAtom,
    isEditPreparationDialogOpenAtom,
    isReadonlyAtom,
    preparationsAtom,
    selectedPreparationIdsAtom,
    strategyMemoAtom,
} from "../../../atoms";
import ErrorChecker from "../../../models/errorChecker";
import LocalStorage from "../../../models/localStorage";
import {
    Preparation,
    PreparationId,
    PreparationIdList,
    PreparationList,
} from "../../../models/preparation";
import Split from "../../../models/split";
import { Bg, Stroke } from "../../commons/classNames";
import DialogView from "../../commons/dialogView";
import {
    ClipboardCopyIconLargeButton,
    ClipboardPasteIconLargeButton,
    FilesIconLargeButton,
    largeIconClassName,
    PencilIconLargeButton,
    PlusIconLargeButton,
    TrashIconLargeButton,
    VerticalSegmentedIconButton,
    XIconLargeButton,
} from "../../commons/iconButtons";
import TextField from "../../commons/textField";

const PreparationListController = ({ className }: { className?: string }) => {
    const selectedPreparationIds = useAtomValue(selectedPreparationIdsAtom);
    const [copiedItems, setCopiedItems] = useState(new PreparationList());

    if (selectedPreparationIds.isEmpty)
        return (
            <div className={`flex ${className}`}>
                <AddItemButton />
            </div>
        );

    return (
        <div className={className}>
            {copiedItems.isEmpty ? (
                <ItemActionButtons setCopiedItems={setCopiedItems} />
            ) : (
                <PasteAndXButtons
                    copiedItems={copiedItems}
                    setCopiedItems={setCopiedItems}
                />
            )}
        </div>
    );
};

export default PreparationListController;

/* -------------------------------------------------------------------------- */

const ItemActionButtons = ({
    setCopiedItems,
}: {
    setCopiedItems: React.Dispatch<React.SetStateAction<PreparationList>>;
}) => {
    const HStack = ({ children }: { children: ReactNode }) => (
        <div className="flex gap-4">{children}</div>
    );

    const VStack = ({ children }: { children: ReactNode }) => (
        <div className="flex flex-col justify-end gap-4">{children}</div>
    );

    return (
        <HStack>
            <VStack>
                <SelectionModeToggleButton />
            </VStack>
            <VStack>
                <EditItemButton />
                <CopyButton setCopiedItems={setCopiedItems} />
                <RemoveItemButton />
            </VStack>
            <VStack>
                <MoveItemButton />
                <XButton />
            </VStack>
        </HStack>
    );
};

/* -------------------------------------------------------------------------- */

const AddItemButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <PlusIconLargeButton
                className={`${Bg.blue500} ${Bg.hoverBlue400} ${Stroke.neutral50}`}
                description="追加"
                onClick={() => setIsOpen(true)}
            />
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
    const setPreparations = useSetAtom(preparationsAtom);
    const [name, setName] = useState("");
    const [materials, setMaterials] = useState("");
    const [categories, setCategories] = useState("");
    const [message, setMessage] = useState("");

    const handleClick = () => {
        const preparation = Preparation.create({
            name: name,
            materials: materials,
            categories: categories,
            checked: false,
            id: new PreparationId(uuidv4()),
        });

        try {
            setStrategyMemo((v) => {
                const newPreparations = v.preparations.added(preparation);
                const newStrategyMemo = v.replacedPreparations(newPreparations);
                setPreparations(newStrategyMemo.preparations);
                LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
                return newStrategyMemo;
            });
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
            <div className="flex flex-col gap-2">
                <p>{message}</p>
                <PreparationInput
                    state={{
                        name: name,
                        materials: materials,
                        categories: categories,
                        setName: setName,
                        setMaterials: setMaterials,
                        setCategories: setCategories,
                    }}
                />
            </div>
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = () => {
    const [isOpen, setIsOpen] = useAtom(isEditPreparationDialogOpenAtom);
    const selectedPreparationIds = useAtomValue(selectedPreparationIdsAtom);
    if (selectedPreparationIds.length !== 1) return <></>;

    return (
        <>
            <PencilIconLargeButton
                className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                description="編集"
                onClick={() => setIsOpen(true)}
            />
            {isOpen && (
                <EditItemDialog preparationId={selectedPreparationIds.at(0)!} />
            )}
        </>
    );
};

const EditItemDialog = ({
    preparationId,
}: {
    preparationId: PreparationId;
}) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setSelectedPreparationIds = useSetAtom(selectedPreparationIdsAtom);
    const [isOpen, setIsOpen] = useAtom(isEditPreparationDialogOpenAtom);

    const [preparations, setPreparations] = useAtom(preparationsAtom);
    const preparation = preparations.find(preparationId);
    const [name, setName] = useState(preparation?.name ?? "");
    const [materials, setMaterials] = useState(
        preparation?.materialsToCommaSeparatedStr ?? "",
    );
    const [categories, setCategories] = useState(
        preparation?.categoriesToCommaSeparatedStr ?? "",
    );
    const [message, setMessage] = useState("");

    if (preparation == null) return <></>;

    const handleClick = () => {
        const editedPreparation = preparation.copyWith({
            name: name,
            materials: Split.byComma(materials),
            categories: Split.byComma(categories),
        });

        try {
            setStrategyMemo((v) => {
                const newPreparations =
                    v.preparations.replaced(editedPreparation);
                const newStrategyMemo = v.replacedPreparations(newPreparations);
                setPreparations(newStrategyMemo.preparations);
                LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
                return newStrategyMemo;
            });
            setSelectedPreparationIds(new PreparationIdList());
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
            title="項目の編集"
            primaryButtonLabel="変更"
            secondaryButtonLabel="キャンセル"
            handlePrimaryButtonClick={handleClick}
        >
            <div className="flex flex-col gap-2">
                <p>{message}</p>
                <PreparationInput
                    state={{
                        name: name,
                        materials: materials,
                        categories: categories,
                        setName: setName,
                        setMaterials: setMaterials,
                        setCategories: setCategories,
                    }}
                />
            </div>
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const RemoveItemButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TrashIconLargeButton
                className={`${Bg.red500} ${Bg.hoverRed400} ${Stroke.neutral50}`}
                description="削除"
                onClick={() => setIsOpen(true)}
            />
            {isOpen && (
                <RemoveItemDialog isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </>
    );
};

const RemoveItemDialog = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const [selectedPreparationIds, setSelectedPreparationIds] = useAtom(
        selectedPreparationIdsAtom,
    );

    const handleClick = () => {
        setStrategyMemo((v) => {
            const newPreparations = selectedPreparationIds.reduce(
                (preparations, id) => preparations.removed(id),
                v.preparations,
            );
            const newStrategyMemo = v.replacedPreparations(newPreparations);
            setPreparations(newStrategyMemo.preparations);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
        setSelectedPreparationIds(new PreparationIdList());
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

type InputState = {
    name: string;
    materials: string;
    categories: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    setMaterials: React.Dispatch<React.SetStateAction<string>>;
    setCategories: React.Dispatch<React.SetStateAction<string>>;
};

const PreparationInput = ({ state }: { state: InputState }) => {
    return (
        <div className="flex flex-col gap-2">
            <TextField
                label="名前"
                value={state.name}
                onChange={(e) => state.setName(e.target.value)}
            />
            <TextField
                label="材料"
                value={state.materials}
                onChange={(e) => state.setMaterials(e.target.value)}
            />
            <TextField
                label="カテゴリー"
                value={state.categories}
                onChange={(e) => state.setCategories(e.target.value)}
            />
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemButton = () => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const selectedPreparationIds = useAtomValue(selectedPreparationIdsAtom);
    if (selectedPreparationIds.length !== 1) return <></>;

    const id = selectedPreparationIds.at(0)!;

    const moveItem = (
        action: (preparations: PreparationList) => PreparationList,
    ) =>
        setStrategyMemo((v) => {
            const newPreparations = action(v.preparations);
            const newStrategyMemo = v.replacedPreparations(newPreparations);
            setPreparations(newStrategyMemo.preparations);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });

    const handleTopButtonClick = () =>
        moveItem((preparations) => preparations.movedUp(id));

    const handleBottomButtonClick = () => {
        moveItem((preparations) => preparations.movedDown(id));
    };

    return (
        <VerticalSegmentedIconButton
            description="移動"
            topIcon={<ChevronUp className={largeIconClassName} />}
            bottomIcon={<ChevronDown className={largeIconClassName} />}
            onTopButtonClick={handleTopButtonClick}
            onBottomButtonClick={handleBottomButtonClick}
        />
    );
};

/* -------------------------------------------------------------------------- */

const CopyButton = ({
    setCopiedItems,
}: {
    setCopiedItems: React.Dispatch<React.SetStateAction<PreparationList>>;
}) => {
    const preparations = useAtomValue(preparationsAtom);
    const selectedPreparationIds = useAtomValue(selectedPreparationIdsAtom);

    const handleClick = () =>
        setCopiedItems(
            preparations.filter((v) => selectedPreparationIds.hasId(v.id)),
        );

    return (
        <ClipboardCopyIconLargeButton
            className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
            description="コピー"
            onClick={handleClick}
        />
    );
};

const PasteAndXButtons = ({
    copiedItems,
    setCopiedItems,
}: {
    copiedItems: PreparationList;
    setCopiedItems: React.Dispatch<React.SetStateAction<PreparationList>>;
}) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const setSelectedPreparationIds = useSetAtom(selectedPreparationIdsAtom);

    const handlePasteButtonClick = () => {
        setStrategyMemo((v) => {
            const newPreparations = copiedItems.reduce(
                (preparations, preparation) => {
                    const newPreparation = preparation.copyWith({
                        id: new PreparationId(uuidv4()),
                    });
                    return preparations.added(newPreparation);
                },
                v.preparations,
            );
            const newStrategyMemo = v.replacedPreparations(newPreparations);
            setPreparations(newStrategyMemo.preparations);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
        setSelectedPreparationIds(new PreparationIdList());
        setCopiedItems(new PreparationList());
    };

    const handleXButtonClick = () => {
        setSelectedPreparationIds(new PreparationIdList());
        setCopiedItems(new PreparationList());
    };

    return (
        <div className="flex gap-4">
            <ClipboardPasteIconLargeButton
                className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                description="貼り付け"
                onClick={handlePasteButtonClick}
            />
            <XIconLargeButton
                description="選択解除"
                onClick={handleXButtonClick}
            />
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const XButton = () => {
    const setSelectedPreparationIds = useSetAtom(selectedPreparationIdsAtom);

    const handleClick = () =>
        setSelectedPreparationIds(new PreparationIdList());

    return <XIconLargeButton description="選択解除" onClick={handleClick} />;
};

/* -------------------------------------------------------------------------- */

const SelectionModeToggleButton = () => {
    const [canSelectMultiple, setCanSelectMultiple] = useAtom(
        canSelectMultipleAtom,
    );

    const handleClick = () => setCanSelectMultiple((v) => !v);

    const backgroundColor = canSelectMultiple
        ? `${Bg.blue500} ${Bg.hoverBlue400}`
        : `${Bg.neutral500} ${Bg.hoverNeutral400}`;

    return (
        <FilesIconLargeButton
            className={`${backgroundColor} ${Stroke.neutral50}`}
            description={canSelectMultiple ? "複数選択ON" : "複数選択OFF"}
            onClick={handleClick}
        />
    );
};
