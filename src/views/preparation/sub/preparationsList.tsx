import { useAtom, useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    PreparationUtility,
    PreparationWithID,
} from "../../../models/preparation";
import PreparationsFiltering from "../../../models/preparationsFiltering";
import { strategyMemoRepositoryAtom } from "../../../strategyMemoAtom";
import { Bg, Border, Divide, Ring, Text } from "../../commons/classNames";
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
}: {
    preparations: PreparationWithID[];
}) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);

    return (
        <>
            <div className="space-y-2 pb-8">
                {preparations.map((v) => (
                    <Card
                        key={v.id}
                        preparation={v}
                        preparations={preparations}
                        selectedID={selectedID}
                        setSelectedID={setSelectedID}
                    />
                ))}
                <AddItemButton />
            </div>
            {selectedID != null && (
                <div className="fixed right-4 bottom-4 space-y-4">
                    <MoveItemUpButton selectedID={selectedID} />
                    <MoveItemDownButton selectedID={selectedID} />
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
    preparations,
    selectedID,
    setSelectedID,
}: {
    preparation: PreparationWithID;
    preparations: PreparationWithID[];
    selectedID: string | null;
    setSelectedID: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    return (
        <div
            className={`mx-auto max-w-150 overflow-clip rounded-md border-2 hover:ring-4 ${Border.neutral950} ${Ring.blue500}`}
            onClick={() =>
                setSelectedID(
                    preparation.id === selectedID ? null : preparation.id,
                )
            }
        >
            <div
                className={`flex h-9 items-center justify-between gap-2 px-1 ${preparation.id === selectedID ? Bg.blue500 : Bg.neutral950}`}
            >
                <h2
                    className={`scroll-mt-14 scroll-pt-14 truncate text-lg font-bold ${Text.neutral50}`}
                    id={preparation.name}
                >
                    {preparation.name}
                </h2>
            </div>
            <div className={`divide-y-2 ${Divide.neutral950}`}>
                <MaterialsTable
                    preparation={preparation}
                    preparations={preparations}
                />
                <CategoriesTable
                    preparation={preparation}
                    preparations={preparations}
                />
            </div>
        </div>
    );
};

const MaterialsTable = ({
    preparation,
    preparations,
}: {
    preparation: PreparationWithID;
    preparations: PreparationWithID[];
}) => {
    const preparationsFiltering = new PreparationsFiltering(preparations);

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
    preparations,
}: {
    preparation: PreparationWithID;
    preparations: PreparationWithID[];
}) => {
    const preparationsFiltering = new PreparationsFiltering(preparations);

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

const AddItemButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <PlusIconLargeButton onClick={() => setIsOpen(true)} />
            <AddItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
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
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <PencilIconLargeButton onClick={() => setIsOpen(true)} />
            <EditItemDialog
                key={`${isOpen}`}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedID={selectedID}
            />
        </>
    );
};

const EditItemDialog = ({
    isOpen,
    setIsOpen,
    selectedID,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedID: string;
}) => {
    const [strategyMemo, setStrategyMemo] = useAtom(strategyMemoRepositoryAtom);
    const index = PreparationUtility.findIndex(strategyMemo, selectedID);
    const preparation = index == null ? null : strategyMemo.preparations[index];
    const [name, setName] = useState(preparation?.name ?? "");
    const [materials, setMaterials] = useState(
        preparation?.materials.join("、") ?? "",
    );
    const [categories, setCategories] = useState(
        preparation?.categories.join("、") ?? "",
    );

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        if (index == null || preparation == null || name.trim().length === 0) {
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
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TrashIconLargeButton onClick={() => setIsOpen(true)} />
            <RemoveItemDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedID={selectedID}
            />
        </>
    );
};

const RemoveItemDialog = ({
    isOpen,
    setIsOpen,
    selectedID,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedID: string;
}) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = (
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ): void => {
        setStrategyMemo((v) => {
            const index = PreparationUtility.findIndex(v, selectedID);
            if (index == null) return v;

            return PreparationUtility.removed(v, index);
        });

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
        <>
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
        </>
    );
};

/* -------------------------------------------------------------------------- */

const MoveItemUpButton = ({ selectedID }: { selectedID: string }) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) => {
            const index = PreparationUtility.findIndex(v, selectedID);
            if (index == null) return v;

            return PreparationUtility.movedUp(v, index);
        });
    };

    return <ChevronUpIconLargeButton onClick={() => handleButtonClick()} />;
};

const MoveItemDownButton = ({ selectedID }: { selectedID: string }) => {
    const setStrategyMemo = useSetAtom(strategyMemoRepositoryAtom);

    const handleButtonClick = () => {
        setStrategyMemo((v) => {
            const index = PreparationUtility.findIndex(v, selectedID);
            if (index == null) return v;

            return PreparationUtility.movedDown(v, index);
        });
    };

    return <ChevronDownIconLargeButton onClick={() => handleButtonClick()} />;
};
