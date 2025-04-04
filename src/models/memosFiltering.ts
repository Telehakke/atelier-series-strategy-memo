import { Memo } from "./memo";

export default class MemosFiltering {
    private memos: Memo[];

    constructor(memos: Memo[]) {
        this.memos = memos;
    }

    /**
     * memosの要素に入力文字列を含むものだけを抽出する
     */
    filtered = (inputs: string[]): Memo[] => {
        return this.memos.filter((v) => {
            return inputs.some((input) => {
                if (v.title.includes(input)) return true;
                if (v.text.includes(input)) return true;
                return false;
            });
        });
    };
}
