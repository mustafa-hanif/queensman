/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import moment from "moment";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import {
  Box,
  Content,
  CircleIcon,
  Pressable,
  Stack,
  HStack,
  Text,
  Image,
  Icon,
  VStack,
  Heading,
  Divider,
  ScrollView,
} from "native-base";
import { gql, useLazyQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  query MyQuery($callout_by_email: String!, $property_id: Int!, $today: date!) {
    callout(
      where: {
        callout_by_email: { _eq: $callout_by_email }
        property_id: { _eq: $property_id }
        schedule: { date_on_calendar: { _lte: $today } }
      }
      order_by: { schedule: { date_on_calendar: desc } }
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
      schedule {
        date_on_calendar
        time_on_calendar
      }
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
            today: moment().format("YYYY-MM-DD"),
            callout_by_email: email,
            property_id: data.property_owned[0].property_id,
          },
        });
        // AsyncStorage.setItem("QueensPropertyID", data.property_owned[0].property_id);
      },
    }
  );

  const [loadCallouts, { loading, data, error }] = useLazyQuery(GET_CALLOUTS, {
    onCompleted: (data2) => {
      setCalloutData(data2.callout);
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
  console.log(CalloutData);
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
              renderItem={({ item }) => <CalloutItem item={item} />}
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

const colors = {
  Waiting: "rose.600",
  "In Progress": "amber.600",
};

const CalloutItem = ({ item, toggleGalleryEventModal }) => {
  const color = item?.urgency_level === "High" ? "rose.600" : "amber.600";
  const statusColor = colors[item?.status] ? colors[item?.status] : "lightBlue.600";
  return (
    <Box bg="white" mx={8} rounded="lg">
      <Stack space={2.5} p={4}>
        <HStack alignItems="center">
          <CircleIcon size={4} mr={0.5} color={color} />
          <Text color={color} mr={2} fontSize="xs">
            {item.urgency_level}
          </Text>
          <CircleIcon size={4} mr={0.5} color={statusColor} />
          <Text color={statusColor} fontSize="xs">
            {item.status}
          </Text>
          <Text color="black" ml="auto" fontSize="xs">
            {item.id}
          </Text>
        </HStack>

        <Heading color="black" size="md" noOfLines={2}>
          {item.job_type}
        </Heading>
        {item?.client?.full_name && (
          <HStack>
            <Text mr={1} color="black" fontSize="sm">
              Reported by
            </Text>
            <Text color="amber.800" bold fontSize="sm">
              {item?.client?.full_name}
            </Text>
          </HStack>
        )}
        <HStack>
          <Text mr={1} color="black" fontSize="sm">
            Assigned to
          </Text>
          <Text color="indigo.800" bold fontSize="sm">
            {item?.job_worker?.[0]?.worker?.full_name}
          </Text>
        </HStack>
        <VStack>
          <Text mr={1} color="black" fontSize="sm">
            On Property
          </Text>
          <Text color="cyan.800" fontSize="sm">
            {item?.property?.address}, {item?.property?.city}
          </Text>
        </VStack>

        {item?.description && (
          <Text lineHeight={[5, 5, 7]} noOfLines={[4, 4, 2]} color="gray.700">
            {item.description}
          </Text>
        )}
        <Divider bg="gray.200" />
        <VStack space={2}>
          <Text color="black" fontSize="sm">
            Scheduled at
          </Text>
          {item?.schedule?.date_on_calendar && (
            <HStack space={2} alignItems="center">
              <AntDesign name="calendar" size={18} />
              <Text color="black" fontSize="sm">
                {moment(item.schedule?.date_on_calendar).format("Do MMMM, YYYY")}
              </Text>
            </HStack>
          )}
          {item?.schedule?.time_on_calendar && (
            <HStack space={2} alignItems="center">
              <AntDesign name="clockcircle" size={18} />
              <Text color="black" fontSize="sm">
                {moment(`2013-02-08T${item.schedule?.time_on_calendar}`).format("hh:mm A")}
              </Text>
            </HStack>
          )}
        </VStack>
      </Stack>
    </Box>
  );
};
