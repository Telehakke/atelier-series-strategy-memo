import { useAtom } from "jotai";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import copyToClipboard from "../models/copyToClipboard";
import { GameMapUtility } from "../models/gameMap";
import { GameMapGroupUtility } from "../models/gameMapGroup";
import { MemoUtility } from "../models/memo";
import { PreparationUtility } from "../models/preparation";
import {
    StrategyMemoUtility,
    StrategyMemoWithID,
} from "../models/strategyMemo";
import { strategyMemoRepositoryAtom } from "../strategyMemoAtom";
import DialogView from "./commons/dialogView";
import { ClipboardIconButton, DatabaseIconButton } from "./commons/iconButtons";
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
            if (!StrategyMemoUtility.isStrategyMemo(obj)) {
                setMessage("⚠️入力文字列のフォーマットが正しくありません");
                return;
            }

            const strategyMemoWithID: StrategyMemoWithID = {
                gameName: obj.gameName,
                gameMapGroups: obj.gameMapGroups.map((v) =>
                    GameMapGroupUtility.create(
                        v.name,
                        v.gameMaps.map((v) =>
                            GameMapUtility.create(
                                v.name,
                                v.items.join(","),
                                v.monsters.join(","),
                                v.memo,
                                v.icon,
                                v.x.toString(),
                                v.y.toString(),
                                uuidv4(),
                            ),
                        ),
                        uuidv4(),
                    ),
                ),
                preparations: obj.preparations.map((v) =>
                    PreparationUtility.create(
                        v.name,
                        v.materials.join(","),
                        v.categories.join(","),
                        uuidv4(),
                    ),
                ),
                memos: obj.memos.map((v) =>
                    MemoUtility.create(v.title, v.text, uuidv4()),
                ),
                id: uuidv4(),
            };
            setStrategyMemoRepository(strategyMemoWithID);
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

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="データのバックアップ"
            primaryButtonLabel="更新"
            onPrimaryButtonClick={handleReplaceButtonClick}
        >
            <div className="flex gap-2">
                <p className="flex-1">{message}</p>
                <ClipboardIconButton onClick={() => handleCopyButtonClick()} />
            </div>
            <TextEditor
                className="h-40"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
        </DialogView>
    );
};
