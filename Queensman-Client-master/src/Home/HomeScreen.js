import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { gql, useMutation } from "@apollo/client";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-whc-toast";
import Constants from "expo-constants";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

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

    paddingHorizontal: "5%",
  },
  TextStyles: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    textShadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, // IOS
    elevation: 3, // Android
    fontFamily: "Helvetica",
  },
  bottomView: {
    // shadowColor: 'rgba(0,0,0, .4)', // IOS
    // shadowOffset: { height: 1, width: 1 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    // elevation: 3, // Android
    flex: 0.5,
    //   backgroundColor: 'rgba(255, 204, 89, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    // marginTop: '10%'
    paddingHorizontal: "10%",
  },
  button: {
    shadowColor: "rgba(255,255,255, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, // IOS
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
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, // IOS
    elevation: 2, // Android
    width: "90%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignSelf: "center",
  },
});

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      throw new Error("Failed to get push token for push notification!");
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }
  throw new Error("Must use physical device for Push Notifications");
};

const requestCallOutPress = (navigation) => {
  navigation.navigate("RequestCallOut");
};

const onGoingCallOutPress = (navigation) => {
  navigation.navigate("CalloutOngoing");
};

const CallOutHistoryPress = (navigation) => {
  navigation.navigate("CalloutHistory");
};

const CallOutReportPress = (navigation) => {
  navigation.navigate("CalloutReportItem");
};

const UPDATE_TOKEN = gql`
  mutation MyMutation($token: String!, $email: String!) {
    update_client(pk_columns: { email: $id }, _set: { expo_token: $token }) {
      expo_token
    }
  }
`;

const HomeScreen = ({ navigation }) => {
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const [updateToken, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_TOKEN);
  console.log(mutationLoading, mutationError);
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
      console.log(response);
    });

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    registerForPushNotificationsAsync()
      .then(async (token) => {
        const user = JSON.parse(await AsyncStorage.getItem("QueensUser"));
        const email = user?.user?.email;
        console.log({ variables: { token, email } });
        updateToken({ variables: { token, email } });
        console.log(token);
      })
      .catch(alert);

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Toast
        textStyle={{
          color: "#fff",
        }}
        style={{
          backgroundColor: "#FFCA5D",
        }}
      />
      {/* background gradinet   */}
      <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />

      <View style={styles.Name}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Image source={require("../../assets/Home/menu.png")} style={{ height: 25, width: 25 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Image
              source={require("../../assets/Home/notifications.png")}
              style={{ tintColor: "#FFCA5D", height: 25, width: 25 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", paddingTop: "7%" }}>
          <Image source={require("../../assets/Login/Queensman_logo3.png")} style={{ height: 50, width: 50 }} />
          <View style={{ flexDirection: "column", width: "100%" }}>
            <Text style={[{ fontSize: 18, color: "#FFCA5D" }, styles.TextStyles]}> Property Maintenance...</Text>
            <Text style={[{ fontSize: 18, color: "#FFCA5D" }, styles.TextStyles]}> Perfectly Managed!</Text>
          </View>
        </View>
      </View>
      <View style={{ height: "10%" }} />
      <View animation="fadeInUpBig" iterationCount={1} duration={1000} style={{ flex: 1 }}>
        <View style={[styles.bottomView]}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => requestCallOutPress(navigation)}>
            <View style={[styles.button]}>
              <Image
                source={require("../../assets/Home/calloutHome.png")}
                style={{ height: 40, width: 40, alignSelf: "center" }}
              />
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
                Request
              </Text>
              <Text style={[{ alignSelf: "center", fontSize: 12, color: "#000E1E" }, styles.TextStyles]}>Callout</Text>
            </View>
          </TouchableOpacity>
          <Text> </Text>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => onGoingCallOutPress(navigation)}>
            <View style={styles.button}>
              <Image
                source={require("../../assets/Home/pendingHome.png")}
                style={{ height: 40, width: 40, alignSelf: "center" }}
              />
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
                Scheduled
              </Text>
              <Text style={[{ alignSelf: "center", fontSize: 12, color: "#000E1E" }, styles.TextStyles]}>Services</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: "3%" }} />
        <View style={[styles.bottomView]}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => CallOutHistoryPress(navigation)}>
            <View style={styles.button}>
              <Image
                source={require("../../assets/Home/historyHome.png")}
                style={{ height: 40, width: 40, alignSelf: "center" }}
              />
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
              <Text style={[{ alignSelf: "center", fontSize: 12, color: "#000E1E" }, styles.TextStyles]}>History</Text>
            </View>
          </TouchableOpacity>
          <Text> </Text>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => CallOutReportPress(navigation)}>
            <View style={styles.button}>
              <Image
                source={require("../../assets/Home/reportHome.png")}
                style={{ height: 40, width: 40, alignSelf: "center" }}
              />
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
                Reports
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
