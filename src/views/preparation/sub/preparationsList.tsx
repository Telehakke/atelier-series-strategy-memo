import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    PreparationUtility,
    PreparationWithID,
} from "../../../models/preparation";
import PreparationsFiltering from "../../../models/preparationsFiltering";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
import CardBase from "../../commons/cardBase";
import { Bg, Text } from "../../commons/classNames";
import DialogView from "../../commons/dialogView";
import {
    ChevronDownIconLargeButton,
    ChevronUpIconLargeButton,
    PencilIconLargeButton,
    PlusIconLargeButton,
    TrashIconLargeButton,
} from "../../commons/iconButtons";
import TextField from "../../commons/textField";

const PreparationsList = ({
    preparations,
    onFiltering,
}: {
    preparations: PreparationWithID[];
    onFiltering: boolean;
}) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);

    return (
        <>
            <div className="space-y-2 pb-8">
                {preparations.map((v) => (
                    <Card
                        key={v.id}
                        preparation={v}
                        selectedID={selectedID}
                        setSelectedID={setSelectedID}
                    />
                ))}
                {!onFiltering && (
                    <AddItemButton className="grid justify-items-center" />
                )}
            </div>
            {selectedID != null && (
                <div className="fixed right-4 bottom-4 flex flex-col space-y-4">
                    {!onFiltering && (
                        <>
                            <MoveItemUpButton selectedID={selectedID} />
                            <MoveItemDownButton selectedID={selectedID} />
                        </>
                    )}
                    <EditItemButton selectedID={selectedID} />
                    <RemoveItemButton selectedID={selectedID} />
                </div>
            )}
        </>
    );
};

export default PreparationsList;

/* -------------------------------------------------------------------------- */

const Card = ({
    preparation,
    selectedID,
    setSelectedID,
}: {
    preparation: PreparationWithID;
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    return (
        <CardBase
            title={preparation.name}
            selected={preparation.id === selectedID}
            onClick={() =>
                setSelectedID(
                    preparation.id === selectedID ? null : preparation.id,
                )
            }
        >
            <MaterialsTable preparation={preparation} />
            <CategoriesTable preparation={preparation} />
        </CardBase>
    );
};

const MaterialsTable = ({
    preparation,
}: {
    preparation: PreparationWithID;
}) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const preparationsFiltering = new PreparationsFiltering(
        strategyMemo.preparations,
    );

    return (
        <Table header1="材料" header2="材料として使える調合品">
            {preparation.materials.map((material, i) => (
                <tr key={i}>
                    <td className={`text-nowrap ${Bg.blue200}`}>{material}</td>
                    <td className={`${Bg.neutral100}`}>
                        {preparationsFiltering
                            .filteredNamesAcceptingMaterial(material)
                            .map((name, i) => (
                                <span
                                    className="inline-block text-nowrap"
                                    key={i}
                                >{`【${name}】`}</span>
                            ))}
                    </td>
                </tr>
            ))}
        </Table>
    );
};

const CategoriesTable = ({
    preparation,
}: {
    preparation: PreparationWithID;
}) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const preparationsFiltering = new PreparationsFiltering(
        strategyMemo.preparations,
    );

    return (
        <Table header1="カテゴリー" header2="調合可能なレシピ">
            {preparation.categories.map((category, i) => (
                <tr key={i}>
                    <td className={`text-nowrap ${Bg.red200}`}>{category}</td>
                    <td className={`${Bg.neutral100}`}>
                        {preparationsFiltering
                            .filteredNameThatCanBeUsedAsMaterial(category)
                            .map((name, i) => (
                                <span
                                    className="inline-block text-nowrap"
                                    key={i}
                                >{`【${name}】`}</span>
                            ))}
                    </td>
                </tr>
            ))}
        </Table>
    );
};

const Table = ({
    header1,
    header2,
    children,
}: {
    header1: string;
    header2: string;
    children: ReactNode;
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

/* -------------------------------------------------------------------------- */

const AddItemButton = ({ className }: { className?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={className}>
            <PlusIconLargeButton onClick={() => setIsOpen(true)} />
            <AddItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    );
};

const AddItemDialog = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);
    const [name, setName] = useState("");
    const [materials, setMaterials] = useState("");
    const [categories, setCategories] = useState("");

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        if (name.trim().length === 0) {
            setIsOpen(false);
            return;
        }

        const preparation = PreparationUtility.create(
            name,
            materials,
            categories,
            uuidv4(),
        );
        setStrategyMemo((v) => PreparationUtility.added(v, preparation));
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の追加"
            primaryButtonLabel="追加"
            onPrimaryButtonClick={handleButtonClick}
        >
            <PreparationInput
                name={name}
                setName={setName}
                materials={materials}
                setMaterials={setMaterials}
                categories={categories}
                setCategories={setCategories}
            />
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const EditItemButton = ({ selectedID }: { selectedID: string }) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const index = PreparationUtility.findIndex(strategyMemo, selectedID);
    const [isOpen, setIsOpen] = useState(false);

    if (index == null) return <></>;

    return (
        <>
            <PencilIconLargeButton onClick={() => setIsOpen(true)} />
            <EditItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                index={index}
            />
        </>
    );
};

const EditItemDialog = ({
    isOpen,
    setIsOpen,
    index,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    index: number;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const preparation = strategyMemo.preparations[index];
    const [name, setName] = useState(preparation.name);
    const [materials, setMaterials] = useState(
        preparation.materials.join("、"),
    );
    const [categories, setCategories] = useState(
        preparation.categories.join("、"),
    );

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        if (name.trim().length === 0) {
            setIsOpen(false);
            return;
        }

        const newPreparation = PreparationUtility.create(
            name,
            materials,
            categories,
            preparation.id,
        );
        setStrategyMemo((v) =>
            PreparationUtility.changed(v, index, newPreparation),
        );
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の編集"
            primaryButtonLabel="変更"
            onPrimaryButtonClick={handleButtonClick}
        >
            <PreparationInput
                name={name}
                setName={setName}
                materials={materials}
                setMaterials={setMaterials}
                categories={categories}
                setCategories={setCategories}
            />
        </DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const RemoveItemButton = ({ selectedID }: { selectedID: string }) => {
    const strategyMemo = useAtomValue(strategyMemoRepositoryAtom);
    const index = PreparationUtility.findIndex(strategyMemo, selectedID);
    const [isOpen, setIsOpen] = useState(false);

    if (index == null) return <></>;

    return (
        <>
            <TrashIconLargeButton onClick={() => setIsOpen(true)} />
            <RemoveItemDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                index={index}
            />
        </>
    );
};

const RemoveItemDialog = ({
    isOpen,
    setIsOpen,
    index,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    index: number;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ): void => {
        setStrategyMemo((v) => PreparationUtility.removed(v, index));
        setIsOpen(false);
    };

    return (
        <DialogView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="項目の削除"
            primaryButtonLabel="削除"
            onPrimaryButtonClick={handleButtonClick}
            shouldUseWarningColor={true}
        ></DialogView>
    );
};

/* -------------------------------------------------------------------------- */

const PreparationInput = ({
    name,
    setName,
    materials,
    setMaterials,
    categories,
    setCategories,
}: {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    materials: string;
    setMaterials: React.Dispatch<React.SetStateAction<string>>;
    categories: string;
    setCategories: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <div className="space-y-2">
            <TextField
                label="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="材料"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
            />
            <TextField
                label="カテゴリー"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
            />
        </div>
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemUpButton = ({ selectedID }: { selectedID: string }) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const index = PreparationUtility.findIndex(strategyMemo, selectedID);

    if (index == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) => PreparationUtility.movedUp(v, index));
    };

    return <ChevronUpIconLargeButton onClick={() => handleButtonClick()} />;
};

const MoveItemDownButton = ({ selectedID }: { selectedID: string }) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const index = PreparationUtility.findIndex(strategyMemo, selectedID);

    if (index == null) return <></>;

    const handleButtonClick = () => {
        setStrategyMemo((v) => PreparationUtility.movedDown(v, index));
    };

    return <ChevronDownIconLargeButton onClick={() => handleButtonClick()} />;
};
