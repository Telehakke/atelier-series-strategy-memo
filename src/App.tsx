import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useAtomValue } from "jotai";
import { Map, NotebookPen, Wand } from "lucide-react";
import { useState } from "react";
import { strategyMemoRepositoryAtom } from "./strategyMemoAtom";
import BackupButton from "./views/backupButton";
import { Bg, Border, Text } from "./views/commons/classNames";
import GameMapView from "./views/gameMap/gameMapView";
import GameNameView from "./views/gameNameView";
import MemoView from "./views/memo/memoView";
import MoveToRepositoryButton from "./views/moveToRepositoryButton";
import PreparationView from "./views/preparation/preparationView";
import ResetButton from "./views/resetButton";

const App = () => {
    const strategyMemoRepository = useAtomValue(strategyMemoRepositoryAtom);
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    return (
        <div className={`${Bg.neutral50} ${Text.neutral950}`}>
            <div
                className={`fixed top-0 right-0 left-0 z-10 h-11 shadow-md ${Bg.neutral50}`}
            />
            <TabGroup>
                <div className="fixed top-2 right-0 left-0 z-20">
                    <div className="flex items-center justify-between gap-2 px-2">
                        <BackupButton />
                        <GameNameView title={strategyMemoRepository.gameName} />
                        <TabList className="grid shrink-0 grid-cols-3 text-nowrap">
                            <Tab
                                className={`rounded-l-full border-y-2 border-l-2 px-1 outline-hidden ${Border.blue200} ${Bg.hoverNeutral200} ${Bg.selectedBlue200}`}
                            >
                                <div className="flex flex-col items-center px-1">
                                    <Map className="size-4" />
                                    <p className="text-[8px]">マップ</p>
                                </div>
                            </Tab>
                            <Tab
                                className={`border-2 px-1 outline-hidden ${Border.blue200} ${Bg.hoverNeutral200} ${Bg.selectedBlue200}`}
                            >
                                <div className="flex flex-col items-center px-1">
                                    <Wand className="size-4" />
                                    <p className="text-[8px]">調合品</p>
                                </div>
                            </Tab>
                            <Tab
                                className={`rounded-r-full border-y-2 border-r-2 px-1 outline-hidden ${Border.blue200} ${Bg.hoverNeutral200} ${Bg.selectedBlue200}`}
                            >
                                <div className="flex flex-col items-center px-1">
                                    <NotebookPen className="size-4" />
                                    <p className="text-[8px]">メモ</p>
                                </div>
                            </Tab>
                        </TabList>
                        <div className="flex shrink-0 items-center gap-2">
                            <ResetButton />
                            <MoveToRepositoryButton />
                        </div>
                    </div>
                </div>
                <TabPanels>
                    <TabPanel className="p-2 pt-13">
                        <GameMapView
                            gameMapGroups={strategyMemoRepository.gameMapGroups}
                            isPanelOpen={isPanelOpen}
                            setIsPanelOpen={setIsPanelOpen}
                        />
                    </TabPanel>
                    <TabPanel className="p-2 pt-13">
                        <PreparationView
                            preparations={strategyMemoRepository.preparations}
                            isPanelOpen={isPanelOpen}
                            setIsPanelOpen={setIsPanelOpen}
                        />
                    </TabPanel>
                    <TabPanel className="p-2 pt-13">
                        <MemoView
                            memos={strategyMemoRepository.memos}
                            isPanelOpen={isPanelOpen}
                            setIsPanelOpen={setIsPanelOpen}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default App;
