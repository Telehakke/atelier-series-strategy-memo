import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React from "react";
import {
    canSelectMultipleAtom,
    isEditMemoDialogOpenAtom,
    isReadonlyAtom,
    memoFilteringValueAtom,
    memosAtom,
    selectedMemoIdsAtom,
    strategyMemoAtom,
} from "../../../atoms";
import LocalStorage from "../../../models/localStorage";
import { Memo, MemoIdList } from "../../../models/memo";
import MemoFilter from "../../../models/memoFilter";
import Split from "../../../models/split";
import CardBase from "../../commons/cardBase";

const MemoListView = () => {
    const memos = useAtomValue(memosAtom);
    const filteringValue = useAtomValue(memoFilteringValueAtom);
    const filteredMemos = MemoFilter.filtered(
        memos,
        Split.byWhiteSpace(filteringValue),
    );

    return (
        <div className="flex flex-col items-center gap-2 pb-60">
            {filteredMemos.map((v) => (
                <Card key={v.id.value} memo={v} />
            ))}
        </div>
    );
};

export default MemoListView;

/* -------------------------------------------------------------------------- */

const Card = ({ memo }: { memo: Memo }) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setMemos = useSetAtom(memosAtom);
    const canSelectMultiple = useAtomValue(canSelectMultipleAtom);
    const [selectedMemoIds, setSelectedMemoIds] = useAtom(selectedMemoIdsAtom);
    const setIsEditDialogOpen = useSetAtom(isEditMemoDialogOpenAtom);
    const isReadonly = useAtomValue(isReadonlyAtom);

    // クリックでリストアイテムの選択状態を切り替える
    const handleClick = () => {
        if (canSelectMultiple) {
            setSelectedMemoIds((v) =>
                v.hasId(memo.id) ? v.removed(memo.id) : v.added(memo.id),
            );
            return;
        }

        setSelectedMemoIds((v) =>
            v.hasId(memo.id) ? new MemoIdList() : new MemoIdList(memo.id),
        );
    };

    // ダブルクリックで編集ダイアログを開く
    const handleDoubleClick = () => {
        if (canSelectMultiple) return;

        setSelectedMemoIds(new MemoIdList(memo.id));
        setIsEditDialogOpen(true);
    };

    // チェックボックスの状態を切り替える
    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (isReadonly) return;

        setStrategyMemo((v) => {
            const newMemo = memo.copyWith({ checked: event.target.checked });
            const newMemos = v.memos.replaced(newMemo);
            const newStrategyMemo = v.replacedMemos(newMemos);
            setMemos(newStrategyMemo.memos);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    return (
        <CardBase
            title={memo.title}
            id={memo.id.value}
            selected={selectedMemoIds.hasId(memo.id)}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            checked={memo.checked}
            onCheckboxChange={handleCheckboxChange}
        >
            <p className="p-1 text-sm whitespace-pre-wrap">{memo.text}</p>
        </CardBase>
    );
};
