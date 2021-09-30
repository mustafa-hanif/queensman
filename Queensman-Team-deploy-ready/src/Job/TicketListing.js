/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import call from "react-native-phone-call";
import moment from "moment"
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { HStack, Icon, IconButton } from 'native-base';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import commonColor from "../../native-base-theme/variables/commonColor";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";

const GET_JOB_TICKETS = gql`
  query MyQuery($callout_id: Int!) {
    job_tickets(where: {callout_id: {_eq: $callout_id}}, order_by: {created_at: desc}) {
      id
      name
      description
      pictures
      notes
      status
      type
      isVerified
      start_time
      end_time
    }
  }
`;

const ADD_HISTORY = gql`
  mutation RespondToClient($callout_id: Int = 10) {
    insert_job_history_one(object: {callout_id: $callout_id, status_update: "Responded to Client"}) {
      id
    }
  }
`;

const GET_JOB_TICKETS_CLOSED = gql`
  query MyQuery($callout_id: Int!) {
    job_tickets(where: {callout_id: {_eq: $callout_id}, status: {_neq: "Closed"}}, order_by: {created_at: desc}) {
      id
    }
  }
`;

export default function TicketListing(props) {
  const workerId = props.navigation.getParam("workerId", {})
  const { 
    property_id, 
    client, 
    property, 
    job_type, 
    id,
    schedulers
  } = props.navigation.getParam(
    "it",
    {}
  );
  const [refresh, setrefresh] = useState(
    props.navigation.getParam("refresh", false)
  );

  const [markAsResponded, { 
    loading: loading2, 
    data: data2, 
    error: erro2 
  }] = useMutation(ADD_HISTORY);

  const [fetchTickets, { 
    loading,
    data, 
    error 
  }] = useLazyQuery(
    GET_JOB_TICKETS,
    {
      variables: {
        callout_id: Number(id),
      },
    }
  );

  const [getClosedTickets, { 
    loading: allTicketsLoading, 
    data: allTickets, 
    error: allTicketsError 
  }] = useLazyQuery(
    GET_JOB_TICKETS_CLOSED,
    {
      variables: {
        callout_id: Number(id),
      },
    }
  );

  useEffect(() => {
    const { navigation } = props;
    const focusListener = navigation.addListener("didFocus", () => {
      fetchTickets();
      getClosedTickets();
      // The screen is focused
      // Call any action
    });
    return () => {
      focusListener.remove();
      return focusListener;
    };
  }, []);
  const TicketDetails = () => {
    return (
      <View style={{ borderWidth: 1 }}>
        <View style={{ backgroundColor: "black", padding: 10 }}>
          <Text style={styles.title}>
            Callout #{id} at {property.address}
          </Text>
        </View>
        <View style={styles.mainViewContainer}>
          <Text style={styles.heading}>Job Type: {job_type} </Text>
          <Text style={{ color: commonColor.goldText }}>Client Details</Text>
         
          <View style={styles.subviewContainer}>
            <Text>Client Name: {client?.full_name} </Text>
            <Text>Client Email: {client?.email} </Text>
            <Text>Client Phone Number: {client?.phone} </Text>
            <HStack space={2} alignItems="center">
            <Text>Call Client</Text>
            <IconButton
              bg="amber.200"
              onPress={() => {
                call({ number: client?.phone });
                markAsResponded({ variables: {
                  callout_id: id
                }});
              }}
              variant="solid"
              icon={<Icon size="xs" as={<AntDesign name="phone" />} color="amber.600" />}
            />
          </HStack>
          </View>
        </View>
      </View>
    );
  };

  const TicketCard = (props) => {
    return (
      <TouchableOpacity
        onPress={props.onPress}
        activeOpacity={0.8}
        style={{
          backgroundColor: "white",
          padding: "3%",
          marginVertical: "2%",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 10,
          borderRadius: 10,
          elevation: 4,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: "2%"
            //   borderWidth: 1,
          }}
        >
          <View>
            <Text style={{ fontSize: 14, marginBottom: 4, fontWeight: "bold" }}>Name: <Text style={{ fontWeight: "normal" }}>{props?.name}</Text></Text>
            <Text style={{ fontSize: 13, marginBottom: 4, fontWeight: "bold" }}>ID: <Text style={{ fontSize: 12, fontWeight: "normal"}}>{props?.id}</Text></Text>
            <Text style={{ fontSize: 13, marginBottom: 4, fontWeight: "bold" }}>Description: <Text style={{ fontSize: 12, fontWeight: "normal"}}>{props?.description}</Text></Text>
            <Text style={{ fontSize: 13, marginBottom: 4, fontWeight: "bold" }}>Ticket Type: <Text style={{ fontSize: 12, fontWeight: "normal"}}>{props?.type}</Text></Text>
            <Text style={{ fontSize: 13, marginBottom: 4, fontWeight: "bold" }}>Status: <Text style={ props?.status == "Closed" && {color: 'red'}}>{props?.status}</Text></Text>
              {props?.status == "Closed" ? <Text style={{ fontSize: 13 }}><Text style={{fontWeight: "bold"}}>Completion Time: </Text>{moment(props?.end_time).diff(moment(props?.start_time), "minutes")} Minute(s)</Text>
              : props?.status !== "Open" && <Text style={{ fontSize: 13 }}><Text style={{fontWeight: "bold"}}>Time since you started ticket: </Text>{props?.end_time ? moment(props?.end_time).diff(moment(props?.start_time), "minutes") : moment.utc().diff(moment(props?.start_time), 'minutes')} Minute(s)</Text>}
          </View>
          <View>
            {props.Checked ? (
              <Icon as={Ionicons} name='flag' style={{ fontSize: 20, color: 'green', marginBottom: 10}} />
            ) : <Icon as={Ionicons} name='flag' style={{ fontSize: 20, color: 'red', marginBottom: 10}} />}
            {props.isVerified && <Icon as={FontAwesome} name="check" style={{fontSize: 20, color: '#539bf5'}}/>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const CreateTicketCard = ({id, client, workerId}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("CreateTicket", {
            callout_id: Number(id),
            ticketDetails: {id, client, workerId, schedulers}
          });
        }}
        style={{
          borderWidth: 2,
          marginBottom: 10,
          borderColor: commonColor.primaryGold,
        }}
      >
        <View style={{ backgroundColor: "black", padding: 10 }}>
          <Text style={styles.title}>Create A New Ticket</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onTicketPress = (ticketDetails) => {
    props.navigation.navigate("Job", {
      it: props.navigation.getParam("it", {}),
      ticketDetails,
      ticketCount: allTickets?.job_tickets.length,
      workerId
    });
  };
  const _tickets = [...(data?.job_tickets ?? []), ...(data?.null_ticket ?? [])];
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ margin: "3%" }}>
      <CreateTicketCard client={client} id={id} workerId={workerId}></CreateTicketCard>
      <TicketDetails></TicketDetails>

      <View style={{ marginTop: "2%" }}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFCA5D" />
        ) : (
          _tickets.map((item, index) => (
            <TicketCard
              key={item.id}
              onPress={() => onTicketPress(item)}
              Checked={item.status === 'Open'}
              {...item}
            ></TicketCard>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: "bold",
    fontSize: 17,
    marginVertical: "3%",
  },
  mainViewContainer: {
    paddingHorizontal: "5%",
  },
  subviewContainer: {
    paddingVertical: "3%",
    paddingLeft: "5%",
  },
  title: {
    color: commonColor.primaryGold,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
