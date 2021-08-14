/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { gql, useLazyQuery } from "@apollo/client";
import { Box, Icon } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons, FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";
import { auth } from "../utils/nhost";

const GET_PROPERTY_BY_ID = gql`
  query MyQuery($callout_by_email: String!) {
    property_owned(where: { client: { email: { _eq: $callout_by_email } } }) {
      property_id
    }
  }
`;

const GET_CALLOUTS = gql`
  query MyQuery($callout_by_email: String!, $property_id: Int!) {
    callout(
      where: { callout_by_email: { _eq: $callout_by_email }, property_id: { _eq: $property_id } }
      order_by: { id: desc }
    ) {
      id
      property_id
      request_time
      resolved_time
      planned_time
      picture1
      picture2
      picture3
      picture4
      job_type
      status
      urgency_level
      callout_job {
        rating
        feedback
        signature
        solution
        instructions
      }
      client_callout_email {
        client_id: id
        client_username: email
        phone
        full_name
      }
      property {
        address
        community
        city
      }
    }
  }
`;
const CalloutHistoryClass = (props) => {
  const [CalloutData, setCalloutData] = useState([]);

  const [loadProperty, { loading: loadingSingleProperty, data: selectedProperty, error: propertyError }] = useLazyQuery(
    GET_PROPERTY_BY_ID,
    {
      onCompleted: (data) => {
        loadCallouts({
          variables: {
            callout_by_email: email,
            property_id: data.property_owned[0].property_id,
          },
        });
        // AsyncStorage.setItem("QueensPropertyID", data.property_owned[0].property_id);
      },
    }
  );

  const [loadCallouts, { loading, data, error }] = useLazyQuery(GET_CALLOUTS, {
    onCompleted: (data) => {
      setCalloutData(data.callout);
    },
  });

  const user = auth?.currentSession?.session?.user;
  const email = user?.email;
  useEffect(() => {
    const load = async () => {
      const property_ID = await AsyncStorage.getItem("QueensPropertyID");
      if (!property_ID) {
        loadProperty({
          variables: {
            callout_by_email: email,
          },
        });
      } else {
        loadCallouts({
          variables: {
            callout_by_email: email,
            property_id: property_ID,
          },
        });
      }
    };
    load();
  }, []);
  const passItem = (item) => {
    // props.navigation.navigate("CalloutHistoryItem", {
    //   it: item,
    // });
  };

  if (loading || !data) {
    return <ActivityIndicator size="large" color="#FFCA5D" />;
  }

  if (error) {
    return <Box>{error}</Box>;
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.TextFam,
          {
            fontSize: 14,
            color: "#000E1E",
            paddingVertical: "5%",
            alignSelf: "center",
          },
        ]}
      >
        Viewing services for currently selected property
      </Text>

      <View>
        {CalloutData && (
          <View>
            <FlatList
              data={CalloutData}
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
                          as={Ionicons}
                          name="flag"
                          style={{
                            fontSize: 24,
                            color:
                              item?.urgency_level == "High"
                                ? "red"
                                : item?.urgency_level == "Scheduled"
                                ? "#aaa"
                                : "#FFCA5D",
                            paddingRight: "5%",
                          }}
                        />
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
                          <Image source={require("../../assets/Home/linehis.png")} style={{ height: 20, width: 20 }} />
                          <View style={{ flexDirection: "column" }}>
                            <Text style={[styles.TextFam, { fontSize: 10 }]}>Callout ID : {item?.id}</Text>
                            <Text style={[styles.TextFam, { fontSize: 10 }]}>Property ID : {item?.property_id}</Text>
                            <Text style={[styles.TextFam, { fontSize: 10 }]}>Status : {item?.status}</Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "column",
                            paddingRight: "5%",
                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={[
                              styles.TextFam,
                              {
                                fontSize: 10,
                                color: "#000",
                                fontWeight: "600",
                              },
                            ]}
                          >
                            Status: {item?.status}
                          </Text>
                          <Text
                            style={[
                              styles.TextFam,
                              {
                                fontSize: 9,
                                color: "#aaa",
                                alignSelf: "center",
                              },
                            ]}
                          >
                            Request time : {dayjs(item?.request_time).format("DD/MM/YYYY")}
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
          </View>
        )}
      </View>
    </View>
  );
};

// export default CalloutHistory;

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
    shadowRadius: 1, // IOS
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

export default CalloutHistoryClass;
