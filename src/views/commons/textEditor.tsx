import { Field, Label } from "@headlessui/react";
import { Border, Text } from "./classNames";

const TextEditor = ({
    label,
    value,
    onChange,
    className,
}: {
    label?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    className?: string;
}) => {
    return (
        <Field>
            {label && (
                <Label className={`block text-sm ${Text.neutral500}`}>
                    {label}
                </Label>
            )}
            <textarea
                className={`w-full resize-none rounded-md border-2 p-1 ${Border.neutral500} ${className}`}
                value={value}
                onChange={onChange}
            />
        </Field>
    );
};

export default TextEditor;
