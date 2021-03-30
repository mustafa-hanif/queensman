/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
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

import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import NetInfo from "@react-native-community/netinfo";

import { Icon } from "native-base";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import * as LocalAuthentication from "expo-local-authentication";
import Constants from "expo-constants";

import Toast from "react-native-whc-toast";
import { auth } from "../utils/nhost";
import { endpoint } from "../constants/Endpoint";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const TextBoxH = deviceHeight / 15.6;

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
    marginBottom: "10%",
  },
});

async function storePass(pass) {
  try {
    await AsyncStorage.setItem("QueensPass", pass);
  } catch (error) {
    // Error saving data
  }
}

export default class LoginScreen extends React.Component {
  // animation ref

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      emailpage: true,
      password: "",
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
    this.checkDeviceForHardware();
    this.checkForFingerprints();
  }

  toggleSwitch = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  checkDeviceForHardware = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    this.setState({ compatible });
  };

  checkForFingerprints = async () => {
    const fingerprints = await LocalAuthentication.isEnrolledAsync();
    this.setState({ fingerprints });
  };

  scanFingerprint = async () => {
    const result = await LocalAuthentication.authenticateAsync(
      "Scan your finger."
    );
    // console.log('Scan Result:', result.success)
    if (result.success) {
      const link = `${endpoint}queens_client_Apis/fetchDeviceID.php?email=${this.state.email}`;
      console.log(link);
      axios.get(link).then((result) => {
        console.log(`result${result.data.server_responce.stored_device_id}`);
        if (
          result.data.server_responce.stored_device_id ==
          Constants.installationId
        ) {
          const { email } = this.state;
          const password = this.state.passwordcheck;
          auth
            .signIn({ email, password })
            .then((user) => {
              this.setState({ user });
              // this.refs.customToast.show("Successful sign in!");
              console.log("successful sign in!");
            })
            .catch((err) => {
              alert("Error signing in! ");
              console.log("error signing in!: ", err);
              this.setState({ loading: false });
            });
          console.log("off to the home hehe");
          this.props.navigation.navigate("AppDrawer");
        } else {
          this.customToast.show("Fingerprint not enabled on this phone.");
        }
      });
    } else {
      // alert("Fingerprint not recognized!")
      this.customToast.show("Fingerprint not recognized!");
      if (Constants.platform.android) {
        this.scanFingerprint();
      }
    }
  };

  proceedFunctionEmail = () => {
    NetInfo.fetch().then((isConnected) => {
      this.setState({ connections: !!isConnected });
    });

    if (this.state.connections) {
      this.setState({
        loading: true,
      });
      // alert("Proceed");

      let link = `${endpoint}queens_client_Apis/checkPassword.php?email=${this.state.email}`;
      console.log(link);
      axios.get(link).then((result) => {
        console.log(result.data);
        this.setState({
          passwordcheck: result.data.server_responce.password,
        });
        console.log(this.state.passwordcheck);
        if (result.data.server_responce == -1) {
          alert(
            "Either you are not a registered user or the email you entered is incorrect. Kindly contact us for more details."
          );
          this.setState({ loading: false });
        } else {
          link = `${endpoint}queens_client_Apis/fetchClientID.php?email=${this.state.email}`;
          console.log(link);
          axios.get(link).then((result) => {
            console.log(result.data.server_responce_ID);
            this._storeData(result.data.server_responce_ID);
          });
        }
      });
    } else {
      alert("Internet connection failed!");
      this.setState({ loading: false });
    }
  };

  _storeData = async (id) => {
    try {
      await AsyncStorage.setItem("QueensUserID", id);

      console.log("Save ID");
      if (this.state.passwordcheck === "null") {
        console.log("Need new password");
        this.makeid();
        console.log(this.state.newpassword);
        const { email, newpassword: password } = this.state;
        auth
          .register({
            email,
            password,
          })
          .then(() => {
            storePass(password);
            this.props.navigation.navigate("PinVerify", {
              UserEmail: email,
              UserPassword: password,
            });
          })
          .catch((err) => {
            console.log(err);
            this.props.navigation.navigate("PinVerify", {
              UserEmail: this.state.email,
              // UserPassword: this.state.newpassword
            });
          });

        // link = "http://www.skynners.com/queenTest/sendEmail.php?subject=" + this.state.subject + "&message=" + this.state.message + this.state.newpassword + "&to=" + this.state.email
        // console.log(link);
        // axios.get(link).then(result => {
        //     console.log(result.data);
        //     alert('Email with PIN Successfully Sent');

        //     this.setState({ loading: false })
        // }).catch(error => {
        //     console.log(error);
        //     this.setState({ loading: false })
        // })
      } else {
        let active = "";
        const link = `${endpoint}queens_client_Apis/fetchClientActive.php?email=${this.state.email}`;
        console.log(link);
        axios.get(link).then((result) => {
          console.log(result.data.server_responce_ID);
          active = result.data.server_responce_ID;
          if (active == "1") {
            this.fadeOutLeft(); // animation
            //  change from email to password
            setTimeout(() => {
              this.setState({ emailpage: false, loading: false });
            }, 400);
            this.scanFingerprint();
          } else {
            alert("Your account is currently deactivated.");
            this.setState({ loading: false });
          }
        });
      }
    } catch (error) {
      // Error saving data
      this.setState({ loading: false });
    }
  };

  makeid = () => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < this.state.length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.setState({ newpassword: result });
  };

  proceedFunctionPassword = () => {
    NetInfo.fetch().then((isConnected) => {
      this.setState({ connections: !!isConnected });
    });
    if (this.state.connections) {
      this.setState({ loading: true });
      const { email, password } = this.state;

      auth
        .login({ email, password })
        .then((user) => {
          this.setState({ user });
          this.refs.customToast.show("Successful sign in!");
          console.log("successful sign in!");
          this.setState({ loading: false });
          setTimeout(() => {
            this.props.navigation.navigate("AppDrawer");
          }, 800);

          // Idher Successful hochuka hay sign-in, Yahan se aagay navigate kardena main screen pe!
        })
        .catch((err) => {
          alert(
            "Error signing in. The password you entered might be incorrect. "
          );
          console.log("error signing in!: ", err);
          this.setState({ loading: false });
        });
    } else {
      alert("Internet connection failed!");
      this.setState({ loading: false });
    }
  };

  CallUsFunction = () => {
    const url = `tel://+${this.state.phoneno}`;
    Linking.openURL(url);
  };

  ContectUsFuntion = () => {
    this.props.navigation.navigate("SignUpContectUs");
  };

  // animation function
  fadeOutLeft = () =>
    this.view
      .fadeOutLeftBig(400)
      .then((endState) =>
        console.log(endState.finished ? "bounce finished" : "bounce cancelled")
      );

  fadeOutRight = () =>
    this.view
      .fadeOutRightBig(400)
      .then((endState) =>
        console.log(endState.finished ? "bounce finished" : "bounce cancelled")
      );

  backtoEmail = () => {
    this.fadeOutRight(); // animation

    // change from password to email
    setTimeout(() => {
      this.setState({ emailpage: true });
    }, 400);
  };

  ForgotPassword = () => {
    this.setState({ loading: true });
    const { email } = this.state;
    Auth.forgotPassword(email)
      .then((data) => {
        console.log(data);
        this.setState({ loading: false });
        this.props.navigation.navigate("ForgotPassword", {
          UserEmail: this.state.email,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
        alert(
          "Either you are not a registered user or the email you entered is incorrect. Kindly contact us for more details."
        );
      });
  };

  contactEmailHandler = () => {
    Linking.openURL("mailto:services@queensman.com");
  };

  render() {
    return (
      // content as view type  and touch exit
      // <Content scrollEnabled={false} style={{ flex:1}}>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Toast
          ref={this.customToast}
          textStyle={{
            color: "#fff",
          }}
          style={{
            backgroundColor: "#FFCA5D",
          }}
        />

        {/* background gradinet   */}
        <LinearGradient
          colors={["#000E1E", "#001E2B", "#000E1E"]}
          style={styles.gradiantStyle}
        />

        <Image
          style={styles.LogoStyle}
          source={require("../../assets/Login/Queensman_logo3.png")}
        />
        <View style={{ paddingTop: "11%" }} />

        {/* checking if to change email and password Component */}

        {this.state.emailpage ? (
          <Animatable.View style={{ width: "100%" }} ref={this.handleViewRef}>
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
                  ref={this.textInputMobile}
                  style={{ fontSize: 15, fontFamily: "Helvetica" }}
                  placeholder="Email"
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  onChangeText={(email) => {
                    this.setState({ email });
                  }} // email set
                />
              </View>
            </ImageBackground>

            <View style={{ paddingVertical: "3%", width: 280 }} />
            <TouchableOpacity
              style={{ height: 38, width: 200, alignSelf: "center" }}
              onPress={this.proceedFunctionEmail}
            >
              <ImageBackground
                style={{ height: 38, width: 200 }}
                source={require("../../assets/Login/Proceed2.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignSelf: "center", paddingTop: "5%" }}
              onPress={this.ForgotPassword}
            >
              <Text
                style={{ fontSize: 15, fontFamily: "Helvetica", color: "#fff" }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        ) : (
          <Animatable.View
            style={{ width: "100%", alignItems: "center" }}
            animation="fadeInRightBig"
            iterationCount={1}
            ref={this.handleViewRefs}
          >
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
                  ref={this.textInputMobile}
                  style={{
                    fontSize: 15,
                    fontFamily: "Helvetica",
                    width: "80%",
                  }}
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
                    name="eye-off"
                    style={{
                      paddingTop: "2%",
                      fontSize: 25,
                      color: "#000E1E",
                      paddingRight: "4%",
                    }}
                  />
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
                  />
                )}
              </View>
            </ImageBackground>

            <View style={{ paddingVertical: "3%" }} />
            <TouchableOpacity
              style={{ width: 200, height: 38 }}
              onPress={this.proceedFunctionPassword}
            >
              <ImageBackground
                style={{ width: 200, height: 38 }}
                source={require("../../assets/Login/Proceed2.png")}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 10,
                fontFamily: "Helvetica",
                color: "#fff",
                alignSelf: "center",
                paddingTop: "3%",
              }}
            >
              You may also use your phone fingerprint to login
            </Text>
            {/* go back to email */}
            <TouchableOpacity
              style={{ alignSelf: "center", paddingTop: "5%" }}
              onPress={this.backtoEmail}
            >
              <Text
                style={{ fontSize: 15, fontFamily: "Helvetica", color: "#fff" }}
              >
                Back to email
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        )}

        {this.state.loading ? (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ paddingTop: "5%" }}
          />
        ) : (
          <View />
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
        />
        {this.state.emailpage ? (
          <TouchableOpacity onPress={this.ContectUsFuntion}>
            <View style={{ flexDirection: "column", paddingTop: "5%" }}>
              <Text
                style={{ fontSize: 11, fontFamily: "Helvetica", color: "#fff" }}
              >
                Haven't registered yet?
              </Text>

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
        ) : (
          <TouchableOpacity onPress={this.CallUsFunction}>
            <View style={{ flexDirection: "column", paddingTop: "5%" }}>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Helvetica",
                  color: "#fff",
                  alignSelf: "center",
                }}
              >
                Facing any issues?
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ height: 18, width: 18, marginTop: "3%" }}
                  source={require("../../assets/Login/Phone.png")}
                />
                <Text> </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Helvetica",
                    color: "#FFCA5D",
                  }}
                >
                  CALL US NOW
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        <View style={{ height: "3%" }} />
        <TouchableOpacity onPress={this.contactEmailHandler}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 11, fontFamily: "Helvetica", color: "#fff" }}
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
      </KeyboardAvoidingView>
      // </Content>
    );
  }
}
