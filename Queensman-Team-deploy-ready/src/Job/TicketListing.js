/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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
import { Icon, CheckIcon } from 'native-base';
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
  const { property_id, client, job_type, id } = props.navigation.getParam(
    "it",
    {}
  );
  const [refresh, setrefresh] = useState(
    props.navigation.getParam("refresh", false)
  );

  const [fetchTickets, { loading, data, error }] = useLazyQuery(
    GET_JOB_TICKETS,
    {
      variables: {
        callout_id: Number(id),
      },
    }
  );

  const [getClosedTickets, { loading: allTicketsLoading, data: allTickets, error: allTicketsError }] = useLazyQuery(
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
            Ticket Listing For Property Id {property_id}
          </Text>
        </View>
        <View style={styles.mainViewContainer}>
          <Text style={styles.heading}>Job Type: {job_type} </Text>
          <Text style={{ color: commonColor.goldText }}>Client Details</Text>
          <View style={styles.subviewContainer}>
            <Text>Callout Name: {client?.full_name} </Text>
            <Text>Callout Email: {client?.email} </Text>
            <Text>Callout Phone Number: {client?.phone} </Text>
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
            <Text style={{ fontWeight: "bold" }}>
              {props.name}
            </Text>
            <Text style={{ fontSize: 13 }}>{props?.description}</Text>
        <Text style={{ fontSize: 12 }}>Ticket type: {props?.type}</Text>
        <Text style={{ fontSize: 12 }}>Status: <Text style={ props?.status == "Closed" && {color: 'red'}}>{props?.status}</Text></Text>
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

  const CreateTicketCard = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("CreateTicket", { callout_id: Number(id) });
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
      ticketCount: allTickets?.job_tickets.length
    });
  };
  const _tickets = [...(data?.job_tickets ?? []), ...(data?.null_ticket ?? [])];
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ margin: "3%" }}>
      <CreateTicketCard></CreateTicketCard>
      <TicketDetails></TicketDetails>

      <View style={{ marginTop: "2%" }}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFCA5D" />
        ) : (
          _tickets.map((item, index) => (
            <TicketCard
              key={item.name}
              onPress={() => onTicketPress(item)}
              Checked={item.status === 'Opened'}
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
