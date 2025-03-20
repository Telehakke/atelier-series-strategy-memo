import { Button } from "@headlessui/react";
import {
    ChartPie,
    CircleX,
    ClipboardCopy,
    ClipboardPaste,
    Files,
    FlipHorizontal2,
    Image,
    ImageOff,
    Link2,
    Move,
    MoveHorizontal,
    MoveVertical,
    PaintBucket,
    PanelLeftClose,
    PanelLeftOpen,
    Pencil,
    Plus,
    RotateCw,
    Shapes,
    Trash,
    Wrench,
    X,
} from "lucide-react";
import React, { ReactNode } from "react";
import { Bg, Stroke, Text } from "./classNames";

export const MiddleIconButton = ({
    onClick,
    className,
    children,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    children: ReactNode;
}) => {
    return (
        <Button
            className={`size-10 rounded-full ${className ?? `${Bg.hoverNeutral300_700} ${Stroke.neutral700_400}`}`}
            onClick={onClick}
        >
            {children}
        </Button>
    );
};

export const MiddleIconClassName = "m-auto size-6 stroke-inherit";

export const PencilIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <MiddleIconButton className={className} onClick={onClick}>
            <Pencil className={`${MiddleIconClassName}`} />
        </MiddleIconButton>
    );
};

export const TrashIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <MiddleIconButton className={className} onClick={onClick}>
            <Trash className={`${MiddleIconClassName}`} />
        </MiddleIconButton>
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
        <MiddleIconButton className={className} onClick={onClick}>
            <CircleX className={`${MiddleIconClassName}`} />
        </MiddleIconButton>
    );
};

export const ImageIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <MiddleIconButton className={className} onClick={onClick}>
            <Image className={`${MiddleIconClassName}`} />
        </MiddleIconButton>
    );
};

export const ImageOffIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <MiddleIconButton className={className} onClick={onClick}>
            <ImageOff className={`${MiddleIconClassName}`} />
        </MiddleIconButton>
    );
};

export const PanelLeftOpenIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <MiddleIconButton className={className} onClick={onClick}>
            <PanelLeftOpen className={`${MiddleIconClassName}`} />
        </MiddleIconButton>
    );
};

export const PanelLeftCloseIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <MiddleIconButton className={className} onClick={onClick}>
            <PanelLeftClose className={`${MiddleIconClassName}`} />
        </MiddleIconButton>
    );
};

export const WrenchIconButton = ({
    onClick,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) => {
    return (
        <MiddleIconButton className={className} onClick={onClick}>
            <Wrench className={`${MiddleIconClassName}`} />
        </MiddleIconButton>
    );
};

/* -------------------------------------------------------------------------- */

export const LargeIconButton = ({
    onClick,
    description,
    className,
    children,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
    children: ReactNode;
}) => {
    return (
        <Button
            className={`relative size-14 rounded-full ${className ?? `${Bg.neutral500} ${Bg.hoverNeutral400} ${Stroke.neutral50}`}`}
            onClick={onClick}
        >
            {children}
            {description != null && (
                <p
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/70 px-1 text-[10px] text-nowrap ${Text.neutral100}`}
                >
                    {description}
                </p>
            )}
        </Button>
    );
};

export const largeIconClassName = "m-auto size-10 stroke-inherit";

export const PlusIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<Plus className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const PencilIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<Pencil className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const TrashIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<Trash className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const ClipboardCopyIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<ClipboardCopy className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const ClipboardPasteIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<ClipboardPaste className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const XIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<X className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const MoveIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<Move className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const ShapesIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<Shapes className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const WrenchIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<Wrench className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const MoveHorizontalIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<MoveHorizontal className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const MoveVerticalIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<MoveVertical className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const RotateCwIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<RotateCw className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const FlipHorizontal2IconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<FlipHorizontal2 className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const ChartPieIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<ChartPie className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const Link2IconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<Link2 className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const PaintBucketIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<PaintBucket className={largeIconClassName} />}
        </LargeIconButton>
    );
};

export const FilesIconLargeButton = ({
    onClick,
    description,
    className,
}: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    description?: string;
    className?: string;
}) => {
    return (
        <LargeIconButton
            className={className}
            onClick={onClick}
            description={description}
        >
            {<Files className={largeIconClassName} />}
        </LargeIconButton>
    );
};

/* -------------------------------------------------------------------------- */

// lucide(https://lucide.dev/)）から取得したSVGをtransformで微調整

// アイコン名: square
export const SquareShape = ({ style }: { style: React.CSSProperties }) => {
    return (
        <svg
            style={style}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <g transform="scale(1.11) translate(-1.2, -1.2)">
                <rect width="18" height="18" x="3" y="3" rx="2" />
            </g>
        </svg>
    );
};

// circle
export const CircleShape = ({ style }: { style: React.CSSProperties }) => {
    return (
        <svg
            style={style}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="12" cy="12" r="10" />
        </svg>
    );
};

// minus
export const LineShape = ({ style }: { style: React.CSSProperties }) => {
    return (
        <svg
            style={style}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <g transform="scale(2,1) translate(-6,0)">
                <path d="M5 12h14" />
            </g>
        </svg>
    );
};

// move-right
export const ArrowShape = ({ style }: { style: React.CSSProperties }) => {
    return (
        <svg
            style={style}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <g transform="">
                <path d="M18 8L22 12L18 16" />
            </g>
            <g transform="scale(1.1,1) translate(-2,0)">
                <path d="M2 12H22" />
            </g>
        </svg>
    );
};

// move-horizontal
export const TwoWayArrowShape = ({ style }: { style: React.CSSProperties }) => {
    return (
        <svg
            style={style}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="m18 8 4 4-4 4" />
            <path d="M2 12h20" />
            <path d="m6 8-4 4 4 4" />
        </svg>
    );
};

// redo
export const CurveShape = ({ style }: { style: React.CSSProperties }) => {
    return (
        <svg
            style={style}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <g transform="translate(1.05,-1)">
                <path d="M21 7v6h-6" />
            </g>
            <g transform="scale(1.12,1) translate(-1.3,-1)">
                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
            </g>
        </svg>
    );
};
