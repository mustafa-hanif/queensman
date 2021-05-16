import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
// import { gql, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationList from "./component/NotificationList";
// import { auth } from "../utils/nhost";

// const GET_NOTIFICATIONS = gql`
//   query MyQuery($email: String!) {
//     client(where: { email: { _eq: $email } }) {
//       client_notifications {
//         notification
//       }
//     }
//   }
// `;

export default function index() {
  // const email = auth?.currentSession?.session?.user.email;

  // console.log({ email });
  // const { loading, data, error } = useQuery(GET_NOTIFICATIONS, {
  //   variables: { email },
  // });

  return (
    <>
      <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />
      <View style={{ flex: 1, paddingHorizontal: "5%", paddingVertical: "10%", marginTop: "15%" }}>
        <ScrollView>
          {/* {data?.client[0]?.client_notifications?.map((val, index) => ( */}
            <NotificationList
              key={1}
              item={{
                title: 'val?.notification',
                description: "test",
                date: "22-May-2019",
              }}
            />
          {/* ))} */}
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
