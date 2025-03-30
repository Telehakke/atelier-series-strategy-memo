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

    toBase64 = async (
        width: number,
        height: number,
    ): Promise<string | null> => {
        if (!ImageFile.isImage(this.file)) return null;

        const img = document.createElement("img");
        img.src = URL.createObjectURL(this.file);
        await img.decode();

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx == null) return null;

        const newWidth = Math.trunc(
            img.width >= img.height ? width : (img.width * height) / img.height,
        );
        const newHeight = Math.trunc(
            img.width >= img.height ? (img.height * width) / img.width : height,
        );
        const marginWidth = Math.trunc((width - newWidth) / 2);
        const marginHeight = Math.trunc((height - newHeight) / 2);
        ctx.drawImage(img, marginWidth, marginHeight, newWidth, newHeight);
        return canvas.toDataURL("image/png");
    };
}
