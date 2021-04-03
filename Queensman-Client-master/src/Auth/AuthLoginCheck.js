import React, { useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from "react-native";
import { useAuth } from "@nhost/react-auth";
import { LinearGradient } from "expo-linear-gradient";
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
  const { signedIn } = useAuth();
  useEffect(() => {
    console.log({ signedIn });
    if (!signedIn) {
      navigation.navigate("Login");
    } else {
      console.log("ye bhi chalra");
      navigation.navigate("AppDrawer");
    }
  }, [signedIn]);

  if (signedIn === null) {
    return (
      <View style={styles.container}>
        {/* background gradinet   */}
        <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />

        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return (
    <View>
      <Text>Hi</Text>
    </View>
  );
};

export default AuthLoginCheck;
