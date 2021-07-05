import { Button } from "native-base";
import React, { useState } from "react";
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";

export default function NotificationList({
  item,
  viewStyle,
  textStyle,
  dotStyle,
  onConfirmPress,
  onNoButtonPress,
  data,
}) {
  return (
    <>
      <View style={styles.container}>
        <View style={[styles.row, viewStyle]}>
          <View style={{ flex: 2 }}>
            <Text style={[[styles.text, textStyle, { fontWeight: "bold" }]]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[[styles.text, textStyle]]} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <Text> </Text>

          <View style={[styles.time, dotStyle]}>
            <Text style={[styles.timeText, textStyle]} numberOfLines={2}>
              {item.date}
            </Text>
          </View>
        </View>
        {item?.type === "client_confirm" && (
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <TouchableOpacity
              onPress={() => {
                onConfirmPress && onConfirmPress(data);
              }}
              style={styles.buttonstyle}
            >
              <Text style={styles.buttonstyle}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onNoButtonPress && onNoButtonPress(data);
              }}
              style={styles.buttonstyle}
            >
              <Text style={styles.buttonstyle}>No</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
