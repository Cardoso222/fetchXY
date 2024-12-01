"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
class InternalServerError extends Error {
    constructor(message, status = 500, retries = 0) {
        super(message);
        this.status = status;
        this.retries = retries;
        this.name = 'InternalServerError';
        this.status = status;
        this.retries = retries;
    }
}
exports.InternalServerError = InternalServerError;
