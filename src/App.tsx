import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useAtom, useSetAtom } from "jotai";
import { Map, NotebookPen, Wand } from "lucide-react";
import {
    gameMapsAtom,
    gameNameAtom,
    isLeftPanelOpenAtom,
    memosAtom,
    preparationsAtom,
    selectedGameMapIdAtom,
    strategyMemoAtom,
} from "./atoms";
import LocalStorage from "./models/localStorage";
import { Bg, Border, Text } from "./views/commons/classNames";
import {
    PanelLeftCloseIconButton,
    PanelLeftOpenIconButton,
} from "./views/commons/iconButtons";
import GameMapView from "./views/gameMap/gameMapView";
import GameNameView from "./views/gameNameView";
import LinkToRepositoryOnGitHub from "./views/linkToRepositoryOnGithub";
import MemoView from "./views/memo/memoView";
import PreparationView from "./views/preparation/preparationView";
import { CheckShareParameter } from "./views/share";
import ToolsButton from "./views/toolsButton";

const App = () => {
    const setStrategyMemo = useSetAtom(strategyMemoAtom);
    const setGameName = useSetAtom(gameNameAtom);
    const setGameMaps = useSetAtom(gameMapsAtom);
    const setPreparations = useSetAtom(preparationsAtom);
    const setMemos = useSetAtom(memosAtom);
    const setSelectedGameMapId = useSetAtom(selectedGameMapIdAtom);

    const strategyMemo = LocalStorage.getStrategyMemo();
    setStrategyMemo(strategyMemo);
    setGameName(strategyMemo.gameName);
    setGameMaps(strategyMemo.gameMaps);
    setPreparations(strategyMemo.preparations);
    setMemos(strategyMemo.memos);
    const gameMap = strategyMemo.gameMaps.at(0);
    setSelectedGameMapId(gameMap?.id ?? null);

    return (
        <div className={`${Bg.neutral50_950} ${Text.neutral950_100}`}>
            <div
                className={`fixed top-0 right-0 left-0 z-10 h-13 border-b-2 ${Bg.neutral50_950} ${Border.neutral300_800}`}
            />
            <TabGroup>
                <div className="fixed top-2 right-0 left-0 z-20">
                    <div className="flex items-center justify-between gap-2 px-2">
                        <LeftPanelOpenCloseButton />
                        <GameNameView />
                        <TabList className="grid shrink-0 grid-cols-3 text-nowrap">
                            <MapTab />
                            <PreparationTab />
                            <MemoTab />
                        </TabList>
                        <div className="flex shrink-0 items-center gap-2">
                            <ToolsButton />
                            <LinkToRepositoryOnGitHub />
                        </div>
                    </div>
                </div>
                <TabPanels>
                    <MapTabPanel />
                    <PreparationTabPanel />
                    <MemoTabPanel />
                </TabPanels>
            </TabGroup>
            <CheckShareParameter />
        </div>
    );
};

export default App;

/* -------------------------------------------------------------------------- */

const LeftPanelOpenCloseButton = () => {
    const [isLeftPanelOpened, setIsLeftPanelOpened] =
        useAtom(isLeftPanelOpenAtom);

    if (isLeftPanelOpened)
        return (
            <PanelLeftCloseIconButton
                onClick={() => setIsLeftPanelOpened(false)}
            />
        );

    return (
        <PanelLeftOpenIconButton onClick={() => setIsLeftPanelOpened(true)} />
    );
};

/* -------------------------------------------------------------------------- */

const MapTab = () => {
    return (
        <Tab
            className={`rounded-l-full border-y-2 border-l-2 px-1 outline-hidden ${Bg.selectedBlue500} ${Bg.hoverNeutral200_800} ${Border.blue500} ${Text.selectedNeutral50}`}
        >
            <div className="flex flex-col items-center px-1">
                <Map className="size-4" />
                <p className="text-[8px]">マップ</p>
            </div>
        </Tab>
    );
};

const PreparationTab = () => {
    return (
        <Tab
            className={`border-2 px-1 outline-hidden ${Bg.selectedBlue500} ${Bg.hoverNeutral200_800} ${Border.blue500} ${Text.selectedNeutral50}`}
        >
            <div className="flex flex-col items-center px-1">
                <Wand className="size-4" />
                <p className="text-[8px]">調合品</p>
            </div>
        </Tab>
    );
};

const MemoTab = () => {
    return (
        <Tab
            className={`rounded-r-full border-y-2 border-r-2 px-1 outline-hidden ${Bg.selectedBlue500} ${Bg.hoverNeutral200_800} ${Border.blue500} ${Text.selectedNeutral50}`}
        >
            <div className="flex flex-col items-center px-1">
                <NotebookPen className="size-4" />
                <p className="text-[8px]">メモ</p>
            </div>
        </Tab>
    );
};

/* -------------------------------------------------------------------------- */

const MapTabPanel = () => {
    return (
        <TabPanel className="p-2 pt-14">
            <GameMapView />
        </TabPanel>
    );
};

const PreparationTabPanel = () => {
    return (
        <TabPanel className="p-2 pt-14">
            <PreparationView />
        </TabPanel>
    );
};

const MemoTabPanel = () => {
    return (
        <TabPanel className="p-2 pt-14">
            <MemoView />
        </TabPanel>
    );
};
