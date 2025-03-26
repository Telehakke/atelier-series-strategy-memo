import { v4 as uuidv4 } from "uuid";
import { GameMap, GameMapWithID } from "./gameMap";
import {
    GameMapGroup,
    GameMapGroupUtility,
    GameMapGroupWithID,
} from "./gameMapGroup";
import { Memo, MemoUtility, MemoWithID } from "./memo";
import {
    Preparation,
    PreparationUtility,
    PreparationWithID,
} from "./preparation";
import {
    isArray,
    isNotNull,
    isNumber,
    isString,
    isStrings,
} from "./typeGuards";

export type StrategyMemo = {
    readonly gameName: string;
    readonly gameMapGroups: GameMapGroup[];
    readonly preparations: Preparation[];
    readonly memos: Memo[];
};

export type StrategyMemoWithID = {
    readonly gameName: string;
    readonly gameMapGroups: GameMapGroupWithID[];
    readonly preparations: PreparationWithID[];
    readonly memos: MemoWithID[];
    readonly id: string;
};

export class StrategyMemoUtility {
    static isStrategyMemo = (value: unknown): value is StrategyMemo => {
        if (!isNotNull(value)) return false;
        if (typeof value.gameName !== "string") return false;
        if (!GameMapGroupUtility.isGameMapGroups(value.gameMapGroups))
            return false;
        if (!PreparationUtility.isPreparations(value.preparations))
            return false;
        if (!MemoUtility.isMemos(value.memos)) return false;
        return true;
    };

    static toStrategyMemo = (value: StrategyMemoWithID): StrategyMemo => {
        return {
            gameName: value.gameName,
            gameMapGroups: value.gameMapGroups.map((v) => {
                const gameMapGroup: GameMapGroup = {
                    name: v.name,
                    gameMaps: v.gameMaps.map((v) => {
                        const gameMap: GameMap = {
                            name: v.name,
                            items: [...v.items],
                            monsters: [...v.monsters],
                            memo: v.memo,
                            icon: v.icon,
                            x: v.x,
                            y: v.y,
                        };
                        return gameMap;
                    }),
                    image: v.image,
                };
                return gameMapGroup;
            }),
            preparations: value.preparations.map((v) => {
                const preparation: Preparation = {
                    name: v.name,
                    materials: [...v.materials],
                    categories: [...v.categories],
                };
                return preparation;
            }),
            memos: value.memos.map((v) => {
                const memo: Memo = {
                    title: v.title,
                    text: v.text,
                };
                return memo;
            }),
        };
    };

    static copied = (value?: unknown, id?: string): StrategyMemoWithID => {
        if (!isNotNull(value))
            return {
                gameName: "",
                gameMapGroups: [],
                preparations: [],
                memos: [],
                id: id ?? uuidv4(),
            };

        return {
            gameName: isString(value.gameName) ? value.gameName : "",
            gameMapGroups: isArray(value.gameMapGroups)
                ? value.gameMapGroups.map((v) => {
                      if (!isNotNull(v)) {
                          const gameMapGroup: GameMapGroupWithID = {
                              name: "",
                              gameMaps: [],
                              image: "",
                              id: id ?? uuidv4(),
                          };
                          return gameMapGroup;
                      }

                      const gameMapGroup: GameMapGroupWithID = {
                          name: isString(v.name) ? v.name : "",
                          gameMaps: isArray(v.gameMaps)
                              ? v.gameMaps.map((v) => {
                                    if (!isNotNull(v)) {
                                        const gameMap: GameMapWithID = {
                                            name: "",
                                            items: [],
                                            monsters: [],
                                            memo: "",
                                            icon: "",
                                            x: 0,
                                            y: 0,
                                            id: id ?? uuidv4(),
                                        };
                                        return gameMap;
                                    }

                                    const gameMap: GameMapWithID = {
                                        name: isString(v.name) ? v.name : "",
                                        items: isStrings(v.items)
                                            ? v.items
                                            : [],
                                        monsters: isStrings(v.monsters)
                                            ? v.monsters
                                            : [],
                                        memo: isString(v.memo) ? v.memo : "",
                                        icon: isString(v.icon) ? v.icon : "",
                                        x: isNumber(v.x) ? v.x : 0,
                                        y: isNumber(v.y) ? v.y : 0,
                                        id: isString(v.id)
                                            ? v.id
                                            : (id ?? uuidv4()),
                                    };
                                    return gameMap;
                                })
                              : [],
                          image: isString(v.image) ? v.image : "",
                          id: isString(v.id) ? v.id : (id ?? uuidv4()),
                      };
                      return gameMapGroup;
                  })
                : [],
            preparations: isArray(value.preparations)
                ? value.preparations.map((v) => {
                      if (!isNotNull(v)) {
                          const preparation: PreparationWithID = {
                              name: "",
                              materials: [],
                              categories: [],
                              id: id ?? uuidv4(),
                          };
                          return preparation;
                      }

                      const preparation: PreparationWithID = {
                          name: isString(v.name) ? v.name : "",
                          materials: isStrings(v.materials) ? v.materials : [],
                          categories: isStrings(v.categories)
                              ? v.categories
                              : [],
                          id: isString(v.id) ? v.id : (id ?? uuidv4()),
                      };
                      return preparation;
                  })
                : [],
            memos: isArray(value.memos)
                ? value.memos.map((v) => {
                      if (!isNotNull(v)) {
                          const memo: MemoWithID = {
                              title: "",
                              text: "",
                              id: id ?? uuidv4(),
                          };
                          return memo;
                      }

                      const memo: MemoWithID = {
                          title: isString(v.title) ? v.title : "",
                          text: isString(v.text) ? v.text : "",
                          id: isString(v.id) ? v.id : (id ?? uuidv4()),
                      };
                      return memo;
                  })
                : [],
            id: isString(value.id) ? value.id : (id ?? uuidv4()),
        };
    };

    static changedGameName = (
        strategyMemo: StrategyMemoWithID,
        name: string,
    ): StrategyMemoWithID => {
        const copied = this.copied(strategyMemo);
        return {
            ...copied,
            gameName: name,
        };
    };
}
