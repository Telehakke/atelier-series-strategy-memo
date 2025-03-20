import { PreparationList } from "./preparation";

export default class PreparationFilter {
    static filtered = (
        list: PreparationList,
        texts: string[],
    ): PreparationList => {
        if (texts.length === 0) return list;

        return list.filter((preparation) =>
            texts.some((text) => {
                if (preparation.name.includes(text)) return true;
                if (preparation.materials.some((v) => v.includes(text)))
                    return true;
                if (preparation.categories.some((v) => v.includes(text)))
                    return true;
                return false;
            }),
        );
    };

    /**
     * 材料として使える調合品名を抽出する
     */
    static filteredNamesThatCanBeUsedAsMaterial = (
        list: PreparationList,
        category: string,
    ): string[] => {
        if (category.length === 0) return [];

        return list.items
            .filter((preparation) =>
                preparation.materials.some((v) => v === category),
            )
            .map((v) => v.name);
    };

    /**
     * 材料を受け入れる調合品名を抽出する
     */
    static filteredNamesAcceptingMaterial = (
        list: PreparationList,
        material: string,
    ): string[] => {
        if (material.length === 0) return [];

        return list.items
            .filter((preparation) => {
                if (preparation.name === material) return true;

                return preparation.categories.some((v) => v === material);
            })
            .map((v) => v.name);
    };
}
