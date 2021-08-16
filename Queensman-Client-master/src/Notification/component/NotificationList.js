/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
import { formatDistance } from "date-fns";
import React from "react";
import { Box, Text, FlatList, HStack, VStack, Button, Icon, IconButton, Divider } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import call from "react-native-phone-call";
import { View, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { gql, useMutation } from "@apollo/client";

const UPDATE_NOTIFICATIONS = gql`
  mutation UpdateNotifications($id: Int!) {
    update_notifications_by_pk(pk_columns: { id: $id }, _set: { isRead: true }) {
      id
    }
  }
`;

const CONFIRM_CALLOUT = gql`
  mutation ConfirmCallout($scheduler_id: Int!) {
    update_scheduler_by_pk(pk_columns: { id: $scheduler_id }, _set: { confirmed: true }) {
      id
    }
  }
`;

export default function NotificationList({
  item,
  onNoButtonPress,
  setNotifications,
  reloadNotification,
  notifications,
  navigation,
  viewStyle,
  index,
  textStyle,
  dotStyle,
}) {
  const [updateNotifications] = useMutation(UPDATE_NOTIFICATIONS, {
    onCompleted: () => {
      reloadNotification();
    },
  });
  const [confirmCalout, { loading: confirmCalloutLoading, error: confirmcalloutError }] = useMutation(CONFIRM_CALLOUT);

  const onConfirmPress = (val) => {
    updateNotifications({
      variables: {
        id: val.id,
      },
    });
    confirmCalout({
      variables: {
        scheduler_id: val.data.scheduler_id,
      },
    })
      .then((res) => console.log(res))
      .catch(console.log);
  };

  const markAsRead = (id) => {
    showMessage({
      message: "Notification marked as read",
      type: "success",
    });
    // const item = [...notifications];
    // item[index].isRead = true;
    // setNotifications(item);
    updateNotifications({
      variables: {
        id,
      },
    });
  };

  const viewCallout = (callout_id) => {
    navigation.navigate("OngoingcalloutItem", {
      it: item,
    });
  };
  console.log(item);
  return (
    <>
      <FlashMessage position="top" />
      {!item?.isRead && (
        <VStack space={3} p={4} bg="white">
          <Text color="black">{item.text}</Text>
          {item?.data?.callout_id && (
            <VStack space={3}>
              <Box>
                {item?.data.type === "client_confirm" && (
                  <VStack space={2}>
                    <HStack space={2}>
                      <Text color="amber.900">Do you confirm?</Text>
                      <Button
                        size="xs"
                        onPress={() => {
                          onConfirmPress(item);
                        }}
                      >
                        Yes
                      </Button>
                    </HStack>
                    <HStack space={2}>
                      <Text color="amber.900">Do you want to reschedule?</Text>
                      <Button
                        size="xs"
                        onPress={() => {
                          onNoButtonPress(item);
                        }}
                      >
                        Yes
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Box>
              <Button
                onPress={() => viewCallout(item?.data?.callout_id)}
                size="xs"
                height={6}
                width={100}
                rounded="sm"
                bg="amber.300"
              >
                <Text color="black" fontSize="xs">
                  View Callout
                </Text>
              </Button>
              <Text color="black" fontSize="xs">{`${formatDistance(new Date(), new Date(item.created_at), {
                includeSeconds: true,
              })} ago`}</Text>
            </VStack>
          )}
          <Button rounded="sm" onPress={() => markAsRead(item.id)} size="xs" width={100} ml="auto" bg="lightBlue.50">
            <Text color="lightBlue.600" fontSize="xxs">
              Mark as read
            </Text>
          </Button>
          <Divider />
        </VStack>
        // <TouchableOpacity onLongPress={() => markAsRead(item.id)}>
        //   <View style={styles.container}>
        //     <View style={[styles.row, viewStyle]}>
        //       <View style={{ flex: 2 }}>
        //         <Text style={[[styles.text, textStyle, { fontWeight: "bold" }]]} numberOfLines={3}>
        //           {item.text}
        //         </Text>
        //       </View>
        //       <View style={[styles.time, dotStyle]}>
        //         <Text style={[styles.timeText, textStyle]} numberOfLines={2}>
        //           {`${formatDistance(new Date(), new Date(item.created_at), { includeSeconds: true })} ago`}
        //         </Text>
        //         {item?.data?.type === "call" && (
        //           <Icon
        //             name="call"
        //             as={Ionicons}
        //             style={{ fontSize: 25, color: "blue", paddingRight: "4%" }}
        //             onPress={() => {
        //               call({ number: item.data.phone, prompt: true });
        //             }}
        //           />
        //         )}
        //       </View>
        //     </View>
        //     {item?.data.type === "client_confirm" && (
        //       <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
        //         <Text>Do you confirm?</Text>
        //         <TouchableOpacity
        //           onPress={() => {
        //             onConfirmPress && onConfirmPress(item);
        //           }}
        //           style={styles.buttonstyle}
        //         >
        //           <Text style={styles.buttonstyle}>Yes</Text>
        //         </TouchableOpacity>
        //         <Text>Do you want to reschedule?</Text>
        //         <TouchableOpacity
        //           onPress={() => {
        //             onNoButtonPress && onNoButtonPress(item);
        //           }}
        //           style={styles.buttonstyle}
        //         >
        //           <Text style={styles.buttonstyle}>Yes</Text>
        //         </TouchableOpacity>
        //       </View>
        //     )}
        //   </View>
        // </TouchableOpacity>
      )}
      {/* {isPop && (
        <View style={styles.popUp}>
          <Text style={[[styles.text, textStyle, {fontWeight: 'bold'}]]}>
            {data.title}
          </Text>
          <Text style={[[styles.text, textStyle]]} numberOfLines={2}>
            {data.description}
          </Text>
        </View>
      )} */}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    paddingVertical: 32,
    paddingHorizontal: 16,
    width: "95%",
    borderRadius: 15,
    backgroundColor: "white",
    alignSelf: "center",
    marginBottom: 12,
  },
  text: {
    marginLeft: 1,
    // fontFamily: "Helvetica",
  },
  time: {
    marginRight: 1,
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  timeText: {
    opacity: 0.4,
    // fontFamily: "Helvetica",
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: 12,
    backgroundColor: "#eee",
    marginTop: 4,
  },
  unDot: {
    height: 12,
    width: 12,
    borderRadius: 12,
    backgroundColor: "#eee",
    marginTop: 4,
  },
  popUp: {
    width: 100,
    height: 100,
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#eee",
  },
});
