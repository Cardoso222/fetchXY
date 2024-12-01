"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = void 0;
class TimeoutError extends Error {
    constructor(message, status = 408, retries = 0) {
        super(message);
        this.status = status;
        this.retries = retries;
        this.name = 'TimeoutError';
        this.status = status;
        this.retries = retries;
    }
}
exports.TimeoutError = TimeoutError;
