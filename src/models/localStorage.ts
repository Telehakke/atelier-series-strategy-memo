import { v4 as uuidv4 } from "uuid";
import DelayAction from "./delayAction";
import { GameMapList } from "./gameMap";
import { MemoList } from "./memo";
import { PreparationList } from "./preparation";
import { StrategyMemo, StrategyMemoId } from "./strategyMemo";
import { StrategyMemoRecordUtility } from "./strategyMemoRecord";

export default class LocalStorage {
    private static readonly key = "strategyMemo";
    private static delayAction = new DelayAction();

    static getStrategyMemo = (): StrategyMemo => {
        const data = localStorage.getItem(this.key);
        try {
            const json = JSON.parse(data ?? "");
            const strategyMemoRecord = StrategyMemoRecordUtility.copied(json);
            return StrategyMemoRecordUtility.convertToStrategyMemo(
                strategyMemoRecord,
            );
        } catch {
            return new StrategyMemo(
                "",
                new GameMapList(),
                new PreparationList(),
                new MemoList(),
                new StrategyMemoId(uuidv4()),
            );
        }
    };

    static setStrategyMemo = (
        strategyMemo: StrategyMemo,
        isReadonly: boolean,
    ): void => {
        if (isReadonly) return;

        this.delayAction.run(() => {
            const strategyMemoRecord =
                StrategyMemoRecordUtility.convertToStrategyMemoRecord(
                    strategyMemo,
                );
            const jsonStr = JSON.stringify(strategyMemoRecord);
            localStorage.setItem(this.key, jsonStr);
        }, 1000);
    };
}
