import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MemoUtility, MemoWithID } from "../../../models/memo";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
import CardBase from "../../commons/cardBase";
import DialogView from "../../commons/dialogView";
import {
    ChevronDownIconLargeButton,
    ChevronUpIconLargeButton,
    PencilIconLargeButton,
    PlusIconLargeButton,
    TrashIconLargeButton,
} from "../../commons/iconButtons";
import TextEditor from "../../commons/textEditor";
import TextField from "../../commons/textField";

const MemosList = ({ memos }: { memos: MemoWithID[] }) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
            <div className="fixed right-4 bottom-4 flex flex-col space-y-4">
                {selectedID != null &&
                    memos.some((v) => v.id === selectedID) && (
                        <>
                            <MoveItemUpButton selectedID={selectedID} />
                            <MoveItemDownButton selectedID={selectedID} />
                            <EditItemButton
                                selectedID={selectedID}
                                isEditDialogOpen={isEditDialogOpen}
                                setIsEditDialogOpen={setIsEditDialogOpen}
                            />
                            <RemoveItemButton selectedID={selectedID} />
                        </>
                    )}
                <AddItemButton className="grid justify-items-center" />
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
    memo: MemoWithID;
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
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");

    const handleButtonClick = () => {
        const memo = MemoUtility.create(title, text, uuidv4());

        try {
            setStrategyMemo((v) => MemoUtility.added(v, memo));
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
    isEditDialogOpen,
    setIsEditDialogOpen,
}: {
    selectedID: string;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const index = MemoUtility.findIndex(strategyMemo, selectedID);

    return (
        <>
            <PencilIconLargeButton onClick={() => setIsEditDialogOpen(true)} />
            {index != null && (
                <EditItemDialog
                    key={`${isEditDialogOpen}`}
                    isOpen={isEditDialogOpen}
                    setIsOpen={setIsEditDialogOpen}
                    index={index}
                />
            )}
        </>
    );
};

const EditItemDialog = ({
    isOpen,
    setIsOpen,
    index,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    index: number;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const memo = strategyMemo.memos[index];
    const [title, setTitle] = useState(memo.title);
    const [text, setText] = useState(memo.text);
    const [message, setMessage] = useState("");

    const handleButtonClick = () => {
        const newMemo = MemoUtility.create(title, text, memo.id);

        try {
            setStrategyMemo((v) => MemoUtility.changed(v, index, newMemo));
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

const RemoveItemButton = ({ selectedID }: { selectedID: string }) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const index = MemoUtility.findIndex(strategyMemo, selectedID);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TrashIconLargeButton onClick={() => setIsOpen(true)} />
            {index != null && (
                <RemoveItemDialog
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    index={index}
                />
            )}
        </>
    );
};

const RemoveItemDialog = ({
    isOpen,
    setIsOpen,
    index,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    index: number;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) => MemoUtility.removed(v, index));
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

const MoveItemUpButton = ({ selectedID }: { selectedID: string }) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const index = MemoUtility.findIndex(strategyMemo, selectedID);

    if (index == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) => MemoUtility.movedUp(v, index));
    };

    return <ChevronUpIconLargeButton onClick={() => handleButtonClick()} />;
};

const MoveItemDownButton = ({ selectedID }: { selectedID: string }) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const index = MemoUtility.findIndex(strategyMemo, selectedID);

    if (index == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) => MemoUtility.movedDown(v, index));
    };

    return <ChevronDownIconLargeButton onClick={() => handleButtonClick()} />;
};
