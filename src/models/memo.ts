import { v4 as uuidv4 } from "uuid";
import { StrategyMemo, StrategyMemoUtility } from "./strategyMemo";

export type Memo = {
    readonly title: string;
    readonly text: string;
    readonly id: string;
};

export class MemoUtility {
    static create = (
        inputTitle: string,
        inputText: string,
        id: string,
    ): Memo => {
        return {
            title: inputTitle.trim(),
            text: inputText.trim(),
            id: id,
        };
    };

    static copied = (memo: Memo): Memo => {
        return {
            title: memo.title,
            text: memo.text,
            id: uuidv4(),
        };
    };

    static find = (memos: Memo[], id: string): Memo | null => {
        return memos.find((v) => v.id === id) ?? null;
    };

    static findIndex = (memos: Memo[], id: string): number | null => {
        const index = memos.findIndex((v) => v.id === id);
        return index < 0 ? null : index;
    };

    static added = (strategyMemo: StrategyMemo, memo: Memo): StrategyMemo => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.memos.push(memo);
        return copied;
    };

    static changed = (
        strategyMemo: StrategyMemo,
        id: string,
        input: { title: string; text: string },
    ): StrategyMemo => {
        const index = this.findIndex(strategyMemo.memos, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const memo: Memo = {
            ...input,
            id: copied.memos[index].id,
        };
        copied.memos[index] = memo;
        return copied;
    };

    static removed = (strategyMemo: StrategyMemo, id: string): StrategyMemo => {
        const index = this.findIndex(strategyMemo.memos, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.memos.splice(index, 1);
        return copied;
    };

    static movedUp = (strategyMemo: StrategyMemo, id: string): StrategyMemo => {
        const index = this.findIndex(strategyMemo.memos, id);
        if (index == null) return strategyMemo;

        const newIndex = index - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.memos.splice(index, 1);
        copied.memos.splice(newIndex, 0, item);
        return copied;
    };

    static movedDown = (
        strategyMemo: StrategyMemo,
        id: string,
    ): StrategyMemo => {
        const index = this.findIndex(strategyMemo.memos, id);
        if (index == null) return strategyMemo;

        const newIndex = index + 1;
        if (newIndex >= strategyMemo.memos.length) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.memos.splice(index, 1);
        copied.memos.splice(newIndex, 0, item);
        return copied;
    };
}
