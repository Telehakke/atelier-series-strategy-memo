import { Button } from "@headlessui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import {
    gameMapDetailSelectionManagerAtom,
    gameMapFilteringValueAtom,
    gameMapsAtom,
    selectedGameMapIdAtom,
} from "../../../atoms";
import { GameMapId } from "../../../models/gameMap";
import {
    GameMapDetail,
    GameMapDetailIdList,
} from "../../../models/gameMapDetail";
import GameMapDetailFilter from "../../../models/gameMapDetailFilter";
import Split from "../../../models/split";
import { Bg, Text } from "../../commons/classNames";

const GameMapDetailBoard = ({ gameMapId }: { gameMapId: GameMapId }) => {
    const [fontSize, setFontSize] = useState<FontSize>("8px");
    const selectionManager = useAtomValue(gameMapDetailSelectionManagerAtom);
    const filteringValue = useAtomValue(gameMapFilteringValueAtom);
    const gameMaps = useAtomValue(gameMapsAtom);
    const gameMap = gameMaps.find(gameMapId);
    if (gameMap == null) return <></>;

    // マップ上のアイテムが未選択の場合、フィルタリングの結果を表示し、
    // アイテムが1つ以上選択されたら全てのアイテムを表示する
    const gameMapDetails = selectionManager.boardItems.isEmpty
        ? GameMapDetailFilter.filtered(
              gameMap.gameMapDetails,
              Split.byWhiteSpace(filteringValue),
          )
        : gameMap.gameMapDetails.items;

    return (
        <>
            <ToggleFontSizeSheet
                className="absolute inset-0 size-full"
                setFontSize={setFontSize}
            />
            {gameMapDetails.map((v) => (
                <Card
                    className={`absolute -translate-1/2 p-px text-center text-nowrap hover:scale-150`}
                    key={v.id.value}
                    gameMapDetail={v}
                    fontSize={fontSize}
                />
            ))}
        </>
    );
};

export default GameMapDetailBoard;

/* -------------------------------------------------------------------------- */

type FontSize = "8px" | "12px";

const ToggleFontSizeSheet = ({
    setFontSize,
    className,
}: {
    setFontSize: React.Dispatch<React.SetStateAction<FontSize>>;
    className?: string;
}) => {
    const handleClick = () =>
        setFontSize((v) => (v === "8px" ? "12px" : "8px"));

    return <div className={className} onClick={handleClick}></div>;
};

/* -------------------------------------------------------------------------- */

const Card = ({
    gameMapDetail,
    fontSize,
    className,
}: {
    gameMapDetail: GameMapDetail;
    fontSize: string;
    className?: string;
}) => {
    const gameMaps = useAtomValue(gameMapsAtom);
    const setSelectedGameMapId = useSetAtom(selectedGameMapIdAtom);
    const [selectionManager, setSelectionManager] = useAtom(
        gameMapDetailSelectionManagerAtom,
    );

    const handleClick = () => {
        // マップアイテムに移動先が設定されている場合、そのマップに切り替える
        const gotoGameMap = gameMaps.find(gameMapDetail.goto);
        if (gotoGameMap != null) {
            setSelectedGameMapId(gotoGameMap.id);
            return;
        }

        // マップアイテムの選択状態を切り替える
        setSelectionManager((v) =>
            v.boardItems.hasId(gameMapDetail.id)
                ? v.copyWith({ boardItems: new GameMapDetailIdList() })
                : v.copyWith({
                      boardItems: new GameMapDetailIdList(gameMapDetail.id),
                  }),
        );
    };

    // マップ上のアイテムが選択されたら強調表示する
    const isSelectedBoardItem = selectionManager.boardItems.hasId(
        gameMapDetail.id,
    );
    const textColor = isSelectedBoardItem
        ? Text.neutral100
        : Text.neutral950_100;
    const backgroundColor = isSelectedBoardItem
        ? Bg.blue400
        : Bg.neutral50_950_70;

    // マップ上のアイテムが選択されたら、未選択のアイテムの表示を薄くする
    const opacity1 =
        selectionManager.boardItems.isNotEmpty && !isSelectedBoardItem
            ? "opacity-30"
            : "";

    // リストアイテムが選択されたら、未選択のアイテムの表示を薄くする
    const isSelectedListItem = selectionManager.listItems.hasId(
        gameMapDetail.id,
    );
    const opacity2 =
        selectionManager.listItems.isNotEmpty && !isSelectedListItem
            ? "opacity-30"
            : "";

    return (
        <Button
            className={`${textColor} ${backgroundColor} ${opacity1} ${opacity2} ${className}`}
            style={{
                left: `${gameMapDetail.point.x}%`,
                top: `${gameMapDetail.point.y}%`,
            }}
            onClick={handleClick}
        >
            <div className="relative p-0.5">
                <p style={{ fontSize: fontSize }}>{gameMapDetail.icon}</p>
                <p style={{ fontSize: fontSize }}>{gameMapDetail.name}</p>
                {gameMapDetail.checked && (
                    <p
                        className="absolute top-0 left-0 -translate-x-full"
                        style={{ fontSize: fontSize }}
                    >
                        ✅
                    </p>
                )}
            </div>
        </Button>
    );
};
