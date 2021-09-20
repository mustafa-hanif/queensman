import { createClient } from "nhost-js-sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";

const nhostClient = createClient({
  baseURL: "https://backend-cf57bf4d.nhost.app",
  clientStorage: AsyncStorage,
  clientStorageType: "react-native",
});

const { auth, storage } = nhostClient;

export { auth, storage };
