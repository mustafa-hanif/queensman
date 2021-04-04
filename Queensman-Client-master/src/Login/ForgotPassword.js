import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "native-base";
import axios from "axios";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import Toast from "react-native-whc-toast";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      email: this.props.navigation.getParam("UserEmail", "Something"),
      pass: "",
      showPassword: true,
    };
  }

  pinInput = React.createRef();

  toggleSwitch = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  toggleSwitch = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  nexthandle = () => {
    const username = this.state.email;
    const { code } = this.state;
    const new_password = this.state.pass;
    if (new_password.length < 8) {
      this.refs.customToast.show("Password length should be greater than 8");
    } else {
      Auth.forgotPasswordSubmit(username, code, new_password)
        .then((data) => {
          console.log(data);

          link = `http://queensman.com/queens_client_Apis/UpdatePassword.php?password=${this.state.pass}&email=${this.state.email}`;
          console.log(link);
          axios.get(link).then((result) => {
            console.log(result.data.server_responce);
            this.refs.customToast.show("New Password Set");
            setTimeout(() => {
              this.props.navigation.goBack(null);
            }, 800);
          });
        })
        .catch((err) => {
          this.pinInput.current.shake().then(() => this.setState({ code: "" }));
          console.log(err);
        });
    }
  };

  render() {
    return (
      // content as view type  and touch exit
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Toast
          ref="customToast"
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

        <Text style={styles.HeadingStyle}>Forgot Password</Text>

        <Text
          style={{
            color: "#fff",
            fontSize: 15,
            fontFamily: "Helvetica",
            paddingBottom: "10%",
          }}
        >
          Please type verification code sent to {this.state.email} via email.
        </Text>
        <SmoothPinCodeInput
          ref={this.pinInput}
          cellStyle={{
            borderWidth: 2,

            borderColor: "#fff",
            backgroundColor: "#FFF",
          }}
          cellStyleFocused={{
            borderColor: "#FFCA5D",
            backgroundColor: "#fff",
          }}
          textStyle={{
            fontSize: 30,
            fontFamily: "Helvetica",
          }}
          value={this.state.code}
          cellSize={40}
          codeLength={6}
          onTextChange={(code) => this.setState({ code })}
          // onFulfill={this._checkCode}
          onBackspace={() => console.log("No more back.")}
        />

        <View style={{ height: "7%" }} />
        <Text
          style={{
            color: "#fff",
            fontSize: 15,
            fontFamily: "Helvetica",
            paddingBottom: "5%",
          }}
        >
          Kindly type new password for this account.
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 11,
            fontFamily: "Helvetica",
            paddingBottom: "8%",
          }}
        >
          *Minimum password length is 8 characters
        </Text>

        <View style={{ flexDirection: "row" }}>
          <TextInput
            ref="textInputMobile"
            style={{ fontSize: 15, color: "#FFCA5D", width: "90%" }}
            placeholder="Password"
            placeholderTextColor="#FFCA5D"
            autoCapitalize="none"
            secureTextEntry={this.state.showPassword}
            underlineColorAndroid="transparent"
            onChangeText={(pass) => {
              this.setState({ pass });
            }} // email set
          />
          {this.state.showPassword ? (
            <Icon
              onPress={this.toggleSwitch}
              name="eye-off"
              style={{ fontSize: 25, color: "#E7B675", paddingRight: "4%" }}
            />
          ) : (
            <Icon
              onPress={this.toggleSwitch}
              name="eye"
              style={{ fontSize: 25, color: "#E7B675", paddingRight: "4%" }}
            />
          )}
        </View>
        <View
          style={{
            borderBottomColor: "#FFCA5D",
            borderBottomWidth: 2,
            width: "100%",
            paddingTop: "3%",
          }}
        />
        <View style={{ height: "10%" }} />

        <TouchableOpacity
          style={{
            backgroundColor: "#FFCA5D",
            alignContent: "center",
            justifyContent: "center",
            height: "10%",
          }}
          onPress={this.nexthandle}
        >
          <Text
            style={{
              color: "#000E1E",
              fontSize: 15,
              fontFamily: "Helvetica",
              alignSelf: "center",
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: "10%",
    paddingVertical: "25%",
  },
  gradiantStyle: {
    width: deviceWidth,
    height: deviceHeight,
    position: "absolute",
    alignSelf: "center",
  },
  HeadingStyle: {
    fontSize: 23,
    color: "#FFCA5D",
    paddingBottom: "5%",
    fontFamily: "Helvetica",
  },
});
