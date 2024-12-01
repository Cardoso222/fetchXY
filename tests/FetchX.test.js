const assert = require('assert');
const FetchX = require('../dist/index').default;

(async function testRGet() {
    global.fetch = async (url, options) => {
        assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');
        assert.strictEqual(options.method, 'GET', 'Incorrect HTTP Method');
        return {
            json: async () => ({ success: true }),
            status: 200,
            headers: new Map(),
        };
    };

    const response = await FetchX.get('https://exampleDomain.com');
    assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');

    console.log('✅ GET method test passed!');
})();

(async function testRPost() {
    global.fetch = async (url, options) => {
        assert.strictEqual(options.method, 'POST', 'Incorrect HTTP Method');
        assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');

        return {
            json: async () => ({ success: true }),
            status: 200,
            headers: new Map(),
        };
    };

    const response = await FetchX.post('https://exampleDomain.com', { data: { fact: 'Cats are awesome' } });
    assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');

    console.log('✅ POST method test passed!');
})();

(async function testRPut() {
    global.fetch = async (url, options) => {
        assert.strictEqual(options.method, 'PUT', 'Incorrect HTTP Method');
        assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');

        return {
            json: async () => ({ success: true }),
            status: 200,
            headers: new Map(),
        };
    };

    const response = await FetchX.put('https://exampleDomain.com', { data: { fact: 'Cats are awesome' } });
    assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');

    console.log('✅ PUT method test passed!');
})();

(async function testRDelete() {
    global.fetch = async (url, options) => {
        assert.strictEqual(options.method, 'DELETE', 'Incorrect HTTP Method');
        assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');

        return {
            json: async () => ({ success: true }),
            status: 200,
            headers: new Map(),
        };
    };

    const response = await FetchX.delete('https://exampleDomain.com');
    assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');

    console.log('✅ DELETE method test passed!');
})();

(async function testRRetries() {

    global.fetch = async (url, options) => {
        assert.strictEqual(options.method, 'GET', 'Incorrect HTTP Method');
        assert.strictEqual(url, 'https://exampleDomain.com', 'Incorrect URL');
        return {
            json: async () => ({ success: false }),
            status: 400,
            headers: new Map(),
        };
    };

    const response = await FetchX.get('https://exampleDomain.com', { retries: 2 });
    assert.strictEqual(response.retries, 2, 'Incorrect number of retries');

    console.log('✅ Retries test passed!');
})();

(async function testRTimeout() {
    global.fetch = async (url, options) => {
        await new Promise(resolve => setTimeout(resolve, 10000));
    };

    const response = await FetchX.get('https://exampleDomain.com', { timeout: 100 });
    assert.strictEqual(response.status, 408, 'Incorrect HTTP Status');
    assert.strictEqual(response.retries, 0, 'Incorrect number of retries');
    assert.strictEqual(response.data, undefined, 'Incorrect data');

    console.log('✅ Timeout test passed!');
})();

(async function testRInternalServerError() {
    global.fetch = async (url, options) => {
        return {
            json: async () => ({ success: false }),
            status: 500,
            headers: new Map(),
        };
    };

    const response = await FetchX.get('https://exampleDomain.com', { retries: 2 });
    assert.strictEqual(response.status, 500, 'Incorrect HTTP Status');
    assert.strictEqual(response.retries, 2, 'Incorrect number of retries');

    console.log('✅ Internal server error test passed!');
})();

