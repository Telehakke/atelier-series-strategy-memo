import { useAtomValue } from "jotai";
import {
    preparationFilteringValueAtom,
    preparationsAtom,
} from "../../../atoms";
import PreparationFilter from "../../../models/preparationFilter";
import Split from "../../../models/split";
import { Text } from "../../commons/classNames";

const PreparationLinkView = ({ className }: { className?: string }) => {
    const preparations = useAtomValue(preparationsAtom);
    const filteringValue = useAtomValue(preparationFilteringValueAtom);
    const filteredPreparations = PreparationFilter.filtered(
        preparations,
        Split.byWhiteSpace(filteringValue),
    );

    return (
        <div className={className}>
            {filteredPreparations.map((v) => (
                <a
                    className={`block truncate leading-8 ${Text.hoverBlue500}`}
                    key={v.id.value}
                    href={`#${v.id.value}`}
                >
                    {v.name}
                </a>
            ))}
        </div>
    );
};

export default PreparationLinkView;
