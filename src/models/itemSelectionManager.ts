import { GameMapDetailIdList } from "./gameMapDetail";
import { GameMapShapeIdList } from "./gameMapShape";
import { Id, IdList } from "./id";

export const ControllerTypeEnum: {
    readonly none: ControllerType;
    readonly board: ControllerType;
    readonly list: ControllerType;
} = {
    none: "none",
    board: "board",
    list: "list",
} as const;

export type ControllerType = keyof typeof ControllerTypeEnum;

/* -------------------------------------------------------------------------- */

abstract class ItemSelectionManager<T extends IdList<Id>> {
    abstract readonly _type: string;
    readonly boardItems: T;
    readonly listItems: T;

    constructor(boardItems: T, listItems: T) {
        this.boardItems = boardItems;
        this.listItems = listItems;
    }

    abstract copyWith({
        boardItems,
        listItems,
    }: {
        boardItems?: T;
        listItems?: T;
    }): ItemSelectionManager<IdList<Id>>;

    get controllerType(): ControllerType {
        if (this.boardItems.isNotEmpty && this.listItems.isNotEmpty)
            return "list";
        if (this.boardItems.isNotEmpty) return "board";
        if (this.listItems.isNotEmpty) return "list";
        return "none";
    }
}

/* -------------------------------------------------------------------------- */

export class GameMapDetailSelectionManager extends ItemSelectionManager<GameMapDetailIdList> {
    readonly _type: string = "GameMapDetailSelectionManager";

    constructor(
        boardItem?: GameMapDetailIdList,
        listItems?: GameMapDetailIdList,
    ) {
        super(
            boardItem ?? new GameMapDetailIdList(),
            listItems ?? new GameMapDetailIdList(),
        );
    }

    copyWith = ({
        boardItems,
        listItems,
    }: {
        boardItems?: GameMapDetailIdList;
        listItems?: GameMapDetailIdList;
    }): GameMapDetailSelectionManager => {
        return new GameMapDetailSelectionManager(
            boardItems ?? this.boardItems,
            listItems ?? this.listItems,
        );
    };
}

export class GameMapShapeSelectionManager extends ItemSelectionManager<GameMapShapeIdList> {
    readonly _type: string = "GameMapShapeSelectionManager";

    constructor(boardItem?: GameMapShapeIdList, listItem?: GameMapShapeIdList) {
        super(
            boardItem ?? new GameMapShapeIdList(),
            listItem ?? new GameMapShapeIdList(),
        );
    }

    copyWith = ({
        boardItems,
        listItems,
    }: {
        boardItems?: GameMapShapeIdList;
        listItems?: GameMapShapeIdList;
    }): GameMapDetailSelectionManager => {
        return new GameMapShapeSelectionManager(
            boardItems ?? this.boardItems,
            listItems ?? this.listItems,
        );
    };
}
