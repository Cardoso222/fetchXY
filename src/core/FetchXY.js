export default class FetchXY {
    constructor(defaultConfig = {}) {
        this.defaultConfig = defaultConfig;
    }

    async request(config) {
        const finalConfig = {...this.defaultConfig, ...config};
        const {
            retries = 0,
            timeout = 10000,
            retryDelay = 1000,
            retryIf = [],
            attempts = 0
        } = finalConfig;

        const controller = new AbortController();
        let timeoutId;

        try {
            const response = await Promise.race([
                fetch(finalConfig.url, {
                    method: finalConfig.method,
                    headers: finalConfig.headers,
                    body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined,
                    signal: controller.signal,
                }),
                new Promise((_, reject) => {
                    timeoutId = setTimeout(() => {
                        controller.abort();
                        reject(new Error('Request timeout'));
                    }, timeout);
                })
            ]);

            const success = response.status >= 200 && response.status < 300;
            const shouldRetry = retries > 0 && (retryIf.length > 0
                ? retryIf.includes(response.status)
                : !success);
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
                retries: retries + attempts,
                retryDelay,
                success
            };

            if (response.status !== 204) {
                result.data = await response.json();
            }

            return result;

        } catch (error) {
            const isTimeout = error.message === 'Request timeout' || error.name === 'AbortError';
            const status = isTimeout ? 408 : 500;

            const shouldRetry = retries > 0 && (retryIf.length === 0 || retryIf.includes(status));
            if (shouldRetry) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return this.request({
                    ...finalConfig,
                    retries: retries - 1,
                    attempts: attempts + 1
                });
            }

            return {
                status,
                attempts,
                retries: retries + attempts,
                retryDelay,
                message: isTimeout ? 'Request timeout' : 'Internal server error',
                success: false
            };
        } finally {
            clearTimeout(timeoutId);
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
