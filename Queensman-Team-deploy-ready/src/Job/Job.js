/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment"
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
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";
import Modal from "react-native-modal";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions'
import { gql, useQuery, useMutation } from "@apollo/client";
import { auth } from "../utils/nhost";
import { Video } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import { SECRECT } from "../_config";

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
  mutation StartJob(
    $callout_id: Int!
    $ticket_id: Int!
    $location: String = ""
    $updater_id: Int!
  ) {
    update_callout_by_pk(
      pk_columns: { id: $callout_id }
      _set: { status: "In Progress" }
    ) {
      status
    }
    update_job_tickets_by_pk(
      pk_columns: { id: $ticket_id }
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
        location: $location
      }
    ) {
      id
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

const UPDATE_TICKET_VERIFICATION = gql`
  mutation UpdateVerificaiton($isVerified: Boolean, $id: Int!) {
    update_job_tickets_by_pk(
      pk_columns: { id: $id }
      _set: { isVerified: $isVerified }
    ) {
      isVerified
    }
  }
`;

const STOP_JOB = gql`
  mutation CloseTicket(
    $id: Int!
    $callout_id: Int!
    $worker_email: String!
    $name: String!
    $desc: String!
    $notes: jsonb!
    $type: String!
    $status: String!
    $worker_id: Int!
    $scheduler_id: Int!
    $client_email: String!
  ) {
    update_job_tickets_by_pk(
      pk_columns: { id: $id }
      _set: { status: "Closed" }
      _append: { notes: $notes }
    ) {
      id
    }
    insert_job_tickets_one(
      object: {
        name: $name
        description: $desc
        callout_id: $callout_id
        type: $type
        worker_email: $worker_email
        worker_id: $worker_id
        scheduler_id: $scheduler_id
        notes: [$notes]
        status: $status
        client_email: $client_email
      }
    ) {
      id
    }
  }
`;

const CHANGE_JOB_TYPE = gql`
  mutation CloseTicket(
    $id: Int!
    $notes: jsonb!
    $status: String!
    $type: String!
  ) {
    update_job_tickets_by_pk(
      pk_columns: { id: $id }
      _set: { status: $status, type: $type }
      _append: { notes: $notes }
    ) {
      id
    }
  }
`;

const Job = (props) => {
  const worker_email = auth.user().email;
  const video = React.useRef(null);
  const [status, setStatus] = useState({});
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
    workerID: props.navigation.getParam("workerId", {}),
    imageLoading: false,
    workerId: "none",
    wokerName: "none",
    workerPhone: "none",
    workerEmail: "none",
    type: ticket?.type,
  });
console.log(state?.JobData?.video)
  const [notes, setnotes] = useState("");
  const [closeJobNote, setcloseJobNote] = useState("");

  const calloutIdFromParam = props.navigation.getParam("it", null);
  const ticket = props.navigation.getParam("ticketDetails", {});
  const workerId = props.navigation.getParam("workerId", {});
  const [ticketNotesArray, setticketNotesArray] = useState(ticket.notes);

  // API
  const [
    startJob,
    { data: startJobCalled, loading: startJobLoading, error: startJobError },
  ] = useMutation(START_JOB);

  const [stopJobModalVisible, setstopJobModalVisible] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [addNote, { Notesdata, loading: addNoteLoading, error: addNoteError }] =
    useMutation(ADD_TICKET_NOTE);

  // console.log({ Notesdata, addNoteLoading, addNoteError });
  const [isVerified, setIsVerified] = useState(ticket.isVerified);
  const [updateVerification, { data: verificationData }] = useMutation(
    UPDATE_TICKET_VERIFICATION
  );

  const [
    stopJob,
    { stopJobData, loading: stopJobLoading, error: stopJobError },
  ] = useMutation(STOP_JOB);

  const [
    changeJobType,
    {
      changeJobTypeData,
      loading: changeJobTypeLoading,
      error: changeJobTypeError,
    },
  ] = useMutation(CHANGE_JOB_TYPE);

  // if (startJobCalled && !startJobLoading) {
  //   props.navigation.navigate("PreJob", {
  //     QJobID: state.JobData.id,
  //     it: props.navigation.getParam("it", {}),
  //     ticketDetails: props.navigation.getParam("ticketDetails", {}),
  //     ticketCount: props.navigation.getParam('ticketCount', {}),
  //   });
  // }

  const { loading, data, error } = useQuery(GET_JOB_WORKERS, {
    variables: {
      id: calloutIdFromParam?.id,
    },
  });

  const getLocation = async () => {
    try {
      await Location.enableNetworkProviderAsync()
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        return null;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      return JSON.stringify(location);
    } catch (e) {
      console.log(e)
      let location = await Location.getLastKnownPositionAsync();
      if (location) {
        return JSON.stringify(location);
      } else {
        return null
      }
    }
  };

  useEffect(() => {
    const jobWorkers = data?.callout_by_pk?.job_worker;
    setState({
      ...state,
      workerId: jobWorkers?.[0]?.worker?.id,
      wokerName: jobWorkers?.[0]?.worker?.full_name,
      workerPhone: jobWorkers?.[0]?.worker?.phone,
      workerEmail: jobWorkers?.[0]?.worker?.email,
    });
  }, [data?.callout_by_pk?.job_worker]);

  const AlertError = () => {
    Alert.alert(
      "Error",
      "An error occured while submitting.",
      [
        {
          text: "Go back",
          onPress: () => props.navigation.navigate("JobList"),
        },
      ],
      { cancelable: false }
    );
  };
  const AlertStartJob = () => {
    const jobStatus = ticket.status === "In Progress" ? false : true
    Alert.alert(
      `${jobStatus ? 'Start the Job.' : 'Continue the Job'}`,
      `${jobStatus ? "Are you sure you want to start the job?" : "Are you sure you want to continue the job?"}`,
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

  const markAsVerified = (isVerified) => {
    updateVerification({
      variables: {
        id: ticket.id,
        isVerified,
      },
    });
    setIsVerified(isVerified);
  };

  const StartJobHandler = async () => {
    const location = await getLocation();
    console.log(location)
    try {
    await startJob({
      variables: {
        ticket_id: ticket.id,
        callout_id: state.JobData.id,
        updater_id: workerId,
        location,
      },
    });
    console.log("navigating");
    props.navigation.navigate("PreJob", {
      QJobID: state.JobData.id,
      it: props.navigation.getParam("it", {}),
      ticketDetails: props.navigation.getParam("ticketDetails", {}),
      ticketCount: props.navigation.getParam("ticketCount", {}),
      workerId,
    });
    console.log("navigated");
  } catch (e) {
    console.log(e)
  }
}

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
            as={Ionicons}
            name="image"
            style={{
              fontSize: 20,
              color: "#000E1E",
              paddingRight: "3%",
            }}
          />
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
    console.log(auth.user());
    const { display_name } = auth.user();

    const param = {
      notes: { from: display_name, message: notes },
      id: ticket.id,
    };

    console.log("calling api", param);
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
          as={Ionicons}
          name="ios-newspaper-outline"
          style={{ fontSize: 18, color: "#000E1E", paddingRight: "4%" }}
        />
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
            as={Ionicons}
            name="add-circle"
            style={{ fontSize: 25, color: "#000E1E" }}
          />
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

  const onFinalSubmitButton = async () => {
    if (closeJobNote === "") {
      return alert("Please enter a note");
    }
    setLoadingModalVisible(true);
    const form = new FormData();
    /*eslint-disable*/
    form.append(
      "arguments",
      JSON.stringify({
        subject: `Defer Ticket of ${ticket.id}`,
        email: client?.email,
        description: `Note: ${closeJobNote} \n Ticket Type: ${state.type}`,
        status: "Open",
        lastTicket: false,
      })
    );

    try {
      const result = await fetch(
        "https://www.zohoapis.com/crm/v2/functions/createzohodeskticket/actions/execute?auth_type=apikey&zapikey=1003.db2c6e3274aace3b787c802bb296d0e8.3bef5ae5ee6b1553f7d3ed7f0116d8cf",
        {
          method: "POST",
          headers: {
            "x-hasura-admin-secret": SECRECT,
          },
          body: form,
        }
      );
      let resultJson = await result.json();
      let output = resultJson.details.output;
      if (output.substring(0, 14) == "No email found") {
        alert(output);
      }
    } catch (e) {
      console.log("ERROR");
      console.log(e);
    }
      try {
        await stopJob({
          variables: {
            name: `Defer Ticket of ${ticket.id}`,
            desc: closeJobNote,
            id: ticket.id,
            worker_email: state.JobData.job_worker[0].worker.email,
            worker_id: state.JobData.job_worker[0].worker.id,
            callout_id: state.JobData.id,
            scheduler_id: state.JobData.schedulers[0].id,
            notes: {
              from: state.JobData.job_worker[0].worker.full_name,
              message: closeJobNote,
            },
            status: "Open",
            type: state.type != "Deferred" ? state.type : "Deferred",
            client_email: client?.email,
          },
        });
        setstopJobModalVisible(false);
        setLoadingModalVisible(false);
        props.navigation.navigate("TicketListing");
      } catch (e) {
        console.log(e);
      }
  };
  return (
    <ScrollView style={styles.container}>
      <View
        style={{ borderBottomWidth: 1, marginVertical: 20, paddingBottom: 20 }}
      >
        <Heading style={{ fontSize: 20, alignSelf: "center", color: "black" }}>
          Ticket Details
        </Heading>
        <Text style={{ fontSize: 12, alignSelf: "center" }}>
          Status:{" "}
          <Text style={ticket?.status == "Closed" && { color: "red" }}>
            {ticket?.status}
          </Text>
        </Text>
        <Heading>Name</Heading>
        <RenderValue>{ticket.name}</RenderValue>
        <Heading>Description</Heading>
        <RenderValue>{ticket.description}</RenderValue>

        <Heading>Pictures</Heading>
        <View style={{ marginVertical: 10 }}>
          {ticket?.pictures?.length > 0 && RenderPictures(ticket.pictures)}
        </View>
        <Heading>Video</Heading>
        {state?.JobData?.video ? 
        <View style={styles.container}>
          <VideoPlayer
            videoProps={{
              shouldPlay: true,
              resizeMode: Video.RESIZE_MODE_CONTAIN,
              // ❗ source is required https://docs.expo.io/versions/latest/sdk/video/#props
              source: {
                uri: `${state?.JobData?.video}`,
              },
            }}
/>
          {/* <Video
            ref={video}
            style={styles.video}
            source={{
              uri: `${state?.JobData?.video}`,
            }}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={status => setStatus(() => status)}
          /> */}
          {/* <View style={styles.buttons}>
            <Button
              title={status.isPlaying ? 'Pause' : 'Play'}
              onPress={() =>
                status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
              }
            />
          </View> */}
        </View> : <Text>No Video</Text>}
        <Heading>Ticket Notes</Heading>
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
        {addNoteLoading && <ActivityIndicator size="small" color="#aaa" />}
        {!addNoteLoading && RenderAddNote()}
      </View>
      {worker_email == "opscord@queensman.com" && (
        <>
          {isVerified ? (
            <View>
              <Button
                style={{ width: "20%" }}
                onPress={() => {
                  markAsVerified(!isVerified);
                }}
                title="Mark it as unverified"
                color="#D2054E"
              />
              <View
                style={{
                  backgroundColor: "#059669",
                  width: "100%",
                  borderBottomRadius: 5,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingVertical: 8,
                    color: "white",
                  }}
                >
                  VERIFIED
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <Button
                style={{ width: "20%" }}
                onPress={() => {
                  markAsVerified(!isVerified);
                }}
                title="Mark it as verified"
                color="#539bf5"
              />
              <Button
                style={{ width: "20%" }}
                title="Unverified"
                color="#539bf5"
                disabled
              />
            </View>
          )}
        </>
      )}

      <Text
        style={[styles.HeadingStyle, { alignSelf: "center", marginTop: 10 }]}
      >
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
        {moment(state.JobData.request_time).format("Do MMMM, YYYY, hh:mm A")}
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
          {moment(state.JobData.request_time).format("Do MMMM, YYYY, hh:mm A")}
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
        ID: {state.workerId}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        Full Name: {state.wokerName}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "1%", paddingHorizontal: "5%" }}
      >
        Phone: {state.workerPhone}
      </Text>
      <Text
        style={{ fontSize: 13, marginBottom: "3%", paddingHorizontal: "5%" }}
      >
        Email: {state.workerEmail}
      </Text>

      {ticket.status != "Closed" && (
        <View style={{ marginBottom: 60 }}>
          <Button
            style={{ width: "20%" }}
            onPress={AlertStartJob}
            title={ticket.status === "In Progress" ? "Continue Job" : "Start Job"}
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
        </View>
      )}

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
        isVisible={loadingModalVisible}
        onBackButtonPress={() => setLoadingModalVisible(false)}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#FFCA5D" />
        </View>
      </Modal>
      <Modal
        isVisible={stopJobModalVisible}
        onBackdropPress={() => setstopJobModalVisible(false)}
      >
        <View
          style={{
            // flex: 1,
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
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "#DDD",
              marginBottom: 15,
            }}
          ></TextInput>

          <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 16 }]}>
            Job Type
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 80,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.circle}
                onPress={() => setState({ ...state, type: "Deferred" })} // we set our value state to key
              >
                {state.type === "Deferred" ? (
                  <View style={styles.checkedCircle} />
                ) : null}
              </TouchableOpacity>
              <Text
                style={{ paddingLeft: "2%", paddingRight: "2%", fontSize: 12 }}
              >
                Deferred
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.circle}
                onPress={() => setState({ ...state, type: "Material Request" })} // we set our value state to key
              >
                {state.type === "Material Request" ? (
                  <View style={styles.checkedCircle} />
                ) : null}
              </TouchableOpacity>

              <Text
                style={{ paddingLeft: "2%", paddingRight: "2%", fontSize: 12 }}
              >
                Material Request
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                width: "100%",
                justifyContent: "flex-end",
                marginLeft: 15,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.circle}
                onPress={() => setState({ ...state, type: "Out of scope" })} // we set our value state to key
              >
                {state.type === "Out of scope" ? (
                  <View style={styles.checkedCircle} />
                ) : null}
              </TouchableOpacity>
              <Text
                style={{ paddingLeft: "2%", paddingRight: "2%", fontSize: 12 }}
              >
                Out of scope
              </Text>
            </View>
          </View>

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
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFCA5D",
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ACACAC",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Job;
