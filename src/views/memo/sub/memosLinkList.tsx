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
        <>
            {memos.length > 0 && (
                <div className={className}>
                    {memos.map((v) => (
                        <a
                            className={`block truncate ${Text.hoverBlue500}`}
                            key={v.id}
                            href={`#${v.title}`}
                        >
                            {v.title}
                        </a>
                    ))}
                </div>
            )}
        </>
    );
};

export default MemosLinkList;
