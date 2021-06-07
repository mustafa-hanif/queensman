/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";

export default function NotificationList({ item, viewStyle, textStyle, dotStyle }) {
  console.log(item)
  return (
    <>
      <TouchableOpacity onPress={() => {}}>
        <View style={[styles.row, viewStyle]}>
          <View style={{ flex: 2 }}>
            <Text style={[[styles.text, textStyle, { fontWeight: "bold" }]]} numberOfLines={2}>
              {item.text}
            </Text>
          </View>
          <View style={[styles.time, dotStyle]}>
            <Text style={[styles.timeText, textStyle]} numberOfLines={2}>
              {item.created_at}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
    paddingTop: 16,
    paddingBottom: 32,
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
