import { PreparationWithID } from "./preparation";

export default class PreparationsFiltering {
    private preparations: PreparationWithID[];

    constructor(preparations: PreparationWithID[]) {
        this.preparations = preparations;
    }

    /**
     * 材料として使える調合品名を抽出する
     */
    filteredNameThatCanBeUsedAsMaterial = (category: string): string[] => {
        return this.preparations
            .filter((v) =>
                v.materials.some((material) => material === category),
            )
            .map((v) => v.name);
    };

    /**
     * 材料を受け入れる調合品名を探す
     */
    filteredNamesAcceptingMaterial = (material: string): string[] => {
        return this.preparations
            .filter((v) => {
                if (v.name === material) {
                    return true;
                }
                return v.categories.some((category) => category === material);
            })
            .map((v) => v.name);
    };
}
