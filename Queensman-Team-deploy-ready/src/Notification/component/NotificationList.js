/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import call from 'react-native-phone-call'
import { Icon } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity, Pressable } from "react-native";
import { gql, useMutation } from "@apollo/client";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { formatDistance } from 'date-fns'


const UPDATE_NOTIFICATIONS = gql`
mutation UpdateNotifications($id: Int!) {
  update_notifications_by_pk(pk_columns: {id: $id}, _set: {isRead: true}) {
    id
  }
}
`;

export default function NotificationList({ item, updateNotifications: reloadNotification, viewStyle, textStyle, dotStyle, setNotifications, notifications, index }) {

  const [updateNotifications] = useMutation(UPDATE_NOTIFICATIONS, {
    onCompleted: () => {
      reloadNotification();
    }
  });

  const markAsRead = (id) => {
    updateNotifications({variables:{
      id
    }})
  }
  return (
    <>
      {!item?.isRead && <View><View style={{flex: 0.9}}><TouchableOpacity 
        onPress={() => {
          item.data.type === "call" && call({number: item.data.phone, prompt:true})
        }}>
        <View style={[styles.row, viewStyle]}>
          <View style={{ flex: 2 }}>
            <Text style={[[styles.text, textStyle, { fontWeight: "bold"}]]} numberOfLines={2}>
              {item.text}
            </Text>
          </View>
          <View style={[styles.time, dotStyle]}>
            <Text style={[styles.timeText, textStyle]} numberOfLines={2}>
              {item?.data?.type === "call" ?
                <Icon
                  name="call"
                  as={Ionicons}
                  style={{ fontSize: 25, color: "blue", paddingRight: "4%" }}
                />
                :
                formatDistance(new Date(), new Date(item.created_at), { includeSeconds: true }) + " ago"
                }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      </View>
      <View style={{flex: 0.1}}>
        <Pressable onPress={()=>markAsRead(item.id)}>
          <Text style={{color: 'red'}}>Dismiss</Text>
        </Pressable>
      </View></View>}
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
    backgroundColor: "#eee",
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
