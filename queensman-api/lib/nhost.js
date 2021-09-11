const createClient = require('nhost-js-sdk').createClient;

const nhostClient = createClient({
  baseURL: 'https://backend-cf57bf4d.nhost.app',
})

const auth = nhostClient.auth;
const storage = nhostClient.storage;

module.exports = { auth, storage };
