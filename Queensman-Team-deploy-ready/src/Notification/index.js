/* eslint-disable no-unused-vars */
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { gql, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationList from "./component/NotificationList";
import { auth } from "../utils/nhost";

const GET_NOTIFICATIONS = gql`
query GetWorkerNotifications($worker_email: String!) {
  notifications(where: {worker_email: {_eq: $worker_email}}) {
    text
    created_at
  }
}
`;

export default function index() {
  const email = auth?.currentSession?.session?.user.email;

  console.log({ email: email ?? 'azamkhan@queensman.com' });
  const { loading, data, error } = useQuery(GET_NOTIFICATIONS, {
    variables: { worker_email: email ?? 'azamkhan@queensman.com' },
  });
  console.log(loading, data, error);
  if (error) {
    return <View>
      <Text>Error</Text>
    </View>;
  }
  if (loading) {
    return <ActivityIndicator size="large" color="#FFCA5D" />;
  }
  
  return (
    <View>
      <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />
      <View style={{ paddingHorizontal: 20, paddingVertical: 20, marginTop: 40 }}>
        <FlatList data={data?.notifications} keyExtractor={(item, index) => `${index}`} renderItem={({item}) => <NotificationList
              item={item}
            />} />
      </View>
    </View>
  );
}

const styles = {
  gradiantStyle: {
    width: "100%",
    height: 120,
  },
};
