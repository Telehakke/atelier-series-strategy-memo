export interface Id {
    readonly _type: string;
    readonly value: string;
}

export abstract class IdList<T extends Id> {
    abstract readonly _type: string;
    readonly items: readonly T[];

    constructor(...items: readonly T[]) {
        this.items = items ?? [];
    }

    get length(): number {
        return this.items.length;
    }

    get isEmpty(): boolean {
        return this.items.length === 0;
    }

    get isNotEmpty(): boolean {
        return this.items.length > 0;
    }

    at = (index: number): T | null => {
        if (index < 0) return null;
        if (index >= this.items.length) return null;

        return this.items[index];
    };

    hasId = (targetId: T): boolean =>
        this.items.some((v) => v.value === targetId.value);

    forEach = (
        callbackfn: (value: T, index: number, array: readonly T[]) => void,
    ): void => this.items.forEach(callbackfn);

    abstract added(id: T): IdList<T>;

    protected helperAdded = (id: T): readonly T[] => [...this.items, id];

    abstract removed(targetId: T): IdList<T>;

    protected helperRemoved = (targetId: T): readonly T[] =>
        this.items.filter((v) => v.value !== targetId.value);
}

/* -------------------------------------------------------------------------- */

export interface WithId {
    readonly _type: string;
    readonly id: Id;
}

export abstract class ListWithId<T extends WithId, U extends Id> {
    abstract readonly _type: string;
    readonly items: readonly T[];

    constructor(...items: readonly T[]) {
        this.items = items ?? [];
    }

    get length(): number {
        return this.items.length;
    }

    get isEmpty(): boolean {
        return this.items.length === 0;
    }

    get isNotEmpty(): boolean {
        return this.items.length > 0;
    }

    at = (index: number): T | null => {
        if (index < 0) return null;
        if (index >= this.items.length) return null;

        return this.items[index];
    };

    find = (targetId: U): T | null => {
        return this.items.find((v) => v.id.value === targetId.value) ?? null;
    };

    findIndex = (targetId: U): number | null => {
        const index = this.items.findIndex(
            (v) => v.id.value === targetId.value,
        );
        return index >= 0 ? index : null;
    };

    forEach = (
        callbackfn: (value: T, index: number, array: readonly T[]) => void,
    ) => this.items.forEach(callbackfn);

    map = <V>(
        callbackfn: (value: T, index: number, array: readonly T[]) => V,
    ) => this.items.map(callbackfn);

    abstract filter(
        predicate: (value: T, index: number, array: readonly T[]) => boolean,
    ): ListWithId<T, U>;

    protected helperFilter = (
        predicate: (value: T, index: number, array: readonly T[]) => boolean,
    ): T[] => this.items.filter(predicate);

    abstract added(item: T): ListWithId<T, U>;

    protected helperAdded = (item: T): readonly T[] => [...this.items, item];

    abstract replaced(targetId: U, newItem: T): ListWithId<T, U>;

    protected helperReplaced = (targetId: U, newItem: T): T[] =>
        this.items.map((v) => (v.id.value === targetId.value ? newItem : v));

    abstract removed(targetId: U): ListWithId<T, U>;

    protected helperRemoved = (targetId: U): T[] =>
        this.items.filter((v) => v.id.value !== targetId.value);

    abstract movedUp(targetId: U): ListWithId<T, U>;

    protected helperMovedUp = (targetId: U): readonly T[] => {
        const fromIndex = this.findIndex(targetId);
        if (fromIndex == null) return this.items;

        const toIndex = fromIndex - 1;
        if (toIndex < 0) return this.items;

        return this.items.map((v, i) => {
            if (i === fromIndex) return this.items[toIndex];
            if (i === toIndex) return this.items[fromIndex];
            return v;
        });
    };

    abstract movedDown(targetId: U): ListWithId<T, U>;

    protected helperMovedDown = (targetId: U): readonly T[] => {
        const fromIndex = this.findIndex(targetId);
        if (fromIndex == null) return this.items;

        const toIndex = fromIndex + 1;
        if (toIndex >= this.items.length) return this.items;

        return this.items.map((v, i) => {
            if (i === fromIndex) return this.items[toIndex];
            if (i === toIndex) return this.items[fromIndex];
            return v;
        });
    };
}
