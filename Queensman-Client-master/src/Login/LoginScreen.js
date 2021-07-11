/* eslint-disable react/no-unescaped-entities */
/* eslint-disable consistent-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../utils/nhost";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: "30%",
    paddingHorizontal: "12%",
  },
  gradiantStyle: {
    width: deviceWidth,
    height: deviceHeight,
    position: "absolute",
    alignSelf: "center",
  },
  LogoStyle: {
    height: 230,
    width: 230,
    marginBottom: "10%",
  },
});

export default class LoginScreen extends React.Component {
  // animation ref

  constructor(props) {
    super(props);

    this.state = {
      email: "bashir.khawaja@gmail.com",
      emailpage: true,
      password: "Simple12",
      phoneno: "97148721301",
      passwordcheck: "",
      newpassword: "check",
      loading: false, // put true to start loading  false to end loading
      user: {},
      length: 8,
      subject: "Account details for Queensman Spades Portal.",
      to: "",
      message: "Your Account password is: ",
      isVerficationCodeModalVisible: true,
      clientID: "",
      connections: true,
      showPassword: true,
      retrievedID: "",
    };

    this.textInputMobile = React.createRef();
    this.handleViewRef = React.createRef();
    this.customToast = React.createRef();
    this.handleViewRefs = React.createRef();
  }

  async componentDidMount() {
    console.log("here LoginScreen");
    // this.checkDeviceForHardware();
    // this.checkForFingerprints();
  }

  toggleSwitch = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  proceedFunctionEmail = async () => {
    const { email, password } = this.state;

    auth
      .login({ email, password })
      .then(async (user) => {
        this.setState({ user, loading: false });
        console.log(user);
        await AsyncStorage.setItem("QueensUser", JSON.stringify(user));
        this.props.navigation.navigate("AppDrawer");
      })
      .catch((err) => {
        alert("Error signing in. The password you entered might be incorrect. ");
        console.log("error signing in!: ", err);
        this.setState({ loading: false });
      });
  };

  CallUsFunction = () => {
    const url = `tel://+${this.state.phoneno}`;
    Linking.openURL(url);
  };

  ContectUsFuntion = () => {
    this.props.navigation.navigate("SignUpContectUs");
  };

  onProceedButtonPress = () => {
    if (this.state.email === "") {
      return alert("Email cannot be empty");
    }
    if (this.state.password === "") {
      return alert("Password cannot be empty");
    }

    this.proceedFunctionEmail();
  };

  ForgotPassword = () => {
    return console.log("Forgot password will not work, its old code");
  };

  contactEmailHandler = () => {
    Linking.openURL("mailto:services@queensman.com");
  };

  render() {
    return (
      <View style={styles.container} behavior="padding" enabled>
        {/* background gradinet   */}
        <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />

        <Image style={styles.LogoStyle} source={require("../../assets/Login/Queensman_logo3.png")} />
        {/* <View style={{ paddingTop: "11%" }} /> */}

        <View>
          <View style={{ width: "100%" }} ref={this.handleViewRef}>
            <ImageBackground
              style={{
                height: 43,
                width: 280,
                alignSelf: "center",
                justifyContent: "center",
              }}
              source={require("../../assets/Login/Username_field3.png")}
            >
              <View style={{ justifyContent: "center", paddingLeft: "15%" }}>
                <TextInput
                  keyboardType="email-address"
                  style={{ fontSize: 15, fontFamily: "Helvetica" }}
                  value={this.state.email}
                  placeholder="Email"
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  onChangeText={(email) => {
                    this.setState({ email });
                  }} // email set
                />
              </View>
            </ImageBackground>

            <View style={{ width: "100%", alignItems: "center", marginTop: "8%" }}>
              <ImageBackground
                style={{ width: 280, height: 43 }}
                source={require("../../assets/Login/Password_field4.png")}
              >
                <View
                  style={{
                    justifyContent: "center",
                    paddingTop: "2%",
                    paddingLeft: "15%",
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    style={{
                      fontSize: 15,
                      fontFamily: "Helvetica",
                      width: "80%",
                    }}
                    value={this.state.password}
                    placeholder="Password"
                    autoCapitalize="none"
                    secureTextEntry={this.state.showPassword}
                    underlineColorAndroid="transparent"
                    onChangeText={(password) => {
                      this.setState({ password });
                    }} // password set
                  />
                  {this.state.showPassword ? (
                    <Icon
                      onPress={this.toggleSwitch}
                      as={<Ionicons name="eye-off" />}
                      name="eye-off"
                      style={{
                        fontSize: 25,
                        color: "#000E1E",
                      }}
                    />
                  ) : (
                    <Icon
                      onPress={this.toggleSwitch}
                      as={<Ionicons name="eye" />}
                      name="eye"
                      style={{
                        fontSize: 25,
                        color: "#000E1E",
                      }}
                    />
                  )}
                </View>
              </ImageBackground>
            </View>

            <View style={{ paddingVertical: "5%", width: 280 }} />
            <TouchableOpacity
              style={{ height: 38, width: 200, alignSelf: "center" }}
              onPress={() => {
                this.onProceedButtonPress();
              }}
            >
              {this.state.loading ? (
                <ActivityIndicator size="small" color="#fff" style={{ paddingTop: "5%" }} />
              ) : (
                <ImageBackground
                  style={{ height: 38, width: 200 }}
                  source={require("../../assets/Login/Proceed2.png")}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={{ alignSelf: "center", paddingTop: "5%" }} onPress={this.ForgotPassword}>
              <Text style={{ fontSize: 15, fontFamily: "Helvetica", color: "#fff" }}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              borderBottomColor: "#FFCA5D",
              borderBottomWidth: 1,
              width: 280,
              paddingTop: "17%",
              alignSelf: "center",
              justifyContent: "center",
            }}
          />

          <TouchableOpacity onPress={this.ContectUsFuntion}>
            <View style={{ flexDirection: "column", paddingTop: "5%", alignSelf: "center" }}>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica", color: "#fff" }}>Haven't registered yet?</Text>

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Helvetica",
                  color: "#FFCA5D",
                  textDecorationLine: "underline",
                }}
              >
                CONTACT US
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: "3%" }} onPress={this.contactEmailHandler}>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ 
                fontSize: 11, 
                fontFamily: "Helvetica", 
                color: "#fff" 
              }}>Feel free to email us at </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Helvetica",
                  color: "#FFCA5D",
                }}
              >
                services@queensman.com
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
