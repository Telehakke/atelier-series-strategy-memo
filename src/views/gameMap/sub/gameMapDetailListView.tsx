import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { ReactNode } from "react";
import {
    canSelectMultipleAtom,
    gameMapDetailSelectionManagerAtom,
    gameMapFilteringValueAtom,
    gameMapsAtom,
    isEditGameMapDialogOpenAtom,
    isReadonlyAtom,
    selectedGameMapIdAtom,
    strategyMemoAtom,
} from "../../../atoms";
import {
    GameMapDetail,
    GameMapDetailIdList,
} from "../../../models/gameMapDetail";
import GameMapDetailFilter from "../../../models/gameMapDetailFilter";
import Split from "../../../models/split";

import { GameMap } from "../../../models/gameMap";
import LocalStorage from "../../../models/localStorage";
import CardBase from "../../commons/cardBase";
import { Bg, Text } from "../../commons/classNames";

const GameMapDetailListView = ({ gameMap }: { gameMap: GameMap }) => {
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    const filteringValue = useAtomValue(gameMapFilteringValueAtom);

    // マップ上のアイテムが選択された場合はそのアイテムだけを表示し、
    // 未選択であればフィルタリングの結果を表示する
    const filteredGameMapDetails = selectionManager.boardItems.isNotEmpty
        ? gameMap.gameMapDetails.filter((v) =>
              selectionManager.boardItems.hasId(v.id),
          )
        : GameMapDetailFilter.filtered(
              gameMap.gameMapDetails,
              Split.byWhiteSpace(filteringValue),
          );

    return (
        <div className={`flex flex-col items-center gap-2 pb-60`}>
            {filteredGameMapDetails.map((v) => (
                <Card key={v.id.value} gameMap={gameMap} gameMapDetail={v} />
            ))}
        </div>
    );
};

export default GameMapDetailListView;

/* -------------------------------------------------------------------------- */

const Card = ({
    gameMap,
    gameMapDetail,
}: {
    gameMap: GameMap;
    gameMapDetail: GameMapDetail;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const canSelectMultiple = useAtomValue(canSelectMultipleAtom);
    const setIsEditDialogOpen = useSetAtom(isEditGameMapDialogOpenAtom);
    const [selectionManager, setSelectionManager] = useAtom(
        gameMapDetailSelectionManagerAtom,
    );
    const isReadonly = useAtomValue(isReadonlyAtom);
    const selectedGameMapId = useAtomValue(selectedGameMapIdAtom);
    if (selectedGameMapId == null) return <></>;

    // クリックでリストアイテムの選択状態を切り替える
    const handleClick = () => {
        if (canSelectMultiple) {
            setSelectionManager((v) =>
                v.copyWith({
                    listItems: v.listItems.hasId(gameMapDetail.id)
                        ? v.listItems.removed(gameMapDetail.id)
                        : v.listItems.added(gameMapDetail.id),
                }),
            );
            return;
        }

        setSelectionManager((v) =>
            v.copyWith({
                listItems: v.listItems.hasId(gameMapDetail.id)
                    ? new GameMapDetailIdList()
                    : new GameMapDetailIdList(gameMapDetail.id),
            }),
        );
    };

    // ダブルクリックで編集ダイアログを開く
    const handleDoubleClick = () => {
        if (canSelectMultiple) return;

        setSelectionManager((v) =>
            v.copyWith({
                listItems: new GameMapDetailIdList(gameMapDetail.id),
            }),
        );
        setIsEditDialogOpen(true);
    };

    // チェックボックスの状態を切り替える
    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (isReadonly) return;

        setStrategyMemo((v) => {
            const newGameMapDetail = gameMapDetail.copyWith({
                checked: event.target.checked,
            });
            const newGameMapDetails =
                gameMap.gameMapDetails.replaced(newGameMapDetail);
            const newStrategyMemo = v.replacedGameMapDetails(
                gameMap,
                newGameMapDetails,
            );
            setGameMaps(newStrategyMemo.gameMaps);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    return (
        <CardBase
            title={gameMapDetail.name}
            id={gameMapDetail.id.value}
            selected={selectionManager.listItems.hasId(gameMapDetail.id)}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            checked={gameMapDetail.checked}
            onCheckboxChange={handleCheckboxChange}
        >
            <Contents gameMapDetail={gameMapDetail} />
        </CardBase>
    );
};

const Contents = ({ gameMapDetail }: { gameMapDetail: GameMapDetail }) => {
    const TextWithLabel = ({
        label,
        children,
    }: {
        label: string;
        children?: ReactNode;
    }) => (
        <div className="p-1">
            <p className={`font-bold ${Text.neutral500}`}>{label}</p>
            <p className={`whitespace-pre-wrap ${Bg.neutral100_900}`}>
                {children}
            </p>
        </div>
    );

    const ItemView = () => {
        if (gameMapDetail.items.length === 0) return <></>;

        return (
            <TextWithLabel label="アイテム">
                {gameMapDetail.items.map((v, i) => (
                    <span className="inline-block text-nowrap" key={i}>
                        {`【${v}】`}
                    </span>
                ))}
            </TextWithLabel>
        );
    };

    const MonsterView = () => {
        if (gameMapDetail.monsters.length === 0) return <></>;

        return (
            <TextWithLabel label="モンスター">
                {gameMapDetail.monsters.map((v, i) => (
                    <span className="inline-block text-nowrap" key={i}>
                        {`【${v}】`}
                    </span>
                ))}
            </TextWithLabel>
        );
    };

    const MemoView = () => {
        if (gameMapDetail.memo.length === 0) return <></>;

        return <TextWithLabel label="メモ">{gameMapDetail.memo}</TextWithLabel>;
    };

    const IconView = () => (
        <TextWithLabel label="アイコン">{gameMapDetail.icon}</TextWithLabel>
    );

    const XView = () => (
        <TextWithLabel label="座標x">{gameMapDetail.point.x}</TextWithLabel>
    );

    const YView = () => (
        <TextWithLabel label="座標y">{gameMapDetail.point.y}</TextWithLabel>
    );

    const GotoView = () => {
        const gameMaps = useAtomValue(gameMapsAtom);

        return (
            <TextWithLabel label="移動先">
                {gameMaps.find(gameMapDetail.goto)?.name}
            </TextWithLabel>
        );
    };

    return (
        <>
            <ItemView />
            <MonsterView />
            <MemoView />
            <div className="flex gap-2">
                <IconView />
                <XView />
                <YView />
                <GotoView />
            </div>
        </>
    );
};
