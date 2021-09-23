import { createClient } from "nhost-js-sdk"
import { HASURA } from "../_config"
const nhostClient = createClient({
  baseURL: HASURA
})

const auth = nhostClient.auth
const storage = nhostClient.storage

export { auth, storage }
