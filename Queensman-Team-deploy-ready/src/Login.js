/* eslint-disable react/prop-types */
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
  KeyboardAvoidingView,
} from "react-native";

import { Font, Constants } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { Content, Icon } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth } from "./utils/nhost";
let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

let TextBoxH = deviceHeight / 15.6;

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      phoneno: "97148721301",
      passwordcheck: "",
      loading: false, //put true to start loading  false to end loading
      clientID: "",
      showPassword: true,
      workerID: "",
    };
  }

  toggleSwitch = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  proceedFunction = () => {
    this.setState({ loading: true });
    const { email, password } = this.state;
    auth
      .login({ email, password })
      .then(async ({ user }) => {
        // console.log(user);
        this.setState({ loading: false });
        await AsyncStorage.setItem("QueensUser", JSON.stringify(user));
        this.props.navigation.navigate("AppDrawer");
      })
      .catch((err) => console.log(err));
  };

  CallUsFunction = () => {
    const url = "tel://+" + this.state.phoneno;
    Linking.openURL(url);
  };

  render() {
    return (
      //content as view type  and touch exit
      // <Content scrollEnabled={false} style={{ flex:1}}>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        {/* background gradinet   */}
        <LinearGradient
          colors={["#000E1E", "#001E2B", "#000E1E"]}
          style={styles.gradiantStyle}
        ></LinearGradient>

        <Image
          style={styles.LogoStyle}
          source={require("../assets/Login/Queensman_logo3.png")}
        />

        {/* checking if to change email and password Component */}

        <Text
          style={{ fontSize: 20, /* fontFamily: 'serif', */ color: "#FFCA5D" }}
        >
          TEAM LOGIN
        </Text>

        <View style={{ height: "8%" }}></View>
        <ImageBackground
          style={{ height: 43, width: 280 }}
          source={require("../assets/Login/Username_field3.png")}
        >
          <View
            style={{
              justifyContent: "center",
              paddingLeft: "15%",
            }}
          >
            <TextInput
              keyboardType="email-address"
              ref="textInputMobile"
              style={{
                fontSize: 15,
                height: "100%",
                paddingLeft: 8,
              }}
              placeholder="Email"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              onChangeText={(email) => {
                this.setState({ email });
              }} //email set
            />
          </View>
        </ImageBackground>

        <View style={{ paddingVertical: "3%", width: 280 }}></View>

        <ImageBackground
          style={{ width: 280, height: 43 }}
          source={require("../assets/Login/Password_field4.png")}
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
              ref="textInputMobile"
              style={{
                fontSize: 15,
                //fontFamily: 'serif',
                width: "80%",
              }}
              placeholder="Password"
              autoCapitalize="none"
              secureTextEntry={this.state.showPassword}
              underlineColorAndroid="transparent"
              onChangeText={(password) => {
                this.setState({ password });
              }} //password set
            />
            {this.state.showPassword ? (
              <Icon
                onPress={this.toggleSwitch}
                name="eye-off"
                style={{
                  paddingTop: "2%",
                  fontSize: 25,
                  color: "#000E1E",
                  paddingRight: "4%",
                }}
              ></Icon>
            ) : (
              <Icon
                onPress={this.toggleSwitch}
                name="eye"
                style={{
                  paddingTop: "2%",
                  fontSize: 25,
                  color: "#000E1E",
                  paddingRight: "4%",
                }}
              ></Icon>
            )}
          </View>
        </ImageBackground>

        <View style={{ paddingVertical: "3%" }}></View>
        <TouchableOpacity
          style={{ width: 200, height: 38 }}
          onPress={this.proceedFunction}
        >
          <ImageBackground
            style={{ width: 200, height: 38 }}
            source={require("../assets/Login/Proceed2.png")}
          ></ImageBackground>
        </TouchableOpacity>

        {this.state.loading ? (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ paddingTop: "5%" }}
          />
        ) : (
          <View></View>
        )}

        {/* call us */}
        <View
          style={{
            borderBottomColor: "#FFCA5D",
            borderBottomWidth: 1,
            width: 280,
            paddingTop: "17%",
            alignSelf: "center",
          }}
        ></View>
        <TouchableOpacity onPress={this.CallUsFunction}>
          <View style={{ flexDirection: "column", paddingTop: "5%" }}>
            <Text
              style={{
                fontSize: 11,
                // fontFamily: 'serif',
                color: "#fff",
                alignSelf: "center",
              }}
            >
              Facing any issues?
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{ height: 18, width: 18, marginTop: "3%" }}
                source={require("../assets/Login/Phone.png")}
              />
              <Text> </Text>
              <Text
                style={{
                  fontSize: 20,
                  // fontFamily: 'serif',
                  color: "#FFCA5D",
                }}
              >
                CALL US NOW
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      // </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
  },
});
