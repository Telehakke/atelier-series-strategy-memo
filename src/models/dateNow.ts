const dateNow = (): string => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(2).padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}${month}${day}_${hour}${minute}${second}`;
};

export default dateNow;
