import { Button } from "@headlessui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { ReactNode, useState } from "react";
import { strategyMemoRepositoryAtom } from "../atoms";
import { StrategyMemoUtility } from "../models/strategyMemo";
import { Bg, Border, Text } from "./commons/classNames";
import DialogView from "./commons/dialogView";
import { WrenchIconButton } from "./commons/iconButtons";

const ToolsButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <WrenchIconButton onClick={() => setIsOpen(true)} />
            <ToolsDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default ToolsButton;

/* -------------------------------------------------------------------------- */

const ToolsDialog = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const strategyMemoRepository = useAtomValue(strategyMemoRepositoryAtom);
    const dataSize = StrategyMemoUtility.dataSize(strategyMemoRepository);

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="データの管理"
            secondaryButtonLabel="閉じる"
        >
            <div className="space-y-2">
                <p>{dataSize}</p>
                <Card header="バックアップ">
                    <div className="flex flex-col gap-2">
                        <ExportData />
                        <ImportData setIsOpen={setIsOpen} />
                    </div>
                </Card>
                <Card header="リセット">
                    <div className="flex flex-col gap-2">
                        <EmptyData />
                        <SetSampleData />
                    </div>
                </Card>
            </div>
        </DialogView>
    );
};

const Card = ({
    header,
    children,
}: {
    header: string;
    children?: ReactNode;
}) => {
    return (
        <div className="">
            <p className={`pl-2 text-xs ${Text.neutral500}`}>{header}</p>
            <div
                className={`rounded-md border-2 p-1 ${Bg.neutral100} ${Border.neutral300}`}
            >
                {children}
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const ExportData = () => {
    const strategyMemoRepository = useAtomValue(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        StrategyMemoUtility.download(strategyMemoRepository);
    };

    return (
        <div>
            <Button
                className={`rounded-md border-2 px-2 py-1 ${Border.neutral400} ${Bg.neutral50} ${Bg.hoverNeutral200}`}
                onClick={() => handleButtonClick()}
            >
                ファイルをダウンロード
            </Button>
        </div>
    );
};

const ImportData = ({
    setIsOpen,
}: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemoRepository = useSetAtom(strategyMemoRepositoryAtom);
    const [message, setMessage] = useState<string | null>(null);

    const handleButtonClick: React.ChangeEventHandler<HTMLInputElement> = (
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
        <div className="my-1.5">
            {message != null && <p className="mb-2">{message}</p>}
            <label
                className={`rounded-md border-2 px-2 py-1.5 ${Border.neutral400} ${Bg.neutral50} ${Bg.hoverNeutral200}`}
                htmlFor="json-file-open"
            >
                ファイルを開く
            </label>
            <input
                className="hidden"
                id="json-file-open"
                type="file"
                accept=".json"
                onChange={handleButtonClick}
            />
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const EmptyData = () => {
    const setStrategyMemoRepository = useSetAtom(strategyMemoRepositoryAtom);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button
                className={`rounded-md border-2 px-2 py-1 text-red-500 ${Border.neutral400} ${Bg.neutral50} ${Bg.hoverNeutral200}`}
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                データを空にする
            </Button>
            <DialogView
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="データのリセット"
                primaryButtonLabel="リセット"
                secondaryButtonLabel="キャンセル"
                onPrimaryButtonClick={() => {
                    setStrategyMemoRepository(StrategyMemoUtility.copied());
                    setIsOpen(false);
                }}
                shouldUseWarningColor={true}
            ></DialogView>
        </div>
    );
};

const SetSampleData = () => {
    const setStrategyMemoRepository = useSetAtom(strategyMemoRepositoryAtom);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button
                className={`rounded-md border-2 px-2 py-1 text-red-500 ${Border.neutral400} ${Bg.neutral50} ${Bg.hoverNeutral200}`}
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                サンプルデータにリセット
            </Button>
            <DialogView
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="データのリセット"
                primaryButtonLabel="リセット"
                secondaryButtonLabel="キャンセル"
                onPrimaryButtonClick={() => {
                    setStrategyMemoRepository(RESET);
                    setIsOpen(false);
                }}
                shouldUseWarningColor={true}
            ></DialogView>
        </div>
    );
};
