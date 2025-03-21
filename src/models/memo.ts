import { StrategyMemoUtility, StrategyMemoWithID } from "./strategyMemo";
import { isNotNull } from "./typeGuards";

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
        if (typeof value.title !== "string") return false;
        if (typeof value.text !== "string") return false;
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

    static findIndex = (
        strategyMemo: StrategyMemoWithID,
        id: string,
    ): number | null => {
        const index = strategyMemo.memos.findIndex((v) => v.id === id);
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
        memosIndex: number,
        memo: MemoWithID,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.memos[memosIndex] = memo;
        return copied;
    };

    static removed = (
        strategyMemo: StrategyMemoWithID,
        memosIndex: number,
    ): StrategyMemoWithID => {
        const copied = StrategyMemoUtility.copied(strategyMemo);
        copied.memos.splice(memosIndex, 1);
        return copied;
    };

    static movedUp = (
        strategyMemo: StrategyMemoWithID,
        memosIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = memosIndex - 1;
        if (newIndex < 0) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.memos.splice(memosIndex, 1);
        copied.memos.splice(newIndex, 0, item);
        return copied;
    };

    static movedDown = (
        strategyMemo: StrategyMemoWithID,
        memosIndex: number,
    ): StrategyMemoWithID => {
        const newIndex = memosIndex + 1;
        if (newIndex >= strategyMemo.memos.length) return strategyMemo;

        const copied = StrategyMemoUtility.copied(strategyMemo);
        const [item] = copied.memos.splice(memosIndex, 1);
        copied.memos.splice(newIndex, 0, item);
        return copied;
    };
}
