const zeroPadding = (value: number): string => {
    return `${value}`.padStart(2, "0");
};

const dateNow = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = zeroPadding(date.getMonth() + 1);
    const day = zeroPadding(date.getDate());
    const hour = zeroPadding(date.getHours());
    const minute = zeroPadding(date.getMinutes());
    const second = zeroPadding(date.getSeconds());
    return `${year}${month}${day}_${hour}${minute}${second}`;
};

export default dateNow;
