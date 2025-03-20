const copyToClipboard = async (text: string): Promise<boolean> => {
    const result = await navigator.clipboard.writeText(text).then(
        () => {
            return true;
        },
        () => {
            return false;
        },
    );
    return result;
};

export default copyToClipboard;
