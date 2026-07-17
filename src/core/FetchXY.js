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

        const headers = {...finalConfig.headers};
        const hasContentType = Object.keys(headers).some(key => key.toLowerCase() === 'content-type');
        if (finalConfig.data && !hasContentType) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await Promise.race([
                fetch(finalConfig.url, {
                    method: finalConfig.method,
                    headers,
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
                try {
                    result.data = await response.json();
                } catch {
                    // Response body is empty or not valid JSON; leave data undefined
                }
            }

            return result;

        } catch (error) {
            const isTimeout = error.message === 'Request timeout' || error.name === 'AbortError';

            // Timeouts are retried when retryIf is empty or includes 408.
            // Network errors have no HTTP status, so they are always
            // considered transient and retried while retries remain.
            const shouldRetry = retries > 0 &&
                (isTimeout ? (retryIf.length === 0 || retryIf.includes(408)) : true);
            if (shouldRetry) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return this.request({
                    ...finalConfig,
                    retries: retries - 1,
                    attempts: attempts + 1
                });
            }

            return {
                status: isTimeout ? 408 : 0,
                attempts,
                retries: retries + attempts,
                retryDelay,
                message: isTimeout ? 'Request timeout' : error.message,
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
