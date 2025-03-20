import { Id, IdList, ListWithId, WithId } from "./id";

export class MemoId implements Id {
    readonly _type: string = "MemoId";
    readonly value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export class MemoIdList extends IdList<MemoId> {
    readonly _type: string = "MemoIdList";

    added = (id: MemoId): MemoIdList => new MemoIdList(...this.helperAdded(id));

    removed = (targetId: MemoId): MemoIdList =>
        new MemoIdList(...this.helperRemoved(targetId));
}

/* -------------------------------------------------------------------------- */

export class Memo implements WithId {
    readonly _type: string = "Memo";
    readonly title: string;
    readonly text: string;
    readonly checked: boolean;
    readonly id: MemoId;

    constructor(title: string, text: string, checked: boolean, id: MemoId) {
        this.title = title;
        this.text = text;
        this.checked = checked;
        this.id = id;
    }

    static create = (
        title: string,
        text: string,
        checked: boolean,
        id: MemoId,
    ): Memo => new Memo(title.trim(), text.trim(), checked, id);

    copyWith = (obj?: {
        title?: string;
        text?: string;
        checked?: boolean;
        id?: MemoId;
    }): Memo =>
        obj == null
            ? this
            : new Memo(
                  obj.title ?? this.title,
                  obj.text ?? this.text,
                  obj.checked ?? this.checked,
                  obj.id ?? this.id,
              );
}

export class MemoList extends ListWithId<Memo, MemoId> {
    readonly _type: string = "MemoList";

    map = <T>(
        callbackfn: (value: Memo, index: number, array: readonly Memo[]) => T,
    ) => this.items.map(callbackfn);

    filter = (
        predicate: (
            value: Memo,
            index: number,
            array: readonly Memo[],
        ) => boolean,
    ): MemoList => new MemoList(...this.helperFilter(predicate));

    added = (item: Memo): MemoList => new MemoList(...this.helperAdded(item));

    replaced = (targetId: MemoId, newItem: Memo): MemoList =>
        new MemoList(...this.helperReplaced(targetId, newItem));

    removed = (targetId: MemoId): MemoList =>
        new MemoList(...this.helperRemoved(targetId));

    movedUp = (targetId: MemoId): MemoList =>
        new MemoList(...this.helperMovedUp(targetId));

    movedDown = (targetId: MemoId): MemoList =>
        new MemoList(...this.helperMovedDown(targetId));

    uncheckedAll = (): MemoList => {
        const newItems = this.items.map(
            (v) => new Memo(v.title, v.text, false, v.id),
        );
        return new MemoList(...newItems);
    };
}
