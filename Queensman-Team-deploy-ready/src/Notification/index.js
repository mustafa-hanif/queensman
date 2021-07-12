/* eslint-disable no-unused-vars */
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import { gql, useQuery, useLazyQuery  } from "@apollo/client";
import FlashMessage from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationList from "./component/NotificationList";
import { auth } from "../utils/nhost";

const GET_NOTIFICATIONS = gql`
query GetWorkerNotifications($worker_email: String!) {
  notifications(where: {worker_email: {_eq: $worker_email}, isRead: {_eq: false}, id: {_gte: 239}}, order_by: {id: desc}, limit: 10) {
    text
    created_at
    data
    id
    isRead
  }
}
`;

export default function index() {
  const email = auth?.currentSession?.session?.user.email;

  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([])
  const [getNotification, { loading, data, error }] = useLazyQuery(GET_NOTIFICATIONS, {
    onCompleted: (data) => {
      setNotifications(data?.notifications || []); setRefreshing(false)
    }
  });

  const onRefresh = React.useCallback(() => {
    setNotifications([])
    setRefreshing(true)
    getNotification({ variables: { worker_email: email }})
    console.log(error)
  }, []);
  

  useEffect(() => {
    if(!refreshing || loading) {
      getNotification({ variables: { worker_email: email }})
    }
    return () => {loading}
  }, [])
  if (error) {
    return <View>
      <Text>Error</Text>
    </View>;
  }
  // console.log(notifications)
  // console.log(data, "ASDASDASDASDAS")
  const unReadNotif = notifications.filter(noti => noti.isRead == false || noti.isRead == undefined).length
  return (
    <ScrollView  refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />}>
      {data?.notifications == undefined || loading ? <><Text style={{textAlign: 'center', marginVertical: 20, fontSize: 20, fontWeight: 'bold'}}>Loading</Text><ActivityIndicator size="large" color="#FFCA5D" /></> : <View>
      {notifications.length >= 1 && !loading ? <Text style={{textAlign: 'center', marginTop: 20, fontSize: 20}}>You have <Text style={{color: "red", fontWeight: 'bold'}}>{unReadNotif} unread</Text> notifications</Text> : <Text style={{textAlign: 'center', marginTop: 20, fontSize: 20}}>You have no new Notification. Pull down to refresh</Text>}
      {notifications.length >= 1 && <Text style={{fontSize: 15, textAlign: 'center', marginBottom: 20}}>Long press the notification to mark as read</Text>}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20, }}>
         {notifications.map((item, i) => {
         return (
              <NotificationList
              item={item}
              key={i}
              index={i}
              setNotifications={setNotifications} 
              updateNotifications={() => getNotification({ variables: { worker_email: email }})}
              notifications={notifications}
            />
         )
         })}
      </View>
      </View>}
    </ScrollView>
  );
}

const styles = {
  gradiantStyle: {
    width: "100%",
    height: 120
  },
};
