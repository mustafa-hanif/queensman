import { createClient } from "nhost-js-sdk";

const config = {
  baseURL: "https://hasura-8106d23e.nhost.app",
};

const { auth, storage } = createClient(config);

export { auth, storage };
