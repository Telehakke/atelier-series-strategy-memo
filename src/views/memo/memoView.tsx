import { useAtomValue } from "jotai";
import { isLeftPanelOpenAtom, isReadonlyAtom } from "../../atoms";
import { Bg, Border, Divide } from "../commons/classNames";
import { ReadonlyButton } from "../share";
import MemoFilteringTextField from "./sub/memoFilteringTextField";
import MemoLinkView from "./sub/memoLinkView";
import MemoListController from "./sub/memoListController";
import MemoListView from "./sub/memoListView";

const MemoView = () => {
    return (
        <>
            <LeftPanel />
            <MemoListView />
            <Controller />
        </>
    );
};

export default MemoView;

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
                <MemoFilteringTextField className="pb-2" />
                <MemoLinkView className="pb-13" />
            </div>
        </div>
    );
};

const Controller = () => {
    const isReadonly = useAtomValue(isReadonlyAtom);

    if (isReadonly)
        return <ReadonlyButton className="fixed right-4 bottom-4" />;

    return <MemoListController className="fixed right-4 bottom-4" />;
};
