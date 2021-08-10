import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Content, Icon } from "native-base";
import axios from "axios";
import Toast from "react-native-whc-toast";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default class SignupChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      repassword: "",
      code: "",
      showPassword: true,

      OldPass: this.props.route.params.UserPassword,
      email: this.props.route.params.UserEmail,
    };
  }

  toggleSwitch = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  donehandle = () => {
    if (this.state.password != this.state.repassword) {
      this.refs.customToast.show("Passwords are not same");
    } else if (this.state.password.length < 8) {
      this.refs.customToast.show("Password length should be greater than 8");
    } else {
      const { OldPass } = this.state;
      const { password } = this.state;
      Auth.currentAuthenticatedUser()
        .then((user) => {
          return Auth.changePassword(user, OldPass, password);
        })
        .then((data) => console.log(data))
        .catch((err) => console.log(err));

      link = `http://queensman.com/queens_client_Apis/UpdatePassword.php?password=${this.state.password}&email=${this.state.email}`;
      console.log(link);
      axios.get(link).then((result) => {
        console.log(result.data.server_responce);
        this.refs.customToast.show("New Password Set");
        setTimeout(() => {
          this.props.navigation.navigate("PropertyDetails");
        }, 800);
      });
    }
  };

  render() {
    return (
      // content as view type  and touch exit
      <Content scrollEnabled={false} contentContainerStyle={styles.container}>
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

        <Text style={styles.HeadingStyle}>New Password</Text>
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
            paddingBottom: "12%",
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
            onChangeText={(password) => {
              this.setState({ password });
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

        <View style={{ flexDirection: "row" }}>
          <TextInput
            ref="textInputMobile"
            style={{ fontSize: 15, color: "#FFCA5D", width: "90%" }}
            placeholder="Retype Password"
            placeholderTextColor="#FFCA5D"
            autoCapitalize="none"
            secureTextEntry={this.state.showPassword}
            underlineColorAndroid="transparent"
            onChangeText={(repassword) => {
              this.setState({ repassword });
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
        <View style={{ height: "30%" }} />

        <TouchableOpacity
          style={{
            backgroundColor: "#FFCA5D",
            alignContent: "center",
            justifyContent: "center",
            height: "15%",
          }}
          onPress={this.donehandle}
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
