import { createClient } from "nhost-js-sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HASURA } from "../_config";

const nhostClient = createClient({
  baseURL: HASURA,
  clientStorage: AsyncStorage,
  clientStorageType: "react-native",
});

const { auth, storage } = nhostClient;

export { auth, storage };
