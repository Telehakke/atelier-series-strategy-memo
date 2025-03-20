import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    canSelectMultipleAtom,
    isEditMemoDialogOpenAtom,
    memosAtom,
    selectedMemoIdsAtom,
    strategyMemoAtom,
} from "../../../atoms";
import ErrorChecker from "../../../models/errorChecker";
import LocalStorage from "../../../models/localStorage";
import { Memo, MemoId, MemoIdList, MemoList } from "../../../models/memo";
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
import TextEditor from "../../commons/textEditor";
import TextField from "../../commons/textField";

const MemoListController = ({ className }: { className?: string }) => {
    const selectedMemoIds = useAtomValue(selectedMemoIdsAtom);
    const [copiedItems, setCopiedItems] = useState<MemoList>(new MemoList());

    if (selectedMemoIds.isNotEmpty && copiedItems.isEmpty)
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

    if (selectedMemoIds.isNotEmpty && copiedItems.isNotEmpty)
        return (
            <div className={className}>
                <PasteAndXButtons
                    copiedItems={copiedItems}
                    setCopiedItems={setCopiedItems}
                />
            </div>
        );

    return (
        <div className={className}>
            <div className="flex">
                <AddItemButton />
            </div>
        </div>
    );
};

export default MemoListController;

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
    const setMemos = useSetAtom(memosAtom);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");

    const handleClick = () => {
        const memo = Memo.create(title, text, false, new MemoId(uuidv4()));

        try {
            setStrategyMemo((v) => {
                const newMemos = v.memos.added(memo);
                const newStrategyMemo = v.replacedMemos(newMemos);
                setMemos(newStrategyMemo.memos);
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
                <MemoInput
                    title={title}
                    setTitle={setTitle}
                    text={text}
                    setText={setText}
                />
            </div>
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = () => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useAtom(
        isEditMemoDialogOpenAtom,
    );
    const selectedMemoIds = useAtomValue(selectedMemoIdsAtom);
    if (selectedMemoIds.length !== 1) return <></>;

    return (
        <>
            <PencilIconLargeButton
                className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                description="編集"
                onClick={() => setIsEditDialogOpen(true)}
            />
            {isEditDialogOpen && (
                <EditItemDialog memoId={selectedMemoIds.at(0)!} />
            )}
        </>
    );
};

const EditItemDialog = ({ memoId }: { memoId: MemoId }) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setSelectedMemoIds = useSetAtom(selectedMemoIdsAtom);
    const [isEditDialogOpen, setIsEditDialogOpen] = useAtom(
        isEditMemoDialogOpenAtom,
    );
    const [memos, setMemos] = useAtom(memosAtom);
    const memo = memos.find(memoId);
    const [title, setTitle] = useState(memo?.title ?? "");
    const [text, setText] = useState(memo?.text ?? "");
    const [message, setMessage] = useState("");

    if (memo == null) return <></>;

    const handleClick = () => {
        const editedMemo = Memo.create(title, text, memo.checked, memo.id);

        try {
            setStrategyMemo((v) => {
                const newMemos = v.memos.replaced(memo.id, editedMemo);
                const newStrategyMemo = v.replacedMemos(newMemos);
                setMemos(newStrategyMemo.memos);
                LocalStorage.setStrategyMemo(newStrategyMemo);
                return newStrategyMemo;
            });
            setSelectedMemoIds(new MemoIdList());
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
                <MemoInput
                    title={title}
                    setTitle={setTitle}
                    text={text}
                    setText={setText}
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
    const setMemos = useSetAtom(memosAtom);
    const [selectedMemoIds, setSelectedMemoIds] = useAtom(selectedMemoIdsAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            let newMemos = v.memos;
            selectedMemoIds.forEach((id) => {
                newMemos = newMemos.removed(id);
            });
            const newStrategyMemo = v.replacedMemos(newMemos);
            setMemos(newStrategyMemo.memos);
            LocalStorage.setStrategyMemo(newStrategyMemo);
            return newStrategyMemo;
        });
        setSelectedMemoIds(new MemoIdList());
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

const MemoInput = ({
    title,
    setTitle,
    text,
    setText,
}: {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <div className="flex flex-col gap-2">
            <TextField
                label="タイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextEditor
                className="h-40"
                label="メモ"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemUpButton = () => {
    return (
        <MoveItemButton
            description="上へ移動"
            action={(memos, id) => memos.movedUp(id)}
        >
            <ChevronUp className={largeIconClassName} />
        </MoveItemButton>
    );
};

const MoveItemDownButton = () => {
    return (
        <MoveItemButton
            description="下へ移動"
            action={(memos, id) => memos.movedDown(id)}
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
    action: (memos: MemoList, id: MemoId) => MemoList;
    children: ReactNode;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setMemos = useSetAtom(memosAtom);
    const selectedMemoIds = useAtomValue(selectedMemoIdsAtom);
    if (selectedMemoIds.length !== 1) return <></>;

    const handleClick = () => {
        const id = selectedMemoIds.at(0)!;

        setStrategyMemo((v) => {
            const newMemos = action(v.memos, id);
            const newStrategyMemo = v.replacedMemos(newMemos);
            setMemos(newStrategyMemo.memos);
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
    setCopiedItems: React.Dispatch<React.SetStateAction<MemoList>>;
}) => {
    const memos = useAtomValue(memosAtom);
    const selectedMemoIds = useAtomValue(selectedMemoIdsAtom);

    const handleClick = () =>
        setCopiedItems(memos.filter((v) => selectedMemoIds.hasId(v.id)));

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
    copiedItems: MemoList;
    setCopiedItems: React.Dispatch<React.SetStateAction<MemoList>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setMemos = useSetAtom(memosAtom);
    const setSelectedMemoIds = useSetAtom(selectedMemoIdsAtom);

    const handlePasteButtonClick = () => {
        setStrategyMemo((v) => {
            let newMemos = v.memos;
            copiedItems.forEach((memo) => {
                const newMemo = memo.copyWith({ id: new MemoId(uuidv4()) });
                newMemos = newMemos.added(newMemo);
            });
            const newStrategyMemo = v.replacedMemos(newMemos);
            setMemos(newStrategyMemo.memos);
            LocalStorage.setStrategyMemo(newStrategyMemo);
            return newStrategyMemo;
        });
        setSelectedMemoIds(new MemoIdList());
        setCopiedItems(new MemoList());
    };

    const handleXButtonClick = () => {
        setSelectedMemoIds(new MemoIdList());
        setCopiedItems(new MemoList());
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
    const setSelectedMemoIds = useSetAtom(selectedMemoIdsAtom);

    const handleClick = () => setSelectedMemoIds(new MemoIdList());

    return <XIconLargeButton description="選択解除" onClick={handleClick} />;
};

/* -------------------------------------------------------------------------- */

const SelectionModeToggleButton = () => {
    const [canSelectMultiple, setCsnSelectMultiple] = useAtom(
        canSelectMultipleAtom,
    );

    const handleClick = () => setCsnSelectMultiple((v) => !v);

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
