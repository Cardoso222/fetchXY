export interface ITimeoutError {
    message: string;
    retries: number;
    status: number;
    success: boolean;
}
