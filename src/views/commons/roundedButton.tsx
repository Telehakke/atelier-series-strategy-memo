import { Button } from "@headlessui/react";
import { Bg, Border, Text } from "./classNames";

const RoundedButton = ({
    label,
    onClick,
    shouldUseWarningColor,
}: {
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    shouldUseWarningColor?: boolean;
}) => {
    return (
        <Button
            className={`d rounded-full border-2 px-2 ${Border.neutral400} ${Bg.hoverNeutral200} ${shouldUseWarningColor ? Text.red500 : Text.neutral950}`}
            onClick={onClick}
        >
            {label}
        </Button>
    );
};

export default RoundedButton;
