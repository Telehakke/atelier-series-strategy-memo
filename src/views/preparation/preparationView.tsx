import { PreparationWithID } from "../../models/preparation";
import { Bg } from "../commons/classNames";
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
    return (
        <>
            <div
                className={`fixed top-0 left-0 z-5 flex h-full max-w-60 gap-2 p-2 pt-13 ${Bg.neutral50}`}
            >
                {isPanelOpen && (
                    <PreparationsLinkList
                        className="overflow-scroll py-2"
                        preparations={preparations}
                    />
                )}
                <PanelOpenCloseButton
                    className="h-full self-center"
                    isOpen={isPanelOpen}
                    setIsOpen={setIsPanelOpen}
                />
            </div>
            <div className="ml-11">
                <PreparationsList preparations={preparations} />
            </div>
        </>
    );
};

export default PreparationView;
