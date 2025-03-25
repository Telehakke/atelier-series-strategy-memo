import { useState } from "react";
import { PreparationWithID } from "../../models/preparation";
import PreparationsFiltering from "../../models/preparationsFiltering";
import splitByWhiteSpace from "../../models/splitByWhiteSpace";
import { Bg, Divide } from "../commons/classNames";
import FilteringTextField from "../commons/filteringTextField";
import PanelOpenCloseButton from "../commons/panelOpenCloseButton";
import PreparationsLinkList from "./sub/preparationsLinkList";
import PreparationsList from "./sub/preparationsList";

const PreparationView = ({
    preparations,
    isPanelOpen,
    setIsPanelOpen,
}: {
    preparations: PreparationWithID[];
    isPanelOpen: boolean;
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [filteringValue, setFilteringValue] = useState("");
    const preparationsFiltering = new PreparationsFiltering(preparations);
    const filteredPreparations = preparationsFiltering.filtered(
        splitByWhiteSpace(filteringValue),
    );

    return (
        <>
            <div
                className={`fixed top-0 left-0 z-5 flex h-full gap-2 p-2 pt-14 ${Bg.neutral50}`}
            >
                {isPanelOpen && (
                    <div
                        className={`divide-y-2 overflow-scroll ${Divide.neutral300}`}
                    >
                        <FilteringTextField
                            className="py-2"
                            filteringValue={filteringValue}
                            setFilteringValue={setFilteringValue}
                        />
                        <PreparationsLinkList
                            className="py-2"
                            preparations={filteredPreparations}
                        />
                    </div>
                )}
                <PanelOpenCloseButton
                    className="h-full self-center"
                    isOpen={isPanelOpen}
                    setIsOpen={setIsPanelOpen}
                />
            </div>
            <div className="ml-13">
                <PreparationsList preparations={filteredPreparations} />
            </div>
        </>
    );
};

export default PreparationView;
