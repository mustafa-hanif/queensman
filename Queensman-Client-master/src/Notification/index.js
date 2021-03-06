/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationList from "./component/NotificationList";
import { auth } from "../utils/nhost";

const ConfirmByClient = gql`
  mutation ConfirmByClient($callout_id: Int!, $updater_id: Int!) {
    insert_job_history_one(
      object: {
        status_update: "Confirmed Client"
        callout_id: $callout_id
        updater_id: $updater_id
        updated_by: "client"
      }
    ) {
      time
      status_update
    }
  }
`;

const GET_NOTIFICATIONS = gql`
  query MyQuery($email: String!) {
    notifications(where: { client_email: { _eq: $email }, isRead: { _eq: false } }, order_by: { id: desc }) {
      id
      data
      created_at
      text
      isRead
    }
  }
`;

export default function Index(props) {
  const email = auth.user().email;

  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [getNotification, { loading, data, error }] = useLazyQuery(GET_NOTIFICATIONS, {
    onCompleted: (data) => {
      setNotifications(data?.notifications || []);
      setRefreshing(false);
    },
  });

  const onRefresh = React.useCallback(() => {
    setNotifications([]);
    setRefreshing(true);
    getNotification({ variables: { email } });
    console.log(error);
  }, []);

  useEffect(() => {
    if (!refreshing || loading) {
      getNotification({ variables: { email } });
    }
  }, []);
  if (error) {
    return (
      <View>
        <Text>Error</Text>
      </View>
    );
  }

  const unReadNotif = notifications.filter((noti) => noti.isRead == false || noti.isRead == undefined).length;

  const onNoButtonPress = (item) => {
    props.navigation.navigate("SelectSchedule", { commingFrom: "Notification", callout_id: item.data.callout_id });
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {data?.notifications == undefined || loading ? (
        <>
          <Text style={{ textAlign: "center", marginVertical: 20, fontSize: 14, fontWeight: "bold" }}>Loading</Text>
          <ActivityIndicator size="large" color="#FFCA5D" />
        </>
      ) : (
        <View>
          {notifications.length >= 1 && !loading ? (
            <Text style={{ textAlign: "right", marginTop: 20, marginRight: 8, marginBottom: 8, fontSize: 14 }}>
              <Text style={{ fontWeight: "bold" }}>{unReadNotif} unread</Text> notifications
            </Text>
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
              No new Notification. Pull down to refresh
            </Text>
          )}
          <View>
            {data?.notifications?.map((item, i) => (
              <NotificationList
                key={item.id}
                onNoButtonPress={onNoButtonPress}
                item={item}
                index={i}
                navigation={props.navigation}
                reloadNotification={() => getNotification({ variables: { email } })}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
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

const response = {
  radiobutton: [
    {
      id: 1,
      label: "car",
      value: "car",
    },
    {
      id: 2,
      label: "new car",
      value: "new car",
    },
  ],
  inputs: [
    { id: 1, label: "Your budget", placeholder: "", input_type: "number" },
    { id: 2, label: "Your name", placeholder: "", input_type: "text" },
  ],
  checkbox: null,
};
