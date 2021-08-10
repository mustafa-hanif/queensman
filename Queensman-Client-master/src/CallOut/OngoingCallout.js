import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "native-base";
import { auth } from "../utils/nhost";

import { gql, useQuery } from "@apollo/client";
import PTRView from "react-native-pull-to-refresh";

const GET_CALLOUT = gql`
  query GetCallout($callout_by_email: String!) {
    callout(where: {callout_by_email: {_eq: $callout_by_email}}) {
      job_type
      id
      urgency_level
      picture1
      picture2
      picture3
      picture4
      status
      description
      schedulers(order_by: {date_on_calendar: desc}) {
        date_on_calendar
        time_on_calendar
        id
      }
      property {
        address
        city
        community
        country
      }
    }
  }
`;

const OngoingCallout = (props) => {
  const email = auth?.currentSession?.session?.user.email;
  const { loading, data, error } = useQuery(GET_CALLOUT, {
    variables: {
      callout_by_email: email,
    },
  });

  const passItem = (item) => {
    props.navigation.navigate("OngoingcalloutItem", {
      it: item,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ paddingTop: 5 }}> </Text>
      {!data?.callout ? (
        <Text
          style={[
            styles.TextFam,
            {
              fontSize: 14,
              color: "#aaa",
              paddingTop: "3%",
              alignSelf: "center",
            },
          ]}
        >
          No Scheduled Services
        </Text>
      ) : (
        <View>
          {loading ? (
            <ActivityIndicator size="large" color="#FFCA5D" />
          ) : (
            <FlatList
              data={data?.callout}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity onPress={() => passItem(item)}>
                    <View style={styles.Card}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={[styles.TextFam, { fontSize: 15, fontWeight: "bold" }]}>
                          Job Type: {item?.job_type}{" "}
                        </Text>
                        <Icon
                          as={<Ionicons name="flag-sharp" />}
                          name="flag"
                          style={{
                            fontSize: 24,
                            color: "#FFCA5D",
                          }}
                        ></Icon>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          paddingBottom: "5%",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={require("../../assets/Home/linehis.png")}
                            style={{ height: 20, width: 20 }}
                          ></Image>
                          <View style={{ flexDirection: "column" }}>
                            <Text style={[styles.TextFam, { fontSize: 10 }]}>
                              Schedule ID :{item?.schedulers[0]?.id}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: "column",
                            paddingRight: "5%",
                            alignItems: "flex-end",
                          }}
                        >
                          <Text style={[styles.TextFam, { fontSize: 9, color: "#aaa" }]}>
                            Date: {item?.schedulers[0]?.date_on_calendar}
                          </Text>
                          <Text style={[styles.TextFam, { fontSize: 9, color: "#aaa" }]}>
                            Time: {item?.schedulers[0]?.time_on_calendar}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Text> </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default OngoingCallout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  Name: {
    marginTop: "10%",
    marginLeft: "3%",
  },
  HeadingStyle: {
    fontSize: 23,
    paddingTop: "10%",
    paddingLeft: "6%",
    color: "#FFCA5D",

    fontFamily: "Helvetica",
  },
  Card: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 3, // Android
    width: "90%",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    // marginBottom: '3%',
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  TextFam: {
    fontFamily: "Helvetica",
  },
});
