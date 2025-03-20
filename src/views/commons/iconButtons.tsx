import { Button } from "@headlessui/react";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    CircleX,
    Clipboard,
    Database,
    Pencil,
    Plus,
    RotateCcw,
    SquareChevronDown,
    SquareChevronLeft,
    SquareChevronRight,
    SquareChevronUp,
    Trash,
} from "lucide-react";
import { Bg, Stroke } from "./classNames";

export const ChevronLeftIconButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`size-8 h-full rounded-full p-1 ${Bg.neutral100} ${Bg.hoverNeutral200}`}
            onClick={onClick}
        >
            <ChevronLeft className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const ChevronRightIconButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`size-8 h-full rounded-full p-1 ${Bg.neutral100} ${Bg.hoverNeutral200}`}
            onClick={onClick}
        >
            <ChevronRight className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const ClipboardIconButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200}`}
            onClick={onClick}
        >
            <Clipboard className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const PencilIconButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    darkTheme?: boolean;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200}`}
            onClick={onClick}
        >
            <Pencil className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const TrashIconButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200}`}
            onClick={onClick}
        >
            <Trash className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const DatabaseIconButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200}`}
            onClick={onClick}
        >
            <Database className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const ChevronUpIconButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200}`}
            onClick={onClick}
        >
            <ChevronUp className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const ChevronDownIconButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200}`}
            onClick={onClick}
        >
            <ChevronDown className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const RotateCCWIconButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200}`}
            onClick={onClick}
        >
            <RotateCcw className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const CircleXIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200} ${className}`}
            onClick={onClick}
        >
            <CircleX className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const SquareChevronLeftIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200} ${className}`}
            onClick={onClick}
        >
            <SquareChevronLeft className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const SquareChevronRightIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200} ${className}`}
            onClick={onClick}
        >
            <SquareChevronRight className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const SquareChevronUpIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200} ${className}`}
            onClick={onClick}
        >
            <SquareChevronUp className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const SquareChevronDownIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <Button
            className={`size-8 rounded-full p-1 ${Bg.hoverNeutral200} ${className}`}
            onClick={onClick}
        >
            <SquareChevronDown className={`${Stroke.neutral700}`} />
        </Button>
    );
};

export const PlusIconLargeButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`mx-auto grid size-10 place-items-center rounded-full ${Bg.blue500} ${Bg.hoverBlue400}`}
            onClick={onClick}
        >
            <Plus className={`size-10 ${Stroke.neutral100}`} />
        </Button>
    );
};

export const ChevronUpIconLargeButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`mx-auto grid size-10 place-items-center rounded-full ${Bg.neutral500} ${Bg.hoverNeutral400}`}
            onClick={onClick}
        >
            <ChevronUp className={`size-7 ${Stroke.neutral100}`} />
        </Button>
    );
};

export const ChevronDownIconLargeButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`mx-auto grid size-10 place-items-center rounded-full ${Bg.neutral500} ${Bg.hoverNeutral400}`}
            onClick={onClick}
        >
            <ChevronDown className={`size-7 ${Stroke.neutral100}`} />
        </Button>
    );
};

export const PencilIconLargeButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`mx-auto grid size-10 place-items-center rounded-full ${Bg.blue500} ${Bg.hoverBlue400}`}
            onClick={onClick}
        >
            <Pencil className={`size-7 ${Stroke.neutral100}`} />
        </Button>
    );
};

export const TrashIconLargeButton = ({
    onClick,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <Button
            className={`mx-auto grid size-10 place-items-center rounded-full ${Bg.red500} ${Bg.hoverRed400}`}
            onClick={onClick}
        >
            <Trash className={`size-7 ${Stroke.neutral100}`} />
        </Button>
    );
};
