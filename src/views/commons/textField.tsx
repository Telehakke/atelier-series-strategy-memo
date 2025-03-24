import { Field, Input, Label } from "@headlessui/react";
import { Border, Text } from "./classNames";

const TextField = ({
    label,
    value,
    errorMessage,
    onChange,
}: {
    label: string;
    value: string;
    errorMessage?: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
    return (
        <Field>
            <Label className={`block text-sm ${Text.neutral500}`}>
                {label}
                <span className="ml-4 text-orange-500">{errorMessage}</span>
            </Label>
            <Input
                className={`w-full rounded-md border-2 p-1 ${Border.neutral500}`}
                type="text"
                value={value}
                onChange={onChange}
            />
        </Field>
    );
};

export default TextField;
