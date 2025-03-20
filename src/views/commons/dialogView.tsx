import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ReactNode } from "react";
import { Bg, Text } from "./classNames";
import RoundedButton from "./roundedButton";

const DialogView = ({
    isOpen,
    setIsOpen,
    title,
    primaryButtonLabel,
    secondaryButtonLabel,
    handlePrimaryButtonClick,
    shouldUseWarningColor,
    children,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    primaryButtonLabel?: string;
    secondaryButtonLabel: string;
    handlePrimaryButtonClick?: () => void;
    shouldUseWarningColor?: boolean;
    children?: ReactNode;
}) => {
    return (
        <Dialog
            className={`relative z-50 ${Text.neutral950_100}`}
            open={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <div
                className={`fixed inset-0 grid items-center justify-center overflow-scroll ${Bg.black_white_25}`}
            >
                <div className="w-screen max-w-100">
                    <DialogPanel
                        className={`m-4 flex flex-col gap-4 rounded-xl p-4 ${Bg.neutral50_950}`}
                    >
                        <DialogTitle className={`text-center font-bold`}>
                            {title}
                        </DialogTitle>
                        <div>{children}</div>
                        <Buttons
                            setIsOpen={setIsOpen}
                            primaryButtonLabel={primaryButtonLabel}
                            secondaryButtonLabel={secondaryButtonLabel}
                            handlePrimaryButtonClick={handlePrimaryButtonClick}
                            shouldUseWarningColor={shouldUseWarningColor}
                        />
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default DialogView;

/* -------------------------------------------------------------------------- */

const Buttons = ({
    setIsOpen,
    primaryButtonLabel,
    secondaryButtonLabel,
    handlePrimaryButtonClick,
    shouldUseWarningColor,
}: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    primaryButtonLabel?: string;
    secondaryButtonLabel: string;
    handlePrimaryButtonClick?: () => void;
    shouldUseWarningColor?: boolean;
}) => {
    return (
        <div className="flex justify-center gap-4">
            <RoundedButton
                label={secondaryButtonLabel}
                onClick={() => setIsOpen(false)}
            />
            {primaryButtonLabel != null && (
                <RoundedButton
                    label={primaryButtonLabel}
                    shouldUseWarningColor={shouldUseWarningColor}
                    onClick={() => handlePrimaryButtonClick?.()}
                />
            )}
        </div>
    );
};
