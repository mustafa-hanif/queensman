import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
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
    client(where: { email: { _eq: $email } }) {
      client_notifications {
        text
        type
        data
      }
    }
  }
`;
const CONFIRM_CALLOUT = gql`
  mutation ConfirmCallout($callout_id: Int!) {
    update_callout_by_pk(pk_columns: { id: $callout_id }, _set: { status: "Confirmed" }) {
      id
    }
  }
`;

export default function Index(props) {
  const email = auth?.currentSession?.session?.user.email;

  console.log({ email });
  const { loading, data, error } = useQuery(GET_NOTIFICATIONS, {
    variables: { email },
  });

  const [confirmCalout, { loading: confirmCalloutLoading, error: confirmcalloutError }] = useMutation(CONFIRM_CALLOUT);

  const onConfirmPress = (data) => {
    confirmCalout({
      variables: {
        callout_id: data.callout_id,
      },
    })
      .then((res) => console.log(res))
      .catch(console.log);
  };

  const onNoButtonPress = (data) => {
    props.navigation.navigate("SelectSchedule", { commingFrom: "Notification", callout_id: data.callout_id });
  };

  return (
    <>
      <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />
      <View style={{ flex: 1, paddingHorizontal: "5%", paddingVertical: "10%", marginTop: "15%" }}>
        <ScrollView>
          {data?.client[0]?.client_notifications?.map((val, index) => (
            <NotificationList
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              onNoButtonPress={onNoButtonPress}
              onConfirmPress={onConfirmPress}
              data={val.data}
              item={{
                title: val.text,
                type: val.type,
                // description: "test",
                // date: "22-May-2019",
              }}
            />
          ))}
        </ScrollView>
      </View>
    </>
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
