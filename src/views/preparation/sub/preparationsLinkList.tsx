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
        <div className={`w-45 ${className}`}>
            {preparations.map((v) => (
                <a
                    className={`block truncate leading-8 ${Text.hoverBlue500}`}
                    key={v.id}
                    href={`#${v.id}`}
                >
                    {v.name}
                </a>
            ))}
        </div>
    );
};

export default PreparationsLinkList;
