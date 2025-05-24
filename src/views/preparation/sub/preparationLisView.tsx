import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ReactNode } from "react";
import {
    canSelectMultipleAtom,
    isEditPreparationDialogOpenAtom,
    isReadonlyAtom,
    preparationFilteringValueAtom,
    preparationsAtom,
    selectedPreparationIdsAtom,
    strategyMemoAtom,
} from "../../../atoms";
import LocalStorage from "../../../models/localStorage";
import { Preparation, PreparationIdList } from "../../../models/preparation";
import PreparationFilter from "../../../models/preparationFilter";
import Split from "../../../models/split";
import CardBase from "../../commons/cardBase";
import { Bg, Text } from "../../commons/classNames";

const PreparationListView = () => {
    const preparations = useAtomValue(preparationsAtom);
    const filteringValue = useAtomValue(preparationFilteringValueAtom);
    const filteredPreparations = PreparationFilter.filtered(
        preparations,
        Split.byWhiteSpace(filteringValue),
    );

    return (
        <div className="flex flex-col items-center gap-2 pb-60">
            {filteredPreparations.map((v) => (
                <Card key={v.id.value} preparation={v} />
            ))}
        </div>
    );
};

export default PreparationListView;

/* -------------------------------------------------------------------------- */

const Card = ({ preparation }: { preparation: Preparation }) => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const canSelectMultiple = useAtomValue(canSelectMultipleAtom);
    const [selectedPreparationIds, setSelectedPreparationIds] = useAtom(
        selectedPreparationIdsAtom,
    );
    const setIsEditDialogOpen = useSetAtom(isEditPreparationDialogOpenAtom);
    const isReadonly = useAtomValue(isReadonlyAtom);

    // クリックでリストアイテムの選択状態を切り替える
    const handleClick = () => {
        if (canSelectMultiple) {
            setSelectedPreparationIds((v) =>
                v.hasId(preparation.id)
                    ? v.removed(preparation.id)
                    : v.added(preparation.id),
            );
        }

        setSelectedPreparationIds((v) =>
            v.hasId(preparation.id)
                ? new PreparationIdList()
                : new PreparationIdList(preparation.id),
        );
    };

    // ダブルクリックで編集ダイアログを開く
    const handleDoubleClick = () => {
        if (canSelectMultiple) return;

        setSelectedPreparationIds(new PreparationIdList(preparation.id));
        setIsEditDialogOpen(true);
    };

    // チェックボックスの状態を切り替える
    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (isReadonly) return;

        setStrategyMemo((v) => {
            const newPreparation = preparation.copyWith({
                checked: event.target.checked,
            });
            const newPreparations = v.preparations.replaced(newPreparation);
            const newStrategyMemo = v.replacedPreparations(newPreparations);
            setPreparations(newStrategyMemo.preparations);
            LocalStorage.setStrategyMemo(newStrategyMemo, isReadonly);
            return newStrategyMemo;
        });
    };

    return (
        <CardBase
            title={preparation.name}
            id={preparation.id.value}
            selected={selectedPreparationIds.hasId(preparation.id)}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            checked={preparation.checked}
            onCheckboxChange={handleCheckboxChange}
        >
            <MaterialsTable preparation={preparation} />
            <CategoriesTable preparation={preparation} />
        </CardBase>
    );
};

const MaterialsTable = ({ preparation }: { preparation: Preparation }) => {
    return (
        <Table header1="材料" header2="材料として使える調合品">
            {preparation.materials.map((material, i) => (
                <tr key={i}>
                    <td className={`text-nowrap ${Bg.blue200_800}`}>
                        {material}
                    </td>
                    <td className={`${Bg.neutral100_900}`}>
                        <MaterialTableData material={material} />
                    </td>
                </tr>
            ))}
        </Table>
    );
};

const MaterialTableData = ({ material }: { material: string }) => {
    const preparations = useAtomValue(preparationsAtom);
    const filteredNames = PreparationFilter.filteredNamesAcceptingMaterial(
        preparations,
        material,
    );

    return (
        <>
            {filteredNames.map((name, i) => (
                <span
                    className="inline-block text-nowrap"
                    key={i}
                >{`【${name}】`}</span>
            ))}
        </>
    );
};

const CategoriesTable = ({ preparation }: { preparation: Preparation }) => {
    return (
        <Table header1="カテゴリー" header2="調合可能なレシピ">
            {preparation.categories.map((category, i) => (
                <tr key={i}>
                    <td className={`text-nowrap ${Bg.red200_800}`}>
                        {category}
                    </td>
                    <td className={`${Bg.neutral100_900}`}>
                        <CategoryTableData category={category} />
                    </td>
                </tr>
            ))}
        </Table>
    );
};

const CategoryTableData = ({ category }: { category: string }) => {
    const preparations = useAtomValue(preparationsAtom);

    const filteredNames =
        PreparationFilter.filteredNamesThatCanBeUsedAsMaterial(
            preparations,
            category,
        );

    return (
        <>
            {filteredNames.map((name, i) => (
                <span
                    className="inline-block text-nowrap"
                    key={i}
                >{`【${name}】`}</span>
            ))}
        </>
    );
};

const Table = ({
    header1,
    header2,
    children,
}: {
    header1?: string;
    header2?: string;
    children?: ReactNode;
}) => {
    return (
        <table className="border-separate p-1 text-sm">
            <thead>
                <tr className={`text-nowrap ${Text.neutral500}`}>
                    <th>{header1}</th>
                    <th className="w-screen">{header2}</th>
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    );
};
