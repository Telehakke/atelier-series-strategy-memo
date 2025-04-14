let id: number | undefined = undefined;

const delayAction = (action: () => void): void => {
    clearTimeout(id);
    id = setTimeout(() => {
        action();
    }, 1000);
};

export default delayAction;
