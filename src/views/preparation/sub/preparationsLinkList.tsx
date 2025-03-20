import { PreparationWithID } from "../../../models/preparation";
import { Text } from "../../commons/classNames";

const PreparationsLinkList = ({
    preparations,
    className,
}: {
    preparations: PreparationWithID[];
    className?: string;
}) => {
    return (
        <>
            {preparations.length > 0 && (
                <div className={className}>
                    {preparations.map((v) => (
                        <a
                            className={`block truncate ${Text.hoverBlue500}`}
                            key={v.id}
                            href={`#${v.name}`}
                        >
                            {v.name}
                        </a>
                    ))}
                </div>
            )}
        </>
    );
};

export default PreparationsLinkList;
