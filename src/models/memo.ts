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
}
