import { useAtom } from "jotai";
import { useRef, useState } from "react";
import { preparationFilteringValueAtom } from "../../../atoms";
import DelayAction from "../../../models/delayAction";
import TextFieldWithPlaceholder from "../../commons/filteringTextField";

const PreparationFilteringTextField = ({
    className,
}: {
    className?: string;
}) => {
    const [filteringValue, setFilteringValue] = useAtom(
        preparationFilteringValueAtom,
    );
    const [value, setValue] = useState(filteringValue);
    const delayAction = useRef(new DelayAction());

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        delayAction.current.run(() => {
            setFilteringValue(event.target.value);
        }, 500);
    };

    const handleClick = () => {
        setValue("");
        setFilteringValue("");
    };

    return (
        <TextFieldWithPlaceholder
            className={className}
            value={value}
            onChange={handleChange}
            onCloseButtonClick={handleClick}
            placeholder="フィルタリング"
        />
    );
};

export default PreparationFilteringTextField;
