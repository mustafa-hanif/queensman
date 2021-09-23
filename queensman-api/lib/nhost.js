const createClient = require('nhost-js-sdk').createClient;
const { HASURA } = require("../_config")

const nhostClient = createClient({
  baseURL: HASURA,
})

const auth = nhostClient.auth;
const storage = nhostClient.storage;

module.exports = { auth, storage };
