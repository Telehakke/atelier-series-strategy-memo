import { v4 as uuidv4 } from "uuid";
import dateNow from "./dateNow";
import { GameMap } from "./gameMap";
import { GameMapGroup } from "./gameMapGroup";
import { Memo } from "./memo";
import { Preparation } from "./preparation";
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
    readonly id: string;
};

export class StrategyMemoUtility {
    static copied = (value?: unknown, id?: string): StrategyMemo => {
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
                          const gameMapGroup: GameMapGroup = {
                              name: "",
                              gameMaps: [],
                              image: "",
                              id: id ?? uuidv4(),
                          };
                          return gameMapGroup;
                      }

                      const gameMapGroup: GameMapGroup = {
                          name: isString(v.name) ? v.name : "",
                          gameMaps: isArray(v.gameMaps)
                              ? v.gameMaps.map((v) => {
                                    if (!isNotNull(v)) {
                                        const gameMap: GameMap = {
                                            name: "",
                                            items: [],
                                            monsters: [],
                                            memo: "",
                                            icon: "",
                                            x: 0,
                                            y: 0,
                                            goto: "",
                                            id: id ?? uuidv4(),
                                        };
                                        return gameMap;
                                    }

                                    const gameMap: GameMap = {
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
                                        goto: isString(v.goto) ? v.goto : "",
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
                          const preparation: Preparation = {
                              name: "",
                              materials: [],
                              categories: [],
                              id: id ?? uuidv4(),
                          };
                          return preparation;
                      }

                      const preparation: Preparation = {
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
                          const memo: Memo = {
                              title: "",
                              text: "",
                              id: id ?? uuidv4(),
                          };
                          return memo;
                      }

                      const memo: Memo = {
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
        strategyMemo: StrategyMemo,
        name: string,
    ): StrategyMemo => {
        const copied = this.copied(strategyMemo);
        return {
            ...copied,
            gameName: name,
        };
    };

    static download = (strategyMemo: StrategyMemo): void => {
        const jsonStr = JSON.stringify(strategyMemo);
        const dataURL = `data:,${encodeURIComponent(jsonStr)}`;
        const anchor = document.createElement("a");
        anchor.href = dataURL;
        anchor.download = `${strategyMemo.gameName}_${dateNow()}.json`;
        anchor.click();
    };

    static dataSize = (strategyMemo: StrategyMemo): string => {
        const size = new Blob([JSON.stringify(strategyMemo)]).size;
        return `データサイズ：${Math.trunc((size * 1000) / 1000000) / 1000} MB`;
    };
}
