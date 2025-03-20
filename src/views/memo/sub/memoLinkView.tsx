import { useAtomValue } from "jotai";
import { memoFilteringValueAtom, memosAtom } from "../../../atoms";
import MemoFilter from "../../../models/memoFilter";
import Split from "../../../models/split";
import { Text } from "../../commons/classNames";

const MemoLinkView = ({ className }: { className?: string }) => {
    const memos = useAtomValue(memosAtom);
    const filteringValue = useAtomValue(memoFilteringValueAtom);
    const filteredMemos = MemoFilter.filtered(
        memos,
        Split.byWhiteSpace(filteringValue),
    );

    return (
        <div className={`w-45 ${className}`}>
            {filteredMemos.map((v) => (
                <a
                    className={`block truncate leading-8 ${Text.hoverBlue500}`}
                    key={v.id.value}
                    href={`#${v.id.value}`}
                >
                    {v.title}
                </a>
            ))}
        </div>
    );
};

export default MemoLinkView;
