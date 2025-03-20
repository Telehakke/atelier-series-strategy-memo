import githubMarkWhiteSVG from "../assets/github-mark-white.svg";
import githubMarkSVG from "../assets/github-mark.svg";

const MoveToRepositoryButton = () => {
    return (
        <a href="" target="_blank">
            <picture className="hover:opacity-70">
                <source
                    srcSet={githubMarkWhiteSVG}
                    media="(prefers-color-scheme: dark)"
                />
                <img src={githubMarkSVG} className="h-6 w-6" />
            </picture>
        </a>
    );
};

export default MoveToRepositoryButton;
