import { createClient } from "nhost-js-sdk"

const nhostClient = createClient({
  baseURL: "https://backend-cf57bf4d.nhost.app"
})

const auth = nhostClient.auth
const storage = nhostClient.storage

export { auth, storage }
