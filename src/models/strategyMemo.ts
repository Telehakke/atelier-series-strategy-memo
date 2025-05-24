import dateNow from "./dateNow";
import { GameMap, GameMapList } from "./gameMap";
import { GameMapDetailList } from "./gameMapDetail";
import { GameMapShapeList } from "./gameMapShape";
import { Id } from "./id";
import { MemoList } from "./memo";
import { PreparationList } from "./preparation";
import { StrategyMemoRecordUtility } from "./strategyMemoRecord";

export class StrategyMemoId implements Id {
    readonly _type: string = "StrategyMemoId";
    readonly value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export class StrategyMemo {
    readonly gameName: string;
    readonly gameMaps: GameMapList;
    readonly preparations: PreparationList;
    readonly memos: MemoList;
    readonly id: StrategyMemoId;

    constructor(
        gameName: string,
        gameMaps: GameMapList,
        preparations: PreparationList,
        memos: MemoList,
        id: StrategyMemoId,
    ) {
        this.gameName = gameName;
        this.gameMaps = gameMaps;
        this.preparations = preparations;
        this.memos = memos;
        this.id = id;
    }

    replacedGameName = (newName: string): StrategyMemo =>
        new StrategyMemo(
            newName,
            this.gameMaps,
            this.preparations,
            this.memos,
            this.id,
        );

    replacedGameMaps = (newItems: GameMapList): StrategyMemo =>
        new StrategyMemo(
            this.gameName,
            newItems,
            this.preparations,
            this.memos,
            this.id,
        );

    replacedPreparations = (newItems: PreparationList): StrategyMemo =>
        new StrategyMemo(
            this.gameName,
            this.gameMaps,
            newItems,
            this.memos,
            this.id,
        );

    replacedMemos = (newItems: MemoList): StrategyMemo =>
        new StrategyMemo(
            this.gameName,
            this.gameMaps,
            this.preparations,
            newItems,
            this.id,
        );

    replacedGameMapDetails = (
        gameMap: GameMap,
        newItems: GameMapDetailList,
    ): StrategyMemo => {
        const newGameMap = gameMap.copyWith({
            gameMapDetails: newItems,
        });
        const newGameMaps = this.gameMaps.replaced(newGameMap);
        return this.replacedGameMaps(newGameMaps);
    };

    replacedGameMapShapes = (
        gameMap: GameMap,
        newItems: GameMapShapeList,
    ): StrategyMemo => {
        const newGameMap = gameMap.copyWith({
            gameMapShapes: newItems,
        });
        const newGameMaps = this.gameMaps.replaced(newGameMap);
        return this.replacedGameMaps(newGameMaps);
    };

    uncheckedAll = (): StrategyMemo =>
        new StrategyMemo(
            this.gameName,
            this.gameMaps.uncheckedAll(),
            this.preparations.uncheckedAll(),
            this.memos.uncheckedAll(),
            this.id,
        );

    download = (): void => {
        const obj = StrategyMemoRecordUtility.convertToStrategyMemoRecord(this);
        const dataURL = `data:application/json,${encodeURIComponent(JSON.stringify(obj))}`;
        const anchor = document.createElement("a");
        anchor.href = dataURL;
        anchor.download = `${this.gameName}_${dateNow()}`;
        anchor.click();
    };

    dataSize = (): string => {
        const obj = StrategyMemoRecordUtility.convertToStrategyMemoRecord(this);
        const size = new Blob([JSON.stringify(obj)]).size;
        return `データサイズ：${Math.trunc((size * 1000) / 1000000) / 1000} MB`;
    };
}
