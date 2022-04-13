/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
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
  Platform
} from "react-native";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Content, Icon, Spinner } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { auth } from './utils/nhost';

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

const HomeScreen = ({ navigation, workerId, workerLoading }) => {
  const email2 = auth?.user()?.email || ""
  return (
    <View style={styles.container}>
      <View style={styles.Name}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Image
              source={require("../assets/Home/menu.png")}
              style={{ height: 25, width: 25 }}
            ></Image>
          </TouchableOpacity>
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 12 }}>{email2}</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => AlertLogout(navigation)}>
              <Icon
              as={Ionicons}
                name="power"
                style={{ fontSize: 25, color: "#FFCA5D" }}
              ></Icon>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => onBellIconPress(navigation, workerId)}
            >
                <Icon
              as={Ionicons}
                name="notifications-outline"
                style={{ fontSize: 25, color: "#FFCA5D" }}
              ></Icon>
              {/* <Image
                resizeMode={"contain"}
                tintColor={"#FFCA5D"}
                source={require("../assets/Home/notifications.png")}
                style={{ height: 25, width: 25 }}
              ></Image> */}
              {/* <Text style={{color: "#FFCA5D", marginTop: -19, fontSize: 10 }}>    1</Text> */}
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
              Property Maintenance...
            </Text>
            <Text
              style={[{ fontSize: 18, color: "#FFCA5D" }, styles.TextStyles]}
            >
              Perfectly Managed!
            </Text>
          </View>
        </View>
      </View>
      <View style={{ height: "10%" }}></View>
      <View>
         {workerLoading && <Spinner color="black" size="sm" />}
         </View>
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
            onPress={() => AssignCalloutHandler(navigation, workerId)}
            disabled={workerLoading}
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
            onPress={() => ScheduleHandler(navigation, workerId)}
            disabled={workerLoading}
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
          {/* <TouchableOpacity
            style={{ flex: 1, paddingRight: "2%" }}
            onPress={() => ServicesHistoryHandler(navigation)}
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
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => InventoryReportHandler(navigation, workerId)}
            disabled={workerLoading}
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
          onPress={() => RequestCalloutHandler(navigation, workerId)}
          disabled={workerLoading}
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
    </View>
  );
};

const registerForPushNotificationsAsync = async () => {
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
    // console.log(token);
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

const AssignCalloutHandler = (navigation, workerId) => {  
  navigation.navigate("JobList", {
    workerId
  });
};

const ServicesHistoryHandler = (navigation) => {
  navigation.navigate("ServicesHistory");
};

const ScheduleHandler = (navigation, workerId) => {
  navigation.navigate("Scheduler", {
    workerId
  });
};

const InventoryReportHandler = (navigation, workerId) => {
  navigation.navigate("ClientList", {
    workerId
  });
};

const RequestCalloutHandler = (navigation, worker_id) => {
  navigation.navigate("ClientListFromRequestCallout", {
    worker_id,
    worker_email: auth.user().email,
  });
};

const onBellIconPress = (navigation, workerId) => {
  navigation.navigate("Notification", {
    workerId
  });
};

const AlertLogout = (navigation) => {
  Alert.alert(
    "Logout.",
    "Are you sure you want to logout?",
    [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Yes", onPress: () => logout(navigation) },
    ],
    { cancelable: false }
  );
};

const logout = async (navigation) => {
  try {
    await AsyncStorage.removeItem("QueensUser");
    setTimeout(() => {
      navigation.navigate("Login");
    }, 500);
  } catch (error) {
    // Error saving data
  }
};

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

import { gql, useMutation, useQuery } from "@apollo/client";
const GET_CURRENT_JOB_WORKER = gql`query GetJobWorkerId($email: String) {
    worker(where: {email: {_eq: $email}}) {
      id
  }
}
`

export default function HomeFunction(props) {
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  console.log(auth.user().email)
  const {loading: workerLoading, data: workerData, error: workerError} = useQuery(GET_CURRENT_JOB_WORKER, {variables: {
    email: auth.user().email,
  }})
  const [updateToken, { 
    loading: mutationLoading, 
    error: mutationError 
  }] =
    useMutation(UPDATE_TOKEN);

  function sendTokenToServer(variables) {
    console.log({ mutationLoading, mutationError });
    updateToken(variables)
      .then((res) => console.log(res))
      .catch((err) => {
        alert(err);
        console.log("error", err)
      });
  }

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
      
    registerForPushNotificationsAsync().then(async (token) => {
      const email = auth.user().email;
      sendTokenToServer({ variables: { token, email } });
    }).catch(alert);
      
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        // setNotification(notification);
        const { content } = notification.request;
        if (content.data.type === "alert") {
          showNotificationAlert(content);
        }
      }
    );
      
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log(
            "from --- Notifications.addNotificationResponseReceivedListener",
            { response }
          );

          const { content } = response.notification.request;
          if (content.data.type === "alert") {
            showNotificationAlert(content);
          }
        }
      );
      
  function showNotificationAlert(content) {
    const { title, body } = content;
    Alert.alert(title, body);
  }
  return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
    }
  }, []);

  return (
    <HomeScreen sendTokenToServer={sendTokenToServer} workerLoading={workerLoading} workerId={workerData?.worker[0].id} {...props}></HomeScreen>
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
