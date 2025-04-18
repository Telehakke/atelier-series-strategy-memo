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
    handleCheckboxChange,
    children,
}: {
    title: string;
    id: string;
    selected: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    onDoubleClick: React.MouseEventHandler<HTMLDivElement>;
    checked?: boolean;
    handleCheckboxChange?: React.ChangeEventHandler<HTMLInputElement>;
    children?: ReactNode;
}) => {
    return (
        <div
            className={`mx-auto max-w-150 overflow-clip rounded-md border-2 hover:ring-4 ${Border.neutral950} ${Ring.blue500}`}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            <div
                className={`flex h-9 items-center justify-between gap-2 px-1 ${selected ? Bg.blue500 : Bg.neutral950}`}
            >
                <h2
                    className={`scroll-mt-14 scroll-pt-14 truncate text-lg font-bold ${Text.neutral50}`}
                    id={id}
                >
                    {title}
                </h2>
                {checked != null && handleCheckboxChange != null && (
                    <Input
                        className="size-6"
                        type="checkbox"
                        checked={checked}
                        onChange={handleCheckboxChange}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        onDoubleClick={(event) => {
                            event.stopPropagation();
                        }}
                    />
                )}
            </div>
            <div className={`divide-y-2 text-sm ${Divide.neutral950}`}>
                {children}
            </div>
        </div>
    );
};

export default CardBase;
