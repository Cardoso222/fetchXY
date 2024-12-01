import { IRequestConfig, IRequestError, IResponse } from "../types";
import { InternalServerError } from "../types/exceptions/InternalServerError";
import { TimeoutError } from "../types/exceptions/TimeoutError";

export class FetchX {
    private defaultConfig: IRequestConfig;

    constructor(defaultConfig?: IRequestConfig) {
        this.defaultConfig = defaultConfig || {};
    }

    async request(config: IRequestConfig): Promise<IResponse | IRequestError> {
        const finalConfig = {...this.defaultConfig, ...config};
        const { retries, timeout = 10000 } = finalConfig;

        try {
            const response = await Promise.race<Response>([
                fetch(finalConfig.url!, {
                    method: finalConfig.method,
                    headers: finalConfig.headers,
                    body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined,
                }),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new TimeoutError('Request timeout', 408, finalConfig.retries || 0)), timeout)
                })
            ]);

            return {
                headers: response.headers,
                status: response.status,
                data: await response.json(),
                retries: finalConfig.retries || 0,
                success: response.status >= 200 && response.status < 300,
            };
        } catch (error) {
            if (retries && retries > 0) {
                return this.request({...finalConfig, retries: retries - 1});
            }

            if (error instanceof TimeoutError) {
                return error;
            }

            return new InternalServerError('Request failed', 500, finalConfig.retries || 0);
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

    delete(url: string, config: IRequestConfig = {}) {
        return this.request({...config, url, method: 'DELETE'});
    }
}
