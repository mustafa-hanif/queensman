/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  TextInput,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { auth, storage } from "../utils/nhost";

import { Content, Icon } from "native-base";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { HASURA } from "../_config";

const POST_PIC = gql`
  mutation AddPostPictures($objects: [post_job_picture_insert_input!] = {}) {
    insert_post_job_picture(objects: $objects) {
      returning {
        id
      }
    }
  }
`;


const FINISH_JOB_SINGLE = gql`
  mutation UpdateJobAndJobTicket(
    $id: Int!
  ) {
    update_job_tickets_by_pk(
      pk_columns: { id: $id }
      _set: { status: "Closed" }
    ) {
      id
    }
  }
`;

const PostJob = (props) => {
  const workerId = props.navigation.getParam("workerId", {});
  const ticketId = props.navigation.getParam("ticketDetails", {}).id;
  console.log(props.navigation.getParam("ticketCount", {}))
  const [finishJobSingle] = useMutation(FINISH_JOB_SINGLE);

  const [state, setState] = useState({
    solution: "",
    Pic1: "link",
    Pic2: "link",
    Pic3: "link",
    Pic4: "link",
    Pic5: "link",
    Pic6: "link",
    Pic7: "link",
    Pic8: "link",
    Pic9: "link",
    Pic10: "link",
    picturename: "",
    CallOutID: props.navigation.getParam("QJobID", "Something"),
    selectedPic:
      "https://en.wikipedia.org/wiki/Art#/media/File:Art-portrait-collage_2.jpg",
    isPicvisible: false, //veiw image app kay lia
    IsImageuploaded: false,
    selectedNo: 0,
    ViewOpacity: 1,
  });

  const [addPostPictures, { loading: prePicLoading, error: prePicErrors }] =
    useMutation(POST_PIC, {
      onCompleted: () => {
        setState({ ...state, IsImageuploaded: true });
      },
      onError: (e) => {
        console.log(e);
      },
    });

  const toggleGalleryEventModal = (vale, no) => {
    setState({
      ...state,
      isPicvisible: !state.isPicvisible,
      selectedPic: vale,
      selectedNo: no,
    });
  };
  
  const endJobHandler = async () => {
    if (state.solution == "") {
      alert("Please type solution first!");
    } else if (state.IsImageuploaded == false) {
      alert("Please upload image first!");
    } else {
      try {
        await finishJobSingle({
          variables: {
            id: ticketId
        }})
        alert("Job ticket has been successfully submitted");
        setTimeout(() => {
          props.navigation.navigate("Home");
        }, 1000);
      } catch (e) {
        console.log(e);
        alert("Could not submit Job!");
      }
    }
  };

  const postJobHandler = () => {
    if (state.solution == "") {
      alert("Please type solution first!");
    } else if (state.IsImageuploaded == false) {
      alert("Please upload image first!");
    } else {
      props.navigation.navigate("JobComplete", {
        QJobID: state.CallOutID,
        Sol: state.solution,
        it: props.navigation.getParam("it", {}),
        ticketDetails: props.navigation.getParam("ticketDetails", {}),
        ticketCount: props.navigation.getParam("ticketCount", {}),
        workerId,
      });
    }
  };
  
  const alertEndJobHandler = () => {
    Alert.alert(
      "Finish Ticket.",
      "Are you sure you want to finish this ticket?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => endJobHandler() },
      ],
      { cancelable: false }
    );
  };

  const alertPostJobHandler = () => {
    Alert.alert(
      "Proceed.",
      "Are you sure you want to proceed?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => postJobHandler() },
      ],
      { cancelable: false }
    );
  };

  const alertUploadImage = () => {
    Alert.alert(
      "Upload Images.",
      "Are you sure you want to upload the selected images?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => uploadImage() },
      ],
      { cancelable: false }
    );
  };

  const selectImages = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.1,
    });
    if (!result.cancelled) {
      _uploadImage(result.uri);
    }
  };


  const _uploadImage = (uri) => {
    for (let i = 0; i < 10; i++) {
      if (state[`Pic${i}`] === "link") {
        setState({ ...state, ...state, [`Pic${i}`]: uri });
        break;
      }
    }
  };

  const removeImages = () => {
    if (state.selectedNo == 0) {
      setState({ ...state, Pic0: "link", isPicvisible: false});
    } else if (state.selectedNo == 1) {
      setState({ ...state, Pic1: "link", isPicvisible: false});
    } else if (state.selectedNo == 2) {
      setState({ ...state, Pic2: "link", isPicvisible: false });
    } else if (state.selectedNo == 3) {
      setState({ ...state, Pic3: "link", isPicvisible: false });
    } else if (state.selectedNo == 4) {
      setState({ ...state, Pic4: "link", isPicvisible: false });
    } else if (state.selectedNo == 5) {
      setState({ ...state, Pic5: "link", isPicvisible: false });
    } else if (state.selectedNo == 6) {
      setState({ ...state, Pic6: "link", isPicvisible: false });
    } else if (state.selectedNo == 7) {
      setState({ ...state, Pic7: "link", isPicvisible: false });
    } else if (state.selectedNo == 8) {
      setState({ ...state, Pic8: "link", isPicvisible: false });
    } else if (state.selectedNo == 9) {
      setState({ ...state, Pic9: "link", isPicvisible: false });
    } else if (state.selectedNo == 10) {
      setState({ ...state, Pic10: "link", isPicvisible: false });
    }
  };

  const cameraSnap = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      exif: true,
      quality: 0.2,
    });
    if (!result.cancelled) {
      _uploadImage(result.uri);
    }
  };

  const uploadImage = () => {
    const pictures = Object.fromEntries(
      [...Array(10)]
        .map((_, i) => {
          const _statePic = state[`Pic${i}`];

          if (_statePic && _statePic !== "link") {
            const file = expoFileToFormFile(_statePic);
            storage
              .put(`/callout_pics/${file.name}`, file)
              .then(console.log)
              .catch(console.error);
            return [
              `Pic${i}`,
              `${HASURA}/storage/o/callout_pics/${file.name}`,
            ];
          }
          return null;
        })
        .filter(Boolean)
    );
    addPostPictures({
      variables: {
        objects: Object.values(pictures).map((pic) => ({
          picture_location: pic,
          callout_id: state.CallOutID,
        })),
      },
    });
    // eslint-disable-next-line no-empty
    if (Object.keys(pictures).length > 0) {
    } else {
      alert("Please Select an Image First");
    }

    return pictures;
  };

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

  return (
    <ScrollView style={styles.container}>
      <Heading
        style={{
          fontSize: 20,
          alignSelf: "center",
          color: "black",
          marginVertical: 20,
        }}
      >
        Post Job
      </Heading>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "1.5%",
        }}
      >
        Solution
      </Text>
      <View style={{ height: 15 }}></View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon
          as={Ionicons}
          name="today"
          style={{ fontSize: 18, color: "#000E1E", paddingRight: "4%" }}
        />
        <TextInput
          // ref="textInputMobile"
          style={{ fontSize: 15, color: "#000E1E", width: "83%" }}
          placeholder="Type solution here"
          defaultValue={state.solution}
          placeholderTextColor="#000E1E"
          underlineColorAndroid="transparent"
          onChangeText={(solution) => {
            setState({ ...state, solution });
          }} //email set
        />
      </View>
      <View
        style={{
          borderBottomColor: "#aaa",
          borderBottomWidth: 2,
          width: "100%",
          paddingTop: "3%",
          marginBottom: 20,
        }}
      ></View>

      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "1.5%",
        }}
      >
        Post Images
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: "5%",
          opacity: state.IsImageuploaded ? 0.3 : 1,
        }}
        pointerEvents={state.IsImageuploaded ? "none" : "auto"}
      >
        <TouchableOpacity onPress={cameraSnap}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Icon
              as={Ionicons}
              name="camera"
              style={{ fontSize: 20, color: "#000E1E", paddingRight: "3%" }}
            />
            <Text
              style={{ fontSize: 13, marginBottom: "1%", color: "#000E1E" }}
            >
              Camera
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 13, marginBottom: "1%" }}>OR</Text>

        <TouchableOpacity onPress={selectImages}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Icon
              as={Ionicons}
              name="add-circle"
              style={{ fontSize: 20, color: "#000E1E", paddingRight: "3%" }}
            />
            <Text
              style={{ fontSize: 13, marginBottom: "1%", color: "#000E1E" }}
            >
              Select images to upload
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: "100%",
          paddingHorizontal: "5%",
          marginTop: "2%",
          opacity: state.IsImageuploaded ? 0.3 : 1,
        }}
      >
        <TouchableOpacity
          onPress={() => toggleGalleryEventModal(state.Pic1, 1)}
          disabled={state.Pic1 == "link" ? true : false}
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
              name="link"
              style={{
                fontSize: 20,
                color: state.Pic1 == "link" ? "#aaa" : "#000E1E",
                paddingRight: "3%",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginBottom: "1%",
                color: state.Pic1 == "link" ? "#aaa" : "#000E1E",
              }}
            >
              Picture 1
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleGalleryEventModal(state.Pic2, 2)}
          disabled={state.Pic2 == "link" ? true : false}
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
              name="link"
              style={{
                fontSize: 20,
                color: state.Pic2 == "link" ? "#aaa" : "#000E1E",
                paddingRight: "3%",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginBottom: "1%",
                color: state.Pic2 == "link" ? "#aaa" : "#000E1E",
              }}
            >
              Picture 2
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleGalleryEventModal(state.Pic3, 3)}
          disabled={state.Pic3 == "link" ? true : false}
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
              name="link"
              style={{
                fontSize: 20,
                color: state.Pic3 == "link" ? "#aaa" : "#000E1E",
                paddingRight: "3%",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginBottom: "1%",
                color: state.Pic3 == "link" ? "#aaa" : "#000E1E",
              }}
            >
              Picture 3
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleGalleryEventModal(state.Pic4, 4)}
          disabled={state.Pic4 == "link" ? true : false}
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
              name="link"
              style={{
                fontSize: 20,
                color: state.Pic4 == "link" ? "#aaa" : "#000E1E",
                paddingRight: "3%",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginBottom: "1%",
                color: state.Pic4 == "link" ? "#aaa" : "#000E1E",
              }}
            >
              Picture 4
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleGalleryEventModal(state.Pic5, 5)}
          disabled={state.Pic5 == "link" ? true : false}
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
              name="link"
              style={{
                fontSize: 20,
                color: state.Pic5 == "link" ? "#aaa" : "#000E1E",
                paddingRight: "3%",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginBottom: "1%",
                color: state.Pic5 == "link" ? "#aaa" : "#000E1E",
              }}
            >
              Picture 5
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleGalleryEventModal(state.Pic6, 6)}
          disabled={state.Pic6 == "link" ? true : false}
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
              name="link"
              style={{
                fontSize: 20,
                color: state.Pic6 == "link" ? "#aaa" : "#000E1E",
                paddingRight: "3%",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginBottom: "1%",
                color: state.Pic6 == "link" ? "#aaa" : "#000E1E",
              }}
            >
              Picture 6
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleGalleryEventModal(state.Pic7, 7)}
          disabled={state.Pic7 == "link" ? true : false}
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
              name="link"
              style={{
                fontSize: 20,
                color: state.Pic7 == "link" ? "#aaa" : "#000E1E",
                paddingRight: "3%",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginBottom: "1%",
                color: state.Pic7 == "link" ? "#aaa" : "#000E1E",
              }}
            >
              Picture 7
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleGalleryEventModal(state.Pic8, 8)}
          disabled={state.Pic8 == "link" ? true : false}
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
              name="link"
              style={{
                fontSize: 20,
                color: state.Pic8 == "link" ? "#aaa" : "#000E1E",
                paddingRight: "3%",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginBottom: "1%",
                color: state.Pic8 == "link" ? "#aaa" : "#000E1E",
              }}
            >
              Picture 8
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleGalleryEventModal(state.Pic9, 9)}
          disabled={state.Pic9 == "link" ? true : false}
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
              name="link"
              style={{
                fontSize: 20,
                color: state.Pic9 == "link" ? "#aaa" : "#000E1E",
                paddingRight: "3%",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginBottom: "1%",
                color: state.Pic9 == "link" ? "#aaa" : "#000E1E",
              }}
            >
              Picture 9
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleGalleryEventModal(state.Pic10, 10)}
          disabled={state.Pic10 == "link" ? true : false}
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
              name="link"
              style={{
                fontSize: 20,
                color: state.Pic10 == "link" ? "#aaa" : "#000E1E",
                paddingRight: "3%",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginBottom: "1%",
                color: state.Pic10 == "link" ? "#aaa" : "#000E1E",
              }}
            >
              Picture 10
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ height: "3%" }}></View>
      <View style={{ height: "3%" }}></View>
      <Button
        disabled={state.IsImageuploaded}
        onPress={alertUploadImage}
        title="UPLOAD IMAGES"
        color="#FFCA5D"
      />
      <View style={{ height: "2%" }}></View>
      {props.navigation.getParam("ticketCount", {}) === 1 ? 
      <Button onPress={alertPostJobHandler} title="PROCEED" color="#FFCA5D" />
      : <Button onPress={alertEndJobHandler} title="FINISH TICKET" color="#FFCA5D" />}
      <View style={{ height: 80 }}></View>
      <Modal
        isVisible={state.isPicvisible}
        onSwipeComplete={() => setState({ isPicvisible: false })}
        swipeDirection={["left", "right", "down"]}
        onBackdropPress={() => setState({ isPicvisible: false })}
      >
        <View style={[styles.GalleryEventModel, { backgroundColor: "#fff" }]}>
          <Image
            style={{ width: "80%", height: "80%", alignSelf: "center" }}
            source={{ uri: state.selectedPic }}
          />
          <Text> </Text>
          <Button
            onPress={() => removeImages()}
            disabled={state.IsImageuploaded}
            title="REMOVE IMAGE"
            color="#FFCA5D"
          />
          <Text> </Text>
          <Text> </Text>
          <Button
            onPress={() => setState({ isPicvisible: false })}
            title="CLOSE"
            color="#FFCA5D"
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

const expoFileToFormFile = (url) => {
  const localUri = url;
  const filename = localUri.split("/").pop();

  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;
  return { uri: localUri, name: filename, type };
};

export default PostJob;
