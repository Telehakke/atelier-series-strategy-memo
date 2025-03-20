import { useAtomValue } from "jotai";
import { isLeftPanelOpenAtom, isReadonlyAtom } from "../../atoms";
import { Bg, Border, Divide } from "../commons/classNames";
import { ReadonlyButton } from "../share";
import PreparationFilteringTextField from "./sub/preparationFilteringTextField";
import PreparationLinkView from "./sub/preparationLinkView";
import PreparationListView from "./sub/preparationLisView";
import PreparationListController from "./sub/preparationListController";

const PreparationView = () => {
    return (
        <>
            <LeftPanel />
            <PreparationListView />
            <Controller />
        </>
    );
};

export default PreparationView;

/* -------------------------------------------------------------------------- */

const LeftPanel = () => {
    const isLeftPanelOpened = useAtomValue(isLeftPanelOpenAtom);

    return (
        <div
            className={`fixed top-0 left-0 z-5 flex h-full border-r-2 p-2 pt-14 ${Bg.neutral50_950} ${Border.neutral300_800} ${isLeftPanelOpened ? "" : "hidden"}`}
        >
            <div
                className={`divide-y-2 overflow-auto ${Divide.neutral300_800}`}
                style={{ scrollbarWidth: "thin" }}
            >
                <div>
                    <PreparationFilteringTextField className="mb-1" />
                </div>
                <PreparationLinkView className="py-2" />
            </div>
        </div>
    );
};

const Controller = () => {
    const isReadonly = useAtomValue(isReadonlyAtom);

    if (isReadonly)
        return <ReadonlyButton className="fixed right-4 bottom-4" />;

    return <PreparationListController className="fixed right-4 bottom-4" />;
};
