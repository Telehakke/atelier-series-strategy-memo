import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    canSelectMultipleAtom,
    isEditMemoDialogOpenAtom,
    isReadonlyAtom,
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
    largeIconClassName,
    PencilIconLargeButton,
    PlusIconLargeButton,
    TrashIconLargeButton,
    VerticalSegmentedIconButton,
    XIconLargeButton,
} from "../../commons/iconButtons";
import TextEditor from "../../commons/textEditor";
import TextField from "../../commons/textField";

const MemoListController = ({ className }: { className?: string }) => {
    const selectedMemoIds = useAtomValue(selectedMemoIdsAtom);
    const [copiedItems, setCopiedItems] = useState<MemoList>(new MemoList());

    if (selectedMemoIds.isEmpty)
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

export default MemoListController;

/* -------------------------------------------------------------------------- */

const ItemActionButtons = ({
    setCopiedItems,
}: {
    setCopiedItems: React.Dispatch<React.SetStateAction<MemoList>>;
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
                <MoveItemsButton />
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
    const setMemos = useSetAtom(memosAtom);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");

    const handleClick = () => {
        const memo = Memo.create({
            title: title,
            text: text,
            checked: false,
            id: new MemoId(uuidv4()),
        });

        try {
            setStrategyMemo((v) => {
                const newMemos = v.memos.added(memo);
                const newStrategyMemo = v.replacedMemos(newMemos);
                setMemos(newStrategyMemo.memos);
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
                <MemoInput
                    state={{
                        title: title,
                        text: text,
                        setTitle: setTitle,
                        setText: setText,
                    }}
                />
            </div>
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = () => {
    const [isOpen, setIsOpen] = useAtom(isEditMemoDialogOpenAtom);
    const selectedMemoIds = useAtomValue(selectedMemoIdsAtom);
    if (selectedMemoIds.length !== 1) return <></>;

    return (
        <>
            <PencilIconLargeButton
                className={`${Bg.green500} ${Bg.hoverGreen400} ${Stroke.neutral50}`}
                description="編集"
                onClick={() => setIsOpen(true)}
            />
            {isOpen && <EditItemDialog memoId={selectedMemoIds.at(0)!} />}
        </>
    );
};

const EditItemDialog = ({ memoId }: { memoId: MemoId }) => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setSelectedMemoIds = useSetAtom(selectedMemoIdsAtom);
    const [isOpen, setIsOpen] = useAtom(isEditMemoDialogOpenAtom);

    const [memos, setMemos] = useAtom(memosAtom);
    const memo = memos.find(memoId);
    const [title, setTitle] = useState(memo?.title ?? "");
    const [text, setText] = useState(memo?.text ?? "");
    const [message, setMessage] = useState("");

    if (memo == null) return <></>;

    const handleClick = () => {
        const editedMemo = memo.copyWith({
            title: title,
            text: text,
        });

        try {
            setStrategyMemo((v) => {
                const newMemos = v.memos.replaced(editedMemo);
                const newStrategyMemo = v.replacedMemos(newMemos);
                setMemos(newStrategyMemo.memos);
                LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
                return newStrategyMemo;
            });
            setSelectedMemoIds(new MemoIdList());
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
                <MemoInput
                    state={{
                        title: title,
                        text: text,
                        setTitle: setTitle,
                        setText: setText,
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
    const setMemos = useSetAtom(memosAtom);
    const [selectedMemoIds, setSelectedMemoIds] = useAtom(selectedMemoIdsAtom);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const newMemos = selectedMemoIds.reduce(
                (memos, id) => memos.removed(id),
                v.memos,
            );
            const newStrategyMemo = v.replacedMemos(newMemos);
            setMemos(newStrategyMemo.memos);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
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

type InputState = {
    title: string;
    text: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setText: React.Dispatch<React.SetStateAction<string>>;
};

const MemoInput = ({ state }: { state: InputState }) => {
    return (
        <div className="flex flex-col gap-2">
            <TextField
                label="タイトル"
                value={state.title}
                onChange={(e) => state.setTitle(e.target.value)}
            />
            <TextEditor
                className="h-40"
                label="メモ"
                value={state.text}
                onChange={(e) => state.setText(e.target.value)}
            />
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemsButton = () => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setMemos = useSetAtom(memosAtom);
    const selectedMemoIds = useAtomValue(selectedMemoIdsAtom);
    if (selectedMemoIds.length !== 1) return <></>;

    const id = selectedMemoIds.at(0)!;

    const moveItems = (action: (memos: MemoList) => MemoList) =>
        setStrategyMemo((v) => {
            const newMemos = action(v.memos);
            const newStrategyMemo = v.replacedMemos(newMemos);
            setMemos(newStrategyMemo.memos);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });

    const handleTopButtonClick = () => moveItems((memos) => memos.movedUp(id));

    const handleBottomButtonClick = () =>
        moveItems((memos) => memos.movedDown(id));

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
    const isReadonly = useAtomValue(isReadonlyAtom);
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setMemos = useSetAtom(memosAtom);
    const setSelectedMemoIds = useSetAtom(selectedMemoIdsAtom);

    const handlePasteButtonClick = () => {
        setStrategyMemo((v) => {
            const newMemos = copiedItems.reduce((memos, memo) => {
                const newMemo = memo.copyWith({ id: new MemoId(uuidv4()) });
                return memos.added(newMemo);
            }, v.memos);
            const newStrategyMemo = v.replacedMemos(newMemos);
            setMemos(newStrategyMemo.memos);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
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
