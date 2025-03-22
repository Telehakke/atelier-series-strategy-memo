import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MemoUtility, MemoWithID } from "../../../models/memo";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
import { Bg, Border, Ring, Text } from "../../commons/classNames";
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

const MemosList = ({
    memos,
    onFiltering,
}: {
    memos: MemoWithID[];
    onFiltering: boolean;
}) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);

    return (
        <>
            <div className="space-y-2 pb-8">
                {memos.map((v) => (
                    <Card
                        key={v.id}
                        memo={v}
                        selectedID={selectedID}
                        setSelectedID={setSelectedID}
                    />
                ))}
                {!onFiltering && <AddItemButton />}
            </div>
            {selectedID != null && (
                <div className="fixed right-4 bottom-4 space-y-4">
                    {!onFiltering && (
                        <>
                            <MoveItemUpButton selectedID={selectedID} />
                            <MoveItemDownButton selectedID={selectedID} />
                        </>
                    )}
                    <EditItemButton selectedID={selectedID} />
                    <RemoveItemButton selectedID={selectedID} />
                </div>
            )}
        </>
    );
};

export default MemosList;

/* -------------------------------------------------------------------------- */

const Card = ({
    memo,
    selectedID,
    setSelectedID,
}: {
    memo: MemoWithID;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    return (
        <div
            className={`mx-auto max-w-150 overflow-clip rounded-md border-2 hover:ring-4 ${Border.neutral950} ${Ring.blue500}`}
            onClick={() =>
                setSelectedID(memo.id === selectedID ? null : memo.id)
            }
        >
            <div
                className={`flex h-9 items-center justify-between gap-2 px-1 ${memo.id === selectedID ? Bg.blue500 : Bg.neutral950}`}
            >
                <h2
                    className={`scroll-mt-14 scroll-pt-14 truncate text-lg font-bold ${Text.neutral50}`}
                    id={memo.title}
                >
                    {memo.title}
                </h2>
            </div>
            <p className="p-1 text-sm whitespace-pre-wrap">{memo.text}</p>
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const AddItemButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <PlusIconLargeButton onClick={() => setIsOpen(true)} />
            <AddItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
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
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        if (title.trim().length === 0) {
            setIsOpen(false);
            return;
        }

        const memo = MemoUtility.create(title, text, uuidv4());
        setStrategyMemo((v) => MemoUtility.added(v, memo));
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の追加"
            primaryButtonLabel="追加"
            onPrimaryButtonClick={handleButtonClick}
        >
            <MemoInput
                title={title}
                setTitle={setTitle}
                text={text}
                setText={setText}
            />
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = ({ selectedID }: { selectedID: string }) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const index = MemoUtility.findIndex(strategyMemo, selectedID);
    const [isOpen, setIsOpen] = useState(false);

    if (index == null) return <></>;

    return (
        <>
            <PencilIconLargeButton onClick={() => setIsOpen(true)} />
            <EditItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                index={index}
            />
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

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        if (title.trim().length === 0) {
            setIsOpen(false);
            return;
        }

        const newMemo = MemoUtility.create(title, text, memo.id);
        setStrategyMemo((v) => MemoUtility.changed(v, index, newMemo));
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の編集"
            primaryButtonLabel="変更"
            onPrimaryButtonClick={handleButtonClick}
        >
            <MemoInput
                title={title}
                setTitle={setTitle}
                text={text}
                setText={setText}
            />
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const RemoveItemButton = ({ selectedID }: { selectedID: string }) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const index = MemoUtility.findIndex(strategyMemo, selectedID);
    const [isOpen, setIsOpen] = useState(false);

    if (index == null) return <></>;

    return (
        <>
            <TrashIconLargeButton onClick={() => setIsOpen(true)} />
            <RemoveItemDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                index={index}
            />
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

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        setStrategyMemo((v) => MemoUtility.removed(v, index));
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の削除"
            primaryButtonLabel="削除"
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
        <>
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
        </>
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
