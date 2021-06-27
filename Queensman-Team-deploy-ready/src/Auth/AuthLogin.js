/* eslint-disable react/prop-types */
import React from "react";
import { StyleSheet, View, ActivityIndicator, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../utils/nhost";
import AsyncStorage from "@react-native-async-storage/async-storage";

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

export default class AuthLogin extends React.Component {
  constructor() {
    super();
    this.loadApp();
  }

  async componentDidMount() {
    const user = await AsyncStorage.getItem("QueensUser");
    // const email = auth?.currentSession?.session?.user.email;
    const email = user && JSON.parse(user.email);
    console.log({ email });
    console.log("In AuthLogin", { email });
    if (email) {
      this.props.navigation.navigate("AppDrawer");
    } else {
      this.props.navigation.navigate("Login");
    }

    //Login  ko hata kar  AppDrawer kardana kud home kulay ga
  }

  loadApp = async () => {};

  render() {
    return (
      <View style={styles.container}>
        {/* background gradinet   */}
        <LinearGradient
          colors={["#000E1E", "#001E2B", "#000E1E"]}
          style={styles.gradiantStyle}
        ></LinearGradient>

        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
}

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
