import { Id, IdList, ListWithId, WithId } from "./id";
import Split from "./split";

export class PreparationId implements Id {
    readonly _type: string = "PreparationId";
    readonly value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export class PreparationIdList extends IdList<PreparationId> {
    readonly _type: string = "PreparationIdList";

    added = (id: PreparationId): PreparationIdList =>
        new PreparationIdList(...this.helperAdded(id));

    removed = (targetId: PreparationId): PreparationIdList =>
        new PreparationIdList(...this.helperRemoved(targetId));
}

/* -------------------------------------------------------------------------- */

export class Preparation implements WithId {
    readonly _type: string = "Preparation";
    readonly name: string;
    readonly materials: readonly string[];
    readonly categories: readonly string[];
    readonly checked: boolean;
    readonly id: PreparationId;

    constructor(
        name: string,
        materials: readonly string[],
        categories: readonly string[],
        checked: boolean,
        id: PreparationId,
    ) {
        this.name = name;
        this.materials = materials;
        this.categories = categories;
        this.checked = checked;
        this.id = id;
    }

    static create = ({
        name,
        materials,
        categories,
        checked,
        id,
    }: {
        name: string;
        materials: string;
        categories: string;
        checked: boolean;
        id: PreparationId;
    }): Preparation =>
        new Preparation(
            name.trim(),
            Split.byComma(materials),
            Split.byComma(categories),
            checked,
            id,
        );

    copyWith = (obj?: {
        name?: string;
        materials?: readonly string[];
        categories?: readonly string[];
        checked?: boolean;
        id?: PreparationId;
    }): Preparation =>
        obj == null
            ? this
            : new Preparation(
                  obj.name ?? this.name,
                  obj.materials ?? this.materials,
                  obj.categories ?? this.categories,
                  obj.checked ?? this.checked,
                  obj.id ?? this.id,
              );

    get materialsToCommaSeparatedStr(): string {
        return this.materials.join("、");
    }

    get categoriesToCommaSeparatedStr(): string {
        return this.categories.join("、");
    }
}

export class PreparationList extends ListWithId<Preparation, PreparationId> {
    readonly _type: string = "PreparationList";

    filter = (
        predicate: (
            value: Preparation,
            index: number,
            array: readonly Preparation[],
        ) => boolean,
    ): PreparationList => new PreparationList(...this.helperFilter(predicate));

    added = (item: Preparation): PreparationList =>
        new PreparationList(...this.helperAdded(item));

    replaced = (newItem: Preparation): PreparationList =>
        new PreparationList(...this.helperReplaced(newItem));

    removed = (targetId: PreparationId): PreparationList =>
        new PreparationList(...this.helperRemoved(targetId));

    movedUp = (targetId: PreparationId): PreparationList =>
        new PreparationList(...this.helperMovedUp(targetId));

    movedDown = (targetId: PreparationId): PreparationList =>
        new PreparationList(...this.helperMovedDown(targetId));

    uncheckedAll = (): PreparationList => {
        const newItems = this.items.map(
            (v) =>
                new Preparation(v.name, v.materials, v.categories, false, v.id),
        );
        return new PreparationList(...newItems);
    };
}
