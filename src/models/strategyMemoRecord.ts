import { v4 as uuidv4 } from "uuid";
import { Angle, Point, Progress, Scale, Thickness } from "./dataClasses";
import { GameMap, GameMapId, GameMapList } from "./gameMap";
import {
    GameMapDetail,
    GameMapDetailId,
    GameMapDetailList,
} from "./gameMapDetail";
import {
    GameMapShape,
    GameMapShapeId,
    GameMapShapeList,
    isShapeColor,
    isShapeName,
    ShapeColorEnum,
    ShapeNameEnum,
} from "./gameMapShape";
import { Memo, MemoId, MemoList } from "./memo";
import { Preparation, PreparationId, PreparationList } from "./preparation";
import { StrategyMemo, StrategyMemoId } from "./strategyMemo";
import {
    isArray,
    isBoolean,
    isNotNull,
    isNumber,
    isString,
    isStrings,
} from "./typeGuards";

export type StrategyMemoRecord = {
    readonly gameName: string;
    readonly gameMaps: GameMapRecord[];
    readonly preparations: PreparationRecord[];
    readonly memos: MemoRecord[];
    readonly id: string;
};

type GameMapRecord = {
    readonly name: string;
    readonly gameMapDetails: GameMapDetailRecord[];
    readonly gameMapShapes: GameMapShapeRecord[];
    readonly image: string;
    readonly id: string;
};

type GameMapDetailRecord = {
    readonly name: string;
    readonly items: string[];
    readonly monsters: string[];
    readonly memo: string;
    readonly icon: string;
    readonly x: number;
    readonly y: number;
    readonly goto: string;
    readonly checked: boolean;
    readonly id: string;
};

type GameMapShapeRecord = {
    readonly name: string;
    readonly thickness: number;
    readonly color: string;
    readonly fill: boolean;
    readonly scaleX: number;
    readonly scaleY: number;
    readonly angle: number;
    readonly flip: boolean;
    readonly progress: number;
    readonly x: number;
    readonly y: number;
    readonly id: string;
};

type PreparationRecord = {
    readonly name: string;
    readonly materials: string[];
    readonly categories: string[];
    readonly checked: boolean;
    readonly id: string;
};

type MemoRecord = {
    readonly title: string;
    readonly text: string;
    readonly checked: boolean;
    readonly id: string;
};

/* -------------------------------------------------------------------------- */

export class StrategyMemoRecordUtility {
    static copied = (value?: unknown): StrategyMemoRecord => {
        if (!isNotNull(value))
            return {
                gameName: "",
                gameMaps: [],
                preparations: [],
                memos: [],
                id: uuidv4(),
            };

        const strategyMemo: StrategyMemoRecord = {
            gameName: isString(value.gameName) ? value.gameName : "",
            gameMaps: isArray(value.gameMaps)
                ? value.gameMaps.map((v) => this.copiedGameMap(v))
                : [],
            preparations: isArray(value.preparations)
                ? value.preparations.map((v) => this.copiedPreparation(v))
                : [],
            memos: isArray(value.memos)
                ? value.memos.map((v) => this.copiedMemo(v))
                : [],
            id: isString(value.id) ? value.id : uuidv4(),
        };
        return strategyMemo;
    };

    private static copiedGameMap = (value?: unknown): GameMapRecord => {
        if (!isNotNull(value)) {
            const obj: GameMapRecord = {
                name: "",
                gameMapDetails: [],
                gameMapShapes: [],
                image: "",
                id: uuidv4(),
            };
            return obj;
        }

        const obj: GameMapRecord = {
            name: isString(value.name) ? value.name : "",
            gameMapDetails: isArray(value.gameMapDetails)
                ? value.gameMapDetails.map((v) => this.copiedGameMapDetail(v))
                : [],
            gameMapShapes: isArray(value.gameMapShapes)
                ? value.gameMapShapes.map((v) => this.copiedGameMapShape(v))
                : [],
            image: isString(value.image) ? value.image : "",
            id: isString(value.id) ? value.id : uuidv4(),
        };
        return obj;
    };

    private static copiedGameMapDetail = (
        value?: unknown,
    ): GameMapDetailRecord => {
        if (!isNotNull(value)) {
            const obj: GameMapDetailRecord = {
                name: "",
                items: [],
                monsters: [],
                memo: "",
                icon: "",
                x: 0,
                y: 0,
                goto: "",
                checked: false,
                id: uuidv4(),
            };
            return obj;
        }

        const obj: GameMapDetailRecord = {
            name: isString(value.name) ? value.name : "",
            items: isStrings(value.items) ? value.items : [],
            monsters: isStrings(value.monsters) ? value.monsters : [],
            memo: isString(value.memo) ? value.memo : "",
            icon: isString(value.icon) ? value.icon : "",
            x: isNumber(value.x) ? value.x : 0,
            y: isNumber(value.y) ? value.y : 0,
            goto: isString(value.goto) ? value.goto : "",
            checked: isBoolean(value.checked) ? value.checked : false,
            id: isString(value.id) ? value.id : uuidv4(),
        };
        return obj;
    };

    private static copiedGameMapShape = (
        value?: unknown,
    ): GameMapShapeRecord => {
        if (!isNotNull(value)) {
            const obj: GameMapShapeRecord = {
                name: "",
                thickness: 0,
                color: "",
                fill: false,
                scaleX: 0,
                scaleY: 0,
                angle: 0,
                flip: false,
                progress: 0,
                x: 0,
                y: 0,
                id: "",
            };
            return obj;
        }

        const obj: GameMapShapeRecord = {
            name: isString(value.name) ? value.name : "",
            thickness: isNumber(value.thickness) ? value.thickness : 0,
            color: isString(value.color) ? value.color : "",
            fill: isBoolean(value.fill) ? value.fill : false,
            scaleX: isNumber(value.scaleX) ? value.scaleX : 0,
            scaleY: isNumber(value.scaleY) ? value.scaleY : 0,
            angle: isNumber(value.angle) ? value.angle : 0,
            flip: isBoolean(value.flip) ? value.flip : false,
            progress: isNumber(value.progress) ? value.progress : 0,
            x: isNumber(value.x) ? value.x : 0,
            y: isNumber(value.y) ? value.y : 0,
            id: isString(value.id) ? value.id : uuidv4(),
        };
        return obj;
    };

    private static copiedPreparation = (value?: unknown): PreparationRecord => {
        if (!isNotNull(value)) {
            const obj: PreparationRecord = {
                name: "",
                materials: [],
                categories: [],
                checked: false,
                id: uuidv4(),
            };
            return obj;
        }

        const obj: PreparationRecord = {
            name: isString(value.name) ? value.name : "",
            materials: isStrings(value.materials) ? value.materials : [],
            categories: isStrings(value.categories) ? value.categories : [],
            checked: isBoolean(value.checked) ? value.checked : false,
            id: isString(value.id) ? value.id : uuidv4(),
        };
        return obj;
    };

    private static copiedMemo = (value?: unknown): MemoRecord => {
        if (!isNotNull(value)) {
            const obj: MemoRecord = {
                title: "",
                text: "",
                checked: false,
                id: uuidv4(),
            };
            return obj;
        }

        const obj: MemoRecord = {
            title: isString(value.title) ? value.title : "",
            text: isString(value.text) ? value.text : "",
            checked: isBoolean(value.checked) ? value.checked : false,
            id: isString(value.id) ? value.id : uuidv4(),
        };
        return obj;
    };

    static convertToStrategyMemo = (obj: StrategyMemoRecord): StrategyMemo => {
        const gameName = obj.gameName;
        const gameMaps = obj.gameMaps.map((gameMap) => {
            const name = gameMap.name;
            const gameMapDetails = gameMap.gameMapDetails.map((v) => {
                const name = v.name;
                const items = v.items;
                const monsters = v.monsters;
                const memo = v.memo;
                const icon = v.icon;
                const point = new Point(v.x, v.y);
                const goto = new GameMapId(v.goto);
                const checked = v.checked;
                const id = new GameMapDetailId(v.id);
                return new GameMapDetail(
                    name,
                    items,
                    monsters,
                    memo,
                    icon,
                    point,
                    goto,
                    checked,
                    id,
                );
            });
            const gameMapShapes = gameMap.gameMapShapes.map((v) => {
                const name = isShapeName(v.name)
                    ? v.name
                    : ShapeNameEnum.square.value;
                const thickness = new Thickness(v.thickness);
                const color = isShapeColor(v.color)
                    ? v.color
                    : ShapeColorEnum.currentColor.value;
                const fill = v.fill;
                const scale = new Scale(v.scaleX, v.scaleY);
                const angle = new Angle(v.angle);
                const flip = v.flip;
                const progress = new Progress(v.progress);
                const point = new Point(v.x, v.y);
                const id = new GameMapShapeId(v.id);
                return new GameMapShape(
                    name,
                    thickness,
                    color,
                    fill,
                    scale,
                    angle,
                    flip,
                    progress,
                    point,
                    id,
                );
            });
            const image = gameMap.image;
            const id = new GameMapId(gameMap.id);
            return new GameMap(
                name,
                new GameMapDetailList(...gameMapDetails),
                new GameMapShapeList(...gameMapShapes),
                image,
                id,
            );
        });
        const preparations = obj.preparations.map((v) => {
            const name = v.name;
            const materials = v.materials;
            const categories = v.categories;
            const checked = v.checked;
            const id = new PreparationId(v.id);
            return new Preparation(name, materials, categories, checked, id);
        });
        const memos = obj.memos.map((v) => {
            const title = v.title;
            const text = v.text;
            const checked = v.checked;
            const id = new MemoId(v.id);
            return new Memo(title, text, checked, id);
        });
        const id = new StrategyMemoId(obj.id);
        return new StrategyMemo(
            gameName,
            new GameMapList(...gameMaps),
            new PreparationList(...preparations),
            new MemoList(...memos),
            id,
        );
    };

    static convertToStrategyMemoRecord = (
        item: StrategyMemo,
    ): StrategyMemoRecord => {
        const gameName = item.gameName;
        const gameMaps = item.gameMaps.items.map((gameMap) => {
            const name = gameMap.name;
            const gameMapDetails = gameMap.gameMapDetails.items.map((v) => {
                const obj: GameMapDetailRecord = {
                    name: v.name,
                    items: [...v.items],
                    monsters: [...v.monsters],
                    memo: v.memo,
                    icon: v.icon,
                    x: v.point.x,
                    y: v.point.y,
                    goto: v.goto.value,
                    checked: v.checked,
                    id: v.id.value,
                };
                return obj;
            });
            const gameMapShapes = gameMap.gameMapShapes.items.map((v) => {
                const obj: GameMapShapeRecord = {
                    name: v.name,
                    thickness: v.thickness.value,
                    color: v.color,
                    fill: v.fill,
                    scaleX: v.scale.x,
                    scaleY: v.scale.y,
                    angle: v.angle.value,
                    flip: v.flip,
                    progress: v.progress.value,
                    x: v.point.x,
                    y: v.point.y,
                    id: v.id.value,
                };
                return obj;
            });
            const image = gameMap.image;
            const id = gameMap.id.value;
            const obj: GameMapRecord = {
                name: name,
                gameMapDetails: gameMapDetails,
                gameMapShapes: gameMapShapes,
                image: image,
                id: id,
            };
            return obj;
        });
        const preparations = item.preparations.items.map((v) => {
            const obj: PreparationRecord = {
                name: v.name,
                materials: [...v.materials],
                categories: [...v.categories],
                checked: v.checked,
                id: v.id.value,
            };
            return obj;
        });
        const memos = item.memos.items.map((v) => {
            const obj: MemoRecord = {
                title: v.title,
                text: v.text,
                checked: v.checked,
                id: v.id.value,
            };
            return obj;
        });
        const id = item.id.value;
        const obj: StrategyMemoRecord = {
            gameName: gameName,
            gameMaps: gameMaps,
            preparations: preparations,
            memos: memos,
            id: id,
        };
        return obj;
    };
}
