/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable consistent-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import React, { useEffect } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

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

import { Button, Icon, Input, Modal, VStack } from "native-base";
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

const LoginScreen = ({ navigation }) => {
  // animation ref
  const [state, setState] = React.useState({
    email: "murtaza.hanif@techinoviq.com",
    emailpage: true,
    changePasswordModal: false,
    password: "123456789",
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
  });
  const { currentLogin } = useLoginCheck();
  const isFocused = useIsFocused();

  useEffect(() => {
    setState({...state, loading: false})
    if (currentLogin && state.changePasswordModal === false) {
      navigation.navigate("AppDrawer");
    } else if (state.changePasswordModal === false) {
      navigation.navigate("Login");
    }
  }, [currentLogin, state.changePasswordModal, isFocused]);

  const toggleSwitch = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const updatePassword = () => {
    if (!state.password) {
      alert("Please provide a password");
      return;
    }
    auth
      .changePassword("0000", state.password)
      .then(() => {
        setState({ ...state, changePasswordModal: false });
        navigation.navigate("AppDrawer");
      })
      .catch((err) => {
        console.log(err);
        alert(`Error changing the password! ${err.response.data.message}`);
      });
  };

  const proceedFunctionEmail = async () => {
    const { email, password } = state;
    setState({ ...state, loading: true });
    auth
      .login({ email, password })
      .then(async (user) => {
        if (password === "0000") {
          // Its a temporary password, ask client to set a proper password
          setState({ ...state, user, loading: false, password: null, changePasswordModal: true });
        }
        await AsyncStorage.setItem("QueensUser", JSON.stringify(user));
      })
      .catch((err) => {
        console.log(err);
        console.log("error logging in!: ", err?.response?.data?.message ?? "");
        setState({ ...state, loading: false });
        alert(`Error logging in! ${err?.response?.data?.message ?? ""}`);
      });
  };

  // const CallUsFunction = () => {
  //   const url = `tel://+${state.phoneno}`;
  //   Linking.openURL(url);
  // };

  const ContectUsFuntion = () => {
    navigation.navigate("SignUpContectUs");
  };

  const onProceedButtonPress = () => {
    if (state.email === "") {
      return alert("Email cannot be empty");
    }
    if (state.password === "") {
      return alert("Password cannot be empty");
    }

    proceedFunctionEmail();
  };

  // const ForgotPassword = () => {
  //   return console.log("Forgot password will not work, its old code");
  // };

  const contactEmailHandler = () => {
    Linking.openURL("mailto:services@queensman.com");
  };

  if (currentLogin === null) {
    <View style={styles.container}>
      {/* background gradinet   */}
      <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />

      <ActivityIndicator size="large" color="#fff" />
    </View>;
  }
  return (
    <View style={styles.container} behavior="padding" enabled>
      <Modal isOpen={state.changePasswordModal}>
        <Modal.Content bgColor="yellow.50" px={8} py={8}>
          <VStack space={4}>
            <Text>Please provide a new password</Text>
            <Input
              color="black"
              value={state.password}
              onChangeText={(password) => {
                setState({ ...state, password });
              }}
              placeholder="New password type here"
            />
            <Button w="70%" onPress={() => updatePassword()}>
              Update password
            </Button>
          </VStack>
        </Modal.Content>
      </Modal>
      {/* background gradinet   */}
      <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />

      <Image style={styles.LogoStyle} source={require("../../assets/Login/Queensman_logo3.png")} />
      {/* <View style={{ paddingTop: "11%" }} /> */}

      <View>
        <View style={{ width: "100%" }}>
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
                value={state.email}
                placeholder="Email"
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                onChangeText={(email) => {
                  setState({ ...state, email });
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
                  value={state.password}
                  placeholder="Password"
                  autoCapitalize="none"
                  secureTextEntry={state.showPassword}
                  underlineColorAndroid="transparent"
                  onChangeText={(password) => {
                    setState({ ...state, password });
                  }} // password set
                />
                {state.showPassword ? (
                  <Icon
                    onPress={toggleSwitch}
                    as={<Ionicons name="eye-off" />}
                    name="eye-off"
                    style={{
                      fontSize: 25,
                      color: "#000E1E",
                    }}
                  />
                ) : (
                  <Icon
                    onPress={toggleSwitch}
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
              onProceedButtonPress();
            }}
          >
            {state.loading ? (
              <ActivityIndicator size="small" color="#fff" style={{ paddingTop: "5%" }} />
            ) : (
              <ImageBackground style={{ height: 38, width: 200 }} source={require("../../assets/Login/Proceed2.png")} />
            )}
          </TouchableOpacity>

          {/* <TouchableOpacity style={{ alignSelf: "center", paddingTop: "5%" }} onPress={ForgotPassword}>
            <Text style={{ fontSize: 15, fontFamily: "Helvetica", color: "#fff" }}>Forgot Password?</Text>
          </TouchableOpacity> */}
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

        <TouchableOpacity onPress={ContectUsFuntion}>
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

        <TouchableOpacity style={{ marginTop: "3%" }} onPress={contactEmailHandler}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Helvetica",
                color: "#fff",
              }}
            >
              Feel free to email us at{" "}
            </Text>
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
};

const useLoginCheck = () => {
  const [currentLogin, setCurrentLogin] = React.useState(false);
  useFocusEffect(
    React.useCallback(() => {
      if (auth.isAuthenticated() === false) {
        setCurrentLogin(false);
      }
      if (auth.isAuthenticated() === true) {
        setCurrentLogin(true);
      }
      const unsubscribe = auth.onAuthStateChanged(async (loggedIn) => {
        setCurrentLogin(loggedIn);
      });
      return unsubscribe;
    }, [auth])
  );

  return { currentLogin };
};

export default LoginScreen;
