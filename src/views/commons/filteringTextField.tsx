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
        <div className={`flex h-10 items-center gap-2 ${className}`}>
            <Input
                className={`w-33 rounded-md border-2 p-1 ${Border.neutral500}`}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {value.length > 0 && (
                <CircleXIconButton onClick={onCloseButtonClick} />
            )}
        </div>
    );
};

export default TextFieldWithPlaceholder;
