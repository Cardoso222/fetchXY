export default class FetchXY {
    constructor(defaultConfig = {}) {
        this.defaultConfig = defaultConfig;
    }

    async request(config) {
        const finalConfig = {...this.defaultConfig, ...config};
        const { 
            retries, 
            timeout = 10000, 
            retryDelay = 1000, 
            retryIf = [], 
            attempts = 0 
        } = finalConfig;

        try {
            const response = await Promise.race([
                fetch(finalConfig.url, {
                    method: finalConfig.method,
                    headers: finalConfig.headers,
                    body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined,
                }),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Request timeout')), timeout);
                })
            ]);

            const shouldRetry = retryIf.includes(response.status) && retries && retries > 0;
            if (shouldRetry) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return this.request({
                    ...finalConfig, 
                    retries: retries - 1, 
                    attempts: attempts + 1
                });
            }

            const result = {
                headers: response.headers,
                status: response.status,
                attempts,
                retries: finalConfig.retries || 0,
                retryDelay: finalConfig.retryDelay || 1000,
                success: response.status >= 200 && response.status < 300
            };

            if (response.status !== 204) {
                result.data = await response.json();
            }

            return result;

        } catch (error) {
            if (error.message === 'Request timeout') {
                return {
                    status: 408,
                    attempts,
                    message: 'Request timeout',
                    success: false
                };
            }

            const shouldRetry = retryIf.includes(500) && retries && retries > 0;
            if (shouldRetry) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return this.request({
                    ...finalConfig, 
                    retries: retries - 1, 
                    attempts: attempts + 1
                });
            }

            return {
                status: 500,
                attempts,
                message: 'Internal server error',
                success: false
            };
        }
    }

    get(url, config = {}) {
        return this.request({...config, url, method: 'GET'});
    }

    post(url, config = {}) {
        return this.request({...config, url, method: 'POST'});
    }

    put(url, config = {}) {
        return this.request({...config, url, method: 'PUT'});
    }

    patch(url, config = {}) {
        return this.request({...config, url, method: 'PATCH'});
    }

    delete(url, config = {}) {
        return this.request({...config, url, method: 'DELETE'});
    }
}
