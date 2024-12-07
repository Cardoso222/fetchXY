import { IRequestConfig, IRequestConfigWithRetries, IRequestError, IResponse } from "../types";
import { InternalServerError } from "../types/exceptions/InternalServerError";
import { TimeoutError } from "../types/exceptions/TimeoutError";

export class FetchXY {
    private defaultConfig: IRequestConfig;

    constructor(defaultConfig?: IRequestConfig) {
        this.defaultConfig = defaultConfig || {};
    }

    async request(config: IRequestConfig | IRequestConfigWithRetries): Promise<IResponse | IRequestError> {
        const finalConfig = {...this.defaultConfig, ...config} as IRequestConfigWithRetries;

        const { retries, timeout = 10000, retryDelay = 1000, retryIf = [], attempts = 0 } = finalConfig;

        try {
            const response = await Promise.race<Response>([
                fetch(finalConfig.url!, {
                    method: finalConfig.method,
                    headers: finalConfig.headers,
                    body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined,
                }),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new TimeoutError('Request timeout', 408, attempts)), timeout)
                })
            ]);

            const shouldRetry = retryIf.includes(response.status) && retries && retries > 0;
            if (shouldRetry) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return this.request({...finalConfig, retries: retries - 1, attempts: attempts + 1});
            }

            return {
                headers: response.headers,
                status: response.status,
                data: await response.json(),
                attempts: attempts,
                retries: finalConfig.retries || 0,
                retryDelay: finalConfig.retryDelay || 1000,
                success: response.status >= 200 && response.status < 300,
            };
        } catch (error) {
            if (error instanceof TimeoutError) {
                return error;
            }

            const shouldRetry = retryIf.includes(500) && retries && retries > 0;
            if (shouldRetry) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return this.request({...finalConfig, retries: retries - 1, attempts: attempts + 1});
            }

            return new InternalServerError('Request failed', 500, attempts);
        }
    }

    get(url: string, config: IRequestConfig = {}) {
        return this.request({...config, url, method: 'GET'});
    }

    post(url: string, config: IRequestConfig = {}) {
        return this.request({...config, url, method: 'POST'});
    }

    put(url: string, config: IRequestConfig = {}) {
        return this.request({...config, url, method: 'PUT'});
    }

    patch(url: string, config: IRequestConfig = {}) {
        return this.request({...config, url, method: 'PATCH'});
    }

    delete(url: string, config: IRequestConfig = {}) {
        return this.request({...config, url, method: 'DELETE'});
    }
}
