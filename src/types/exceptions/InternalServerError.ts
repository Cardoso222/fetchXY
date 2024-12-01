export class InternalServerError extends Error {
    constructor(message: string, public status: number = 500, public retries: number = 0) {
        super(message);
        this.name = 'InternalServerError';
        this.status = status;
        this.retries = retries;
    }
}
