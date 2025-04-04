import { useAtom, useSetAtom } from "jotai";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { strategyMemoRepositoryAtom } from "../../../atoms";
import { Memo, MemoUtility } from "../../../models/memo";
import CardBase from "../../commons/cardBase";
import DialogView from "../../commons/dialogView";
import {
    ChevronDownIconLargeButton,
    ChevronUpIconLargeButton,
    ClipboardCopyIconLargeButton,
    ClipboardPasteIconLargeButton,
    PencilIconLargeButton,
    PlusIconLargeButton,
    TrashIconLargeButton,
    XIconLargeButton,
} from "../../commons/iconButtons";
import TextEditor from "../../commons/textEditor";
import TextField from "../../commons/textField";

const MemosList = ({ memos }: { memos: Memo[] }) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [copiedItem, setCopiedItem] = useState<Memo | null>(null);

    return (
        <>
            <div className="space-y-2 pb-8">
                {memos.map((v) => (
                    <Card
                        key={v.id}
                        memo={v}
                        selectedID={selectedID}
                        setSelectedID={setSelectedID}
                        setIsEditDialogOpen={setIsEditDialogOpen}
                    />
                ))}
            </div>
            <div className="fixed right-4 bottom-4 flex gap-4">
                {copiedItem == null ? (
                    <>
                        <div className="flex flex-col gap-4">
                            <EditItemButton
                                setSelectedID={setSelectedID}
                                selectedID={selectedID}
                                isEditDialogOpen={isEditDialogOpen}
                                setIsEditDialogOpen={setIsEditDialogOpen}
                            />
                            <CopyAndPasteItemButton
                                selectedID={selectedID}
                                setSelectedID={setSelectedID}
                                copiedItem={copiedItem}
                                setCopiedItem={setCopiedItem}
                            />
                            <RemoveItemButton
                                selectedID={selectedID}
                                setSelectedID={setSelectedID}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <MoveItemUpButton selectedID={selectedID} />
                            <MoveItemDownButton selectedID={selectedID} />

                            <AddItemButton
                                setSelectedID={setSelectedID}
                                className="grid justify-items-center"
                            />
                        </div>
                    </>
                ) : (
                    <CopyAndPasteItemButton
                        selectedID={selectedID}
                        setSelectedID={setSelectedID}
                        copiedItem={copiedItem}
                        setCopiedItem={setCopiedItem}
                    />
                )}
            </div>
        </>
    );
};

export default MemosList;

/* -------------------------------------------------------------------------- */

const Card = ({
    memo,
    selectedID,
    setSelectedID,
    setIsEditDialogOpen,
}: {
    memo: Memo;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <CardBase
            title={memo.title}
            id={memo.id}
            selected={memo.id === selectedID}
            onClick={() =>
                setSelectedID(memo.id === selectedID ? null : memo.id)
            }
            onDoubleClick={() => {
                setSelectedID(memo.id);
                setIsEditDialogOpen(true);
            }}
        >
            <p className="p-1 text-sm whitespace-pre-wrap">{memo.text}</p>
        </CardBase>
    );
};

/* -------------------------------------------------------------------------- */

const AddItemButton = ({
    setSelectedID,
    className,
}: {
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    className?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={className}>
            <PlusIconLargeButton onClick={() => setIsOpen(true)} />
            <AddItemDialog
                key={`${isOpen}`}
                setSelectedID={setSelectedID}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    );
};

const AddItemDialog = ({
    setSelectedID,
    isOpen,
    setIsOpen,
}: {
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");

    const handleButtonClick = () => {
        const memo = MemoUtility.create(title, text, uuidv4());

        try {
            setStrategyMemo((v) => MemoUtility.added(v, memo));
            setSelectedID(null);
            setIsOpen(false);
        } catch (error) {
            if (String(error).includes("QuotaExceededError")) {
                setMessage("⚠️データ量の上限に達したため保存に失敗しました");
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
            onPrimaryButtonClick={handleButtonClick}
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

const EditItemButton = ({
    selectedID,
    setSelectedID,
    isEditDialogOpen,
    setIsEditDialogOpen,
}: {
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    if (selectedID == null) return <></>;

    return (
        <>
            <PencilIconLargeButton onClick={() => setIsEditDialogOpen(true)} />
            <EditItemDialog
                key={`${isEditDialogOpen}`}
                selectedID={selectedID}
                setSelectedID={setSelectedID}
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
            />
        </>
    );
};

const EditItemDialog = ({
    selectedID,
    setSelectedID,
    isOpen,
    setIsOpen,
}: {
    selectedID: string;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const memo = MemoUtility.find(strategyMemo.memos, selectedID);
    const [title, setTitle] = useState(memo?.title ?? "");
    const [text, setText] = useState(memo?.text ?? "");
    const [message, setMessage] = useState("");

    const handleButtonClick = () => {
        if (memo == null) return;

        try {
            setStrategyMemo((v) =>
                MemoUtility.changed(v, memo.id, {
                    title: title,
                    text: text,
                }),
            );
            setSelectedID(null);
            setIsOpen(false);
        } catch (error) {
            if (String(error).includes("QuotaExceededError")) {
                setMessage("⚠️データ量の上限に達したため保存に失敗しました");
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
            onPrimaryButtonClick={handleButtonClick}
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

const RemoveItemButton = ({
    selectedID,
    setSelectedID,
}: {
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (selectedID == null) return <></>;

    return (
        <>
            <TrashIconLargeButton onClick={() => setIsOpen(true)} />
            <RemoveItemDialog
                selectedID={selectedID}
                setSelectedID={setSelectedID}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    );
};

const RemoveItemDialog = ({
    selectedID,
    setSelectedID,
    isOpen,
    setIsOpen,
}: {
    selectedID: string;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) => MemoUtility.removed(v, selectedID));
        setSelectedID(null);
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
        <div className="space-y-2">
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

const MoveItemUpButton = ({ selectedID }: { selectedID: string | null }) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) => MemoUtility.movedUp(v, selectedID));
    };

    return <ChevronUpIconLargeButton onClick={() => handleButtonClick()} />;
};

const MoveItemDownButton = ({ selectedID }: { selectedID: string | null }) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    if (selectedID == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) => MemoUtility.movedDown(v, selectedID));
    };

    return <ChevronDownIconLargeButton onClick={() => handleButtonClick()} />;
};

/* -------------------------------------------------------------------------- */

const CopyAndPasteItemButton = ({
    selectedID,
    setSelectedID,
    copiedItem,
    setCopiedItem,
}: {
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
    copiedItem: Memo | null;
    setCopiedItem: React.Dispatch<React.SetStateAction<Memo | null>>;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);

    if (copiedItem != null)
        return (
            <div className="flex gap-4">
                <ClipboardPasteIconLargeButton
                    onClick={() => {
                        const preparation = MemoUtility.copied(copiedItem);
                        setStrategyMemo((v) =>
                            MemoUtility.added(v, preparation),
                        );
                    }}
                />
                <XIconLargeButton
                    onClick={() => {
                        setSelectedID(null);
                        setCopiedItem(null);
                    }}
                />
            </div>
        );

    if (selectedID != null)
        return (
            <ClipboardCopyIconLargeButton
                onClick={() =>
                    setCopiedItem(
                        MemoUtility.find(strategyMemo.memos, selectedID),
                    )
                }
            />
        );

    return <></>;
};
