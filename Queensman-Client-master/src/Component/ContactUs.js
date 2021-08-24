/* eslint-disable react/no-string-refs */
/* eslint-disable no-alert */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Content, Icon, ScrollView } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      code: "",
      WhatsAppMessage: "",
      phoneno: "",
      Whatsapp: "",
    };
  }

  async componentDidMount() {
    const propertyCountry = await AsyncStorage.getItem("QueensPropertyCountry"); // assign customer id here
    if (propertyCountry == "UK" || propertyCountry == "United Kingdom") {
      this.setState({
        phoneno: "447402308203",
        Whatsapp: "+447402308203",
      });
    } else if (propertyCountry == "UAE" || propertyCountry == "United Arab Emirates") {
      this.setState({
        phoneno: "971555996024",
        Whatsapp: "+971555996024",
      });
    }
  }

  Callhandle = () => {
    if (this.state.phoneno == "") {
      alert("Please select property first from 'Property Details' tab in the menu.");
    } else {
      const url = `tel://+${this.state.phoneno}`;
      Linking.openURL(url);
    }
  };

  Messagehandle = () => {
    if (this.state.Whatsapp == "") {
      alert("Please select property first from 'Property Details' tab in the menu.");
    } else {
      Linking.openURL(`http://api.whatsapp.com/send?text=${this.state.WhatsAppMessage}&phone=${this.state.Whatsapp}`);
    }
  };

  render() {
    return (
      // content as view type  and touch exit
      <ScrollView contentContainerStyle={styles.container}>
        {/* background gradinet   */}
        <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />

        <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
          <Icon as={Ionicons} name="arrow-back" style={{ fontSize: 24, color: "#fff" }} />
        </TouchableOpacity>
        <View style={{ height: "7%" }} />

        <Text style={styles.HeadingStyle}>Contact Us</Text>
        <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Helvetica" }}>We are always here to help! </Text>

        <View style={{ height: "10%" }} />

        <View style={{ flexDirection: "row" }}>
          <TextInput
            ref="textInputMobile"
            style={{
              fontSize: 15,
              color: "#FFCA5D",
              width: "90%",
              fontFamily: "Helvetica",
            }}
            placeholder="Type WhatsApp message here"
            placeholderTextColor="#FFCA5D"
            multiline
            numberOfLines={4}
            underlineColorAndroid="transparent"
            onChangeText={(WhatsAppMessage) => {
              this.setState({ WhatsAppMessage });
            }} // email set
          />
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
            flexDirection: "row",
          }}
          onPress={this.Messagehandle}
        >
          <Icon as={Ionicons} name="logo-whatsapp" style={{ fontSize: 24, color: "green", alignSelf: "center" }} />
          <Text> </Text>
          <Text
            style={{
              color: "#000E1E",
              fontSize: 15,
              fontFamily: "Helvetica",
              alignSelf: "center",
            }}
          >
            WhatsApp us
          </Text>
        </TouchableOpacity>
        <View style={{ height: "10%" }} />
        <Text
          style={{
            color: "#fff",
            fontSize: 15,
            fontFamily: "Helvetica",
            alignSelf: "center",
          }}
        >
          OR
        </Text>

        <View style={{ height: "10%" }} />
        <TouchableOpacity
          style={{
            backgroundColor: "#FFCA5D",
            alignContent: "space-around",
            justifyContent: "center",
            height: "10%",
            flexDirection: "row",
          }}
          onPress={this.Callhandle}
        >
          <Icon as={Ionicons} name="call" style={{ fontSize: 24, color: "#000E1E", alignSelf: "center" }} />
          <Text> </Text>
          <Text
            style={{
              color: "#000E1E",
              fontSize: 15,
              fontFamily: "Helvetica",
              alignSelf: "center",
            }}
          >
            Call us
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: "10%",
    paddingVertical: "15%",
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
