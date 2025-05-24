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
    const isLeftPanelOpen = useAtomValue(isLeftPanelOpenAtom);

    const flex = "flex flex-col gap-2";
    const fixedToLeft = "fixed top-13 left-0 z-5";
    const border = `border-r-2 ${Border.neutral300_800}`;
    const showPanel = `${isLeftPanelOpen ? "" : "hidden"}`;

    return (
        <div
            className={`h-full w-51 p-2 ${flex} ${fixedToLeft} ${border} ${showPanel} ${Bg.neutral50_950}`}
        >
            <div
                className={`space-y-2 divide-y-2 overflow-auto overscroll-contain ${Divide.neutral300_800}`}
                style={{ scrollbarWidth: "thin" }}
            >
                <PreparationFilteringTextField className="pb-2" />
                <PreparationLinkView className="pb-13" />
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
