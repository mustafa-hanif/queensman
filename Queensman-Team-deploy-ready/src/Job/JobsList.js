/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

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
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import dayjs from "dayjs";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { auth } from "../utils/nhost";

const GET_JOBS_LIST = gql`
  query JobsList(
    $email: String
    $urgency: [String!] = ["High", "Medium", "Scheduled"]
  ) {
    callout(
      order_by: { request_time: desc }
      where: {
        job_worker: { worker: { email: { _eq: $email } } }
        status: { _neq: "Closed" }
        urgency_level: { _in: $urgency }
      }
    ) {
      id
      property_id
      job_type
      description
      status
      request_time
      planned_time
      picture1
      picture2
      picture3
      picture4
      urgency_level
      client_id: callout_by
      client: client_callout_email {
        full_name
        email
        phone
      }
      job: callout_job {
        instructions
      }
      job_worker {
        worker {
          full_name
          email
        }
      }
      property {
        id
        address
        community
        country
        city
      }
      schedulers {
        date_on_calendar
        time_on_calendar
      }
    }
  }
`;

const GET_JOBS_LIST_ALL = gql`
  query JobsList($urgency: [String!] = ["High", "Medium", "Scheduled"]) {
    callout(
      order_by: { id: desc }
      where: { urgency_level: { _in: $urgency } }
    ) {
      id
      property_id
      job_type
      description
      status
      request_time
      planned_time
      picture1
      picture2
      picture3
      picture4
      urgency_level
      client_id: callout_by
      client: client_callout_email {
        full_name
        email
        phone
      }
      job: callout_job {
        instructions
      }
      job_worker {
        worker {
          full_name
          email
        }
      }
      property {
        id
        address
        community
        country
        city
      }
      schedulers {
        date_on_calendar
        time_on_calendar
      }
    }
  }
`;

const JobsList = (props) => {
  const workerId = props.navigation.getParam("workerId", {});
  const workerEmail = auth?.currentSession?.session?.user.email;
  const [state, setState] = useState({
    assignedCallouts: [], //Ismain hayn saaray client ke ongoing callouts.
    dataAvaible: true,
    selected: null,
    TotalData: [],
  });

  const [getJobsFromEmail, { loading, data, error, refetch }] =
    useLazyQuery(GET_JOBS_LIST);

  const [getAllJobs, { loading: allLoading, data: allData, error: allError }] =
    useLazyQuery(GET_JOBS_LIST_ALL);
  let finalData = [
    "opscord@queensman.com",
    "opsmanager@queensman.com",
  ].includes(workerEmail)
    ? allData
    : data;
  const onFilterChange = (value) => {
    setState({
      ...state,
      selected: value,
    });
  };

  const passItem = (item) => {
    props.navigation.navigate("TicketListing", {
      it: item,
      workerId,
    });
  };

  useEffect(() => {
    const workerEmail = auth?.currentSession?.session?.user.email;
    setState({ workerEmail });
    let variables = undefined;
    if (
      ["opscord@queensman.com", "opsmanager@queensman.com"].includes(
        workerEmail
      )
    ) {
      if (state?.selected !== "All" && state?.selected !== null) {
        variables = {
          urgency: [state.selected],
        };
      }
      if (variables) {
        getAllJobs({ variables });
      } else {
        getAllJobs();
      }
    } else {
      variables = {
        email: auth?.currentSession?.session?.user.email,
      };
      if (state?.selected !== "All" && state?.selected !== null) {
        variables = {
          email: auth?.currentSession?.session?.user.email,
          urgency: [state.selected],
        };
      }
      if (variables) {
        getJobsFromEmail({ variables });
      } else {
        getJobsFromEmail();
      }
    }

    if (finalData?.callout) {
      setState({
        ...state,
        assignedCallouts: finalData.callout,
        dataAvaible: true,
        TotalData: finalData.callout,
      });
    } else {
      setState({ ...state, dataAvaible: false });
    }
  }, [
    finalData?.callout,
    state.selected,
    auth?.currentSession?.session?.user.email,
  ]);
  if (error) {
    console.log(error)
    return (
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
            color: "#FF2222",
            marginRight: "4%",
          }}
        >
          An Error Occured. Please restart the app.
          Error #182
        </Text>
      </View>
    );
  }

  return (
    <Box px={4}>
      <Select
        color="black"
        bg="white"
        mt={4}
        mb={4}
        selectedValue={state.selected}
        placeholder="Filter Options"
        dropdownIcon={<ChevronDownIcon color="black" />}
        _selectedItem={{
          bg: "black",
          endIcon: <CheckIcon size={4} />,
        }}
        onValueChange={(itemValue) => {
          onFilterChange(itemValue);
        }}
      >
        <Select.Item label="All" value="All" />
        <Select.Item label="Urgency Level:Medium" value="Medium" />
        <Select.Item label="Urgency Level:High" value="High" />
        <Select.Item label="Urgency Level:Scheduled" value="Scheduled" />
      </Select>
      <UnAssigned count={finalData?.callout?.length} />
      {(!loading || !allLoading) && finalData && (
        <FlatList
          data={state.assignedCallouts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => <Item item={item} passItem={passItem} />}
        />
      )}
      {(loading || allLoading) && (
        <Center>
          <Spinner color="amber.500" size="lg" />
        </Center>
      )}
    </Box>
  );
};

const UnAssigned = ({ count }) => {
  if (count === 0) {
    return (
      <Text
        style={[
          {
            fontSize: 14,
            color: "#aaa",
            paddingTop: "3%",
            alignSelf: "center",
          },
        ]}
      >
        No Assigned Services
      </Text>
    );
  }
  return null;
};
let colors = {
  Waiting: "rose.600",
  "In Progress": "amber.600",
};
const Item = ({ item, passItem }) => {
  const color = item?.urgency_level === "High" ? "rose.600" : "amber.600";

  const statusColor = colors[item?.status]
    ? colors[item?.status]
    : "lightBlue.600";
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
            {item?.description}
          </Text>
        )}
        <Divider bg="gray.200" />
        <VStack space={2}>
          <Text color="black" fontSize="sm">
            Scheduled at
          </Text>
          {item?.schedulers?.[0]?.date_on_calendar && (
            <HStack space={2} alignItems="center">
              <AntDesign name="calendar" size={18} />
              <Text color="black" fontSize="sm">
                {moment(item?.schedulers?.[0].date_on_calendar).format("Do MMMM, YYYY")}
              </Text>
            </HStack>
          )}
          {item?.schedulers?.[0]?.time_on_calendar && (
            <HStack space={2} alignItems="center">
              <AntDesign name="clockcircle" size={18} />
              <Text color="black" fontSize="sm">
                {moment(`2013-02-08T${item?.schedulers?.[0].time_on_calendar}`).format("hh:mm A")}
              </Text>
            </HStack>
          )}
        </VStack>

        <Button
          onPress={() => passItem(item)}
          width={100}
          py={2}
          ml="auto"
          bg="lightBlue.200"
          size="xs"
        >
          View Callout
        </Button>
      </Stack>
    </Box>
  );
};

export default JobsList;
