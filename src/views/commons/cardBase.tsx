import { ReactNode } from "react";
import { Bg, Border, Divide, Ring, Text } from "./classNames";

const CardBase = ({
    title,
    id,
    selected,
    onClick,
    children,
}: {
    title: string;
    id: string;
    selected: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    children?: ReactNode;
}) => {
    return (
        <div
            className={`mx-auto max-w-150 overflow-clip rounded-md border-2 hover:ring-4 ${Border.neutral950} ${Ring.blue500}`}
            onClick={onClick}
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
            </div>
            <div className={`divide-y-2 text-sm ${Divide.neutral950}`}>
                {children}
            </div>
        </div>
    );
};

export default CardBase;
