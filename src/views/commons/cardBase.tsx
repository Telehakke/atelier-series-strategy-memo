import { Input } from "@headlessui/react";
import { ReactNode } from "react";
import { Bg, Border, Divide, Ring, Text } from "./classNames";

const CardBase = ({
    title,
    id,
    selected,
    onClick,
    onDoubleClick,
    checked,
    onCheckboxChange,
    children,
}: {
    title: string;
    id: string;
    selected: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    onDoubleClick: React.MouseEventHandler<HTMLDivElement>;
    checked?: boolean;
    onCheckboxChange?: React.ChangeEventHandler<HTMLInputElement>;
    children?: ReactNode;
}) => {
    return (
        <div
            className={`mx-auto max-w-150 overflow-clip rounded-md border-2 hover:ring-4 ${Ring.blue500} ${Border.neutral950_300}`}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            <div
                className={`flex h-8 items-center gap-2 px-1 ${selected ? Bg.blue500 : Bg.neutral950_300}`}
            >
                {checked != null && onCheckboxChange != null && (
                    <Checkbox
                        checked={checked}
                        onCheckboxChange={onCheckboxChange}
                    />
                )}
                <h2
                    className={`flex-1 scroll-mt-15 scroll-pt-15 truncate text-lg font-bold ${Text.neutral100_950}`}
                    id={id}
                >
                    {title}
                </h2>
            </div>
            <div className={`divide-y-2 text-sm ${Divide.neutral950_300}`}>
                {children}
            </div>
        </div>
    );
};

export default CardBase;

/* -------------------------------------------------------------------------- */

const Checkbox = ({
    checked,
    onCheckboxChange,
}: {
    checked: boolean;
    onCheckboxChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
    return (
        <Input
            className="size-6"
            type="checkbox"
            checked={checked}
            onChange={onCheckboxChange}
            onClick={(event) => {
                event.stopPropagation();
            }}
            onDoubleClick={(event) => {
                event.stopPropagation();
            }}
        />
    );
};
