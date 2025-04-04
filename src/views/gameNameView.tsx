import { useAtom } from "jotai";
import { useState } from "react";
import { strategyMemoRepositoryAtom } from "../atoms";
import { StrategyMemoUtility } from "../models/strategyMemo";
import DialogView from "./commons/dialogView";
import { PencilIconButton } from "./commons/iconButtons";
import TextField from "./commons/textField";

const GameNameView = ({ title }: { title: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="truncate">
                <div className="flex items-center gap-2">
                    <h1 className="truncate">{title}</h1>
                    <PencilIconButton onClick={() => setIsOpen(true)} />
                </div>
            </div>
            <EditGameNameDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
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
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const [name, setName] = useState(strategyMemo.gameName);

    const handleButtonClick = () => {
        setStrategyMemo((v) => StrategyMemoUtility.changedGameName(v, name));
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="ゲーム名の編集"
            primaryButtonLabel="変更"
            secondaryButtonLabel="キャンセル"
            onPrimaryButtonClick={handleButtonClick}
        >
            <TextField
                label="ゲーム名"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </DialogView>
    );
};
