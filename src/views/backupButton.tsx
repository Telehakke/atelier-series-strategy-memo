import { useAtom } from "jotai";
import { useState } from "react";
import copyToClipboard from "../models/copyToClipboard";
import { StrategyMemoUtility } from "../models/strategyMemo";
import { strategyMemoRepositoryAtom } from "../strategyMemoAtom";
import DialogView from "./commons/dialogView";
import {
    CircleXIconButton,
    ClipboardIconButton,
    DatabaseIconButton,
} from "./commons/iconButtons";
import TextEditor from "./commons/textEditor";

const BackupButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <DatabaseIconButton onClick={() => setIsOpen(true)} />
            <BackupDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    );
};

export default BackupButton;

/* -------------------------------------------------------------------------- */

const BackupDialog = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [strategyMemoRepository, setStrategyMemoRepository] = useAtom(
        strategyMemoRepositoryAtom,
    );
    const strategyMemo = StrategyMemoUtility.toStrategyMemo(
        strategyMemoRepository,
    );
    const strategyMemoJsonStr = JSON.stringify(strategyMemo, null, 4);
    const [value, setValue] = useState(strategyMemoJsonStr);
    const [message, setMessage] = useState("");

    const handleReplaceButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ): void => {
        try {
            const obj = JSON.parse(value);
            setStrategyMemoRepository(StrategyMemoUtility.copied(obj));
            setIsOpen(false);
        } catch {
            setMessage("⚠️入力文字列のフォーマットが正しくありません");
        }
    };

    const handleCopyButtonClick = async (): Promise<void> => {
        const result = await copyToClipboard(strategyMemoJsonStr);
        if (result) {
            setMessage("✅クリップボードにコピーされました");
        } else {
            setMessage("❌コピーに失敗しました");
        }
    };

    const handleCircleXButtonClick = () => {
        setValue("");
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="データのバックアップ"
            primaryButtonLabel="更新"
            onPrimaryButtonClick={handleReplaceButtonClick}
        >
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <p className="flex-1">{message}</p>
                    <ClipboardIconButton
                        onClick={() => handleCopyButtonClick()}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <TextEditor
                            className="h-40"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                        />
                    </div>
                    <CircleXIconButton
                        className={`my-auto ${value.length > 0 ? "" : "invisible"}`}
                        onClick={() => handleCircleXButtonClick()}
                    />
                </div>
            </div>
        </DialogView>
    );
};
