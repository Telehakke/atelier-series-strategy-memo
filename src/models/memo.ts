import { v4 as uuidv4 } from "uuid";
import { StrategyMemoUtility, StrategyMemoWithID } from "./strategyMemo";
import { isNotNull, isString } from "./typeGuards";

export type Memo = {
    readonly title: string;
    readonly text: string;
};

export type MemoWithID = Memo & {
    readonly id: string;
};

export class MemoUtility {
    static isMemo = (value: unknown): value is Memo => {
        if (!isNotNull(value)) return false;
        if (!isString(value.title)) return false;
        if (!isString(value.text)) return false;
        return true;
    };

    static isMemos = (value: unknown): value is Memo[] => {
        if (!Array.isArray(value)) return false;
        return value.every((v) => this.isMemo(v));
    };

    static create = (
        inputTitle: string,
        inputText: string,
        id: string,
    ): MemoWithID => {
        return {
            title: inputTitle.trim(),
            text: inputText.trim(),
            id: id,
        };
    };

    static copied = (memo: MemoWithID): MemoWithID => {
        return {
            title: memo.title,
            text: memo.text,
            id: uuidv4(),
        };
    };

    static find = (memos: MemoWithID[], id: string): MemoWithID | null => {
        return memos.find((v) => v.id === id) ?? null;
    };

    static findIndex = (memos: MemoWithID[], id: string): number | null => {
        const index = memos.findIndex((v) => v.id === id);
        return index < 0 ? null : index;
    };

    static added = (
        strategyMemo: StrategyMemoWithID,
        memo: MemoWithID,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.memos.push(memo);
        return copied;
    };

    static changed = (
        strategyMemo: StrategyMemoWithID,
        id: string,
        input: { title: string; text: string },
    ): StrategyMemoWithID => {
        const index = this.findIndex(strategyMemo.memos, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const memo: MemoWithID = {
            ...input,
            id: copied.memos[index].id,
        };
        copied.memos[index] = memo;
        return copied;
    };

    static removed = (
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): StrategyMemoWithID => {
        const index = this.findIndex(strategyMemo.memos, id);
        if (index == null) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.memos.splice(index, 1);
        return copied;
    };

    static movedUp = (
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): StrategyMemoWithID => {
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
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): StrategyMemoWithID => {
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
