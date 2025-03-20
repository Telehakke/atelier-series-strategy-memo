export default class DelayAction {
    private id: number | undefined = undefined;

    run = (action: () => void, duration: number): void => {
        clearInterval(this.id);
        this.id = setTimeout(() => {
            action();
        }, duration);
    };
}
