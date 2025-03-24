import { MemoWithID } from "../../../models/memo";
import { Text } from "../../commons/classNames";

const MemosLinkList = ({
    memos,
    className,
}: {
    memos: MemoWithID[];
    className?: string;
}) => {
    return (
        <div className={`w-45 {${className}`}>
            {memos.map((v) => (
                <a
                    className={`mb-2 block truncate ${Text.hoverBlue500}`}
                    key={v.id}
                    href={`#${v.title}`}
                >
                    {v.title}
                </a>
            ))}
        </div>
    );
};

export default MemosLinkList;
