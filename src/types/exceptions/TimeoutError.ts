export class TimeoutError extends Error {
    constructor(message: string, public status: number = 408, public retries: number = 0) {
        super(message);
        this.name = 'TimeoutError';
        this.status = status;
        this.retries = retries;
    }
} 