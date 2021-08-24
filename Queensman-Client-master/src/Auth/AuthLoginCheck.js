import React, { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from "react-native";
import { useAuth } from "@nhost/react-auth";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../utils/nhost";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  gradiantStyle: {
    width: deviceWidth,
    height: deviceHeight,
    position: "absolute",
    alignSelf: "center",
  },
});

const AuthLoginCheck = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      if (auth.isAuthenticated() === false) {
        console.log("not logged in");
        navigation.navigate("Login");
      }
      const unsubscribe = auth.onAuthStateChanged(async (loggedIn) => {
        if (loggedIn) {
          setTimeout(() => {
            console.log("redirect from here 1");
            navigation.navigate("AppDrawer");
          }, 2000);
        } else {
          console.log("not logged in");
          navigation.navigate("Login");
        }
      });
      return () => {
        console.log("unmount");
        unsubscribe();
      };
    }, [auth])
  );
  return (
    <View style={styles.container}>
      {/* background gradinet   */}
      <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />

      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default AuthLoginCheck;
