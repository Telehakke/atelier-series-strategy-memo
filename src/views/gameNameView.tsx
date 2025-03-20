import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { gameNameAtom, isReadonlyAtom, strategyMemoAtom } from "../atoms";
import LocalStorage from "../models/localStorage";
import DialogView from "./commons/dialogView";
import { PencilIconButton } from "./commons/iconButtons";
import TextField from "./commons/textField";

const GameNameView = () => {
    const gameName = useAtomValue(gameNameAtom);
    const isReadonly = useAtomValue(isReadonlyAtom);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="truncate">
                <div className="flex items-center gap-2">
                    <h1 className="truncate">{gameName}</h1>
                    {!isReadonly && (
                        <PencilIconButton onClick={() => setIsOpen(true)} />
                    )}
                </div>
            </div>
            {isOpen && (
                <EditGameNameDialog isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </>
    );
};

export default GameNameView;

/* -------------------------------------------------------------------------- */

const EditGameNameDialog = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const [gameName, setGameName] = useAtom(gameNameAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) => {
            const newStrategyMemo = v.replacedGameName(gameName);
            LocalStorage.setStrategyMemo(newStrategyMemo);
            return newStrategyMemo;
        });
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="ゲーム名の編集"
            primaryButtonLabel="変更"
            secondaryButtonLabel="キャンセル"
            handlePrimaryButtonClick={handleButtonClick}
        >
            <TextField
                label="ゲーム名"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
            />
        </DialogView>
    );
};
