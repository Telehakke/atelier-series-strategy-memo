import { useState } from "react";
import { Preparation } from "../../models/preparation";
import PreparationsFiltering from "../../models/preparationsFiltering";
import splitByWhiteSpace from "../../models/splitByWhiteSpace";
import { Bg, Border, Divide } from "../commons/classNames";
import FilteringTextField from "../commons/filteringTextField";
import PreparationsLinkList from "./sub/preparationsLinkList";
import PreparationsList from "./sub/preparationsList";

const PreparationView = ({
    preparations,
    isPanelOpen,
}: {
    preparations: Preparation[];
    isPanelOpen: boolean;
}) => {
    const [filteringValue, setFilteringValue] = useState("");
    const preparationsFiltering = new PreparationsFiltering(preparations);
    const filteredPreparations = preparationsFiltering.filtered(
        splitByWhiteSpace(filteringValue),
    );

    return (
        <>
            {isPanelOpen && (
                <div
                    className={`fixed top-0 left-0 z-5 flex h-full gap-2 border-r-2 p-2 pt-14 ${Bg.neutral50} ${Border.neutral300}`}
                >
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
                </div>
            )}
            <PreparationsList preparations={filteredPreparations} />
        </>
    );
};

export default PreparationView;
