import { createClient } from "nhost-js-sdk"

const nhostClient = createClient({
  baseURL: "https://backend-8106d23e.nhost.app"
})

const auth = nhostClient.auth
const storage = nhostClient.storage

export { auth, storage }
