/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import { Button, Radio, Box, ScrollView, Select, Icon, AlertDialog, Center, HStack, CheckIcon } from "native-base";
import { Video } from "expo-av";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import FlashMessage from "react-native-flash-message";

import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";

import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import Modal from "react-native-modal";
import { auth, storage } from "../utils/nhost";
import { HASURA } from "../_config";

import VideoScreen from "../VideoScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradiantStyle: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  RowFlex: {
    flexDirection: "row",
    paddingLeft: "10%",
  },
  ColFlex: {
    flexDirection: "column",
    paddingLeft: "10%",
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
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFCA5D",
  },
  Card: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    flex: 1,
    shadowRadius: 1, // IOS
    elevation: 1, // Android
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FFF",
    paddingHorizontal: "10%",
    paddingVertical: "10%",
  },
  TextFam: {},
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
  GalleryEventModel: {
    // backgroundColor: '',
    padding: 22,
    //   backgroundColor: '#65061B',
    justifyContent: "space-around",
    // alignItems: 'center',
    borderRadius: 4,
    height: "80%",
    borderColor: "rgba(0, 0, 0, 0.1)",
  },

  OthertxtStyle: {
    width: "100%",
    height: 28,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#FFCA5D",
    backgroundColor: "#eeeeee",
    paddingHorizontal: "3%",
  },
  DestxtStyle: {
    width: "100%",
    height: 80,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#FFCA5D",
    backgroundColor: "#eeeeee",
    paddingHorizontal: "3%",
  },
  ImageSelectStyle: {
    height: 25,
    paddingHorizontal: "2%",
    backgroundColor: "#FFCA5D",
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, // IOS
    elevation: 1, // Android
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#eee",
    color: "#ccc",
  },
  SubmitCallout: {
    borderTopWidth: 1,
    borderTopColor: "#000",

    height: 38,
    width: "100%",
    backgroundColor: "#001E2B",
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, // IOS
    // elevation: 1, // Android
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

const GET_JOB_CATEGORY = gql`
  query GetJobCategory {
    team_expertise(where: { skill_level: { _eq: 0 }, isAdmin: { _eq: false } }, order_by: { skill_name: asc }) {
      skill_name
      id
      isHigh
    }
  }
`;

const GET_JOB_TYPE = gql`
  query GetJobType($skill_parent: Int!, $isHigh: Boolean!) {
    team_expertise(
      where: {
        skill_level: { _eq: 1 }
        skill_parent: { _eq: $skill_parent }
        isHigh: { _eq: $isHigh }
        isAdmin: { _eq: false }
      }
      order_by: { skill_name: asc }
    ) {
      id
      skill_name
      isHigh
    }
  }
`;

const GET_PROPERTIES = gql`
  query MyQuery($email: String) {
    client(where: { email: { _eq: $email } }) {
      property_owneds {
        property {
          address
          community
          city
          id
          country
        }
        id
      }
    }
  }
`;

const GET_PROPERTY_BY_ID = gql`
  query FetchPropertyById($id: Int!) {
    property_owned_by_pk(id: $id) {
      property {
        address
        city
        community
        country
        category: type
        id
      }
      id
      owner_id
    }
  }
`;

const ADD_CALLOUT = gql`
  mutation AddCallOut(
    $callout_by_email: String = ""
    $picture1: String
    $property_id: Int
    $description: String
    $picture2: String
    $picture3: String
    $picture4: String
    $category: String
    $job_type: String
    $status: String
    $worker_id: Int
    $worker_email: String
    $urgency_level: String
    $client_email: String
    $job_type2: String
  ) {
    insert_job_tickets_one(
      object: {
        callout: {
          data: {
            callout_by_email: $callout_by_email
            property_id: $property_id
            description: $description
            picture1: $picture1
            picture2: $picture2
            picture3: $picture3
            picture4: $picture4
            category: $category
            job_type: $job_type
            status: $status
            active: 1
            urgency_level: $urgency_level
            job_worker: { data: { worker_id: $worker_id } }
          }
        }
        name: "Additional Request"
        description: $description
        type: $job_type2
        status: $status
        worker_id: $worker_id
        worker_email: $worker_email
        client_email: $client_email
      }
    ) {
      id
    }
  }
`;

const REQUEST_CALLOUT = gql`
  mutation AddCallout(
    $property_id: Int
    $date_on_calendar: date
    $notes: String
    $time_on_calendar: time
    $email: String
    $category: String
    $job_type: String
    $job_type_id: Int
    $status: String
    $picture1: String
    $picture2: String
    $picture3: String
    $picture4: String
    $video: String
    $urgency_level: String
  ) {
    insert_scheduler_one(
      object: {
        callout: {
          data: {
            callout_by_email: $email
            property_id: $property_id
            category: $category
            job_type: $job_type
            job_type_id: $job_type_id
            status: $status
            urgency_level: $urgency_level
            description: $notes
            picture1: $picture1
            picture2: $picture2
            picture3: $picture3
            picture4: $picture4
            video: $video
            active: 1
          }
        }
        date_on_calendar: $date_on_calendar
        time_on_calendar: $time_on_calendar
        notes: $notes
      }
    ) {
      date_on_calendar
      id
      callout_id
    }
  }
`;

const ADD_JOB_TICKET = gql`
  mutation AddJobTicket($callout_id: Int, $scheduler_id: Int, $notes: String, $client_email: String) {
    insert_job_tickets_one(
      object: {
        callout_id: $callout_id
        scheduler_id: $scheduler_id
        type: "Full Job"
        name: $notes
        description: $notes
        status: "Open"
        client_email: $client_email
      }
    ) {
      id
    }
  }
`;

const GET_WORKER = gql`
  query GetWorker($_eq: String!) {
    worker(where: { email: { _eq: $_eq } }) {
      full_name
      id
      email
    }
  }
`;

const RequestCallOut = (props) => {
  const additionalServices = JSON.parse(props?.route?.params?.additionalServices);
  const [state, _setState] = useState({
    PropertyDetails: null,
    property_type: "",
    address: "",
    community: "",
    city: "",
    country: "",
    Urgency: additionalServices ? "Medium" : "",
    OtherJobType: "",
    Description: "",
    character: 0,
    to: "aalvi@queensman.com",
    subject: "Callout from Queensman Spades",
    message: "Just checking hehe",
    customermessage:
      "Thankyou for registering a callout.A representative from Queensman Spades will get in touch with you as soon as possible. \n" +
      "Best regards, \n" +
      "Queensman Spades",
    picture1: "",
    picture2: "",
    picture3: "",
    picture4: "",
    video: "",
    videoUrl: "",
    customerEmail: "",
    PropertyID: "",
    Email: "",
    UserName: "",
    Mobile: "",
    CalloutID: "",
    loading: false,
    isPicvisible: false, // veiw image app kay lia
    connections: true,
    selectedPic: "",
    selectedNo: 0,
  });
  const setState = (props) => {
    _setState(props);
  };
  const { data: jobCategory } = useQuery(GET_JOB_CATEGORY);
  const { data: allWorkers } = useQuery(GET_WORKER, {
    variables: { _eq: "opscord@queensman.com" },
  });
  const [getJobType, { loading: loadingJobType, data: jobType }] = useLazyQuery(GET_JOB_TYPE);
  const [addCalloutApiCall] = useMutation(ADD_CALLOUT);
  const [addJobTicket] = useMutation(ADD_JOB_TICKET);
  const [requestCalloutApiCall] = useMutation(REQUEST_CALLOUT, {
    onCompleted: (data) => {
      addJobTicket({
        variables: {
          callout_id: data?.insert_scheduler_one?.callout_id,
          scheduler_id: data?.insert_scheduler_one?.id,
          notes: state.Description,
          client_email: auth.user().email,
        },
      });
    },
  });
  const [videoSaving, setVideoSaving] = useState(false);
  const [showVideoScreen, setShowVideoScreen] = useState(false);
  const [jobCategorySelect, setJobCategorySelect] = useState({});
  const [jobTypeSelect, setJobTypeSelect] = useState(null);

  const onJobCategoryValueChange = (value) => {
    const item = jobCategory?.team_expertise.find((i) => i.id === parseInt(value, 10));
    setJobCategorySelect({ value: item.id, label: item.skill_name });
    selectJobCategoryPressed(item.id);
  };

  const onJobTypeValueChange = (value) => {
    const jobValue = value.split("@")[0];
    const jobId = value.split("@")[1];
    setJobTypeSelect({ value: jobValue, label: jobValue, id: jobId });
  };
  const selectJobCategoryPressed = (id) => {
    getJobType({
      variables: {
        skill_parent: id,
        isHigh: state.Urgency.toLowerCase() === "high",
      },
    });
  };

  const { email } = auth.user();
  const { data: allProperties } = useQuery(GET_PROPERTIES, {
    variables: { email },
  });

  const [loadProperty, { loading: loadingSingleProperty, data: selectedProperty, error: propertyError }] = useLazyQuery(
    GET_PROPERTY_BY_ID,
    {
      variables: { id: allProperties?.client?.[0]?.property_owneds?.[0]?.id },
    }
  );

  const [videoDurationinMillis, setvideoDurationinMillis] = useState("0:00");

  // Did mount - Select the first property of the client, or use the one in async storage
  useEffect(() => {
    const propertyFunction = async () => {
      const propertyDetails = await AsyncStorage.getItem("QueensPropertyDetails");
      if (!propertyDetails) {
        const loadSelectedProperty = async () => {
          loadProperty();
        };
        if (allProperties) {
          loadSelectedProperty(allProperties?.client?.[0]?.property_owneds);
        }
      }
    };
    propertyFunction();
  }, [allProperties]);

  // Once we have a selected property - Load it in the local state
  // TODO: This is not necessary, we can use the selected property directly
  useEffect(() => {
    const propertyFunction = async () => {
      const propertyDetails = await AsyncStorage.getItem("QueensPropertyDetails");
      if (!propertyDetails) {
        if (!loadingSingleProperty && selectedProperty && !propertyDetails) {
          const propertyid = selectedProperty?.property_owned_by_pk?.property?.id;
          const propertyDetails = selectedProperty?.property_owned_by_pk?.property;
          const { category, address, community, city, country } = propertyDetails;
          setState({ ...state, PropertyDetails: propertyDetails });
          setState((state) => ({
            ...state,
            property_type: category,
            address,
            community,
            city,
            country,
            PropertyID: propertyid,
          }));
        }
      } else {
        const { id, address, community, city, country } = JSON.parse(propertyDetails);
        setState({ ...state, PropertyDetails: JSON.parse(propertyDetails) });
        setState((state) => ({
          ...state,
          address,
          community,
          city,
          country,
          PropertyID: id,
        }));
      }
    };
    propertyFunction();
  }, [selectedProperty, loadingSingleProperty]);

  const selectFromGallery = async () => {
    if (Constants.platform.ios) {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.1,
    });
    if (!result.cancelled) {
      _uploadImage(result.uri);
    }
  };

  const _uploadImage = (uri) => {
    if (state.picture1 === "") {
      setState({
        ...state,
        picture1: uri,
      });
    } else if (state.picture2 === "") {
      setState({
        ...state,
        picture2: uri,
      });
    } else if (state.picture3 === "") {
      setState({
        ...state,
        picture3: uri,
      });
    } else if (state.picture4 === "") {
      setState({
        ...state,
        picture4: uri,
      });
    } else {
      alert("Please select up to 4 images.");
    }
  };

  const toggleGalleryEventModal = (vale, no) => {
    setState({
      ...state,
      isPicvisible: !state.isPicvisible,
      selectedPic: vale,
      selectedNo: no,
    });
  };

  const askSubmitCallout = () => {
    if (!jobCategorySelect?.value) {
      return alert("Please Select Job Category!");
    }
    if (!additionalServices && !jobTypeSelect?.value) {
      return alert("Please Select Job Type!");
    }
    if (state.Urgency === "") {
      return alert("Please Select Urgency!");
    }
    if (state.Description === "") {
      return alert("Please add Description!");
    }
    if (state.picture1 === "") {
      return alert("Please upload atleast one image!");
    }
    if (!additionalServices) {
      // If not on additional requst page
      if (state.Urgency === "medium") {
        return props.navigation.navigate("SelectSchedule", { state: { ...state, Job: jobTypeSelect } });
      }

      Alert.alert(
        "Callout Request Confirmation.",
        "Kindly click YES to submit this callout.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "Yes", onPress: () => submitCallout() },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Confirmation.",
        "Kindly click YES to make request.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "Yes", onPress: () => addJobTicketFunc() },
        ],
        { cancelable: false }
      );
    }
  };

  const SubmittedCalloutAlert = () => {
    Alert.alert(
      "Callout Request Submitted.",
      "One of our team will be in touch shortly.",
      [
        {
          text: "Ok",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const SubmittedMakeRequestAlert = () => {
    Alert.alert(
      "Callout Request Submitted.",
      "One of our team will be in touch shortly.",
      [
        {
          text: "Ok",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const submitCallout = async () => {
    const category = "Uncategorized";
    const pictures = Object.fromEntries(
      [...Array(4)]
        .map((_, i) => {
          const _statePic = state[`picture${i}`];
          if (_statePic) {
            const file = expoFileToFormFile(_statePic);
            storage.put(`/callout_pics/${file.name}`, file).then().catch(console.error);
            return [`picture${i}`, `${HASURA}/storage/o/callout_pics/${file.name}`];
          }
          return null;
        })
        .filter(Boolean)
    );
    requestCalloutApiCall({
      variables: {
        property_id: state.PropertyID,
        email: auth.user().email,
        notes: state.Description,
        time_on_calendar: null,
        date_on_calendar: null,
        category,
        job_type: jobTypeSelect.value,
        job_type_id: jobTypeSelect.id,
        status: "Requested",
        urgency_level: state.Urgency,
        video: state.videoUrl,
        ...pictures,
      },
    })
      .then(() => {
        SubmittedMakeRequestAlert();
        props.navigation.navigate("HomeNaviagtor");
      })
      .catch((err) => console.log({ err }));
  };

  const RemoveImages = () => {
    if (state.selectedNo === 1) {
      setState({
        ...state,
        picture1: "",
        isPicvisible: false,
      });
    } else if (state.selectedNo === 2) {
      setState({
        ...state,
        picture2: "",
        isPicvisible: false,
      });
    } else if (state.selectedNo === 3) {
      setState({
        ...state,
        picture3: "",
        isPicvisible: false,
      });
    } else if (state.selectedNo === 4) {
      setState({
        ...state,
        picture4: "",
        isPicvisible: false,
      });
    }
  };

  const CameraSnap = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }

    const { status: status2 } = await Camera.requestCameraPermissionsAsync();
    if (status2 !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      exif: true,
      quality: 0.2,
    });
    if (!result.cancelled) {
      _uploadImage(result.uri);
    }
  };

  const showVideoScreenCallback = () => {
    setShowVideoScreen(true);
  };

  const saveVideo = ({ uri }) => {
    setState({ ...state, video: uri });
  };

  const [videoPlayScreen, setVideoPlayScreen] = useState(false);
  const showPlayVideoScreen = () => {
    setVideoPlayScreen(true);
  };

  const expoFileToFormFile = (url, mimeType = "image") => {
    const localUri = url;
    const filename = localUri.split("/").pop();

    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `${mimeType}/${match[1]}` : mimeType;
    return { uri: localUri, name: filename, type };
  };

  function millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  const saveVideoCloud = () => {
    const file = expoFileToFormFile(state.video, "video");
    setVideoSaving(true);
    storage
      .put(`/callout_videos/${file.name}`, file)
      .then(() => {
        setVideoSaving(false);
      })
      .catch(console.error);
    setState({
      ...state,
      videoUrl: `${HASURA}/storage/o/callout_videos/${file.name}`,
    });
  };

  const onDeleteVideo = () => {
    setState({ ...state, video: "" });
  };

  const addJobTicketFunc = async () => {
    setState({ ...state, loading: true });
    const category = "Uncategorized";
    const pictures = Object.fromEntries(
      [...Array(4)]
        .map((_, i) => {
          const _statePic = state[`picture${i}`];
          if (_statePic) {
            const file = expoFileToFormFile(_statePic);
            storage.put(`/callout_pics/${file.name}`, file).then(console.log).catch(console.error);
            return [`picture${i}`, `${HASURA}/storage/o/callout_pics/${file.name}`];
          }
          return null;
        })
        .filter(Boolean)
    );

    addCalloutApiCall({
      variables: {
        callout_by_email: auth.user().email,
        property_id: state.PropertyID,
        worker_email: "opscord@queensman.com",
        client_email: auth.user().email,
        worker_id: allWorkers.worker[0].id,
        description: state.Description,
        category,
        job_type: jobCategorySelect.value,
        job_type2: "Additional Request",
        status: "Open",
        urgency_level: "Medium",
        ...pictures,
      },
    })
      .then(() => {
        setState({ ...state, loading: false });
        SubmittedCalloutAlert();
        setTimeout(() => {
          props.navigation.navigate("HomeNaviagtor");
        }, 4000);
      })
      .catch((err) => console.log({ err }));
  };

  if (videoPlayScreen) {
    console.log("will return video play screen");
    return <VideoPlayScreen setVideoPlayScreen={setVideoPlayScreen} video={state.video} />;
  }

  if (showVideoScreen) {
    return (
      <VideoScreen
        getDuration={(time) => {
          setvideoDurationinMillis(millisToMinutesAndSeconds(time));
        }}
        setShowVideoScreen={setShowVideoScreen}
        saveVideo={saveVideo}
      />
    );
  }
  if (propertyError) {
    return (
      <Center>
        <AlertDialog isOpen motionPreset="fade">
          <AlertDialog.Content>
            <AlertDialog.Header fontSize="lg" fontWeight="bold">
              No property found
            </AlertDialog.Header>
            <AlertDialog.Body>You currently don't have any property assigned.</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button onPress={() => props.navigation.navigate("HomeNaviagtor")}>Ok</Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
    );
  }
  return (
    <ScrollView style={{ height: "100%" }}>
      <View style={{ backgroundColor: "#000", paddingHorizontal: "10%", paddingVertical: "10%" }}>
        <FlashMessage position="top" />
        <Text style={[styles.TextFam, { color: "#FFCA5D", fontSize: 10 }]}>Callout Address</Text>
        {state.PropertyDetails != null ? (
          <View style={{}}>
            <Text style={[styles.TextFam, { fontSize: 16, fontWeight: "bold", color: "#fff" }]}>{state.address}</Text>
            <Text style={[styles.TextFam, { fontSize: 10, color: "#fff" }]}>
              {state.community},{state.city},{state.country}
            </Text>
          </View>
        ) : (
          <View>
            <ActivityIndicator size="small" color="white" style={{ alignSelf: "center" }} />
          </View>
        )}
      </View>
      <View style={styles.Card}>
        <View style={styles.container} showsVerticalScrollIndicator={false}>
          {!additionalServices && <View style={{ height: "3%" }} />}
          {!additionalServices && (
            <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 16 }]}>
              Urgency<Text style={{ color: "red" }}>*</Text>
            </Text>
          )}
          {!additionalServices && <View style={{ height: "2%" }} />}
          {!additionalServices && (
            <Box mb={8}>
              <Radio.Group
                colorScheme="emerald"
                name="Urgency"
                accessibilityLabel="Urgency"
                value={state.Urgency}
                onChange={(nextValue) => {
                  setJobCategorySelect({ value: null, label: null });
                  setJobTypeSelect({ value: null, label: null, id: null });
                  setState({ ...state, Urgency: nextValue });
                }}
              >
                <HStack space={20}>
                  <Radio value="High" mr={2}>
                    <HStack ml={1} space={0.5} alignItems="center">
                      <Text color="black">High</Text>
                      <Icon size={5} name="flag" as={<Ionicons name="flag-sharp" />} style={{ color: "red" }} />
                    </HStack>
                  </Radio>
                  <Radio value="medium">
                    <HStack ml={1} space={0.5} alignItems="center">
                      <Text color="black">Medium</Text>
                      <Icon size={5} name="flag" as={<Ionicons name="flag-sharp" />} style={{ color: "#FFCA5D" }} />
                    </HStack>
                  </Radio>
                </HStack>
              </Radio.Group>
              {/* <View style={{ flex: 1, flexDirection: "row", width: "100%" }}>
                <Pressable
                  style={styles.circle}
                  onPress={() => setState({ ...state, Urgency: "High" })} // we set our value state to key
                >
                  {state.Urgency === "High" ? <View style={styles.checkedCircle} /> : null}
                </Pressable>

                <Text style={[styles.TextFam, { paddingLeft: "2%", paddingRight: "2%", fontSize: 14 }]}>High</Text>
                <Icon
                  name="flag"
                  as={<Ionicons name="flag-sharp" />}
                  style={{ fontSize: 16, color: "red", marginTop: -6 }}
                />
              </View>
              <View style={{ flex: 1, flexDirection: "row", width: "100%", justifyContent: "flex-end" }}>
                <Pressable
                  style={styles.circle}
                  onPress={() => setState({ ...state, Urgency: "medium" })} // we set our value state to key
                >
                  {state.Urgency === "medium" ? <View style={styles.checkedCircle} /> : null}
                </Pressable>
                <Text style={[styles.TextFam, { paddingLeft: "2%", paddingRight: "2%", fontSize: 14 }]}>Medium</Text>
                <Icon
                  name="flag"
                  as={<Ionicons name="flag-sharp" />}
                  style={{ fontSize: 16, color: "#FFCA5D", marginTop: -6 }}
                />
              </View> */}
            </Box>
          )}
          <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 16, marginBottom: 8 }]}>
            {!additionalServices ? "Job Category" : "Request Type"}
            <Text style={{ color: "red" }}>*</Text>
          </Text>

          <View>
            {!additionalServices ? ( // If it is request callout
              <Select // Select Job category
                mode="dialog"
                isDisabled={state.Urgency === ""}
                onValueChange={onJobCategoryValueChange}
                selectedValue={jobCategorySelect?.value}
                // backgroundColor="#FFCA5D"
                color="black"
                placeholder="Select Job Category"
                _selectedItem={{
                  bg: "#FFCA5D",
                  endIcon: <CheckIcon size={4} />,
                }}
              >
                {jobCategory ? (
                  state.Urgency.toLowerCase() === "high" ? (
                    jobCategory?.team_expertise
                      .filter((value) => value.isHigh === true)
                      .map(
                        (
                          element,
                          i // Map job category from db
                        ) => (
                          <Select.Item
                            label={element.skill_name}
                            value={element.id}
                            key={i}
                            // onTouchEnd={() => selectJobCategoryPressed(element.id)}
                          />
                        )
                      )
                  ) : (
                    jobCategory?.team_expertise.map(
                      (
                        element,
                        i // Map job category from db
                      ) => (
                        <Select.Item
                          label={element.skill_name}
                          value={element.id}
                          key={i}
                          // onTouchEnd={() => selectJobCategoryPressed(element.id)}
                        />
                      )
                    )
                  )
                ) : (
                  <Select.Item label="Unable to load job types" value="Unable to load job types" />
                )}
              </Select>
            ) : (
              <Select // else request for additional services
                note
                mode="dialog"
                isDisabled={state.Urgency === ""}
                onValueChange={(value) => setJobCategorySelect({ value, label: value })}
                selectedValue={jobCategorySelect?.value}
                // bg="#FFCA5D"
                color="black"
                placeholder="Select Request Type"
                _selectedItem={{
                  bg: "#FFCA5D",
                  endIcon: <CheckIcon size={4} />,
                }}
              >
                <Select.Item label="Request for quotation" value="Request for quotation" />
                <Select.Item label="Other" value="other" />
              </Select>
            )}
          </View>

          {!additionalServices && (
            <View style={{ paddingTop: "3%" }}>
              <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 16, marginBottom: 8 }]}>
                Job Type<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Select
                isDisabled={!(jobCategorySelect?.value && !loadingJobType)}
                mode="dialog"
                onValueChange={onJobTypeValueChange}
                selectedValue={`${jobTypeSelect?.value}@${jobTypeSelect?.id}`}
                // bg="#FFCA5D"
                color="black"
                placeholder="Select Job Type"
                _selectedItem={{
                  bg: "#FFCA5D",
                  endIcon: <CheckIcon size={4} />,
                }}
              >
                {jobType ? (
                  jobType?.team_expertise.map((element, i) => (
                    <Select.Item label={element.skill_name} value={`${element.skill_name}@${element.id}`} key={i} />
                  ))
                ) : (
                  <Select.Item label="Unable to load job types" value="Unable to load job types" />
                )}
              </Select>
            </View>
          )}

          <View style={{ height: "3%" }} />
          <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 16 }]}>
            Description<Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={{ height: "2%" }} />
          <View style={styles.DestxtStyle}>
            <TextInput
              style={{
                // fontSize: 14,
                color: "#8c8c8c",
                width: "90%",

                // padding: "2%",
              }}
              placeholder="Type description here ...."
              placeholderTextColor="#8c8c8c"
              multiline
              value={state.Description}
              numberOfLines={3}
              maxLength={150}
              allowFontScaling={false}
              underlineColorAndroid="transparent"
              onChangeText={(Description) => {
                setState({ ...state, Description });
              }} // email set
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 12, color: "#bbb", marginTop: 2 }}>
              Character count: {state.Description.length}/150{" "}
            </Text>
            {state.Description.length == 150 && (
              <Text style={{ fontSize: 12, color: "red", marginTop: 2 }}>Character limit reached</Text>
            )}
          </View>
          <View style={{ height: "3%" }} />
          <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 16 }]}>
            Images<Text style={{ color: "red" }}>*</Text>
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity style={styles.ImageSelectStyle} onPress={CameraSnap}>
              <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 10 }]}> Camera </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ImageSelectStyle} onPress={selectFromGallery}>
              <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 10 }]}> Select Images From Gallery </Text>
            </TouchableOpacity>
            {!additionalServices ? (
              state.video ? (
                !videoSaving ? (
                  <View>
                    <TouchableOpacity
                      style={[styles.ImageSelectStyle, { marginBottom: 10 }]}
                      onPress={showPlayVideoScreen}
                    >
                      <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 10 }]}>
                        Play Video {videoDurationinMillis}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={state.videoUrl.length}
                      style={[styles.ImageSelectStyle, state.videoUrl.length ? styles.disabledButton : null]}
                      onPress={saveVideoCloud}
                    >
                      <Text
                        style={[styles.TextFam, { color: state.videoUrl.length ? "#bbb" : "#000E1E", fontSize: 10 }]}
                      >
                        Save Video
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ImageSelectStyle, { marginTop: 10 }]} onPress={onDeleteVideo}>
                      <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 10 }]}>Delete Video</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <ActivityIndicator size="large" color="#000" style={{ alignSelf: "center" }} />
                )
              ) : (
                <TouchableOpacity style={styles.ImageSelectStyle} onPress={showVideoScreenCallback}>
                  <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 10 }]}>Add video</Text>
                </TouchableOpacity>
              )
            ) : (
              <></>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "80%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleGalleryEventModal(state.picture1, 1)}
              disabled={state.picture1 === ""}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="link"
                  as={<Ionicons name="link" />}
                  style={{
                    fontSize: 20,
                    color: state.picture1 === "" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: state.picture1 === "" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 1
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleGalleryEventModal(state.picture2, 2)}
              disabled={state.picture2 === ""}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Icon
                  as={<Ionicons name="link" />}
                  name="link"
                  style={{
                    fontSize: 20,
                    color: state.picture2 === "" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: state.picture2 === "" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 2
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "80%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleGalleryEventModal(state.picture3, 3)}
              disabled={state.picture3 === ""}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Icon
                  as={<Ionicons name="link" />}
                  name="link"
                  style={{
                    fontSize: 20,
                    color: state.picture3 === "" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: state.picture3 === "" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 3
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleGalleryEventModal(state.picture4, 4)}
              disabled={state.picture4 === ""}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Icon
                  as={<Ionicons name="link" />}
                  name="link"
                  style={{
                    fontSize: 20,
                    color: state.picture4 === "" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: state.picture4 === "" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 4
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Box mb={12} mt={4}>
            {state.loading ? (
              <ActivityIndicator size="small" color="#FFCA5D" style={{ alignSelf: "center" }} />
            ) : (
              <Button mb={12} isLoading={state.loading} onPress={() => askSubmitCallout()}>
                <Text>
                  {state.Urgency === "medium" ? "Select Date" : !additionalServices ? "Submit Callout" : "Make Request"}
                </Text>
              </Button>
            )}
          </Box>
        </View>
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
            source={{ uri: state.selectedPic }}
            resizeMode="contain"
          />
          <Text> </Text>

          <TouchableOpacity onPress={() => RemoveImages()}>
            <View style={styles.ButtonSty}>
              <Text style={{ fontWeight: "bold", color: "#ffff", fontSize: 15 }}>Remove Image</Text>
            </View>
          </TouchableOpacity>
          <Text> </Text>
          <Text> </Text>

          <TouchableOpacity onPress={() => setState({ ...state, isPicvisible: false })}>
            <View style={styles.ButtonSty}>
              <Text style={{ fontWeight: "bold", color: "#ffff", fontSize: 15 }}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const VideoPlayScreen = ({ setVideoPlayScreen, video: uri }) => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  return (
    <View style={videoPlayStyles.container}>
      <Video
        ref={video}
        style={videoPlayStyles.video}
        source={{
          uri,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <View style={videoPlayStyles.buttons}>
        <Button
          color="#FFCA5D"
          style={{ marginRight: 20 }}
          onPress={() => (status.isPlaying ? video.current.pauseAsync() : video.current.playAsync())}
        >
          {status.isPlaying ? "Pause" : "Play"}
        </Button>
        <Button color="#FFCA5D" onPress={() => setVideoPlayScreen(false)}>
          Close
        </Button>
      </View>
    </View>
  );
};

const videoPlayStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: 1280,
    height: 600,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default RequestCallOut;
