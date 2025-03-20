import { MemoList } from "./memo";

export default class MemoFilter {
    static filtered = (list: MemoList, texts: string[]): MemoList => {
        if (texts.length === 0) return list;

        return list.filter((memo) =>
            texts.some((v) => {
                if (memo.title.includes(v)) return true;
                if (memo.text.includes(v)) return true;
                return false;
            }),
        );
    };
}
