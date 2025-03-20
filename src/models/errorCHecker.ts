export default class ErrorChecker {
    static quotaExceededErrorMessage =
        "⚠️データ量の上限に達したため保存に失敗しまし";

    static isQuotaExceededError = (error: unknown): boolean => {
        return String(error).includes("QuotaExceededError");
    };
}
