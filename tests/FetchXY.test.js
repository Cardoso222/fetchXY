import assert from 'assert';
import { describe, beforeEach, afterEach, it } from 'node:test';
import FetchXY from '../src/core/FetchXY.js';

describe('FetchXY', () => {
    let originalFetch;
    let client;
    beforeEach(() => {
        // Store the original fetch if it exists
        originalFetch = global.fetch;
        client = new FetchXY();
    });

    afterEach(() => {
        // Restore the original fetch after each test
        global.fetch = originalFetch;
        client = null;
    });

    it('should handle GET requests correctly', async () => {
        global.fetch = async (url, options) => {
            assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');
            assert.strictEqual(options.method, 'GET', 'Incorrect HTTP Method');
            return {
                json: async () => ({ success: true }),
                status: 200,
                headers: new Map(),
            };
        };

        const response = await client.get('https://exampleDomain.com');
        assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');
    });

    it('should handle POST requests correctly', async () => {
        global.fetch = async (url, options) => {
            assert.strictEqual(options.method, 'POST', 'Incorrect HTTP Method');
            assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');
            return {
                json: async () => ({ success: true }),
                status: 200,
                headers: new Map(),
            };
        };

        const response = await client.post('https://exampleDomain.com', { data: { fact: 'Cats are awesome' } });
        assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');
    });

    it('should handle PUT requests correctly', async () => {
        global.fetch = async (url, options) => {
            assert.strictEqual(options.method, 'PUT', 'Incorrect HTTP Method');
            assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');
            return {
                json: async () => ({ success: true }),
                status: 200,
                headers: new Map(),
            };
        };

        const response = await client.put('https://exampleDomain.com', { data: { fact: 'Cats are awesome' } });
        assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');
    });

    it('should handle PATCH requests correctly', async () => {
        global.fetch = async (url, options) => {
            assert.strictEqual(options.method, 'PATCH', 'Incorrect HTTP Method');
            assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');
            return {
                json: async () => ({ success: true }),
                status: 200,
                headers: new Map(),
            };
        };

        const response = await client.patch('https://exampleDomain.com', { data: { fact: 'Cats are awesome' } });
        assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');
    });

    it('should handle DELETE requests correctly', async () => {
        global.fetch = async (url, options) => {
            assert.strictEqual(options.method, 'DELETE', 'Incorrect HTTP Method');
            assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');
            return {
                json: async () => ({ success: true }),
                status: 200,
                headers: new Map(),
            };
        };

        const response = await client.delete('https://exampleDomain.com');
        assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');
    });

    it('should handle timeouts correctly', async () => {
        global.fetch = async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
        };

        const response = await client.get('https://exampleDomain.com', { timeout: 10 });
        assert.strictEqual(response.status, 408, 'Incorrect HTTP Status');
        assert.strictEqual(response.data, undefined, 'Incorrect data');
    });

    it('should handle retry delays correctly', async () => {
        global.fetch = async () => {
            return {
                json: async () => ({ success: false }),
                status: 500,
                headers: new Map(),
            };
        };

        const timeBeforeRequest = Date.now();
        const response = await client.get('https://exampleDomain.com', { 
            retries: 2, 
            retryDelay: 50,
            retryIf: [500] 
        });
        const timeAfterResponse = Date.now();
        
        assert.strictEqual(response.attempts, 2, 'Incorrect number of attempts');
        assert.strictEqual(response.retryDelay, 50, 'Incorrect retry delay');
        assert.ok(timeAfterResponse - timeBeforeRequest >= 50, 'Retry delay should be at least 50ms');
    });

    it('should handle internal server errors correctly', async () => {
        global.fetch = async () => {
            return {
                json: async () => ({ success: false }),
                status: 500,
                headers: new Map(),
            };
        };

        const response = await client.get('https://exampleDomain.com', { 
            retries: 2, 
            retryIf: [500] 
        });
        assert.strictEqual(response.status, 500, 'Incorrect HTTP Status');
        assert.strictEqual(response.attempts, 2, 'Incorrect number of attempts');
    });

    it('should handle retries correctly', async () => {
        global.fetch = async (url, options) => {
            assert.strictEqual(options.method, 'GET', 'Incorrect HTTP Method');
            assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');
            return {
                json: async () => ({ success: false }),
                status: 400,
                headers: new Map(),
            };
        };

        const response = await client.get('https://exampleDomain.com', {
            retries: 2,
            retryIf: [400]
        });
        assert.strictEqual(response.attempts, 2, 'Incorrect number of attempts');
    });

    it('should not retry successful responses when retryIf is empty', async () => {
        let fetchCalls = 0;
        global.fetch = async () => {
            fetchCalls++;
            return {
                json: async () => ({ success: true }),
                status: 200,
                headers: new Map(),
            };
        };

        const response = await client.get('https://exampleDomain.com', {
            retries: 3,
            retryDelay: 10
        });
        assert.strictEqual(fetchCalls, 1, 'Should not retry a successful response');
        assert.strictEqual(response.attempts, 0, 'Incorrect number of attempts');
        assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');
        assert.strictEqual(response.success, true, 'Incorrect success flag');
    });

    it('should retry failed responses when retryIf is empty', async () => {
        let fetchCalls = 0;
        global.fetch = async () => {
            fetchCalls++;
            return {
                json: async () => ({ success: false }),
                status: 503,
                headers: new Map(),
            };
        };

        const response = await client.get('https://exampleDomain.com', {
            retries: 2,
            retryDelay: 10
        });
        assert.strictEqual(fetchCalls, 3, 'Should retry until retries are exhausted');
        assert.strictEqual(response.attempts, 2, 'Incorrect number of attempts');
        assert.strictEqual(response.status, 503, 'Incorrect HTTP Status');
    });

    it('should stop retrying as soon as a request succeeds', async () => {
        let fetchCalls = 0;
        global.fetch = async () => {
            fetchCalls++;
            return {
                json: async () => ({}),
                status: fetchCalls < 2 ? 500 : 200,
                headers: new Map(),
            };
        };

        const response = await client.get('https://exampleDomain.com', {
            retries: 5,
            retryDelay: 10,
            retryIf: [500]
        });
        assert.strictEqual(fetchCalls, 2, 'Should stop retrying after success');
        assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');
        assert.strictEqual(response.attempts, 1, 'Incorrect number of attempts');
    });

    it('should retry on timeout', async () => {
        let fetchCalls = 0;
        global.fetch = async () => {
            fetchCalls++;
            await new Promise(resolve => setTimeout(resolve, 50));
        };

        const response = await client.get('https://exampleDomain.com', {
            timeout: 10,
            retries: 2,
            retryDelay: 10,
            retryIf: [408]
        });
        assert.strictEqual(fetchCalls, 3, 'Should retry timed out requests');
        assert.strictEqual(response.status, 408, 'Incorrect HTTP Status');
        assert.strictEqual(response.attempts, 2, 'Incorrect number of attempts');
    });

    it('should not retry on timeout when retryIf excludes 408', async () => {
        let fetchCalls = 0;
        global.fetch = async () => {
            fetchCalls++;
            await new Promise(resolve => setTimeout(resolve, 50));
        };

        const response = await client.get('https://exampleDomain.com', {
            timeout: 10,
            retries: 2,
            retryDelay: 10,
            retryIf: [500]
        });
        assert.strictEqual(fetchCalls, 1, 'Should not retry when 408 is not in retryIf');
        assert.strictEqual(response.status, 408, 'Incorrect HTTP Status');
    });

    it('should handle network errors correctly', async () => {
        global.fetch = async () => {
            throw new TypeError('fetch failed');
        };

        const response = await client.get('https://exampleDomain.com');
        assert.strictEqual(response.status, 0, 'Network errors should have status 0');
        assert.strictEqual(response.success, false, 'Incorrect success flag');
        assert.strictEqual(response.message, 'fetch failed', 'Should preserve the original error message');
    });

    it('should retry network errors while retries remain', async () => {
        let fetchCalls = 0;
        global.fetch = async () => {
            fetchCalls++;
            throw new TypeError('fetch failed');
        };

        const response = await client.get('https://exampleDomain.com', {
            retries: 2,
            retryDelay: 10,
            retryIf: [500]
        });
        assert.strictEqual(fetchCalls, 3, 'Should retry network errors');
        assert.strictEqual(response.status, 0, 'Incorrect status');
        assert.strictEqual(response.attempts, 2, 'Incorrect number of attempts');
    });

    it('should handle non-JSON response bodies gracefully', async () => {
        global.fetch = async () => {
            return {
                json: async () => { throw new SyntaxError('Unexpected token'); },
                status: 200,
                headers: new Map(),
            };
        };

        const response = await client.get('https://exampleDomain.com');
        assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');
        assert.strictEqual(response.success, true, 'Incorrect success flag');
        assert.strictEqual(response.data, undefined, 'Data should be undefined for non-JSON bodies');
    });

    it('should set Content-Type header automatically when sending data', async () => {
        let sentHeaders;
        global.fetch = async (url, options) => {
            sentHeaders = options.headers;
            return {
                json: async () => ({}),
                status: 200,
                headers: new Map(),
            };
        };

        await client.post('https://exampleDomain.com', { data: { name: 'test' } });
        assert.strictEqual(sentHeaders['Content-Type'], 'application/json', 'Should default Content-Type to application/json');
    });

    it('should not override a user-provided Content-Type header', async () => {
        let sentHeaders;
        global.fetch = async (url, options) => {
            sentHeaders = options.headers;
            return {
                json: async () => ({}),
                status: 200,
                headers: new Map(),
            };
        };

        await client.post('https://exampleDomain.com', {
            data: { name: 'test' },
            headers: { 'content-type': 'application/vnd.api+json' }
        });
        assert.strictEqual(sentHeaders['content-type'], 'application/vnd.api+json', 'Should keep user-provided Content-Type');
        assert.strictEqual(sentHeaders['Content-Type'], undefined, 'Should not add a duplicate Content-Type');
    });

    it('should report the originally configured number of retries', async () => {
        global.fetch = async () => {
            return {
                json: async () => ({}),
                status: 500,
                headers: new Map(),
            };
        };

        const response = await client.get('https://exampleDomain.com', {
            retries: 3,
            retryDelay: 10,
            retryIf: [500]
        });
        assert.strictEqual(response.retries, 3, 'Should report the original retries value');
        assert.strictEqual(response.attempts, 3, 'Incorrect number of attempts');
    });
});