import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useState } from "react";
import { strategyMemoRepositoryAtom } from "../strategyMemoAtom";
import DialogView from "./commons/dialogView";
import { RotateCCWIconButton } from "./commons/iconButtons";

const ResetButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <RotateCCWIconButton onClick={() => setIsOpen(true)} />
            <ResetDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default ResetButton;

/* -------------------------------------------------------------------------- */

const ResetDialog = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="データのリセット"
            primaryButtonLabel="リセット"
            onPrimaryButtonClick={() => {
                setStrategyMemo(RESET);
                setIsOpen(false);
            }}
            shouldUseWarningColor={true}
        />
    );
};
