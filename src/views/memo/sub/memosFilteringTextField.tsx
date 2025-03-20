import { Input } from "@headlessui/react";
import { Border } from "../../commons/classNames";
import { CircleXIconButton } from "../../commons/iconButtons";

const MemosFilteringTextField = ({
    filteringValue,
    setFilteringValue,
    setOnFiltering,
    className,
}: {
    filteringValue: string;
    setFilteringValue: React.Dispatch<React.SetStateAction<string>>;
    setOnFiltering: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Input
                className={`w-32 max-w-full rounded-md border-2 p-1 ${Border.neutral500}`}
                type="text"
                placeholder="フィルタリング"
                value={filteringValue}
                onChange={(e) => {
                    const value = e.target.value;
                    setFilteringValue(value);
                    setOnFiltering(value !== "");
                }}
            />
            <CircleXIconButton
                className={`${filteringValue ? "" : "invisible"}`}
                onClick={() => {
                    setFilteringValue("");
                    setOnFiltering(false);
                }}
            />
        </div>
    );
};

export default MemosFilteringTextField;
