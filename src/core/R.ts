import { IRequestConfig, IResponse } from "../types";

export class R {
    private defaultConfig: IRequestConfig;

    constructor(defaultConfig?: IRequestConfig) {
        this.defaultConfig = defaultConfig || {};
    }

    async request(config: IRequestConfig): Promise<IResponse> {
        const finalConfig = {...this.defaultConfig, ...config};
        const { retries } = finalConfig;

        try {
            const response = await fetch(finalConfig.url!, {
                method: finalConfig.method,
                headers: finalConfig.headers,
                body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined
            });

            return {
                headers: response.headers,
                status: response.status,
                data: await response.json(),
                retries: finalConfig.retries || 0,
            };
        } catch (error) {
            if (retries && retries > 0) {
                return this.request({...finalConfig, retries: retries - 1});
            }

            throw error;
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
