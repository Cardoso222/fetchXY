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
exports.R = void 0;
class R {
    constructor(defaultConfig) {
        this.defaultConfig = defaultConfig || {};
    }
    request(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalConfig = Object.assign(Object.assign({}, this.defaultConfig), config);
            const { retries } = finalConfig;
            try {
                const response = yield fetch(finalConfig.url, {
                    method: finalConfig.method,
                    headers: finalConfig.headers,
                    body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined
                });
                return {
                    headers: response.headers,
                    status: response.status,
                    data: yield response.json(),
                    retries: finalConfig.retries || 0,
                };
            }
            catch (error) {
                if (retries && retries > 0) {
                    return this.request(Object.assign(Object.assign({}, finalConfig), { retries: retries - 1 }));
                }
                throw error;
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
exports.R = R;
