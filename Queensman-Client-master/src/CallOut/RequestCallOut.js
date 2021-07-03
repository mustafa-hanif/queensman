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
import { Video } from "expo-av";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Button,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import { Picker, Icon } from "native-base";
import Toast from "react-native-whc-toast";
import { gql, useLazyQuery, useQuery } from "@apollo/client";

import axios from "axios";

import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal";
import { auth, storage } from "../utils/nhost";

import VideoScreen from "../VideoScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradiantStyle: {
    width: "100%",
    height: "100%",
    position: "absolute",
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
    shadowRadius: 1, // IOS
    elevation: 1, // Android
    width: "100%",
    height: "72%",
    alignSelf: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FFF",
    paddingHorizontal: "10%",
    paddingVertical: 15,
  },
  TextFam: {
    fontFamily: "Helvetica",
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
  PickerStyle: {
    width: "100%",
    height: 42,
    backgroundColor: "#FFCA5D",
    borderRadius: 4,
    justifyContent: "center",
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
    height: 65,
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
    height: 38,
    width: "100%",
    backgroundColor: "#001E2B",
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, // IOS
    elevation: 1, // Android
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

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
      }
    }
  }
`;

const GET_PROPERTY_BY_ID = gql`
  query FetchPropertyById($id: Int = 10) {
    property_owned_by_pk(id: $id) {
      property {
        address
        city
        community
        country
        category: type
      }
      id
      owner_id
    }
  }
`;

const RequestCallOut = (props) => {
  const [state, setState] = useState({
    PropertyDetails: [],
    property_type: "",
    address: "",
    community: "",
    city: "",
    country: "",
    JobType: "none",
    OtherJobType: "",
    Urgency: "",
    Description: "",
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
    PropertyDetailLoading: false,
    CalloutID: "",
    loading: false,
    isPicvisible: false, // veiw image app kay lia
    connections: true,
    selectedPic: "",
    selectedNo: 0,
  });

  const [videoSaving, setVideoSaving] = useState(false);
  const [showVideoScreen, setShowVideoScreen] = useState(false);

  const onValueChange = (value) => {
    setState((state) => ({
      ...state,
      JobType: value,
    }));
  };

  const user = auth?.currentSession?.session?.user;
  const email = user?.email;
  const { loading, data: allProperties, error } = useQuery(GET_PROPERTIES, {
    variables: { email },
  });

  const [loadProperty, { loading: loadingSingleProperty, data: selectedProperty, error: propertyError }] = useLazyQuery(
    GET_PROPERTY_BY_ID
  );

  // Did mount - Select the first property of the client, or use the one in async storage
  useEffect(() => {
    setState({
      ...state,
      PropertyDetailLoading: true,
    });
    const loadSelectedProperty = async (properties) => {
      let property_ID = await AsyncStorage.getItem("QueensPropertyID"); // assign customer id here
      if (!property_ID) {
        property_ID = properties?.[0]?.property?.id;
      }
      setState({
        ...state,
        customerEmail: email,
        PropertyID: property_ID,
      });
      loadProperty({ variables: { id: property_ID } });
    };
    if (allProperties) {
      loadSelectedProperty(allProperties?.client?.[0]?.property_owneds);
    }
  }, [allProperties]);

  // Once we have a selected property - Load it in the local state
  // TODO: This is not necessary, we can use the selected property directly
  useEffect(() => {
    console.log({ selectedProperty });
    if (selectedProperty) {
      const propertyid = selectedProperty?.property_owned_by_pk?.id;
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
        PropertyDetailLoading: false,
      }));
    }
  }, [selectedProperty]);

  const selectFromGallery = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
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
    console.log(`My:${uri}`);
    if (state.picture1 === "") {
      setState({
        ...state,
        picture1: uri,
      });
      console.log(state.picture1);
    } else if (state.picture2 === "") {
      setState({
        ...state,
        picture2: uri,
      });
      console.log(state.picture2);
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

  const urlToUPLOAD = async (url, link) => {
    const localUri = url;
    const filename = localUri.split("/").pop();

    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("photo", { uri: localUri, name: filename, type });

    await fetch(link, {
      method: "POST",
      body: formData,
      header: {
        "content-type": "multipart/form-data",
      },
    });
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
    if (state.JobType === "none") {
      return alert("Please Select Job Type First");
    }
    if (state.picture1 === "" || state.Urgency === "" || state.JobType === "none") {
      return alert("Kindly fill all the required details.");
    }

    if (state.Urgency === "medium") {
      return props.navigation.navigate("SelectSchedule", { state });
    }

    Alert.alert(
      "Callout Request Confirmation.",
      "Kindly click YES to submit this callout.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => submitCallout() },
      ],
      { cancelable: false }
    );
  };

  const SubmittedCalloutAlert = () => {
    Alert.alert(
      "Callout Request Submitted.",
      "One of our team will be in touch shortly.",
      [
        {
          text: "Ok",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const submitCallout = async () => {
    if (state.picture1 === "" || state.Urgency === "" || state.JobType === "none") {
      alert("Kindly fill all the required details.");
    } else {
      NetInfo.fetch().then((isConnected) => {
        if (isConnected) {
          let JOBS = "";
          if (state.OtherJobType === "") {
            JOBS = state.JobType;
          } else {
            JOBS = `Other: ${state.OtherJobType}`;
          }
          let pic1name = "";
          let pic2name = "";
          let pic3name = "";
          let pic4name = "";

          if (state.picture1 !== "") {
            pic1name = state.picture1.split("/").pop();
          }
          if (state.picture1 !== "") {
            pic2name = state.picture2.split("/").pop();
          }
          if (state.picture1 !== "") {
            pic3name = state.picture3.split("/").pop();
          }
          if (state.picture1 !== "") {
            pic4name = state.picture4.split("/").pop();
          }

          setState({ ...state, loading: true });
          let link = `http://queensman.com/queens_client_Apis/submitCallOut.php?client_id=${state.customerID}&prop_id=${state.PropertyID}&job=${JOBS}&describe=${state.Description}&property_type=${state.property_type}&urg_lvl=${state.Urgency}&picture1=${pic1name}&picture2=${pic2name}&picture3=${pic3name}&picture4=${pic4name}`;
          console.log(link);
          axios
            .get(link)
            .then((result) => {
              console.log(result.data.server_responce);

              link = "http://queensman.com/queens_client_Apis/uploadPhoto.php";
              if (state.picture1 !== "") {
                urlToUPLOAD(state.picture1, link);
              }
              if (state.picture2 !== "") {
                urlToUPLOAD(state.picture2, link);
              }
              if (state.picture3 !== "") {
                urlToUPLOAD(state.picture3, link);
              }
              if (state.picture4 !== "") {
                urlToUPLOAD(state.picture4, link);
              }
              setTimeout(() => {
                link = `http://queensman.com/queens_client_Apis/fetchNewCalloutID.php?ID=${state.customerID}`;
                console.log(link);
                axios.get(link).then((result) => {
                  console.log(result.data.server_response[0].id);
                  setState({
                    ...state,
                    CalloutID: result.data.server_response[0].id,
                  });
                  setTimeout(() => {
                    link = `http://queensman.com/queens_client_Apis/fetchClientProfile.php?ID=${state.customerID}`;
                    console.log(link);

                    axios.get(link).then((result) => {
                      console.log(result.data.server_responce);
                      setState({
                        ...state,
                        Email: result.data.server_responce.email,
                        UserName: result.data.server_responce.full_name,
                        Mobile: result.data.server_responce.phone,
                      });
                      link = `http://queensman.com/queens_client_Apis/sendEmail2.php?subject=${state.subject}&callout_id=${state.CalloutID}&client_id=${state.customerID}&client_name=${state.UserName}&client_email=${state.Email}&job=${JOBS}&description=${state.Description}&callout_urgency=${state.Urgency}&property_id=${state.PropertyID}&property_address=${state.address}&community=${state.community}&city=${state.city}&country=${state.country}&client_phone=${state.Mobile}`;
                      console.log(link);
                      axios
                        .get(link)
                        .then((result) => {
                          console.log(result.data);
                          SubmittedCalloutAlert();
                          // refs.customToast.show('Callout Successfully Sent');
                          setState({ ...state, loading: false });
                          setTimeout(() => {
                            props.navigation.navigate("HomeNaviagtor");
                          }, 800);
                        })
                        .catch((error) => {
                          console.log(error);
                          alert(error);
                          setState({ ...state, loading: false });
                        });
                    });
                  }, 2000);
                });
              }, 2000);
            })
            .catch((error) => console.log(error));
        } else {
          alert("No Internet Connection Callout failed");
        }
      });
    }
  };

  const RemoveImages = () => {
    if (state.selectedNo === 1) {
      setState({
        ...state,
        picture1: "",
      });
    } else if (state.selectedNo === 2) {
      setState({
        ...state,
        picture2: "",
      });
    } else if (state.selectedNo === 3) {
      setState({
        ...state,
        picture3: "",
      });
    } else if (state.selectedNo === 4) {
      setState({
        ...state,
        picture4: "",
      });
    }
    setState({ ...state, isPicvisible: false });
  };

  const CameraSnap = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
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

  const saveVideoCloud = () => {
    const file = expoFileToFormFile(state.video, "video");
    console.log(`/callout_videos/${file.name}`);
    setVideoSaving(true);
    storage
      .put(`/callout_videos/${file.name}`, file)
      .then(() => {
        setVideoSaving(false);
      })
      .catch(console.error);
    setState({
      ...state,
      videoUrl: `https://backend-8106d23e.nhost.app/storage/o/callout_videos/${file.name}`,
    });
  };

  if (videoPlayScreen) {
    console.log("will return video play screen");
    return <VideoPlayScreen setVideoPlayScreen={setVideoPlayScreen} video={state.video} />;
  }

  if (showVideoScreen) {
    return <VideoScreen setShowVideoScreen={setShowVideoScreen} saveVideo={saveVideo} />;
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, justifyContent: "space-between" }} behavior="padding" enabled>
      <Toast
        textStyle={{
          color: "#fff",
        }}
        style={{
          backgroundColor: "#000E1E",
        }}
      />
      <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />
      <View style={{ paddingHorizontal: "10%", top: "13%" }}>
        <Text style={[styles.TextFam, { color: "#FFCA5D", fontSize: 10 }]}>Callout Address</Text>
        {!state.PropertyDetailLoading ? (
          <View style={{}}>
            <Text style={[styles.TextFam, { fontSize: 16, fontWeight: "bold", color: "#fff" }]}>{state.address}</Text>
            <Text style={[styles.TextFam, { fontSize: 10, color: "#fff" }]}>
              {state.community},{state.city},{state.country}
            </Text>
          </View>
        ) : (
          <Text style={[styles.TextFam, { fontSize: 20, fontWeight: "bold", color: "#fff" }]}>
            Loading please wait...
          </Text>
        )}
        <View style={{ height: "2%" }} />
      </View>

      <View style={styles.Card}>
        <View style={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 16, marginBottom: 8 }]}>Job Type</Text>

          <View style={styles.PickerStyle}>
            <Picker
              note
              mode="dialog"
              onValueChange={onValueChange}
              placeholderStyle={{ color: "#000" }}
              selectedValue={state.JobType}
              itemStyle={{ fontSize: 30 }}
            >
              <Picker.Item label="Select" value="none" />
              <Picker.Item label="AC" value="AC" />
              <Picker.Item label="Plumbing" value="Plumbing" />
              <Picker.Item label="Electric" value="Electric" />
              <Picker.Item label="Woodworks" value="Woodworks" />
              <Picker.Item label="Paintworks" value="Paintworks" />
              <Picker.Item label="Masonry" value="Masonry" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          {state.JobType === "other" ? (
            <View style={{ paddingTop: "3%" }}>
              <View style={styles.OthertxtStyle}>
                <TextInput
                  style={{ fontSize: 14, fontFamily: "Helvetica" }}
                  placeholder="Type other here...."
                  underlineColorAndroid="transparent"
                  numberOfLines={1}
                  onChangeText={(OtherJobType) => {
                    setState({ ...state, OtherJobType });
                  }}
                />
              </View>
            </View>
          ) : null}
          <View style={{ height: "3%" }} />
          <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 16 }]}>Urgency</Text>
          <View style={{ height: "2%" }} />
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              paddingHorizontal: "5%",
            }}
          >
            <TouchableOpacity
              style={styles.circle}
              onPress={() => setState({ ...state, Urgency: "high" })} // we set our value state to key
            >
              {state.Urgency === "high" ? <View style={styles.checkedCircle} /> : null}
            </TouchableOpacity>

            <Text style={[styles.TextFam, { paddingLeft: "2%", paddingRight: "3%", fontSize: 14 }]}>High</Text>
            <Icon name="flag" style={{ fontSize: 24, color: "red", paddingRight: "20%" }} />
            <TouchableOpacity
              style={styles.circle}
              onPress={() => setState({ ...state, Urgency: "medium" })} // we set our value state to key
            >
              {state.Urgency === "medium" ? <View style={styles.checkedCircle} /> : null}
            </TouchableOpacity>
            <Text style={[styles.TextFam, { paddingLeft: "2%", paddingRight: "3%", fontSize: 14 }]}>Medium</Text>
            <Icon name="flag" style={{ fontSize: 24, color: "#FFCA5D", paddingRight: "6%" }} />
          </View>
          <View style={{ height: "3%" }} />
          <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 16 }]}>Description</Text>
          <View style={{ height: "2%" }} />
          <View style={styles.DestxtStyle}>
            <TextInput
              style={{
                fontSize: 14,
                color: "#8c8c8c",
                width: "90%",
                fontFamily: "Helvetica",
                paddingTop: "2%",
              }}
              placeholder="Type description here ...."
              placeholderTextColor="#8c8c8c"
              multiline
              numberOfLines={1}
              underlineColorAndroid="transparent"
              onChangeText={(Description) => {
                setState({ ...state, Description });
              }} // email set
            />
          </View>
          <View style={{ height: "3%" }} />
          <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 16 }]}>Images</Text>
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
            {state.video ? (
              !videoSaving ? (
                <View>
                  <TouchableOpacity
                    style={[styles.ImageSelectStyle, { marginBottom: 10 }]}
                    onPress={showPlayVideoScreen}
                  >
                    <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 10 }]}>Play Video</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={state.videoUrl.length}
                    style={[styles.ImageSelectStyle, state.videoUrl.length ? styles.disabledButton : null]}
                    onPress={saveVideoCloud}
                  >
                    <Text style={[styles.TextFam, { color: state.videoUrl.length ? "#bbb" : "#000E1E", fontSize: 10 }]}>
                      Save Video
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ActivityIndicator size="large" color="#000" style={{ alignSelf: "center" }} />
              )
            ) : (
              <TouchableOpacity style={styles.ImageSelectStyle} onPress={showVideoScreenCallback}>
                <Text style={[styles.TextFam, { color: "#000E1E", fontSize: 10 }]}>Add video</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ height: "2%" }} />
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
          <View style={{ height: "1%" }} />
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
          <View style={{ height: "5%" }} />
          <TouchableOpacity style={styles.SubmitCallout} onPress={() => askSubmitCallout()}>
            {state.loading ? (
              <ActivityIndicator size="large" color="#fff" style={{ alignSelf: "center" }} />
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "Helvetica",
                  alignSelf: "center",
                }}
              >
                {state.Urgency === "medium" ? "Select Date" : "Submit Callout"}
              </Text>
            )}
          </TouchableOpacity>
          <View style={{ height: 100 }} />
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

          <TouchableOpacity onPress={() => setState({ isPicvisible: false })}>
            <View style={styles.ButtonSty}>
              <Text style={{ fontWeight: "bold", color: "#ffff", fontSize: 15 }}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
          title={status.isPlaying ? "Pause" : "Play"}
          color="#FFCA5D"
          style={{ marginRight: 20 }}
          onPress={() => (status.isPlaying ? video.current.pauseAsync() : video.current.playAsync())}
        />
        <Button color="#FFCA5D" title="Close" onPress={() => setVideoPlayScreen(false)} />
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
