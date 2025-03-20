import { useState } from "react";
import { MemoWithID } from "../../models/memo";
import MemosFiltering from "../../models/memosFiltering";
import { Bg, Divide } from "../commons/classNames";
import PanelOpenCloseButton from "../commons/panelOpenCloseButton";
import MemosFilteringTextField from "./sub/memosFilteringTextField";
import MemosLinkList from "./sub/memosLinkList";
import MemosList from "./sub/memosList";

const MemoView = ({
    memos,
    isPanelOpen,
    setIsPanelOpen,
}: {
    memos: MemoWithID[];
    isPanelOpen: boolean;
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [onFiltering, setOnFiltering] = useState(false);
    const [filteringValue, setFilteringValue] = useState("");
    const memosFiltering = new MemosFiltering(memos);
    const filteredMemos = memosFiltering.filtered(filteringValue);

    return (
        <>
            <div
                className={`fixed top-0 left-0 z-5 flex h-full max-w-60 gap-2 p-2 pt-13 ${Bg.neutral50}`}
            >
                {isPanelOpen && (
                    <div
                        className={`divide-y-2 overflow-scroll ${Divide.neutral300}`}
                    >
                        <MemosFilteringTextField
                            className="py-2"
                            filteringValue={filteringValue}
                            setFilteringValue={setFilteringValue}
                            setOnFiltering={setOnFiltering}
                        />
                        <MemosLinkList className="py-2" memos={filteredMemos} />
                    </div>
                )}
                <PanelOpenCloseButton
                    isOpen={isPanelOpen}
                    setIsOpen={setIsPanelOpen}
                />
            </div>
            <div className="ml-11">
                <MemosList memos={filteredMemos} onFiltering={onFiltering} />
            </div>
        </>
    );
};

export default MemoView;
