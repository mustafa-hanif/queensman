const createClient = require('nhost-js-sdk').createClient;

const nhostClient = createClient({
  baseURL: 'https://backend-8106d23e.nhost.app',
})

const auth = nhostClient.auth;
const storage = nhostClient.storage;

module.exports = { auth, storage };
