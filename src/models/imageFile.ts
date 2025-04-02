import { isString } from "./typeGuards";

export default class ImageFile {
    private file: File;

    constructor(file: File) {
        this.file = file;
    }

    static isImage = (file: File): boolean => {
        if (file.type === "image/jpeg") return true;
        if (file.type === "image/png") return true;
        return false;
    };

    /**
     * @param quality 0から1の間
     */
    toBase64 = async (
        quality: number,
        clipMode: ClipMode,
    ): Promise<string | null> => {
        if (!ImageFile.isImage(this.file)) return null;

        const img = document.createElement("img");
        img.src = URL.createObjectURL(this.file);
        await img.decode();

        const canvas = document.createElement("canvas");
        const [width, height] = this.clipSize(
            ...this.resize(img.width, img.height),
            clipMode,
        );
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx == null) return null;

        ctx.drawImage(img, ...this.clipRect(width, height, clipMode));
        return canvas.toDataURL("image/jpeg", quality);
    };

    private resize = (
        imgWidth: number,
        imgHeight: number,
    ): [number, number] => {
        const widthRatio = imgWidth / 1280;
        const heightRatio = imgHeight / 1280;
        const maxRatio = Math.max(widthRatio, heightRatio);
        const ratio = maxRatio > 1 ? maxRatio : 1;
        const newWidth = Math.trunc(imgWidth / ratio);
        const newHeight = Math.trunc(imgHeight / ratio);
        return [newWidth, newHeight];
    };

    private clipSize = (
        width: number,
        height: number,
        clipMode: ClipMode,
    ): [number, number] => {
        const newWidth = clipMode === "all" ? width : Math.trunc(width / 2);
        return [newWidth, height];
    };

    private clipRect = (
        width: number,
        height: number,
        clipMode: ClipMode,
    ): [number, number, number, number] => {
        switch (clipMode) {
            case "left":
                return [0, 0, width * 2, height];
            case "right":
                return [-width, 0, width * 2, height];
            case "center":
                return [-width / 2, 0, width * 2, height];
            default:
                return [0, 0, width, height];
        }
    };
}

/* -------------------------------------------------------------------------- */

export const JpegQuality = {
    high: 85,
    middle: 50,
    low: 20,
} as const;

/* -------------------------------------------------------------------------- */

export const ClipModeEnum = {
    all: "all",
    left: "left",
    right: "right",
    center: "center",
} as const;

export type ClipMode = keyof typeof ClipModeEnum;

export const isClipMode = (value: unknown): value is ClipMode => {
    if (!isString(value)) return false;
    return Object.values(ClipModeEnum).some((v) => v === value);
};

export const ClipModeJA = {
    all: "全体",
    left: "左半分",
    right: "右半分",
    center: "中央",
} as const;
