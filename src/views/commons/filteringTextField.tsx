import { Input } from "@headlessui/react";
import { Border } from "./classNames";
import { CircleXIconButton } from "./iconButtons";

const TextFieldWithPlaceholder = ({
    value,
    onChange,
    onCloseButtonClick,
    placeholder,
    className,
}: {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onCloseButtonClick: React.MouseEventHandler<HTMLButtonElement>;
    placeholder?: string;
    className?: string;
}) => {
    return (
        <div className={className}>
            <div className="flex items-center gap-2">
                <Input
                    className={`w-full rounded-md border-2 p-1 ${Border.neutral500}`}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                <div
                    className={`grid ${value.length === 0 ? "invisible" : ""}`}
                >
                    <CircleXIconButton onClick={onCloseButtonClick} />
                </div>
            </div>
        </div>
    );
};

export default TextFieldWithPlaceholder;
