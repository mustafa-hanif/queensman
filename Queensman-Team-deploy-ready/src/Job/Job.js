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
  TextInput,
} from "react-native";
import { Icon } from "native-base";
import dayjs from "dayjs";
import Modal from "react-native-modal";

import { gql, useQuery, useMutation } from "@apollo/client";
import { auth } from "../utils/nhost";
import * as Location from "expo-location";

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

const ADD_TICKET_NOTE = gql`
  mutation AddNote($notes: jsonb!, $id: Int!) {
    update_job_tickets_by_pk(
      pk_columns: { id: $id }
      _append: { notes: $notes }
    ) {
      notes
    }
  }
`;

const STOP_JOB = gql`
  mutation CloseTicket($id: Int!, $worker_email: String!, $notes: jsonb!) {
    update_job_tickets_by_pk(
      pk_columns: { id: $id }
      _set: { status: "Closed" }
      _append: { notes: $notes }
    ) {
      id
    }
    insert_job_tickets_one(
      object: { type: "Deferred", worker_email: $worker_email, notes: [$notes] }
    ) {
      id
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

  const [notes, setnotes] = useState("");
  const [closeJobNote, setcloseJobNote] = useState("");

  const calloutIdFromParam = props.navigation.getParam("it", null);
  const ticket = props.navigation.getParam("ticketDetails", {});
  const [ticketNotesArray, setticketNotesArray] = useState(ticket.notes);

  // API
  const [
    startJob,
    { called: startJobCalled, loading: startJobLoading, error: startJobError },
  ] = useMutation(START_JOB, {
    onError: (error) => alert(error),
  });

  const [stopJobModalVisible, setstopJobModalVisible] = useState(false);
  const [addNote, { Notesdata, loading: addNoteLoading, error: addNoteError }] =
    useMutation(ADD_TICKET_NOTE);

  console.log({ Notesdata, addNoteLoading, addNoteError });

  const [
    stopJob,
    { stopJobData, loading: stopJobLoading, error: stopJobError },
  ] = useMutation(STOP_JOB);

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

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return null;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return JSON.stringify(location);
  };

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

  if (loading) {
    return <ActivityIndicator size="large" color="#FFCA5D" />;
  }

  const RenderPictures = (arrayOfPics) => {
    return arrayOfPics.map((val, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => toggleGalleryEventModal(val)}
        // disabled={false}
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
              color: "#000E1E",
              paddingRight: "3%",
            }}
          ></Icon>
          <Text
            style={{
              fontSize: 13,
              marginBottom: "1%",
              color: "#000E1E",
            }}
          >
            Picture {index + 1}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };

  const pictureLinks = [...Array(4)]
    .map((_, index) => {
      const statePicture = state.JobData[`picture${index}`];
      if (statePicture) {
        return statePicture;
      }
      return null;
    })
    .filter(Boolean);

  const Heading = (props) => {
    return (
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "1.5%",
          ...props.style,
        }}
      >
        {props.children}
      </Text>
    );
  };

  const RenderComment = ({ from, message }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: "1%",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
              fontStyle: "italic",
              marginRight: 8,
            }}
          >
            - {from} :
          </Text>
          <Text>{message}</Text>
        </View>
      </View>
    );
  };

  const AddNoteApiCall = () => {
    if (notes === "") {
      return alert("Cannot add empty Note");
    }
    const { display_name } = auth.user();

    const param = {
      notes: { from: display_name, message: notes },
      id: ticket.id,
    };

    console.log("calling api");
    addNote({
      variables: param,
    })
      .then((res) => {
        console.log({ res });
        setnotes("");
        setticketNotesArray(res.data.update_job_tickets_by_pk.notes);
      })
      .catch(console.log);
  };

  const RenderAddNote = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Icon
          name="ios-newspaper-outline"
          style={{ fontSize: 18, color: "#000E1E", paddingRight: "4%" }}
        ></Icon>
        <TextInput
          style={{
            fontSize: 15,
            color: "#000E1E",
            width: "83%",
          }}
          placeholder="Type note here..."
          defaultValue={notes}
          value={notes}
          placeholderTextColor="#000E1E"
          underlineColorAndroid="transparent"
          onChangeText={(Note) => {
            setnotes(Note.trimLeft());
          }} //email set
        />
        <TouchableOpacity onPress={AddNoteApiCall}>
          <Icon
            name="add-circle"
            style={{ fontSize: 25, color: "#000E1E" }}
          ></Icon>
        </TouchableOpacity>
      </View>
    );
  };

  const RenderValue = (props) => {
    return (
      <Text
        style={{
          fontSize: 14,
          fontWeight: "800",
          // fontFamily: 'serif',
          marginBottom: "3%",
        }}
      >
        {props.children}
      </Text>
    );
  };

  const onStopJobPress = () => {
    setstopJobModalVisible(true);
  };

  const onFinalSubmitButton = () => {
    if (closeJobNote === "") {
      return alert("Please enter a note");
    }
    console.log({
      id: ticket.id,
      worker_email: auth.user().email,
      notes: closeJobNote,
    })

    stopJob({
      variables: {
        id: ticket.id,
        worker_email: auth.user().email,
        notes: closeJobNote,
      },
    })
      .then((res) => {
        console.log({ res });
        setstopJobModalVisible(false);
        props.navigation.navigate("HomeNaviagtor");
      })
      .catch(console.log);
  };
  return (
    <ScrollView style={styles.container}>
      <View
        style={{ borderBottomWidth: 1, marginVertical: 20, paddingBottom: 20 }}
      >
        <Heading style={{ fontSize: 20, alignSelf: "center", color: "black" }}>
          Ticket Details
        </Heading>
        <Heading>Name</Heading>
        <RenderValue>{ticket.name}</RenderValue>
        <Heading>Description</Heading>
        <RenderValue>{ticket.description}</RenderValue>

        <Heading>Pictures</Heading>
        <View style={{ marginVertical: 10 }}>
          {RenderPictures(ticket.pictures)}
        </View>
        <Heading>Notes</Heading>
        {ticketNotesArray?.map((val, index) => {
          const { from, message } = val;
          return (
            <RenderComment
              key={index}
              from={from}
              message={message}
            ></RenderComment>
          );
        })}

        {RenderAddNote()}
      </View>
      <Text style={[styles.HeadingStyle, { alignSelf: "center" }]}>
        Overall Job Details
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "800",
          // fontFamily: 'serif',
          marginBottom: "3%",
          alignSelf: "center",
        }}
      >
        {dayjs(state.JobData.request_time).format("DD MMM YYYY")}
      </Text>

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
          Request Time:{" "}
          {dayjs(state.JobData.request_time).format("DD MMM YYYY")}
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
        {RenderPictures(pictureLinks)}
      </View>
      <View style={{ height: "1%" }}></View>
      {job?.instructions && (
        <>
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
            style={{
              fontSize: 13,
              marginBottom: "3%",
              paddingHorizontal: "5%",
            }}
          >
            {job?.instructions}
          </Text>
        </>
      )}

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

      <View style={{ marginTop: 20, marginBottom: 40 }}>
        <Button
          // style={{ width: "20%" }}
          onPress={onStopJobPress}
          title="Stop Job"
          color="#cf142b"
        />
      </View>

      <Modal
        isVisible={state.isPicvisible}
        onSwipeComplete={() => setState({ ...state, isPicvisible: false })}
        swipeDirection={["left", "right", "down"]}
        onBackdropPress={() => setState({ ...state, isPicvisible: false })}
      >
        <View style={[styles.GalleryEventModel, { backgroundColor: "#fff" }]}>
          <Image
            style={{ width: "80%", height: "80%", alignSelf: "center" }}
            onLoadStart={() => setState({ ...state, imageLoading: true })}
            onLoadEnd={() => setState({ ...state, imageLoading: false })}
            source={{ uri: state.selectedPic }}
          />
          {state.imageLoading && (
            <ActivityIndicator size="large" color="#FFCA5D" />
          )}
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
      <Modal
        isVisible={stopJobModalVisible}
        onBackdropPress={() => stopJobModalVisible(false)}
      >
        <View
          style={{
            width: "90%",

            borderRadius: 10,
            padding: 15,
            backgroundColor: "white",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Why Are you closing this job?
          </Text>
          <TextInput
            placeholder={"Write your reason here..."}
            multiline={true}
            onChangeText={(val) => {
              setcloseJobNote(val.trimLeft());
            }}
            style={{
              height: 80,
              textAlignVertical: "top",
              padding: 5,
            }}
          ></TextInput>
          <Button
            style={{ width: "20%" }}
            onPress={onFinalSubmitButton}
            title="Submit"
          />
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
