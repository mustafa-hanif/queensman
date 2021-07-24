/* eslint-disable react/no-string-refs */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";

import React, { useEffect, useState } from "react";

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
  SafeAreaView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Content, Icon } from "native-base";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { auth, storage } from "../utils/nhost";

const GET_NOTES = gql`
  query JobNotes($callout_id: Int!) {
    job_notes(where: { callout_id: { _eq: $callout_id } }) {
      note
    }
  }
`;

const ADD_NOTE = gql`
  mutation InsertJobNote($callout_id: Int!, $note: String!) {
    insert_job_notes_one(object: { callout_id: $callout_id, note: $note }) {
      note
    }
  }
`;

const DELETE_NOTE = gql`
  mutation DeleteJobNote($callout_id: Int!, $note: String!) {
    delete_job_notes(
      where: { callout_id: { _eq: $callout_id }, note: { _eq: $note } }
    ) {
      affected_rows
    }
  }
`;

const FINISH_JOB = gql
`mutation FinishFinalJob($id: Int!, $updater_id: Int!, $callout_id: Int!) {
  insert_job_history_one(object: {callout_id: $callout_id, updater_id: $updater_id, updated_by: "Ops Team", status_update: "Closed"}) {
    time
  }
  update_callout_by_pk(pk_columns: {id: $callout_id}, _set: {status: "Closed"}) {
    status
  }
  
  update_job_tickets_by_pk(
    pk_columns: { id: $id }
    _set: { status: "Closed" }
  ) {
    id
  }
}`

const FINISH_JOB_SINGLE = gql `
mutation UpdateJobAndJobTicket ($id: Int!) {
  update_job_tickets_by_pk(
      pk_columns: { id: $id }
      _set: { status: "Closed" }
    ) {
      id
    }
}
`


const PreJob = (props) => {
  const ticketId = props.navigation.getParam("ticketDetails", {}).id
  const workerId = props.navigation.getParam('workerId', {})
  const ticket = props.navigation.getParam("ticketDetails", {})
  const ticketCount = props.navigation.getParam('ticketCount', {})
  const pics = Object.fromEntries(
    [...Array(10)].map((_, index) => {
      return [`Pic${index}`, "link"];
    })
  );

  const CallOutIdFromParams = props.navigation.getParam("QJobID", null);
  const [state, setState] = useState({
    Note: "",
    Notes: [{ note: "" }],
    ...pics,
    ViewOpacity: 1,
    UploadButtonDeactive: false,
    selectedPic:
      "https://en.wikipedia.org/wiki/Art#/media/File:Art-portrait-collage_2.jpg",
    isPicvisible: false, //veiw image app kay lia
    picturename: "",
    CallOutID: CallOutIdFromParams,
    IsImageuploaded: true,
    selectedNo: 0,
    NoteItem: {
      key: "hay",
    },
  });

  const [addJobNote, { loading: addJobNoteLoading, error: mutationError }] =
    useMutation(ADD_NOTE);

  const [deleteJobNote, { loading: delNoteLoading, error: delNoteError }] =
    useMutation(DELETE_NOTE);

  const [fetchNotes, { loading, data }] = useLazyQuery(GET_NOTES, {
    variables: {
      callout_id: CallOutIdFromParams,
    },
  });

  const [finishJob] =
  useMutation(FINISH_JOB);

  const [finishJobSingle] = useMutation(FINISH_JOB_SINGLE)


  useEffect(() => {
    fetchNotes();
  }, []);

  const toggleGalleryEventModal = (vale, no) => {
    setState({
      ...state,
      isPicvisible: !state.isPicvisible,
      selectedPic: vale,
      selectedNo: no,
    });
  };
  const AlertPreJobHandler = () => {
    Alert.alert(
      "Alert.",
      "Are you sure you want continue?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => PreJobHandler() },
      ],
      { cancelable: false }
    );
  };

  const AlertSubmitJob = () => {
    Alert.alert(
      "Alert.",
      "Are you sure you want continue?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => doneJob() },
      ],
      { cancelable: false }
    );
  };

  const doneJob = async () => {
    // saveCanvas()
    console.log(ticketCount)
    if(ticketCount == 1) {
      console.log("One Job")


      try {
        await finishJob({variables: {
          id: ticketId,
          updater_id: workerId,
          callout_id: state.CallOutID,
        }})
        alert("Service has been successfully completed. Great Job!");
        props.navigation.navigate("HomeNaviagtor");
      } catch (e) {
        console.log(e)
        alert("Could not submit Job!");
      }
    } else {
      console.log("Many job")
      try {
        await finishJobSingle({variables: {
          id: ticketId,
        }})
        alert("Service has been successfully completed. Great Job!");
        props.navigation.navigate("HomeNaviagtor");
      } catch (e) {
        console.log(e)
        alert("Could not submit Job!");
      }
    }
};

  const PreJobHandler = () => {
    if (state.IsImageuploaded) {
      props.navigation.navigate("PostJob", {
        QJobID: state.CallOutID,
        it: props.navigation.getParam("it", {}),
        ticketDetails: props.navigation.getParam("ticketDetails", {}),
        ticketCount: props.navigation.getParam('ticketCount', {}),
      });
    } else {
      alert("Please upload pre job images first!");
    }
  };
  const AlertUploadImage = () => {
    Alert.alert(
      "Upload Images.",
      "Are you sure you want to upload the selected images?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => UploadImage() },
      ],
      { cancelable: false }
    );
  };

  const SelectImages = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
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

  const UploadImage = () => {
    const pictures = Object.fromEntries(
      [...Array(10)]
        .map((_, i) => {
          const _statePic = state[`Pic${i}`];
          if (_statePic !== "link") {
            const file = expoFileToFormFile(_statePic);
            storage
              .put(`/callout_pics/${file.name}`, file)
              .then(console.log)
              .catch(console.error);
            return [
              `Pic${i}`,
              `https://backend-8106d23e.nhost.app/storage/o/callout_pics/${file.name}`,
            ];
          }
          return null;
        })
        .filter(Boolean)
    );
    console.log({ pictures });
    if (Object.keys(pictures).length > 0) {
      setState({ ...state, IsImageuploaded: true });
    }else{
      alert('Please Select an Image First')
    }

    return pictures;
  };

  const _uploadImage = (uri) => {
    console.log("chalra");
    for (let i = 0; i < 10; i++) {
      if (state[`Pic${i}`] === "link") {
        setState({ ...state, ...state, [`Pic${i}`]: uri });
        break;
      }
    }
  };

  const urlToUPLOAD = async (url, link) => {
    let localUri = url;
    let filename = localUri.split("/").pop();
    let blink =
      "https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file=" +
      filename +
      "&ID=" +
      state.CallOutID;
    console.log(blink);
    axios.get(blink).then((result) => {
      console.log(result.data);
    });
    console.log(filename);
    setState({ ...state, picturename: filename });
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append("photo", { uri: localUri, name: filename, type });
    console.log(formData);

    return await fetch(link, {
      method: "POST",
      body: formData,
      header: {
        "content-type": "multipart/form-data",
      },
    }).then((result) => {
      console.log(result.data);
    });
  };

  const addNote = () => {
    addJobNote({
      variables: {
        callout_id: CallOutIdFromParams,
        note: state.Note,
      },
    })
      .then((res) => {
        setState({ ...state, Note: "" });
        fetchNotes();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const RemoveNotesAlert = (item) => {
    Alert.alert(
      "Remove Note.",
      item.note,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Remove", onPress: () => RemoveNotes(item) },
      ],
      { cancelable: false }
    );
  };
  const RemoveNotes = (item) => {
    deleteJobNote({
      variables: {
        callout_id: state.CallOutID,
        note: item.note,
      },
    }).then((res) => {
      console.log("delete ====>", { res });
      fetchNotes();
    });
  };

  const RemoveImages = () => {
    if (state.selectedNo == 1) {
      setState({ ...state, Pic1: "link" });
    } else if (state.selectedNo == 2) {
      setState({ ...state, Pic2: "link" });
    } else if (state.selectedNo == 3) {
      setState({ ...state, Pic3: "link" });
    } else if (state.selectedNo == 4) {
      setState({ ...state, Pic4: "link" });
    } else if (state.selectedNo == 5) {
      setState({ ...state, Pic5: "link" });
    } else if (state.selectedNo == 6) {
      setState({ ...state, Pic6: "link" });
    } else if (state.selectedNo == 7) {
      setState({ ...state, Pic7: "link" });
    } else if (state.selectedNo == 8) {
      setState({ ...state, Pic8: "link" });
    } else if (state.selectedNo == 9) {
      setState({ ...state, Pic9: "link" });
    } else if (state.selectedNo == 10) {
      setState({ ...state, Pic10: "link" });
    }
    setState({ ...state, isPicvisible: false });
  };

  const cameraSnap = async () => {
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
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      exif: true,
      quality: 0.2,
    });
    if (!result.cancelled) {
      _uploadImage(result.uri);
    }
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
          defaultValue={state.Note}
          // value={state.Note}
          placeholderTextColor="#000E1E"
          underlineColorAndroid="transparent"
          onChangeText={(Note) => {
            setState({ ...state, Note });
          }} //email set
        />
        <TouchableOpacity onPress={addNote}>
          <Icon
          as={Ionicons}
            name="add-circle"
            style={{ fontSize: 25, color: "#000E1E" }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
       <Heading style={{ fontSize: 20, alignSelf: "center", color: "black", marginVertical:20 }}>
       Upload Images
        </Heading>
        <View style={{ height: "2%" }}></View>
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
              <Text style={{ fontSize: 13, marginBottom: "1%" }}>Camera</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 13, marginBottom: "1%" }}>OR</Text>
          <TouchableOpacity
            onPress={SelectImages}
            disabled={state.UploadButtonDeactive}
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
                name="add-circle"
                style={{ fontSize: 20, color: "#000E1E", paddingRight: "3%" }}
              />
              <Text style={{ fontSize: 13, marginBottom: "1%" }}>
                Select Image From Gallery
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
          {[...Array(10)].map((_, i) => {
            return (
              <PictureLink
                key={`Picture ${i}`}
                label={`Picture ${i}`}
                picture={state[`Pic${i}`]}
                toggleGalleryEventModal={toggleGalleryEventModal}
                index={i}
              />
            );
          })}
        </View>
        <View style={{ height: "3%" }}></View>
        <Button
          disabled={state.IsImageuploaded}
          onPress={AlertUploadImage}
          title="UPLOAD IMAGES"
          color="#FFCA5D"
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            color: "#FFCA5D",
            marginBottom: "1.5%",
            marginTop: "4%",
          }}
        >
          Notes:{" "}
        </Text>
        <View  style={{ heigh: "30%", width: "100%" }}>
          {data?.job_notes && !delNoteLoading ? <FlatList
            data={data?.job_notes || []}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: "4%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: "1%",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                  as={Ionicons}
                    name="remove"
                    style={{ fontSize: 12, color: "#aaa" }}
                  />
                  <Text style={{ fontSize: 12, color: "#aaa" }}>
                    {" "}
                    {item.note}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => RemoveNotesAlert(item)}>
                  <Icon
                  as={Ionicons}
                    name="close-circle"
                    style={{ fontSize: 20, color: "#FFCA5D" }}
                  />
                </TouchableOpacity>
              </View>
            )}
          ></FlatList> : <ActivityIndicator size="small" color="#aaa" />}
        </View>
        <View  style={{ borderBottomWidth: 1, paddingBottom: 10 }}>
        {addJobNoteLoading && <ActivityIndicator size="small" color="#aaa" />}
        {!addJobNoteLoading && RenderAddNote()}
       </View>
       <View style={{ marginTop: 20, marginBottom: 60}}>
        {ticket.type == "Deferred" ? <Button onPress={AlertSubmitJob} title = "Submit Job" color="#FFCA5D" /> : 
        <Button onPress={AlertPreJobHandler} title="NEXT" color="#FFCA5D" />}
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
            />
            <Text> </Text>

            <Button
              disabled={state.IsImageuploaded}
              onPress={() => RemoveImages()}
              title="REMOVE IMAGE"
              color="#FFCA5D"
            />
            <Text> </Text>
            <Text> </Text>
            <Button
              onPress={() => setState({ ...state, isPicvisible: false })}
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
    width: "40%",
    // justifyContent: 'center',
    alignItems: "center",
    // height:'25%'
    paddingVertical: "3%",
  },
});

const PictureLink = ({ toggleGalleryEventModal, picture, label, index }) => {
  return (
    <TouchableOpacity
      onPress={() => toggleGalleryEventModal(picture, index)}
      disabled={picture == "link" ? true : false}
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
            color: picture == "link" ? "#aaa" : "#000E1E",
            paddingRight: "3%",
          }}
        />
        <Text
          style={{
            fontSize: 13,
            marginBottom: "1%",
            color: picture == "link" ? "#aaa" : "#000E1E",
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const expoFileToFormFile = (url) => {
  const localUri = url;
  const filename = localUri.split("/").pop();

  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;
  return { uri: localUri, name: filename, type };
};
export default PreJob;
