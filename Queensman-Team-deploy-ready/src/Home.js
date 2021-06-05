/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ImageBackground,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Content, Icon } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { Colors } from "react-native/Libraries/NewAppScreen";
let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: true,
    };
  }

  registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  componentDidMount() {
    if (!Constants.isDevice) {
      return;
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    this.registerForPushNotificationsAsync().then(async (token) => {
      const user = JSON.parse(await AsyncStorage.getItem("QueensUser"));
      const email = user?.email;
      this.props.sendTokenToServer({ variables: { token, email } });
    });

    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        // setNotification(notification);
        console.log({ notification });

        const { content } = notification.request;
        if (content.data.type === "alert") {
          this.showNotificationAlert(content);
        }
      }
    );

    this.responseListener =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log(
            "from --- Notifications.addNotificationResponseReceivedListener",
            { response }
          );

          const { content } = response.notification.request;
          if (content.data.type === "alert") {
            this.showNotificationAlert(content);
          }
          // const { sound } = await Audio.Sound.createAsync(
          //   //THIS FILE DOES NOT EXIST RIGHT NOW
          //   // require("../assets/etest.mp3")
          // );

          //   console.log("Playing Sound");
          //   await sound.playAsync();
          //   let timeout = setTimeout(() => {
          //     sound.unloadAsync();
          //     clearTimeout(timeout);
          //   }, 60000);
        }
      );

    console.log("componentDidMount");
  }

  showNotificationAlert(content) {
    const { title, body } = content;
    Alert.alert(title, body);
  }

  componentWillUnmount() {
    Notifications.removeNotificationSubscription(this.notificationListener);
    Notifications.removeNotificationSubscription(this.responseListener);
  }

  AssignCalloutHandler = () => {
    this.props.navigation.navigate("JobList");
  };

  ServicesHistoryHandler = () => {
    this.props.navigation.navigate("ServicesHistory");
  };

  ScheduleHandler = () => {
    this.props.navigation.navigate("Scheduler");
  };

  InventoryReportHandler = () => {
    this.props.navigation.navigate("ClientList");
  };

  RequestCalloutHandler = () => {
    this.props.navigation.navigate("ClientListFromRequestCallout");
  };

  onBellIconPress = () => {
    this.props.navigation.navigate("Notification");
  };

  AlertLogout = () => {
    Alert.alert(
      "Logout.",
      "Are you sure you want to logout?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => this.logout() },
      ],
      { cancelable: false }
    );
  };

  logout = async () => {
    try {
      await AsyncStorage.removeItem("QueensUser");
      setTimeout(() => {
        this.props.navigation.navigate("Login");
      }, 500);
    } catch (error) {
      // Error saving data
    }
  };

  render() {
    console.log("render home");
    // NetInfo.fetch().then(isConnected => {
    //   this.setState({ connections: isConnected ? true : false })
    // });
    return (
      <View style={styles.container}>
        {/* background gradinet   
        <LinearGradient
          colors={['#000E1E', '#001E2B', '#000E1E']}
          style={styles.gradiantStyle}
        ></LinearGradient>
        */}

        <View style={styles.Name}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.toggleDrawer()}
            >
              <Image
                source={require("../assets/Home/menu.png")}
                style={{ height: 25, width: 25 }}
              ></Image>
            </TouchableOpacity>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => this.AlertLogout()}>
                <Icon
                  name="power"
                  style={{ fontSize: 25, color: "#FFCA5D" }}
                ></Icon>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={() => this.onBellIconPress()}
              >
                <Image
                  resizeMode={"contain"}
                  tintColor={"#FFCA5D"}
                  source={require("../assets/Home/notifications.png")}
                  style={{ height: 25, width: 25 }}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: "row", paddingTop: "7%" }}>
            <Image
              source={require("../assets/Login/Queensman_logo3.png")}
              style={{ height: 50, width: 50 }}
            ></Image>
            <View style={{ flexDirection: "column", width: "100%" }}>
              <Text
                style={[{ fontSize: 18, color: "#FFCA5D" }, styles.TextStyles]}
              >
                {" "}
                Property Maintenance...
              </Text>
              <Text
                style={[{ fontSize: 18, color: "#FFCA5D" }, styles.TextStyles]}
              >
                {" "}
                Perfectly Managed!
              </Text>
            </View>
          </View>
        </View>
        <View style={{ height: "10%" }}></View>
        {this.state.connections ? (
          <View
            style={[
              {
                flex: 1,
                flexDirection: "column",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingHorizontal: "2%",
              },
            ]}
          >
            <View
              style={[
                {
                  width: deviceWidth - deviceWidth / 8,
                  flex: 1,
                  flexDirection: "row",
                },
              ]}
            >
              <TouchableOpacity
                style={{ flex: 1, paddingRight: "2%" }}
                onPress={this.AssignCalloutHandler}
              >
                <View style={[styles.button]}>
                  <Image
                    source={require("../assets/Home/calloutHome.png")}
                    style={{ height: 40, width: 40, alignSelf: "center" }}
                  ></Image>
                  <Text
                    style={[
                      {
                        alignSelf: "center",
                        fontSize: 12,
                        color: "#000E1E",
                        marginTop: "4%",
                      },
                      styles.TextStyles,
                    ]}
                  >
                    Assigned
                  </Text>
                  <Text
                    style={[
                      { alignSelf: "center", fontSize: 12, color: "#000E1E" },
                      styles.TextStyles,
                    ]}
                  >
                    Services
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={this.ScheduleHandler}
              >
                <View style={[styles.button]}>
                  <Image
                    source={require("../assets/Home/calloutHome.png")}
                    style={{ height: 40, width: 40, alignSelf: "center" }}
                  ></Image>
                  <Text
                    style={[
                      {
                        alignSelf: "center",
                        fontSize: 12,
                        color: "#000E1E",
                        marginTop: "4%",
                      },
                      styles.TextStyles,
                    ]}
                  >
                    Scheduler
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ height: "3%" }}></View>

            <View
              style={[
                {
                  width: deviceWidth - deviceWidth / 8,
                  flex: 1,
                  flexDirection: "row",
                },
              ]}
            >
              <TouchableOpacity
                style={{ flex: 1, paddingRight: "2%" }}
                onPress={this.ServicesHistoryHandler}
              >
                <View style={styles.button}>
                  <Image
                    source={require("../assets/Home/pendingHome.png")}
                    style={{ height: 40, width: 40, alignSelf: "center" }}
                  ></Image>
                  <Text
                    style={[
                      {
                        alignSelf: "center",
                        fontSize: 12,
                        color: "#000E1E",
                        marginTop: "4%",
                      },
                      styles.TextStyles,
                    ]}
                  >
                    Services
                  </Text>
                  <Text
                    style={[
                      { alignSelf: "center", fontSize: 12, color: "#000E1E" },
                      styles.TextStyles,
                    ]}
                  >
                    History
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={this.InventoryReportHandler}
              >
                <View style={styles.button}>
                  <Image
                    source={require("../assets/Home/pendingHome.png")}
                    style={{ height: 40, width: 40, alignSelf: "center" }}
                  ></Image>
                  <Text
                    style={[
                      {
                        alignSelf: "center",
                        fontSize: 12,
                        color: "#000E1E",
                        marginTop: "4%",
                      },
                      styles.TextStyles,
                    ]}
                  >
                    Inventory
                  </Text>
                  <Text
                    style={[
                      { alignSelf: "center", fontSize: 12, color: "#000E1E" },
                      styles.TextStyles,
                    ]}
                  >
                    Report
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              style={{ width: deviceWidth - deviceWidth / 8, flex: 1 }}
              onPress={this.RequestCalloutHandler}
            >
              <View style={styles.button}>
                <Image
                  source={require("../assets/Home/pendingHome.png")}
                  style={{ height: 40, width: 40, alignSelf: "center" }}
                ></Image>
                <Text
                  style={[
                    {
                      alignSelf: "center",
                      fontSize: 12,
                      color: "#000E1E",
                      marginTop: "4%",
                    },
                    styles.TextStyles,
                  ]}
                >
                  Request Callout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          // <View style={[styles.bottomView]}>
          //   <TouchableOpacity style={{ flex: 1 }} onPress={this.AssignCalloutHandler} >
          //     <View style={[styles.button,]}>
          //       <Image source={require('../assets/Home/calloutHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
          //       <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Assigned</Text>
          //       <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E' }, styles.TextStyles]}>Services</Text>
          //     </View>
          //   </TouchableOpacity>
          //   <Text>     </Text>
          //   <TouchableOpacity style={{ flex: 1 }} onPress={this.ServicesHistoryHandler} >
          //     <View style={styles.button}>
          //       <Image source={require('../assets/Home/pendingHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
          //       <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Services</Text>
          //       <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E' }, styles.TextStyles]}>History</Text>
          //     </View>
          //   </TouchableOpacity>
          // </View>

          <View style={styles.NoInternetCard}>
            <Text
              style={{ fontSize: 24, paddingHorizontal: 20, color: "#FFCA5D" }}
            >
              No Internet
            </Text>
            <Text
              style={{
                fontSize: 10,
                paddingTop: 30,
                paddingHorizontal: 20,
                color: "#fff",
              }}
            >
              Queensmen Spades App require internet connection.
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const UPDATE_TOKEN = gql`
  mutation MyMutation($token: String!, $email: String!) {
    update_worker(
      where: { email: { _eq: $email } }
      _set: { expo_token: $token }
    ) {
      returning {
        expo_token
      }
    }
  }
`;

import { gql, useMutation } from "@apollo/client";

export default function HomeFunction(props) {
  const [updateToken, { loading: mutationLoading, error: mutationError }] =
    useMutation(UPDATE_TOKEN);

  function sendTokenToServer(token) {
    console.log({ mutationLoading, mutationError });
    updateToken(token)
      .then((res) => console.log(res))
      .catch((err) => console.log("error", err));
  }

  return (
    <HomeScreen sendTokenToServer={sendTokenToServer} {...props}></HomeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: "5%",
    paddingVertical: "10%",
    // justifyContent: 'center'
  },
  Name: {
    marginTop: "13%",
    width: "100%",
    paddingHorizontal: "5%",
  },
  TextStyles: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    textShadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 3, // Android
    // fontFamily: 'serif'
  },
  bottomView: {
    // shadowColor: 'rgba(0,0,0, .4)', // IOS
    // shadowOffset: { height: 1, width: 1 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    // elevation: 3, // Android
    flex: 1,
    //   backgroundColor: 'rgba(255, 204, 89, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
    alignContent: "flex-start",
    flexDirection: "column",
    //marginTop: '10%'
    paddingHorizontal: "30%",
  },
  // externalContainer: {
  //   flex: 1,
  //   flexDirection: 'row'
  // },
  button: {
    shadowColor: "rgba(255,255,255, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 3, // Android
    flex: 1,
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFCA5D",
  },
  gradiantStyle: {
    width: deviceWidth,
    height: deviceHeight,
    position: "absolute",
    alignSelf: "center",
  },
  NoInternetCard: {
    // shadowColor: 'rgba(0,0,0, .4)', // IOS
    // shadowOffset: { height: 1, width: 1 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    // elevation: 2, // Android
    width: "90%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: '#FFF',
    borderRadius: 10,
    alignSelf: "center",
  },
});
