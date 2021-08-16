/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { StyleSheet, View, TouchableOpacity, Dimensions, Platform, Alert } from "react-native";
import {
  Box,
  Content,
  CircleIcon,
  Pressable,
  Stack,
  HStack,
  Text,
  Image,
  Icon,
  VStack,
  Heading,
  Divider,
  ScrollView,
} from "native-base";
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { gql, useQuery, useMutation } from "@apollo/client";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import FlashMessage from "react-native-flash-message";
import Constants from "expo-constants";
import { auth } from "../utils/nhost";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const GET_CALLOUT = gql`
  query GetCallout($callout_by_email: String!, $today: date = "") {
    callout(
      where: { callout_by_email: { _eq: $callout_by_email }, schedule: { date_on_calendar: { _gte: $today } } }
      order_by: { schedule: { date_on_calendar: asc } }
      limit: 1
    ) {
      job_type
      id
      urgency_level
      picture1
      picture2
      picture3
      picture4
      status
      description
      property {
        address
        city
        community
        country
      }
      schedule {
        date_on_calendar
        time_on_calendar
        id
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    paddingTop: 12,
  },
  Name: {
    marginTop: "13%",

    paddingHorizontal: "5%",
  },
  TextStyles: {
    // shadowColor: "rgba(0,0,0, .4)", // IOS
    // textShadowOffset: { height: 1, width: 1 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, // IOS
    // elevation: 3, // Android
    // fontFamily: "Helvetica",
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
  // throw new Error("Must use physical device for Push Notifications");
};

const requestCallOutPress = (navigation, { additionalServices }) => {
  if (!additionalServices) {
    // if false
    navigation.navigate("RequestCallOut", { name: "Request Callout", additionalServices });
  } else {
    // if true
    navigation.navigate("RequestCallOut", { name: "Additional Request", additionalServices });
  }
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
    update_client(where: { email: { _eq: $email } }, _set: { expo_token: $token }) {
      returning {
        expo_token
      }
    }
  }
`;

const NOTIFICATION_LIST = gql`
  query MyQuery($email: String!) {
    notifications_aggregate(where: { client_email: { _eq: $email }, isRead: { _eq: false } }, order_by: { id: desc }) {
      aggregate {
        count
      }
    }
  }
`;

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const email2 = auth?.currentSession?.session?.user.email;
  const { loading, data, error } = useQuery(GET_CALLOUT, {
    variables: {
      callout_by_email: email2,
      today: moment().format("YYYY-MM-DD"),
    },
  });

  const {
    loading: loading2,
    data: notifications,
    error: notificationError,
  } = useQuery(NOTIFICATION_LIST, {
    variables: {
      email: email2,
    },
  });

  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const [updateToken, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_TOKEN);
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {});

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {});

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
        updateToken({ variables: { token, email } });
        setEmail(email);
      })
      .catch(alert);

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <FlashMessage position="center" />
      {/* background gradinet   */}
      {/* <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} /> */}

      <View style={styles.Name}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Image alt="pic" source={require("../../assets/Home/menu.png")} style={{ height: 25, width: 25 }} />
          </TouchableOpacity>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>{email}</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => AlertLogout(navigation)}>
              <Icon as={Ionicons} name="power" style={{ fontSize: 25, color: "#FFCA5D" }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate("Notification")}>
              <Box>
                {notifications?.notifications_aggregate?.aggregate?.count && (
                  <Box
                    position="absolute"
                    bottom={5}
                    left={3.5}
                    fontSize="xs"
                    bg="rose.400"
                    color="black"
                    width={6}
                    py={0.5}
                    px={0.25}
                    borderRadius={24}
                  >
                    <Text fontSize="xs" color="black" textAlign="center">
                      {notifications.notifications_aggregate.aggregate.count}
                    </Text>
                  </Box>
                )}
                <Icon as={Ionicons} name="notifications-outline" style={{ fontSize: 25, color: "#FFCA5D" }} />
              </Box>
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
        {/* <View style={{ flexDirection: "row", paddingTop: "7%" }}>
          <Image source={require("../../assets/Login/Queensman_logo3.png")} style={{ height: 50, width: 50 }} />
          <View style={{ flexDirection: "column", width: "100%" }}>
            <Text style={[{ fontSize: 18, color: "#FFCA5D" }, styles.TextStyles]}> Property Maintenance...</Text>
            <Text style={[{ fontSize: 18, color: "#FFCA5D" }, styles.TextStyles]}> Perfectly Managed!</Text>
          </View>
        </View> */}
      </View>
      <Box pt={4}>
        <VStack space={4}>
          <Item
            onPress={() => requestCallOutPress(navigation, { additionalServices: false })}
            text="Request Callout"
            image={require("../../assets/Home/calloutHome.png")}
          />
          <Item
            onPress={() => onGoingCallOutPress(navigation)}
            text="Scheduled Services"
            image={require("../../assets/Home/pendingHome.png")}
          />
          <Item
            onPress={() => CallOutHistoryPress(navigation)}
            text="Services History"
            image={require("../../assets/Home/historyHome.png")}
          />
          <Item
            onPress={() => CallOutReportPress(navigation)}
            text="Report and Documents"
            image={require("../../assets/Home/reportHome.png")}
          />
          <Item
            onPress={() => requestCallOutPress(navigation, { additionalServices: true })}
            text="Request of Additional Services"
            image={require("../../assets/Home/pendingHome.png")}
          />
        </VStack>
      </Box>
      <VStack space={4} mt={4}>
        <Divider />
        <Heading mx="auto" size="sm">
          Upcoming Service
        </Heading>
        { data?.callout?.length > 0 ? <CalloutItem item={data.callout[0]} toggleGalleryEventModal={() => {}} /> : <Text textAlign="center">No service</Text>}
        <Divider />
        <Text pb={8} alignItems="flex-end" fontSize="xs" textAlign="center">
          All rights reserved © 2021 - Queensman
        </Text>
      </VStack>
    </ScrollView>
  );
};

const Item = ({ text, image, onPress }) => (
  <Pressable onPress={onPress}>
    <HStack
      space={2}
      alignContent="center"
      borderWidth={1}
      borderColor="amber.300"
      mx={8}
      py={2}
      px={4}
      borderRadius={48}
      bg="white"
    >
      <Image alt="pic" source={image} alt="picture" style={{ height: 32, width: 32, alignSelf: "center" }} />
      <Text color="amber.900" alignSelf="center">
        {text}
      </Text>
    </HStack>
  </Pressable>
);
export default HomeScreen;

const colors = {
  Waiting: "rose.600",
  "In Progress": "amber.600",
};

const CalloutItem = ({ item, toggleGalleryEventModal }) => {
  const color = item?.urgency_level === "High" ? "rose.600" : "amber.600";
  const statusColor = colors[item?.status] ? colors[item?.status] : "lightBlue.600";
  return (
    <Box bg="white" mx={8} rounded="lg">
      <Stack space={2.5} p={4}>
        <HStack alignItems="center">
          <CircleIcon size={4} mr={0.5} color={color} />
          <Text color={color} mr={2} fontSize="xs">
            {item?.urgency_level}
          </Text>
          <CircleIcon size={4} mr={0.5} color={statusColor} />
          <Text color={statusColor} fontSize="xs">
            {item?.status}
          </Text>
          <Text color="black" ml="auto" fontSize="xs">
            {item?.id}
          </Text>
        </HStack>

        <Heading color="black" size="md" noOfLines={2}>
          {item?.job_type}
        </Heading>
        {item?.client?.full_name && (
          <HStack>
            <Text mr={1} color="black" fontSize="sm">
              Reported by
            </Text>
            <Text color="amber.800" bold fontSize="sm">
              {item?.client?.full_name}
            </Text>
          </HStack>
        )}
        <HStack>
          <Text mr={1} color="black" fontSize="sm">
            Assigned to
          </Text>
          <Text color="indigo.800" bold fontSize="sm">
            {item?.job_worker?.[0]?.worker?.full_name}
          </Text>
        </HStack>
        <VStack>
          <Text mr={1} color="black" fontSize="sm">
            On Property
          </Text>
          <Text color="cyan.800" fontSize="sm">
            {item?.property?.address}, {item?.property?.city}
          </Text>
        </VStack>

        {item?.description && (
          <Text lineHeight={[5, 5, 7]} noOfLines={[4, 4, 2]} color="gray.700">
            {item?.description}
          </Text>
        )}
        <Divider bg="gray.200" />
        <VStack space={2}>
          <Text color="black" fontSize="sm">
            Scheduled at
          </Text>
          {item?.schedule?.date_on_calendar && (
            <HStack space={2} alignItems="center">
              <AntDesign name="calendar" size={18} />
              <Text color="black" fontSize="sm">
                {moment(item?.schedule?.date_on_calendar).format("Do MMMM, YYYY")}
              </Text>
            </HStack>
          )}
          {item?.schedule?.time_on_calendar && (
            <HStack space={2} alignItems="center">
              <AntDesign name="clockcircle" size={18} />
              <Text color="black" fontSize="sm">
                {moment(`2013-02-08T${item?.schedule?.time_on_calendar}`).format("hh:mm A")}
              </Text>
            </HStack>
          )}
        </VStack>
      </Stack>
    </Box>
  );
};
