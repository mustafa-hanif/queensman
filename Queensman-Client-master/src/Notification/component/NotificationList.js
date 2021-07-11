import { formatDistance } from 'date-fns'
import React from "react";
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { gql, useMutation } from "@apollo/client";

const UPDATE_NOTIFICATIONS = gql`
mutation UpdateNotifications($id: Int!) {
  update_notifications_by_pk(pk_columns: {id: $id}, _set: {isRead: true}) {
    id
  }
}
`;


const CONFIRM_CALLOUT = gql`
  mutation ConfirmCallout($callout_id: Int!, $id: Int!) {
    update_callout_by_pk(pk_columns: { id: $callout_id }, _set: { status: "Confirmed" }) {
      id
    }
    update_notifications_by_pk(pk_columns: {id: $id}, _set: {isRead: true, type: "client"}) {
      id
    }
  }
`;

export default function NotificationList({
  item,
  onNoButtonPress,
  setNotifications,
  notifications,
  viewStyle, 
  index,
  textStyle, 
  dotStyle
}) {

  const [updateNotifications] = useMutation(UPDATE_NOTIFICATIONS);
  const [confirmCalout, { 
    loading: confirmCalloutLoading, 
    error: confirmcalloutError 
  }] = useMutation(CONFIRM_CALLOUT);

  const onConfirmPress = (val) => {
    showMessage({
      message: "Notification marked as read",
      type: "success",
    });
    const item = [...notifications]
    item[index].isRead = true
    setNotifications(item)
    confirmCalout({
      variables: {
        callout_id: val.data.callout_id,
        id: val.id
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
    const item = [...notifications]
    item[index].isRead = true
    setNotifications(item)
    updateNotifications({variables:{
      id
    }})
  }

  return (
    <>
    <FlashMessage position="top" />
    {!item?.isRead && <TouchableOpacity onLongPress={() => markAsRead(item.id)}>
      <View style={styles.container}>
        <View style={[styles.row, viewStyle]}>
          <View style={{ flex: 2 }}>
            <Text style={[[styles.text, textStyle, { fontWeight: "bold" }]]} numberOfLines={2}>
              {item.text}
            </Text>
          </View>
          <View style={[styles.time, dotStyle]}>
            <Text style={[styles.timeText, textStyle]} numberOfLines={2}>
              {formatDistance(new Date(), new Date(item.created_at), { includeSeconds: true }) + " ago"}
            </Text>
          </View>
        </View>
        {item?.type === "client_confirm" && (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                onConfirmPress && onConfirmPress(item);
              }}
              style={styles.buttonstyle}
            >
              <Text style={styles.buttonstyle}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onNoButtonPress && onNoButtonPress(item);
              }}
              style={styles.buttonstyle}
            >
              <Text style={styles.buttonstyle}>No</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      </TouchableOpacity>}
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
  container: {
    marginBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: "95%",
    borderRadius: 15,
  },
  row: {
    flexDirection: "row",

    alignSelf: "center",
  },
  text: {
    marginLeft: 1,
    fontFamily: "Helvetica",
  },
  time: {
    marginRight: 1,
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  timeText: {
    opacity: 0.4,
    fontFamily: "Helvetica",
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  unDot: {
    height: 12,
    width: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  popUp: {
    width: 100,
    height: 100,
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#fff",
  },
  buttonstyle: {
    backgroundColor: "#FFCA5D",
    alignContent: "center",
    justifyContent: "center",
    // height: "7%",
    padding: "1%",
    paddingHorizontal: "2%",
    alignSelf: "flex-start",
    borderRadius: 6,
  },
  buttonTxt: {
    color: "#000E1E",
    fontSize: 14,
    fontFamily: "Helvetica",
    alignSelf: "center",
  },
});
