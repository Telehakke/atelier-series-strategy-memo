import { ChevronLeftIconButton, ChevronRightIconButton } from "./iconButtons";

const PanelOpenCloseButton = ({
    isOpen,
    setIsOpen,
    className,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}) => {
    return (
        <div className={className}>
            {isOpen ? (
                <ChevronLeftIconButton onClick={() => setIsOpen(false)} />
            ) : (
                <ChevronRightIconButton onClick={() => setIsOpen(true)} />
            )}
        </div>
    );
};

export default PanelOpenCloseButton;
