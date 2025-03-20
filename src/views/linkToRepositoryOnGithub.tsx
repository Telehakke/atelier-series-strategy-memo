import githubMarkWhiteSVG from "../assets/github-mark-white.svg";
import githubMarkSVG from "../assets/github-mark.svg";

const LinkToRepositoryOnGitHub = () => {
    return (
        <a
            href="https://github.com/Telehakke/atelier-series-strategy-memo"
            target="_blank"
        >
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

export default LinkToRepositoryOnGitHub;
