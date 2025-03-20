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
            className={`rounded-full border-2 px-4 py-1 ${Border.neutral400_700} ${Bg.hoverNeutral200_800} ${shouldUseWarningColor ? Text.red500 : Text.neutral950_100}`}
            onClick={onClick}
        >
            {label}
        </Button>
    );
};

export default RoundedButton;
