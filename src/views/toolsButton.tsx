import { Button } from "@headlessui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    gameMapDetailSelectionManagerAtom,
    gameMapFilteringValueAtom,
    gameMapsAtom,
    gameMapShapeSelectionManagerAtom,
    gameNameAtom,
    isReadonlyAtom,
    memoFilteringValueAtom,
    memosAtom,
    preparationFilteringValueAtom,
    preparationsAtom,
    selectedGameMapIdAtom,
    selectedMemoIdsAtom,
    selectedPreparationIdsAtom,
    strategyMemoAtom,
} from "../atoms";
import DelayAction from "../models/delayAction";

import { GameMapList } from "../models/gameMap";
import { GameMapDetailIdList } from "../models/gameMapDetail";
import { GameMapShapeIdList } from "../models/gameMapShape";
import LocalStorage from "../models/localStorage";
import { MemoIdList, MemoList } from "../models/memo";
import { PreparationIdList, PreparationList } from "../models/preparation";
import { StrategyMemo, StrategyMemoId } from "../models/strategyMemo";
import { StrategyMemoRecordUtility } from "../models/strategyMemoRecord";
import { isString } from "../models/typeGuards";
import sampleData from "../sampleData";
import { Bg, Border, Text } from "./commons/classNames";
import DialogView from "./commons/dialogView";
import { WrenchIconButton } from "./commons/iconButtons";

const ToolsButton = () => {
    const isReadonly = useAtomValue(isReadonlyAtom);
    const [isOpen, setIsOpen] = useState(false);

    if (isReadonly) return <></>;

    return (
        <>
            <WrenchIconButton onClick={() => setIsOpen(true)} />
            {isOpen && <ToolsDialog isOpen={isOpen} setIsOpen={setIsOpen} />}
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
    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="データの管理"
            secondaryButtonLabel="閉じる"
        >
            <div className="flex flex-col gap-2">
                <DataSize />
                <Card header="バックアップ">
                    <div className="flex flex-col gap-2">
                        <ExportData />
                        <ImportData />
                    </div>
                </Card>
                <Card header="リセット">
                    <div className="flex flex-col gap-2">
                        <EmptyData />
                        <SetSampleData />
                        <UncheckedALL />
                    </div>
                </Card>
                <ResetStateAllButton />
            </div>
        </DialogView>
    );
};

const DataSize = () => {
    const strategyMemo = useAtomValue(strategyMemoAtom);
    const dataSize = strategyMemo.dataSize();

    return <p>{dataSize}</p>;
};

const Card = ({
    header,
    children,
}: {
    header: string;
    children?: ReactNode;
}) => {
    return (
        <div>
            <p className={`pl-2 text-xs ${Text.neutral500}`}>{header}</p>
            <div
                className={`rounded-md border-2 p-1 ${Bg.neutral100_900} ${Border.neutral300_800}`}
            >
                {children}
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const ExportData = () => {
    const strategyMemo = useAtomValue(strategyMemoAtom);

    const handleClick = () => strategyMemo.download();

    return (
        <div>
            <Button
                className={`rounded-md border-2 px-2 py-1 ${Border.neutral400_700} ${Bg.neutral50_950} ${Bg.hoverNeutral200_800}`}
                onClick={handleClick}
            >
                ファイルを保存
            </Button>
        </div>
    );
};

const ImportData = () => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const [message, setMessage] = useState<string | null>(null);

    const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            if (!isString(text)) {
                setMessage("⚠️ファイルの読み込みに失敗しました");
                return;
            }

            try {
                const obj = JSON.parse(text);
                const strategyMemo =
                    StrategyMemoRecordUtility.convertToStrategyMemo(obj);
                LocalStorage.setStrategyMemo(strategyMemo);
                setStrategyMemo(strategyMemo);
                resetStateAll();
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
                className={`rounded-md border-2 px-2 py-1.5 ${Border.neutral400_700} ${Bg.neutral50_950} ${Bg.hoverNeutral200_800}`}
                htmlFor="json-file-open"
            >
                ファイルを開く
            </label>
            <input
                className="hidden"
                id="json-file-open"
                type="file"
                accept=".json"
                onChange={handleClick}
            />
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const EmptyData = () => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        const empty = new StrategyMemo(
            "",
            new GameMapList(),
            new PreparationList(),
            new MemoList(),
            new StrategyMemoId(uuidv4()),
        );
        LocalStorage.setStrategyMemo(empty);
        setStrategyMemo(empty);
        setIsOpen(false);
        resetStateAll();
    };

    return (
        <div>
            <Button
                className={`rounded-md border-2 px-2 py-1 ${Text.red500} ${Border.neutral400_700} ${Bg.neutral50_950} ${Bg.hoverNeutral200_800}`}
                onClick={() => setIsOpen(true)}
            >
                データを全て消去
            </Button>
            <DialogView
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="データを全て消去"
                primaryButtonLabel="リセット"
                secondaryButtonLabel="キャンセル"
                handlePrimaryButtonClick={handleClick}
                shouldUseWarningColor={true}
            ></DialogView>
        </div>
    );
};

const SetSampleData = () => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        LocalStorage.setStrategyMemo(sampleData);
        setStrategyMemo(sampleData);
        setIsOpen(false);
        resetStateAll();
    };

    return (
        <div>
            <Button
                className={`rounded-md border-2 px-2 py-1 ${Text.red500} ${Border.neutral400_700} ${Bg.neutral50_950} ${Bg.hoverNeutral200_800}`}
                onClick={() => setIsOpen(true)}
            >
                サンプルデータでリセット
            </Button>
            <DialogView
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="サンプルデータでリセット"
                primaryButtonLabel="リセット"
                secondaryButtonLabel="キャンセル"
                handlePrimaryButtonClick={handleClick}
                shouldUseWarningColor={true}
            ></DialogView>
        </div>
    );
};

const UncheckedALL = () => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const setMemos = useSetAtom(memosAtom);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setStrategyMemo((v) => {
            const strategyMemo = v.uncheckedAll();
            LocalStorage.setStrategyMemo(strategyMemo);
            setGameMaps(strategyMemo.gameMaps);
            setPreparations(strategyMemo.preparations);
            setMemos(strategyMemo.memos);
            return strategyMemo;
        });
        setIsOpen(false);
    };

    return (
        <div>
            <Button
                className={`rounded-md border-2 px-2 py-1 ${Text.red500} ${Border.neutral400_700} ${Bg.neutral50_950} ${Bg.hoverNeutral200_800}`}
                onClick={() => setIsOpen(true)}
            >
                全てのチェックを外す
            </Button>
            <DialogView
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="全てのチェックを外す"
                primaryButtonLabel="リセット"
                secondaryButtonLabel="キャンセル"
                handlePrimaryButtonClick={handleClick}
                shouldUseWarningColor={true}
            ></DialogView>
        </div>
    );
};

const ResetStateAllButton = () => {
    const strategyMemo = useAtomValue(strategyMemoAtom);
    const setGameName = useSetAtom(gameNameAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const setMemos = useSetAtom(memosAtom);

    const setSelectedGameMapId = useSetAtom(selectedGameMapIdAtom);
    const setGameMapDetailSelectionManager = useSetAtom(
        gameMapDetailSelectionManagerAtom,
    );
    const setGameMapShapeSelectionManager = useSetAtom(
        gameMapShapeSelectionManagerAtom,
    );
    const setGameMapFilteringValue = useSetAtom(gameMapFilteringValueAtom);

    const setSelectedPreparationIds = useSetAtom(selectedPreparationIdsAtom);
    const setPreparationFilteringValue = useSetAtom(
        preparationFilteringValueAtom,
    );

    const setSelectedMemoIds = useSetAtom(selectedMemoIdsAtom);
    const setMemoFilteringValue = useSetAtom(memoFilteringValueAtom);

    return (
        <Button
            className="hidden"
            id="reset-state-all"
            onClick={() => {
                setGameName(strategyMemo.gameName);
                setGameMaps(strategyMemo.gameMaps);
                setPreparations(strategyMemo.preparations);
                setMemos(strategyMemo.memos);

                const gameMap = strategyMemo.gameMaps.at(0);
                setSelectedGameMapId(gameMap?.id ?? null);
                setGameMapDetailSelectionManager((v) =>
                    v.copyWith({
                        boardItems: new GameMapDetailIdList(),
                        listItems: new GameMapDetailIdList(),
                    }),
                );
                setGameMapShapeSelectionManager((v) =>
                    v.copyWith({
                        boardItems: new GameMapShapeIdList(),
                        listItems: new GameMapShapeIdList(),
                    }),
                );
                setGameMapFilteringValue("");

                setSelectedPreparationIds(new PreparationIdList());
                setPreparationFilteringValue("");

                setSelectedMemoIds(new MemoIdList());
                setMemoFilteringValue("");
            }}
        />
    );
};

const delayAction = new DelayAction();

const resetStateAll = () => {
    const element = document.querySelector("#reset-state-all");
    if (element instanceof HTMLButtonElement) {
        delayAction.run(() => {
            element.click();
        }, 200);
    }
};
