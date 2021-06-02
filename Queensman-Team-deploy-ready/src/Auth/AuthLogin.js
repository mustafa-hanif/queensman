import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

export default class AuthLogin extends React.Component {
  constructor() {
    super();
    this.loadApp();
  }

  async componentDidMount() {

    const QueensUser = JSON.parse(await AsyncStorage.getItem("QueensUser"));
    console.log(QueensUser);
    if (QueensUser?.email) {
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
