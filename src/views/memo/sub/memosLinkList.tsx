import { Memo } from "../../../models/memo";
import { Text } from "../../commons/classNames";

const MemosLinkList = ({
    memos,
    className,
}: {
    memos: Memo[];
    className?: string;
}) => {
    return (
        <div className={`w-45 {${className}`}>
            {memos.map((v) => (
                <a
                    className={`block truncate leading-8 ${Text.hoverBlue500}`}
                    key={v.id}
                    href={`#${v.id}`}
                >
                    {v.title}
                </a>
            ))}
        </div>
    );
};

export default MemosLinkList;
