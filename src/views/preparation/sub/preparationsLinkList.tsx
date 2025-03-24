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
                    className={`block truncate pb-2 ${Text.hoverBlue500}`}
                    key={v.id}
                    href={`#${v.name}`}
                >
                    {v.name}
                </a>
            ))}
        </div>
    );
};

export default PreparationsLinkList;
