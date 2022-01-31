export type TransactionResponse<T = any> = {
    success: boolean;
    message?: string;
    data?: T;
}