import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Linking,
} from "react-native";
import { Content, List, ListItem, Row, Icon } from "native-base";
import axios from "axios";
import Constants from "expo-constants";

import Toast from "react-native-whc-toast";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: "Username",
      Mobile: "03xxxxxxxx",
      Email: "User@mail.com",
      Gender: "Male",
      loading: false,
      Id: "",
      deviceID: "",
      fingerValue: "",
    };
  }

  async componentDidMount() {
    const ID = await AsyncStorage.getItem("QueensUserID"); // assign customer id here
    const value = await AsyncStorage.getItem("QueensFinger");
    this.setState({ fingerValue: value });
    // link = "./fetchClientProfile.php?ID=" + ID;
    const link = `http://13.250.20.151/queens_client_Apis/fetchClientProfile.php?ID=${ID}`;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data.server_responce);
      this.setState({
        UserName: result.data.server_responce.full_name,
        Mobile: result.data.server_responce.phone,
        Email: result.data.server_responce.email,
      });
    });
  }

  _RemoveData = async () => {
    try {
      await AsyncStorage.setItem("QueensPropertyID", "asd");
      await AsyncStorage.setItem("QueensPropertyType", " ");
      await AsyncStorage.setItem("QueensPropertyCountry", " ");
      Auth.signOut()
        .then((data) => console.log(data))
        .catch((err) => console.log(err));

      this.props.navigation.navigate("Login");
    } catch (error) {
      // Error saving data
      this.refs.customToast.show("Error Signing out");
    }
  };

  signOut = () => {
    this.refs.customToast.show("Signing out... Please wait");
    this._RemoveData();
  };

  updatePassword = () => {
    this.props.navigation.navigate("SettingPasswordChange", {
      UserEmail: this.state.Email,
    });
  };

  toggleFingerPrint = () => {
    if (this.state.fingerValue == "enable") {
      this.disableFingerPrint();
      this.setState({ fingerValue: "disable" });
      this._storeFingerPrintData("disable");
    } else if (this.setState.fingerValue == "disable") {
      this.EnableFingerPrint();
      this.setState({ fingerValue: "enable" });
      this._storeFingerPrintData("enable");
    } else {
      this._storeFingerPrintData("enable");
      this.setState({ fingerValue: "enable" });
      this.EnableFingerPrint();
    }
  };

  _storeFingerPrintData = async (value) => {
    try {
      await AsyncStorage.setItem("QueensFinger", value);
      // this.EnableFingerPrint();
    } catch (error) {
      // Error saving data
    }
  };

  EnableFingerPrint = () => {
    console.log(Constants.installationId);
    link = `http://13.250.20.151/queens_client_Apis/setDeviceID.php?email=${this.state.Email}&device_id=${Constants.installationId}`;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data.server_responce);
      this.refs.customToast.show("Fingerprint enabled on this phone.");
    });
    // this.props.navigation.navigate('SettingPasswordChange')
  };

  disableFingerPrint = () => {
    console.log(Constants.installationId);
    link = `http://13.250.20.151/queens_client_Apis/setDeviceID.php?email=${this.state.Email}&device_id=null`;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data.server_responce);
      this.refs.customToast.show("Fingerprint disabled on this phone.");
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Toast
          ref="customToast"
          textStyle={{
            color: "#fff",
          }}
          style={{
            backgroundColor: "#FFCA5D",
          }}
        />
        <Text style={{ paddingTop: "5%" }}> </Text>

        <View style={{ height: "5%" }} />

        <Content>
          <List>
            <Image
              style={styles.ImageStyle}
              source={require("../../assets/Home/mens.png")}
            />

            <ListItem />

            <ListItem>
              <Row>
                <Icon
                  name="contact"
                  style={{
                    fontSize: 30,
                    color: "#718792",
                    paddingRight: "14%",
                    paddingTop: "3%",
                  }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.TextFam}>Name</Text>
                  <Text style={[styles.TextFam, { color: "#718792" }]}>
                    {this.state.UserName}
                  </Text>
                </View>
                <Text> </Text>
              </Row>
            </ListItem>

            <ListItem>
              <Row>
                <Icon
                  name="phone-portrait"
                  style={{
                    fontSize: 30,
                    color: "#718792",
                    paddingRight: "16%",
                    paddingTop: "3%",
                  }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.TextFam}>Phone</Text>
                  <Text style={[styles.TextFam, { color: "#718792" }]}>
                    {this.state.Mobile}
                  </Text>
                </View>
                <Text> </Text>
              </Row>
            </ListItem>

            <ListItem>
              <TouchableOpacity onPress={this.updatePassword}>
                <Row>
                  <Icon
                    name="lock"
                    style={{
                      fontSize: 30,
                      color: "#718792",
                      paddingRight: "14%",
                      paddingTop: "3%",
                    }}
                  />
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.TextFam}>Password</Text>
                    <Text style={[styles.TextFam, { color: "#718792" }]}>
                      Tap to update password
                    </Text>
                  </View>
                  <Text> </Text>
                </Row>
              </TouchableOpacity>
            </ListItem>

            <ListItem>
              <Row>
                <Icon
                  name="mail"
                  style={{
                    fontSize: 30,
                    color: "#718792",
                    paddingRight: "13%",
                    paddingTop: "3%",
                  }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.TextFam}>Email</Text>
                  <Text style={[styles.TextFam, { color: "#718792" }]}>
                    {this.state.Email}
                  </Text>
                </View>
                <Text> </Text>
              </Row>
            </ListItem>

            <ListItem>
              <TouchableOpacity onPress={this.toggleFingerPrint}>
                <Row>
                  <Icon
                    name="finger-print"
                    style={{
                      fontSize: 30,
                      color: "#718792",
                      paddingRight: "10.5%",
                      paddingTop: "1%",
                    }}
                  />
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.TextFam}>Fingerprint Login</Text>
                    <Text style={[styles.TextFam, { color: "#718792" }]}>
                      Tap to enable/disable fingerprint login
                    </Text>
                  </View>
                  <Text> </Text>
                </Row>
              </TouchableOpacity>
            </ListItem>

            <ListItem itemDivider>
              <Text style={[styles.TextFam, styles.textheader]}>About</Text>
            </ListItem>
            <ListItem>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://queensman.com/management-maintenance"
                  )
                }
              >
                <Row>
                  <Image
                    source={require("../../assets/Login/Queensman_logo3.png")}
                    style={{
                      height: 42,
                      width: 42,
                      marginRight: "13%",
                      paddingTop: "4%",
                    }}
                  />
                  {/* <Icon name="people" style={{ fontSize: 30, color: '#718792', paddingRight: '13.5%', paddingTop: '3%', paddingLeft: '1%' }}></Icon> */}
                  <Text style={[styles.TextFam, { paddingTop: "3%" }]}>
                    About Us
                  </Text>
                  <Text> </Text>
                </Row>
              </TouchableOpacity>
            </ListItem>
            <ListItem>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://queensman.com/terms-of-use")
                }
              >
                <Row>
                  <Icon
                    name="clipboard"
                    style={{
                      fontSize: 30,
                      color: "#718792",
                      paddingRight: "14%",
                      paddingTop: "3%",
                      paddingLeft: "1%",
                    }}
                  />
                  <Text style={[styles.TextFam, { paddingTop: "5%" }]}>
                    Terms and Conditions
                  </Text>
                  <Text> </Text>
                </Row>
              </TouchableOpacity>
            </ListItem>
            <ListItem>
              <TouchableOpacity onPress={this.signOut}>
                <Row>
                  <Icon
                    name="power"
                    style={{
                      fontSize: 30,
                      color: "#718792",
                      paddingRight: "15%",
                      paddingTop: "3%",
                      paddingLeft: "1%",
                    }}
                  />
                  <Text style={[styles.TextFam, { paddingTop: "5%" }]}>
                    Sign Out
                  </Text>
                  <Text> </Text>
                </Row>
              </TouchableOpacity>
            </ListItem>
          </List>
        </Content>
      </View>
    );
  }
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

    justifyContent: "center",
  },
  ImageStyle: {
    height: 80,
    width: 80,
    alignSelf: "center",
    marginTop: "7%",
  },
  Name: {
    paddingTop: "10%",
    paddingLeft: "3%",
    flexDirection: "row",
  },
  TextFam: {
    fontFamily: "Helvetica",
  },
});
