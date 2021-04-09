import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, ScrollView } from "react-native";
import NotificationList from "./component/NotificationList";

export default function index() {
  return (
    <>
      <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />
      <View style={{ flex: 1, paddingHorizontal: "5%", paddingVertical: "10%", marginTop: "15%" }}>
        <ScrollView>
          <NotificationList
            item={{
              title: "test",
              description: "test",
              date: "22-May-2019",
            }}
          />
          <NotificationList
            item={{
              title: "test",
              description: "test",
              date: "22-May-2019",
            }}
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = {
  gradiantStyle: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignSelf: "center",
  },
};
