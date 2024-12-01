const assert = require('assert');
const R = require('../dist/index').default;

(async function testRGet() {
    global.fetch = async (url, options) => {
        assert.strictEqual(url, 'https://cat-fact.herokuapp.com/facts', 'Incorrect URL');
        assert.strictEqual(options.method, 'GET', 'Incorrect HTTP Method');
        return {
            json: async () => ({ success: true }),
            status: 200,
            headers: new Map(),
        };
    };

    const response = await R.get('https://cat-fact.herokuapp.com/facts');
    assert.strictEqual(response.status, 200, 'Incorrect HTTP Status');

    console.log('✅ GET method test passed!');
})();

(async function testRPost() {

})();

(async function testRPut() {

})();

(async function testRDelete() {

})();

(async function testRRetries() {

    global.fetch = async (url, options) => {
        assert.strictEqual(options.method, 'GET', 'Incorrect HTTP Method');
        assert.strictEqual(url, 'https://invalidDomain.com', 'Incorrect URL');
        return {
            json: async () => ({ success: false }),
            status: 400,
            headers: new Map(),
        };
    };

    const response = await R.get('https://invalidDomain.com', { retries: 2 });
    assert.strictEqual(response.retries, 2, 'Incorrect number of retries');

    console.log('✅ Retries test passed!');
})();
