import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Content } from "native-base";

import SmoothPinCodeInput from "react-native-smooth-pincode-input";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default class PinVerfication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      email: this.props.navigation.getParam("UserEmail", "Something"),
      pass: "",
    };
  }

  pinInput = React.createRef();

  async componentDidMount() {
    const pas = await AsyncStorage.getItem("QueensPass"); // assign customer id here
    this.setState({ pass: pas });
  }

  _checkCode = () => {
    const username = this.state.email;
    const { code } = this.state;
    console.log(`${code}${username}`);
    Auth.confirmSignUp(username, code, {
      // Optional. Force user confirmation irrespective of existing alias. By default set to True.
      forceAliasCreation: true,
    })
      .then((data) => {
        console.log(data);
      })
      .catch((err) =>
        this.pinInput.current.shake().then(() => this.setState({ code: "" }))
      );
  };

  nexthandle = () => {
    const username = this.state.email;
    const { code } = this.state;
    console.log(`${code}${username}`);
    Auth.confirmSignUp(username, code, {
      // Optional. Force user confirmation irrespective of existing alias. By default set to True.
      forceAliasCreation: true,
    })
      .then((data) => {
        console.log(data);
        const { email } = this.state;
        const { pass } = this.state;
        Auth.signIn(email, pass)
          .then((user) => {
            this.setState({ user });
            console.log("successful sign in!");
            this.props.navigation.navigate("SignUpChangePass", {
              UserPassword: this.state.pass,
              UserEmail: this.state.email,
            });
          })
          .catch((err) => console.log("error signing in!: ", err));
      })
      .catch((err) =>
        this.pinInput.current.shake().then(() => this.setState({ code: "" }))
      );
  };

  render() {
    return (
      // content as view type  and touch exit
      <Content scrollEnabled={false} contentContainerStyle={styles.container}>
        {/* background gradinet   */}
        <LinearGradient
          colors={["#000E1E", "#001E2B", "#000E1E"]}
          style={styles.gradiantStyle}
        />

        <Text style={styles.HeadingStyle}>Verification Code</Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 15,
            fontFamily: "Helvetica",
            paddingBottom: "10%",
          }}
        >
          Please type verification code sent to {this.state.email} via email.{" "}
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

        <View style={{ height: "30%" }} />

        <TouchableOpacity
          style={{
            backgroundColor: "#FFCA5D",
            alignContent: "center",
            justifyContent: "center",
            height: "15%",
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
            Next
          </Text>
        </TouchableOpacity>
      </Content>
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
