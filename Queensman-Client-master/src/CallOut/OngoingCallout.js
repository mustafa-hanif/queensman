/* eslint-disable no-use-before-define */
import {
  Icon,
  CircleIcon,
  Center,
  Spinner,
  Button,
  Select,
  Stack,
  Text,
  Heading,
  CheckIcon,
  Box,
  FlatList,
  ChevronDownIcon,
  HStack,
  VStack,
  Divider,
} from "native-base";
import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { gql, useQuery } from "@apollo/client";
import { auth } from "../utils/nhost";

const GET_CALLOUT = gql`
  query GetCallout($callout_by_email: String!, $today: date = "") {
    callout(
      where: { callout_by_email: { _eq: $callout_by_email }, schedule: { date_on_calendar: { _gte: $today } } }
      order_by: { schedule: { date_on_calendar: asc } }
    ) {
      job_type
      id
      urgency_level
      picture1
      picture2
      picture3
      picture4
      status
      description
      property {
        address
        city
        community
        country
      }
      schedule {
        date_on_calendar
        time_on_calendar
        id
        worker {
          email
          full_name
        }
      }
    }
  }
`;

const OngoingCallout = (props) => {
  const email = auth?.currentSession?.session?.user.email;
  const { loading, data, error } = useQuery(GET_CALLOUT, {
    variables: {
      callout_by_email: email,
      today: moment().format("YYYY-MM-DD"),
    },
  });
  const passItem = (item) => {
    props.navigation.navigate("OngoingcalloutItem", {
      it: item,
    });
  };

  return (
    <View style={styles.container}>
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
              px={8}
              pt={8}
              bg="amber.100"
              data={data?.callout}
              renderItem={({ item }) => <Item item={item} passItem={passItem} />}
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
    
  },
});

const colors = {
  Waiting: "rose.600",
  "In Progress": "amber.600",
};
const Item = ({ item, passItem }) => {
  const color = item?.urgency_level === "High" ? "rose.600" : "amber.600";
  const statusColor = colors[item?.status] ? colors[item?.status] : "lightBlue.600";
  return (
    <Box bg="white" shadow={1} rounded="lg" mb={4}>
      <Stack space={2.5} p={4}>
        <HStack alignItems="center">
          <CircleIcon size={4} mr={0.5} color={color} />
          <Text color={color} mr={2} fontSize="xs">
            {item?.urgency_level}
          </Text>
          <CircleIcon size={4} mr={0.5} color={statusColor} />
          <Text color={statusColor} fontSize="xs">
            {item?.status}
          </Text>
          <Text color="black" ml="auto" fontSize="xs">
            {item?.id}
          </Text>
        </HStack>

        <Heading color="black" size="md" noOfLines={2}>
          {item?.job_type}
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
            {item?.schedule?.worker?.full_name}
          </Text>
        </HStack>
        <VStack>
          <Text mr={1} color="black" fontSize="sm">
            On Property
          </Text>
          <Text color="cyan.800" fontSize="sm">
          {item?.property ? `${item?.property?.address}, ${item?.property?.city}` : "No Property Assigned"}
          </Text>
        </VStack>

        {item?.description && (
          <Text lineHeight={[5, 5, 7]} noOfLines={[4, 4, 2]} color="gray.700">
            {item?.description}
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
                {moment(item?.schedule?.date_on_calendar).format("Do MMMM, YYYY")}
              </Text>
            </HStack>
          )}
          {item?.schedule?.time_on_calendar && (
            <HStack space={2} alignItems="center">
              <AntDesign name="clockcircle" size={18} />
              <Text color="black" fontSize="sm">
                {moment(`2013-02-08T${item?.schedule?.time_on_calendar}`).format("hh:mm A")}
              </Text>
            </HStack>
          )}
        </VStack>

        <Button onPress={() => passItem(item)} width={100} py={2} ml="auto" bg="lightBlue.200" size="xs">
          View Callout
        </Button>
      </Stack>
    </Box>
  );
};
