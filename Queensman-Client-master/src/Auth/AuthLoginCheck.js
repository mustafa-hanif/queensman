import React, { useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Dimensions } from "react-native";
import { useAuth } from "@nhost/react-auth";
import { LinearGradient } from "expo-linear-gradient";

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
    if (!signedIn) {
      navigation.navigate("Login");
    }

    navigation.navigate("AppDrawer");
  }, [signedIn]);

  if (signedIn === null) {
    return (
      <View style={styles.container}>
        {/* background gradinet   */}
        <LinearGradient
          colors={["#000E1E", "#001E2B", "#000E1E"]}
          style={styles.gradiantStyle}
        />

        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return null;
};

export default AuthLoginCheck;
