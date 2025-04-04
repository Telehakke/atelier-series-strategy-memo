import { Button } from "@headlessui/react";
import { useAtom } from "jotai";
import { useState } from "react";
import { strategyMemoRepositoryAtom } from "../atoms";
import { StrategyMemoUtility } from "../models/strategyMemo";
import { Bg, Border } from "./commons/classNames";
import DialogView from "./commons/dialogView";
import { DatabaseIconButton } from "./commons/iconButtons";

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
    const [message, setMessage] = useState(
        StrategyMemoUtility.dataSize(strategyMemoRepository),
    );

    const handleDownloadButtonClick = () => {
        StrategyMemoUtility.download(strategyMemoRepository);
    };

    const handleFileOpen: React.ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        const files = event.target.files;
        if (files == null || files.length === 0) return;

        const file = files[0];
        if (file.type !== "application/json") {
            setMessage("⚠️JSONファイルを選択してください");
            return;
        }

        const reader = new FileReader();
        reader.readAsText(file);
        reader.addEventListener("load", () => {
            const text = reader.result;
            if (typeof text !== "string") {
                setMessage("⚠️ファイルの読み込みに失敗しました");
                return;
            }

            try {
                const obj = JSON.parse(text);
                setStrategyMemoRepository(StrategyMemoUtility.copied(obj));
                setIsOpen(false);
            } catch (error) {
                if (String(error).includes("QuotaExceededError")) {
                    setMessage(
                        "⚠️データ量の上限に達したため保存に失敗しました",
                    );
                    return;
                }

                if (error instanceof SyntaxError) {
                    setMessage("⚠️ファイルのフォーマットが正しくありません");
                }

                console.log(error);
            }
        });
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="データのバックアップ"
            secondaryButtonLabel="閉じる"
        >
            <div className="flex flex-col gap-4">
                <p>{message}</p>
                <div>
                    <Button
                        className={`rounded-md border-2 px-2 py-1 ${Border.neutral400} ${Bg.hoverNeutral200}`}
                        onClick={() => handleDownloadButtonClick()}
                    >
                        ファイルをダウンロード
                    </Button>
                </div>
                <div>
                    <label
                        className={`rounded-md border-2 px-2 py-1.5 ${Border.neutral400} ${Bg.hoverNeutral200}`}
                        htmlFor="json-file-open"
                    >
                        ファイルを開く
                    </label>
                    <input
                        className="hidden"
                        id="json-file-open"
                        type="file"
                        accept=".json"
                        onChange={handleFileOpen}
                    />
                </div>
            </div>
        </DialogView>
    );
};
