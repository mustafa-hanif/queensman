/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import dayjs from 'dayjs';
import Modal from "react-native-modal";

import { Content, Icon } from "native-base";
import content from "react-native-signature-canvas/h5/html";

import { gql, useQuery, useMutation } from "@apollo/client";
import { auth } from "../utils/nhost";

const GET_JOB_WORKERS = gql`
  query FetchJobWorker($id: Int!) {
    callout_by_pk(id: $id) {
      job_worker {
        worker {
          id
          full_name
          email
          phone
        }
      }
    }
  }
`;

const START_JOB = gql`
  mutation StartJob($callout_id: Int!, $time: timestamp!, $updater_id: Int!) {
    update_callout_by_pk(
      pk_columns: { id: $callout_id }
      _set: { status: "In Progress" }
    ) {
      status
    }
    insert_job_history_one(
      object: {
        callout_id: $callout_id
        status_update: "In Progress"
        updated_by: "Ops Team"
        updater_id: $updater_id
        time: $time
      }
    ) {
      time
    }
  }
`;

const Job = (props) => {
  const [state, setState] = useState({
    Pic1: "photos/0690da3e-9c38-4a3f-ba45-8971697bd925.jpg",
    Pic2: "link",
    Pic3: "link",
    Pic4: "link",
    selectedPic:
      "https://en.wikipedia.org/wiki/Art#/media/File:Art-portrait-collage_2.jpg",
    isPicvisible: false, //veiw image app kay lia
    JobData: props.navigation.getParam("it", null),
    workerList: [],
    workerID: 1,
    imageLoading: false,
    W1ID: "none",
    W1Name: "none",
    W1Phone: "none",
    W1Email: "none",
    W2ID: "none",
    W2Name: "none",
    W2Phone: "none",
    W2Email: "none",
    W3ID: "none",
    W3Name: "none",
    W3Phone: "none",
    W3Email: "none",
  });

  const calloutIdFromParam = props.navigation.getParam("it", null);

  // API
  const [startJob, {  called: startJobCalled, loading: startJobLoading, error: startJobError }] = useMutation(START_JOB, {
    onError: (error) => alert(error),
  });

  if (startJobCalled && !startJobLoading) {
    props.navigation.navigate("PreJob", {
      QJobID: state.JobData.id,
    });
  }

  const { loading, data, error } = useQuery(GET_JOB_WORKERS, {
    variables: {
      id: calloutIdFromParam?.id,
    },
  });

  useEffect(() => {
    const jobWorkers = data?.callout_by_pk?.job_worker;
    setState({
      ...state,
      workerList: jobWorkers,
      W1ID: jobWorkers?.[0]?.worker?.id,
      W1Name: jobWorkers?.[0]?.worker?.full_name,
      W1Phone: jobWorkers?.[0]?.worker?.phone,
      W1Email: jobWorkers?.[0]?.worker?.email,
      W2ID: jobWorkers?.[1]?.worker?.id,
      W2Name: jobWorkers?.[1]?.worker?.full_name,
      W2Phone: jobWorkers?.[1]?.worker?.phone,
      W2Email: jobWorkers?.[1]?.worker?.email,
      W3ID: jobWorkers?.[2]?.worker?.id,
      W3Name: jobWorkers?.[2]?.worker?.full_name,
      W3Phone: jobWorkers?.[2]?.worker?.phone,
      W3Email: jobWorkers?.[2]?.worker?.email,
    });
  }, [data?.callout_by_pk?.job_worker]);

  const AlertStartJob = () => {
    Alert.alert(
      "Start the Job.",
      "Are you sure you want to start the job?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => StartJobHandler() },
      ],
      { cancelable: false }
    );
  };
  const StartJobHandler = () => {
    startJob({
      variables: {
        callout_id: state.JobData.id,
        updater_id: state.workerID,
        time: new Date().toJSON(),
      },
    });
  };
  const toggleGalleryEventModal = (value) => {
    setState({
      ...state,
      isPicvisible: !state.isPicvisible,
      selectedPic: `${value}?w=640&h=960&q=75`,
    });
  };

  const job = state?.JobData?.job?.[0];
  const client = state?.JobData?.client;
  const property = state?.JobData?.property;

  console.log(state?.JobData)
  if (loading) {
    return <ActivityIndicator size="large" color="#FFCA5D" />;
  }
  const pictureLinks = [...Array(4)].map((_, index) => {
    const statePicture = state.JobData[`picture${index}`];
    if (statePicture) {
      return <TouchableOpacity
      onPress={() => toggleGalleryEventModal(statePicture)}
      disabled={statePicture == "" ? true : false}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Icon
          name="image"
          style={{
            fontSize: 20,
            color: statePicture == "" ? "#aaa" : "#000E1E",
            paddingRight: "3%",
          }}
        ></Icon>
        <Text
          style={{
            fontSize: 13,
            marginBottom: "1%",
            color: statePicture == "" ? "#aaa" : "#000E1E",
          }}
        >
          Picture {index}
        </Text>
      </View>
    </TouchableOpacity>
    }
    return null;
  }).filter(Boolean);
  return (
    <ScrollView style={styles.container}>
      <View style={{ height: 20 }}></View>
      <Text style={styles.HeadingStyle}>{dayjs(state.JobData.request_time).format('DD MMM YYYY')}</Text>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "800",
          // fontFamily: 'serif',
          marginBottom: "3%",
        }}
      >
        Job type: {state.JobData.job_type}{" "}
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "1.5%",
        }}
      >
        Client details
      </Text>
      <View style={{ width: "100%", paddingHorizontal: "5%" }}>
        <Text style={{ fontSize: 13, marginBottom: "1%" }}>
          Callout Name: {client?.full_name}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: "1%" }}>
          Callout Email: {client?.email}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: "3%" }}>
          Callout Phone Number: {client?.phone}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "1.5%",
        }}
      >
        Callout details
      </Text>
      <View style={{ width: "100%", paddingHorizontal: "5%" }}>
        <Text style={{ fontSize: 13, marginBottom: "1%" }}>
          Callout ID: {state.JobData.id}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: "1%" }}>
          Description: {state.JobData.description}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: "1%" }}>
          Urgency Level: {state.JobData.urgency_level}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: "3%" }}>
          Request Time: {dayjs(state.JobData.request_time).format('DD MMM YYYY')}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "1.5%",
        }}
      >
        Property details
      </Text>
      <View style={{ width: "100%", paddingHorizontal: "5%" }}>
        <Text style={{ fontSize: 13, marginBottom: "1%" }}>
          Property ID: {property?.id}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: "1%" }}>
          Property Address: {property?.address}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: "1%" }}>
          Community: {property?.community}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: "1%" }}>
          City: {property?.city}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: "3%" }}>
          Country: {property?.country}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "1.5%",
        }}
      >
        Callout Images
      </Text>
      <View style={{ width: "100%", paddingHorizontal: "5%", marginTop: "2%" }}>
        {pictureLinks}
      </View>
      <View style={{ height: "3%" }}></View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "1.5%",
        }}
      >
        Instructions from Admin
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "3%", paddingHorizontal: "5%" }}
      >
        {job?.instructions}
      </Text>

      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "2%",
        }}
      >
        Assigned Ops Team
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        ID: {state.W1ID}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        Full Name: {state.W1Name}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        Phone: {state.W1Phone}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "3%", paddingHorizontal: "5%" }}
      >
        Email: {state.W1Email}
      </Text>

      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        ID: {state.W2ID}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        Full Name: {state.W2Name}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        Phone: {state.W2Phone}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "3%", paddingHorizontal: "5%" }}
      >
        Email: {state.W2Email}
      </Text>

      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        ID: {state.W3ID}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        Full Name: {state.W3Name}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        Phone: {state.W3Phone}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "7%", paddingHorizontal: "5%" }}
      >
        Email: {state.W3Email}
      </Text>

      <Button
        style={{ width: "20%" }}
        onPress={AlertStartJob}
        title="Start Job"
        color="#FFCA5D"
      />
      <View style={{ height: 80 }}></View>

      <Modal
        isVisible={state.isPicvisible}
        onSwipeComplete={() => setState({ ...state, isPicvisible: false })}
        swipeDirection={["left", "right", "down"]}
        onBackdropPress={() => setState({ ...state, isPicvisible: false })}
      >
        <View style={[styles.GalleryEventModel, { backgroundColor: "#fff" }]}>
          <Image
            style={{ width: "80%", height: "80%", alignSelf: "center" }}
            onLoadStart={() => setState({...state, imageLoading: true})}
            onLoadEnd={() => setState({...state, imageLoading: false})}
            source={{ uri: state.selectedPic }}
          />
          {state.imageLoading && <ActivityIndicator size="large" color="#FFCA5D" />}
          <TouchableOpacity
            onPress={() => setState({ ...state, isPicvisible: false })}
          >
            <View style={styles.ButtonSty}>
              <Text
                style={{ fontWeight: "bold", color: "#ffff", fontSize: 15 }}
              >
                Close
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

    paddingHorizontal: "5%",
  },
  HeadingStyle: {
    fontSize: 20,
    // fontFamily: 'serif',
    marginBottom: "2%",
  },
  GalleryEventModel: {
    //backgroundColor: '',
    padding: 22,
    //   backgroundColor: '#65061B',
    justifyContent: "space-around",
    // alignItems: 'center',
    borderRadius: 4,
    height: "70%",
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  ButtonSty: {
    backgroundColor: "#FFCA5D",
    //  borderRadius: 20,
    alignSelf: "center",
    width: "90%",
    // justifyContent: 'center',
    alignItems: "center",
    // height:'25%'
    paddingVertical: "3%",
  },
});

export default Job;
