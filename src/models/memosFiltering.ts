import { MemoWithID } from "./memo";

export default class MemosFiltering {
    private memos: MemoWithID[];

    constructor(memos: MemoWithID[]) {
        this.memos = memos;
    }

    /**
     * memosの要素に入力文字列を含むものだけを抽出する
     */
    filtered = (inputs: string[]): MemoWithID[] => {
        return this.memos.filter((v) => {
            return inputs.some((input) => {
                if (v.title.includes(input)) return true;
                if (v.text.includes(input)) return true;
                return false;
            });
        });
    };
}
