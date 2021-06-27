import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import commonColor from "../../native-base-theme/variables/commonColor";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_JOB_TICKETS = gql`
  query MyQuery($callout_id: Int!) {
    job_tickets(where: { callout_id: { _eq: $callout_id } }) {
      name
      description
    }
  }
`;

export default function TicketListing(props) {
  //   console.log(props.navigation.getParam("it", {}));
  const { property_id, client, job_type, id } = props.navigation.getParam(
    "it",
    {}
  );

  const { loading, data, error } = useQuery(GET_JOB_TICKETS, {
    variables: {
      callout_id: Number(id),
    },
  });

  console.log({ loading, data, error });

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
      <View
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
          shadowRadius: 2.62,

          elevation: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            //   borderWidth: 1,
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>
              Ticket Type : {props.ticketType}
            </Text>
          </View>
          <View>
            {props.Checked && (
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../assets/checkicon.png")}
              ></Image>
            )}
          </View>
        </View>
        <Text style={{ fontSize: 13 }}>{props?.description}</Text>
      </View>
    );
  };

  const CreateTicketCard = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("CreateTicket");
        }}
        style={{
          borderWidth: 2,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: commonColor.primaryGold,
        }}
      >
        <View style={{ backgroundColor: "black", padding: 10 }}>
          <Text style={styles.title}>Create A New Ticket</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ margin: "3%" }}>
      <CreateTicketCard></CreateTicketCard>
      <TicketDetails></TicketDetails>

      <View style={{ marginTop: "2%" }}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFCA5D" />
        ) : (
          <FlatList
            data={data?.job_tickets}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
              <TicketCard
                Checked={true}
                description={item.description}
                ticketType={item.name}
              ></TicketCard>
            )}
          ></FlatList>
        )}
      </View>
    </View>
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
