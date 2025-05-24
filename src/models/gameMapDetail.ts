import { Point } from "./dataClasses";
import { GameMapId } from "./gameMap";
import { Id, IdList, ListWithId, WithId } from "./id";
import Split from "./split";

export class GameMapDetailId implements Id {
    readonly _type: string = "GameMapDetailId";
    readonly value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export class GameMapDetailIdList extends IdList<GameMapDetailId> {
    readonly _type: string = "GameMapDetailIdList";

    added = (id: GameMapDetailId): GameMapDetailIdList =>
        new GameMapDetailIdList(...this.helperAdded(id));

    removed = (targetId: GameMapDetailId): GameMapDetailIdList =>
        new GameMapDetailIdList(...this.helperRemoved(targetId));
}

/* -------------------------------------------------------------------------- */

export class GameMapDetail implements WithId {
    readonly _type: string = "GameMapDetail";
    readonly name: string;
    readonly items: readonly string[];
    readonly monsters: readonly string[];
    readonly memo: string;
    readonly icon: string;
    readonly point: Point;
    readonly goto: GameMapId;
    readonly checked: boolean;
    readonly id: GameMapDetailId;

    constructor(
        name: string,
        items: readonly string[],
        monsters: readonly string[],
        memo: string,
        icon: string,
        point: Point,
        goto: GameMapId,
        checked: boolean,
        id: GameMapDetailId,
    ) {
        this.name = name;
        this.items = items;
        this.monsters = monsters;
        this.memo = memo;
        this.icon = icon;
        this.point = point;
        this.goto = goto;
        this.checked = checked;
        this.id = id;
    }

    static create = ({
        name,
        items,
        monsters,
        memo,
        icon,
        x,
        y,
        goto,
        checked,
        id,
    }: {
        name: string;
        items: string;
        monsters: string;
        memo: string;
        icon: string;
        x: string;
        y: string;
        goto: GameMapId;
        checked: boolean;
        id: GameMapDetailId;
    }): GameMapDetail => {
        let validX = parseInt(x);
        if (isNaN(validX)) validX = 0;

        let validY = parseInt(y);
        if (isNaN(validY)) validY = 0;

        return new GameMapDetail(
            name.trim(),
            Split.byComma(items),
            Split.byComma(monsters),
            memo,
            icon.trim(),
            new Point(validX, validY),
            goto,
            checked,
            id,
        );
    };

    copyWith = (obj?: {
        name?: string;
        items?: readonly string[];
        monsters?: readonly string[];
        memo?: string;
        icon?: string;
        point?: Point;
        goto?: GameMapId;
        checked?: boolean;
        id?: GameMapDetailId;
    }): GameMapDetail =>
        obj == null
            ? this
            : new GameMapDetail(
                  obj.name ?? this.name,
                  obj.items ?? this.items,
                  obj.monsters ?? this.monsters,
                  obj.memo ?? this.memo,
                  obj.icon ?? this.icon,
                  obj.point ?? this.point,
                  obj.goto ?? this.goto,
                  obj.checked ?? this.checked,
                  obj.id ?? this.id,
              );

    get itemsToCommaSeparatedStr(): string {
        return this.items.join("、");
    }

    get monstersToCommaSeparatedStr(): string {
        return this.monsters.join("、");
    }
}

export class GameMapDetailList extends ListWithId<
    GameMapDetail,
    GameMapDetailId
> {
    readonly _type: string = "GameMapDetailList";

    filter = (
        predicate: (
            value: GameMapDetail,
            index: number,
            array: readonly GameMapDetail[],
        ) => boolean,
    ): GameMapDetailList =>
        new GameMapDetailList(...this.helperFilter(predicate));

    added = (item: GameMapDetail): GameMapDetailList =>
        new GameMapDetailList(...this.helperAdded(item));

    replaced = (newItem: GameMapDetail): GameMapDetailList =>
        new GameMapDetailList(...this.helperReplaced(newItem));

    removed = (targetId: GameMapDetailId): GameMapDetailList =>
        new GameMapDetailList(...this.helperRemoved(targetId));

    movedUp = (targetId: GameMapDetailId): GameMapDetailList =>
        new GameMapDetailList(...this.helperMovedUp(targetId));

    movedDown = (targetId: GameMapDetailId): GameMapDetailList =>
        new GameMapDetailList(...this.helperMovedDown(targetId));

    uncheckedAll = (): GameMapDetailList => {
        const newItems = this.items.map(
            (v) =>
                new GameMapDetail(
                    v.name,
                    v.items,
                    v.monsters,
                    v.memo,
                    v.icon,
                    v.point,
                    v.goto,
                    false,
                    v.id,
                ),
        );
        return new GameMapDetailList(...newItems);
    };
}
