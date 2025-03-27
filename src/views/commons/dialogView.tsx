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
    onPrimaryButtonClick,
    shouldUseWarningColor,
    children,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    primaryButtonLabel?: string;
    secondaryButtonLabel: string;
    onPrimaryButtonClick?: () => void;
    shouldUseWarningColor?: boolean;
    children?: ReactNode;
}) => {
    return (
        <Dialog
            className={`relative z-50 ${Text.neutral950}`}
            open={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <div
                className={`fixed inset-0 flex w-screen items-center justify-center ${Bg.black_25}`}
            >
                <DialogPanel
                    className={`m-4 w-full max-w-100 space-y-4 rounded-xl p-4 ${Bg.neutral50}`}
                >
                    <DialogTitle
                        className={`text-center font-bold ${Text.neutral950}`}
                    >
                        {title}
                    </DialogTitle>
                    <div>{children}</div>
                    <div className="flex justify-center gap-4">
                        <RoundedButton
                            label={secondaryButtonLabel}
                            onClick={() => setIsOpen(false)}
                        />
                        {primaryButtonLabel != null && (
                            <RoundedButton
                                label={primaryButtonLabel}
                                shouldUseWarningColor={shouldUseWarningColor}
                                onClick={() =>
                                    onPrimaryButtonClick != null
                                        ? onPrimaryButtonClick()
                                        : () => {}
                                }
                            />
                        )}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default DialogView;
