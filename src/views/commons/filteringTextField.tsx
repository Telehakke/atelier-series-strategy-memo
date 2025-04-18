import { Input } from "@headlessui/react";
import { Border } from "./classNames";
import { CircleXIconButton } from "./iconButtons";

const FilteringTextField = ({
    filteringValue,
    setFilteringValue,
    className,
}: {
    filteringValue: string;
    setFilteringValue: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Input
                className={`w-32 rounded-md border-2 p-1 ${Border.neutral500}`}
                type="text"
                placeholder="フィルタリング"
                value={filteringValue}
                onChange={(e) => {
                    const value = e.target.value;
                    setFilteringValue(value);
                }}
            />
            <CircleXIconButton
                className={`${filteringValue ? "" : "invisible"}`}
                onClick={() => {
                    setFilteringValue("");
                }}
            />
        </div>
    );
};

export default FilteringTextField;
