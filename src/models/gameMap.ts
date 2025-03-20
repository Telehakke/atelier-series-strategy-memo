import { GameMapDetailList } from "./gameMapDetail";
import { GameMapShapeList } from "./gameMapShape";
import { Id, ListWithId, WithId } from "./id";

export class GameMapId implements Id {
    readonly _type: string = "GameMapId";
    readonly value: string;

    constructor(value: string) {
        this.value = value;
    }
}

/* -------------------------------------------------------------------------- */

export class GameMap implements WithId {
    readonly _type: string = "GameMap";
    readonly name: string;
    readonly gameMapDetails: GameMapDetailList;
    readonly gameMapShapes: GameMapShapeList;
    readonly image: string;
    readonly id: GameMapId;

    constructor(
        name: string,
        gameMapDetails: GameMapDetailList,
        gameMapShapes: GameMapShapeList,
        image: string,
        id: GameMapId,
    ) {
        this.name = name;
        this.gameMapDetails = gameMapDetails;
        this.gameMapShapes = gameMapShapes;
        this.image = image;
        this.id = id;
    }

    static create = (
        name: string,
        gameMapDetails: GameMapDetailList,
        gameMapShapes: GameMapShapeList,
        image: string,
        id: GameMapId,
    ): GameMap =>
        new GameMap(name.trim(), gameMapDetails, gameMapShapes, image, id);

    copyWith = (obj?: {
        name?: string;
        gameMapDetails?: GameMapDetailList;
        gameMapShapes?: GameMapShapeList;
        image?: string;
        id?: GameMapId;
    }): GameMap =>
        obj == null
            ? this
            : new GameMap(
                  obj.name ?? this.name,
                  obj.gameMapDetails ?? this.gameMapDetails,
                  obj.gameMapShapes ?? this.gameMapShapes,
                  obj.image ?? this.image,
                  obj.id ?? this.id,
              );
}

export class GameMapList extends ListWithId<GameMap, GameMapId> {
    readonly _type: string = "GameMapList";

    filter = (
        predicate: (
            value: GameMap,
            index: number,
            array: readonly GameMap[],
        ) => boolean,
    ): GameMapList => new GameMapList(...this.helperFilter(predicate));

    added = (item: GameMap): GameMapList =>
        new GameMapList(...this.helperAdded(item));

    replaced = (targetId: GameMapId, newItem: GameMap): GameMapList =>
        new GameMapList(...this.helperReplaced(targetId, newItem));

    removed = (targetId: GameMapId): GameMapList =>
        new GameMapList(...this.helperRemoved(targetId));

    movedUp = (targetId: GameMapId): GameMapList =>
        new GameMapList(...this.helperMovedUp(targetId));

    movedDown = (targetId: GameMapId): GameMapList =>
        new GameMapList(...this.helperMovedDown(targetId));

    uncheckedAll = (): GameMapList => {
        const newGameMaps = this.items.map((gameMap) => {
            const newGameMap: GameMap = {
                ...gameMap,
                gameMapDetails: gameMap.gameMapDetails.uncheckedAll(),
            };
            return newGameMap;
        });
        return new GameMapList(...newGameMaps);
    };

    findId = (index: number): GameMapId | null => {
        if (index < 0) return null;
        if (index >= this.items.length) return null;

        return this.items[index].id;
    };
}
