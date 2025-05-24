import { Button } from "@headlessui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    gameMapsAtom,
    gameNameAtom,
    isReadonlyAtom,
    memosAtom,
    preparationsAtom,
    selectedGameMapIdAtom,
    strategyMemoAtom,
} from "../atoms";
import { GameMapList } from "../models/gameMap";
import LocalStorage from "../models/localStorage";
import { MemoList } from "../models/memo";
import { PreparationList } from "../models/preparation";
import { StrategyMemo, StrategyMemoId } from "../models/strategyMemo";
import { StrategyMemoRecordUtility } from "../models/strategyMemoRecord";
import { Bg, Text } from "./commons/classNames";
import DialogView from "./commons/dialogView";

export const CheckShareParameter = () => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameName = useSetAtom(gameNameAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const setMemos = useSetAtom(memosAtom);
    const setSelectedGameMapId = useSetAtom(selectedGameMapIdAtom);
    const setIsReadonly = useSetAtom(isReadonlyAtom);
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const func = async () => {
            const params = new URLSearchParams(document.location.search);
            const share = params.get("share");
            if (share == null) return;
            if (
                share.indexOf("https://gist.githubusercontent.com/") < 0 &&
                share.indexOf("https://raw.githubusercontent.com/") < 0
            ) {
                setErrorMessage(
                    "指定されたURLからデータを取り込むことはできません",
                );
                return;
            }

            try {
                const response = await fetch(share);
                const text = await response.text();
                const json = JSON.parse(text);
                const obj = StrategyMemoRecordUtility.copied(json);
                const strategyMemo =
                    StrategyMemoRecordUtility.convertToStrategyMemo(obj);
                setStrategyMemo(strategyMemo);
                setGameName(strategyMemo.gameName);
                setGameMaps(strategyMemo.gameMaps);
                setPreparations(strategyMemo.preparations);
                setMemos(strategyMemo.memos);
                const gameMap = strategyMemo.gameMaps.at(0);
                setSelectedGameMapId(gameMap?.id ?? null);
                setIsReadonly(true);
            } catch (error) {
                setIsOpen(true);
                setErrorMessage(String(error));

                const empty = new StrategyMemo(
                    "",
                    new GameMapList(),
                    new PreparationList(),
                    new MemoList(),
                    new StrategyMemoId(uuidv4()),
                );
                setStrategyMemo(empty);
                setGameName(empty.gameName);
                setGameMaps(empty.gameMaps);
                setPreparations(empty.preparations);
                setMemos(empty.memos);
                setSelectedGameMapId(null);
            }
        };
        func();
    }, [
        setIsOpen,
        setErrorMessage,
        setGameMaps,
        setGameName,
        setMemos,
        setPreparations,
        setSelectedGameMapId,
        setStrategyMemo,
        setIsReadonly,
    ]);

    return (
        <>
            {isOpen && (
                <ShareErrorDialog
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    errorMessage={errorMessage}
                />
            )}
        </>
    );
};

const ShareErrorDialog = ({
    isOpen,
    setIsOpen,
    errorMessage,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    errorMessage: string;
}) => {
    return (
        <>
            {isOpen && (
                <DialogView
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    title="シェアの失敗"
                    secondaryButtonLabel="閉じる"
                >
                    <p>{errorMessage}</p>
                </DialogView>
            )}
        </>
    );
};

/* -------------------------------------------------------------------------- */

export const ReadonlyButton = ({ className }: { className?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={className}>
                <Button
                    className={`rounded-full p-2 ${Bg.neutral500} ${Bg.hoverNeutral400}`}
                    onClick={() => setIsOpen(true)}
                >
                    <p className={`${Text.neutral100}`}>読み出し専用モード</p>
                </Button>
            </div>
            {isOpen && (
                <ImportShareDialog isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </>
    );
};

const ImportShareDialog = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setIsReadonly = useSetAtom(isReadonlyAtom);
    const strategyMemo = useAtomValue(strategyMemoAtom);

    const handleClick = () => {
        setIsReadonly(false);
        LocalStorage.setStrategyMemo(strategyMemo, false);

        const url = new URL(location.href);
        url.search = "";
        // リロードせずに、パラメータを取り除いたURLへ置き換える
        history.replaceState(null, "", url);
    };

    return (
        <>
            {isOpen && (
                <DialogView
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    title="共有データの取り込み"
                    primaryButtonLabel="取り込む"
                    secondaryButtonLabel="キャンセル"
                    handlePrimaryButtonClick={handleClick}
                >
                    <p>
                        共有データをローカルに保存しますか？
                        <br />
                        読み出し専用モードが解除され編集可能になります
                    </p>
                </DialogView>
            )}
        </>
    );
};
