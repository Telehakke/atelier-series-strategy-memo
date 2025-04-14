import { useState } from "react";
import { Memo } from "../../models/memo";
import MemosFiltering from "../../models/memosFiltering";
import splitByWhiteSpace from "../../models/splitByWhiteSpace";
import { Bg, Border, Divide } from "../commons/classNames";
import FilteringTextField from "../commons/filteringTextField";
import MemosLinkList from "./sub/memosLinkList";
import MemosList from "./sub/memosList";

const MemoView = ({
    memos,
    isPanelOpen,
}: {
    memos: Memo[];
    isPanelOpen: boolean;
}) => {
    const [filteringValue, setFilteringValue] = useState("");
    const memosFiltering = new MemosFiltering(memos);
    const filteredMemos = memosFiltering.filtered(
        splitByWhiteSpace(filteringValue),
    );

    return (
        <>
            {isPanelOpen && (
                <div
                    className={`fixed top-0 left-0 z-5 flex h-full gap-2 border-r-2 p-2 pt-14 ${Bg.neutral50} ${Border.neutral300}`}
                >
                    <div
                        className={`divide-y-2 overflow-scroll ${Divide.neutral300}`}
                    >
                        <FilteringTextField
                            className="py-2"
                            filteringValue={filteringValue}
                            setFilteringValue={setFilteringValue}
                        />
                        <MemosLinkList className="py-2" memos={filteredMemos} />
                    </div>
                </div>
            )}
            <MemosList memos={filteredMemos} />
        </>
    );
};

export default MemoView;
