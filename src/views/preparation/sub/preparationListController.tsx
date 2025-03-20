import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    canSelectMultipleAtom,
    isEditPreparationDialogOpenAtom,
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
import { Bg, Stroke } from "../../commons/classNames";
import DialogView from "../../commons/dialogView";
import {
    ClipboardCopyIconLargeButton,
    ClipboardPasteIconLargeButton,
    FilesIconLargeButton,
    LargeIconButton,
    largeIconClassName,
    PencilIconLargeButton,
    PlusIconLargeButton,
    TrashIconLargeButton,
    XIconLargeButton,
} from "../../commons/iconButtons";
import TextField from "../../commons/textField";

const PreparationListController = ({ className }: { className?: string }) => {
    const selectedPreparationIds = useAtomValue(selectedPreparationIdsAtom);
    const [copiedItems, setCopiedItems] = useState(new PreparationList());

    if (selectedPreparationIds.isNotEmpty && copiedItems.isEmpty)
        return (
            <div className={`flex gap-4 ${className}`}>
                <div className="flex flex-col justify-end gap-4">
                    <SelectionModeToggleButton />
                </div>
                <div className="flex flex-col justify-end gap-4">
                    <EditItemButton />
                    <CopyButton setCopiedItems={setCopiedItems} />
                    <RemoveItemButton />
                </div>
                <div className="flex flex-col justify-end gap-4">
                    <MoveItemUpButton />
                    <MoveItemDownButton />
                    <XButton />
                </div>
            </div>
        );

    if (selectedPreparationIds.isNotEmpty && copiedItems.isNotEmpty)
        return (
            <div className={className}>
                <PasteAndXButtons
                    copiedItems={copiedItems}
                    setCopiedItems={setCopiedItems}
                />
            </div>
        );

    return (
        <div className={`${className}`}>
            <div className="flex">
                <AddItemButton />
            </div>
        </div>
    );
};

export default PreparationListController;

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
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const [name, setName] = useState("");
    const [materials, setMaterials] = useState("");
    const [categories, setCategories] = useState("");
    const [message, setMessage] = useState("");

    const handleClick = () => {
        const preparation = Preparation.create(
            name,
            materials,
            categories,
            false,
            new PreparationId(uuidv4()),
        );

        try {
            setStrategyMemo((v) => {
                const newPreparations = v.preparations.added(preparation);
                const newStrategyMemo = v.replacedPreparations(newPreparations);
                setPreparations(newStrategyMemo.preparations);
                LocalStorage.setStrategyMemo(newStrategyMemo);
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
            <div className="space-y-2">
                <p>{message}</p>
                <PreparationInput
                    name={name}
                    setName={setName}
                    materials={materials}
                    setMaterials={setMaterials}
                    categories={categories}
                    setCategories={setCategories}
                />
            </div>
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = () => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useAtom(
        isEditPreparationDialogOpenAtom,
    );
    const selectedPreparationIds = useAtomValue(selectedPreparationIdsAtom);
    if (selectedPreparationIds.length !== 1) return <></>;

    return (
        <>
            <PencilIconLargeButton
                className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                description="編集"
                onClick={() => setIsEditDialogOpen(true)}
            />
            {isEditDialogOpen && (
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
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setSelectedPreparationIds = useSetAtom(selectedPreparationIdsAtom);
    const [isEditDialogOpen, setIsEditDialogOpen] = useAtom(
        isEditPreparationDialogOpenAtom,
    );
    const [preparations, setPreparations] = useAtom(preparationsAtom);
    const preparation = preparations.find(preparationId);
    const [name, setName] = useState(preparation?.name ?? "");
    const [materials, setMaterials] = useState(
        preparation?.materials.join("、") ?? "",
    );
    const [categories, setCategories] = useState(
        preparation?.categories.join("、") ?? "",
    );
    const [message, setMessage] = useState("");

    if (preparation == null) return <></>;

    const handleClick = () => {
        const editedPreparations = Preparation.create(
            name,
            materials,
            categories,
            preparation.checked,
            preparation.id,
        );

        try {
            setStrategyMemo((v) => {
                const newPreparations = v.preparations.replaced(
                    preparation.id,
                    editedPreparations,
                );
                const newStrategyMemo = v.replacedPreparations(newPreparations);
                setPreparations(newStrategyMemo.preparations);
                LocalStorage.setStrategyMemo(newStrategyMemo);
                return newStrategyMemo;
            });
            setSelectedPreparationIds(new PreparationIdList());
            setIsEditDialogOpen(false);
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
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            title="項目の編集"
            primaryButtonLabel="変更"
            secondaryButtonLabel="キャンセル"
            handlePrimaryButtonClick={handleClick}
        >
            <div className="flex flex-col gap-2">
                <p>{message}</p>
                <PreparationInput
                    name={name}
                    setName={setName}
                    materials={materials}
                    setMaterials={setMaterials}
                    categories={categories}
                    setCategories={setCategories}
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
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const [selectedPreparationIds, setSelectedPreparationIds] = useAtom(
        selectedPreparationIdsAtom,
    );

    const handleButtonClick = () => {
        setStrategyMemo((v) => {
            let newPreparations = v.preparations;
            selectedPreparationIds.forEach((id) => {
                newPreparations = newPreparations.removed(id);
            });
            const newStrategyMemo = v.replacedPreparations(newPreparations);
            setPreparations(newStrategyMemo.preparations);
            LocalStorage.setStrategyMemo(newStrategyMemo);
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
            handlePrimaryButtonClick={handleButtonClick}
            shouldUseWarningColor={true}
        />
    );
};

/* -------------------------------------------------------------------------- */

const PreparationInput = ({
    name,
    setName,
    materials,
    setMaterials,
    categories,
    setCategories,
}: {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    materials: string;
    setMaterials: React.Dispatch<React.SetStateAction<string>>;
    categories: string;
    setCategories: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <div className="flex flex-col gap-2">
            <TextField
                label="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="材料"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
            />
            <TextField
                label="カテゴリー"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
            />
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemUpButton = () => {
    return (
        <MoveItemButton
            description="上へ移動"
            action={(preparations, id) => preparations.movedUp(id)}
        >
            <ChevronUp className={largeIconClassName} />
        </MoveItemButton>
    );
};

const MoveItemDownButton = () => {
    return (
        <MoveItemButton
            description="下へ移動"
            action={(preparations, id) => preparations.movedDown(id)}
        >
            <ChevronDown className={largeIconClassName} />
        </MoveItemButton>
    );
};

const MoveItemButton = ({
    description,
    action,
    children,
}: {
    description: string;
    action: (
        preparations: PreparationList,
        id: PreparationId,
    ) => PreparationList;
    children: ReactNode;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const selectedPreparationIds = useAtomValue(selectedPreparationIdsAtom);
    if (selectedPreparationIds.length !== 1) return <></>;

    const handleClick = () => {
        const id = selectedPreparationIds.at(0)!;

        setStrategyMemo((v) => {
            const newPreparations = action(v.preparations, id);
            const newStrategyMemo = v.replacedPreparations(newPreparations);
            setPreparations(newStrategyMemo.preparations);
            LocalStorage.setStrategyMemo(newStrategyMemo);
            return newStrategyMemo;
        });
    };

    return (
        <LargeIconButton
            className={`${Bg.yellow500} ${Bg.hoverYellow400} ${Stroke.neutral50}`}
            description={description}
            onClick={handleClick}
        >
            {children}
        </LargeIconButton>
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
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const setSelectedPreparationIds = useSetAtom(selectedPreparationIdsAtom);

    const handlePasteButtonClick = () => {
        setStrategyMemo((v) => {
            let newPreparations = v.preparations;
            copiedItems.forEach((preparation) => {
                const newPreparation = preparation.copyWith({
                    id: new PreparationId(uuidv4()),
                });
                newPreparations = newPreparations.added(newPreparation);
            });
            const newStrategyMemo = v.replacedPreparations(newPreparations);
            setPreparations(newStrategyMemo.preparations);
            LocalStorage.setStrategyMemo(newStrategyMemo);
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

    const backgroundColor = canSelectMultiple ? Bg.blue500 : Bg.neutral500;
    const hoverColor = canSelectMultiple ? Bg.hoverBlue400 : Bg.hoverNeutral400;

    return (
        <FilesIconLargeButton
            className={`${backgroundColor} ${hoverColor} ${Stroke.neutral50}`}
            description={canSelectMultiple ? "複数選択ON" : "複数選択OFF"}
            onClick={handleClick}
        />
    );
};
