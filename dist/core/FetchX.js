"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchX = void 0;
const InternalServerError_1 = require("../types/exceptions/InternalServerError");
const TimeoutError_1 = require("../types/exceptions/TimeoutError");
class FetchX {
    constructor(defaultConfig) {
        this.defaultConfig = defaultConfig || {};
    }
    request(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalConfig = Object.assign(Object.assign({}, this.defaultConfig), config);
            const { retries, timeout = 10000 } = finalConfig;
            try {
                const response = yield Promise.race([
                    fetch(finalConfig.url, {
                        method: finalConfig.method,
                        headers: finalConfig.headers,
                        body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined,
                    }),
                    new Promise((_, reject) => {
                        setTimeout(() => reject(new TimeoutError_1.TimeoutError('Request timeout', 408, finalConfig.retries || 0)), timeout);
                    })
                ]);
                return {
                    headers: response.headers,
                    status: response.status,
                    data: yield response.json(),
                    retries: finalConfig.retries || 0,
                    success: response.status >= 200 && response.status < 300,
                };
            }
            catch (error) {
                if (retries && retries > 0) {
                    return this.request(Object.assign(Object.assign({}, finalConfig), { retries: retries - 1 }));
                }
                if (error instanceof TimeoutError_1.TimeoutError) {
                    return error;
                }
                return new InternalServerError_1.InternalServerError('Request failed', 500, finalConfig.retries || 0);
            }
        });
    }
    get(url, config = {}) {
        return this.request(Object.assign(Object.assign({}, config), { url, method: 'GET' }));
    }
    post(url, config = {}) {
        return this.request(Object.assign(Object.assign({}, config), { url, method: 'POST' }));
    }
    put(url, config = {}) {
        return this.request(Object.assign(Object.assign({}, config), { url, method: 'PUT' }));
    }
    delete(url, config = {}) {
        return this.request(Object.assign(Object.assign({}, config), { url, method: 'DELETE' }));
    }
}
exports.FetchX = FetchX;
