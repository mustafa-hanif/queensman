/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

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
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";

import { Content, Icon } from "native-base";

const PreJob = (props) => {
  const [state, setState] = useState({
    Note: "",
    Notes: [{ note: "" }],
    Pic1: "link",
    Pic2: "link",
    Pic3: "link",
    Pic4: "link",
    Pic5: "link",
    Pic6: "link",
    Pic7: "link",
    Pic8: "link",
    Pic9: "link",
    ViewOpacity: 1,
    UploadButtonDeactive: false,
    Pic10: "link",
    selectedPic:
      "https://en.wikipedia.org/wiki/Art#/media/File:Art-portrait-collage_2.jpg",
    isPicvisible: false, //veiw image app kay lia
    picturename: "",
    CallOutID: this.props.navigation.getParam("QJobID", null),
    IsImageuploaded: false,
    selectedNo: 0,
    NoteItem: {
      key: "hay",
    },
  });

  componentDidMount() {
    link =
      "https://www.queensman.com/phase_2/queens_worker_Apis/fetchOngoingJobPrePictures.php?ID=" +
      this.state.CallOutID;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(
        result.data.server_response[0].ongoing_job_pictures.picture_location
      );
      if (result.data.server_response != -1) {
        if (
          result.data.server_response[0].ongoing_job_pictures.picture_location
        ) {
          this.setState({
            IsImageuploaded: true,
            Pic1:
              result.data.server_response[0].ongoing_job_pictures
                .picture_location,
          });
        }
        if (
          result.data.server_response[1].ongoing_job_pictures.picture_location
        ) {
          this.setState({
            IsImageuploaded: true,
            Pic2:
              result.data.server_response[1].ongoing_job_pictures
                .picture_location,
          });
        }
        if (
          result.data.server_response[2].ongoing_job_pictures.picture_location
        ) {
          this.setState({
            IsImageuploaded: true,
            Pic3:
              result.data.server_response[2].ongoing_job_pictures
                .picture_location,
          });
        }
        if (
          result.data.server_response[3].ongoing_job_pictures.picture_location
        ) {
          this.setState({
            IsImageuploaded: true,
            Pic4:
              result.data.server_response[3].ongoing_job_pictures
                .picture_location,
          });
        }
        if (
          result.data.server_response[4].ongoing_job_pictures.picture_location
        ) {
          this.setState({
            IsImageuploaded: true,
            Pic5:
              result.data.server_response[4].ongoing_job_pictures
                .picture_location,
          });
        }
        if (
          result.data.server_response[5].ongoing_job_pictures.picture_location
        ) {
          this.setState({
            IsImageuploaded: true,
            Pic6:
              result.data.server_response[5].ongoing_job_pictures
                .picture_location,
          });
        }
        if (
          result.data.server_response[6].ongoing_job_pictures.picture_location
        ) {
          this.setState({
            IsImageuploaded: true,
            Pic7:
              result.data.server_response[6].ongoing_job_pictures
                .picture_location,
          });
        }
        if (
          result.data.server_response[7].ongoing_job_pictures.picture_location
        ) {
          this.setState({
            IsImageuploaded: true,
            Pic8:
              result.data.server_response[7].ongoing_job_pictures
                .picture_location,
          });
        }
        if (
          result.data.server_response[8].ongoing_job_pictures.picture_location
        ) {
          this.setState({
            IsImageuploaded: true,
            Pic9:
              result.data.server_response[8].ongoing_job_pictures
                .picture_location,
          });
        }
      }
    });
    this.FetchUpdateNotes();
  }
  FetchUpdateNotes() {
    link =
      "https://www.queensman.com/phase_2/queens_worker_Apis/fetchJobNotes.php?ID=" +
      this.state.CallOutID;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data);
      if (result.data.server_response != -1) {
        this.setState({
          Notes: result.data.server_response,
        });
      }
      console.log(this.state.Notes);
    });
  }

  toggleGalleryEventModal = (vale, no) => {
    this.setState({
      isPicvisible: !this.state.isPicvisible,
      selectedPic: vale,
      selectedNo: no,
    });
  };
  AlertPreJobHandler = () => {
    Alert.alert(
      "Alert.",
      "Are you sure you want continue?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => this.PreJobHandler() },
      ],
      { cancelable: false }
    );
  };

  PreJobHandler = () => {
    if (this.state.IsImageuploaded) {
      this.props.navigation.navigate("PostJob", {
        QJobID: this.state.CallOutID,
      });
    } else {
      alert("Please upload pre job images first!");
    }
  };
  AlertUploadImage = () => {
    Alert.alert(
      "Upload Images.",
      "Are you sure you want to upload the selected images?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => this.UploadImage() },
      ],
      { cancelable: false }
    );
  };

  SelectImages = async () => {
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
      this._uploadImage(result.uri);
    }
  };

  UploadImage = () => {
    if (this.state.Pic1 != "link") {
      let link =
        "https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_a.php";
      if (this.state.Pic1 != "link") {
        this.urlToUPLOAD(this.state.Pic1, link);
      }
      if (this.state.Pic2 != "link") {
        this.urlToUPLOAD(this.state.Pic2, link);
        // blink="https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file="+this.state.picturename+"&ID="+this.state.CallOutID
        // console.log(blink)
        // axios.get(blink).then((result)=>
        // {
        //     console.log(result.data)
        // })
      }
      if (this.state.Pic3 != "link") {
        this.urlToUPLOAD(this.state.Pic3, link);
        // blink="https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file="+this.state.picturename+"&ID="+this.state.CallOutID
        // console.log(blink)
        // axios.get(blink).then((result)=>
        // {
        //     console.log(result.data)
        // })
      }
      if (this.state.Pic4 != "link") {
        this.urlToUPLOAD(this.state.Pic4, link);
        // blink="https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file="+this.state.picturename+"&ID="+this.state.CallOutID
        // console.log(blink)
        // axios.get(blink).then((result)=>
        // {
        //     console.log(result.data)
        // })
      }
      if (this.state.Pic5 != "link") {
        this.urlToUPLOAD(this.state.Pic5, link);
        // blink="https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file="+this.state.picturename+"&ID="+this.state.CallOutID
        // console.log(blink)
        // axios.get(blink).then((result)=>
        // {
        //     console.log(result.data)
        // })
      }
      if (this.state.Pic6 != "link") {
        this.urlToUPLOAD(this.state.Pic6, link);
        // blink="https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file="+this.state.picturename+"&ID="+this.state.CallOutID
        // console.log(blink)
        // axios.get(blink).then((result)=>
        // {
        //     console.log(result.data)
        // })
      }
      if (this.state.Pic7 != "link") {
        this.urlToUPLOAD(this.state.Pic7, link);
        // blink="https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file="+this.state.picturename+"&ID="+this.state.CallOutID
        // console.log(blink)
        // axios.get(blink).then((result)=>
        // {
        //     console.log(result.data)
        // })
      }
      if (this.state.Pic8 != "link") {
        this.urlToUPLOAD(this.state.Pic8, link);
        // blink="https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file="+this.state.picturename+"&ID="+this.state.CallOutID
        // console.log(blink)
        // axios.get(blink).then((result)=>
        // {
        //     console.log(result.data)
        // })
      }
      if (this.state.Pic9 != "link") {
        this.urlToUPLOAD(this.state.Pic9, link);
        // blink="https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file="+this.state.picturename+"&ID="+this.state.CallOutID
        // console.log(blink)
        // axios.get(blink).then((result)=>
        // {
        //     console.log(result.data)
        // })
      }
      if (this.state.Pic10 != "link") {
        this.urlToUPLOAD(this.state.Pic10, link);
        // blink="https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file="+this.state.picturename+"&ID="+this.state.CallOutID
        // console.log(blink)
        // axios.get(blink).then((result)=>
        // {
        //     console.log(result.data)
        // })
      }
      this.setState({ IsImageuploaded: true });
    } else {
      alert("Please select atleast 1 image!");
    }
  };

  _uploadImage = (uri) => {
    if (this.state.Pic1 == "link") {
      this.setState({
        Pic1: uri,
      });
      console.log(this.state.picture1);
    } else if (this.state.Pic2 == "link") {
      this.setState({
        Pic2: uri,
      });
      console.log(this.state.picture2);
    } else if (this.state.Pic3 == "link") {
      this.setState({
        Pic3: uri,
      });
    } else if (this.state.Pic4 == "link") {
      this.setState({
        Pic4: uri,
      });
    } else if (this.state.Pic5 == "link") {
      this.setState({
        Pic5: uri,
      });
    } else if (this.state.Pic6 == "link") {
      this.setState({
        Pic6: uri,
      });
    } else if (this.state.Pic7 == "link") {
      this.setState({
        Pic7: uri,
      });
    } else if (this.state.Pic8 == "link") {
      this.setState({
        Pic8: uri,
      });
    } else if (this.state.Pic9 == "link") {
      this.setState({
        Pic9: uri,
      });
    } else if (this.state.Pic10 == "link") {
      this.setState({
        Pic10: uri,
      });
    } else {
      alert("Pictures Limit Reached, i.e 10");
    }
  };
  urlToUPLOAD = async (url, link) => {
    let localUri = url;
    let filename = localUri.split("/").pop();
    let blink =
      "https://www.queensman.com/phase_2/queens_worker_Apis/uploadPrePicture_b.php?target_file=" +
      filename +
      "&ID=" +
      this.state.CallOutID;
    console.log(blink);
    axios.get(blink).then((result) => {
      console.log(result.data);
    });
    console.log(filename);
    this.setState({
      picturename: filename,
    });
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
  addNote = () => {
    link =
      "https://www.queensman.com/phase_2/queens_worker_Apis/insertJobNotes.php?ID=" +
      this.state.CallOutID +
      "&note=" +
      this.state.Note;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data);
      this.setState({
        Note: "",
      });
      this.FetchUpdateNotes();
    });
  };
  RemoveNotesAlert = (item) => {
    Alert.alert(
      "Remove Note.",
      item.note,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Remove", onPress: () => this.RemoveNotes(item) },
      ],
      { cancelable: false }
    );
  };
  RemoveNotes = (item) => {
    link =
      "https://www.queensman.com/phase_2/queens_worker_Apis/deleteJobNotes.php?ID=" +
      this.state.CallOutID +
      "&note=" +
      item.note;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data);

      this.FetchUpdateNotes();
    });
  };
  RemoveImages = () => {
    if (this.state.selectedNo == 1) {
      this.setState({
        Pic1: "link",
      });
    } else if (this.state.selectedNo == 2) {
      this.setState({
        Pic2: "link",
      });
    } else if (this.state.selectedNo == 3) {
      this.setState({
        Pic3: "link",
      });
    } else if (this.state.selectedNo == 4) {
      this.setState({
        Pic4: "link",
      });
    } else if (this.state.selectedNo == 5) {
      this.setState({
        Pic5: "link",
      });
    } else if (this.state.selectedNo == 6) {
      this.setState({
        Pic6: "link",
      });
    } else if (this.state.selectedNo == 7) {
      this.setState({
        Pic7: "link",
      });
    } else if (this.state.selectedNo == 8) {
      this.setState({
        Pic8: "link",
      });
    } else if (this.state.selectedNo == 9) {
      this.setState({
        Pic9: "link",
      });
    } else if (this.state.selectedNo == 10) {
      this.setState({
        Pic10: "link",
      });
    }
    this.setState({ isPicvisible: false });
  };
  CameraSnap = async () => {
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
      this._uploadImage(result.uri);
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <ScrollView style={styles.container}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: "#FFCA5D",
              marginBottom: "1.5%",
            }}
          >
            Pre Images
          </Text>
          <View style={{ height: "2%" }}></View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: "5%",
              opacity: this.state.IsImageuploaded ? 0.3 : 1,
            }}
            pointerEvents={this.state.IsImageuploaded ? "none" : "auto"}
          >
            <TouchableOpacity onPress={this.CameraSnap}>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="camera"
                  style={{ fontSize: 20, color: "#000E1E", paddingRight: "3%" }}
                ></Icon>
                <Text style={{ fontSize: 13, marginBottom: "1%" }}>Camera</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 13, marginBottom: "1%" }}>OR</Text>
            <TouchableOpacity
              onPress={this.SelectImages}
              disabled={this.state.UploadButtonDeactive}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="add-circle"
                  style={{ fontSize: 20, color: "#000E1E", paddingRight: "3%" }}
                ></Icon>
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
              opacity: this.state.IsImageuploaded ? 0.3 : 1,
            }}
          >
            <TouchableOpacity
              onPress={() => this.toggleGalleryEventModal(this.state.Pic1, 1)}
              disabled={this.state.Pic1 == "link" ? true : false}
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
                    color: this.state.Pic1 == "link" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                ></Icon>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: this.state.Pic1 == "link" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 1
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleGalleryEventModal(this.state.Pic2, 2)}
              disabled={this.state.Pic2 == "link" ? true : false}
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
                    color: this.state.Pic2 == "link" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                ></Icon>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: this.state.Pic2 == "link" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 2
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleGalleryEventModal(this.state.Pic3, 3)}
              disabled={this.state.Pic3 == "link" ? true : false}
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
                    color: this.state.Pic3 == "link" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                ></Icon>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: this.state.Pic3 == "link" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 3
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleGalleryEventModal(this.state.Pic4, 4)}
              disabled={this.state.Pic4 == "link" ? true : false}
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
                    color: this.state.Pic4 == "link" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                ></Icon>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: this.state.Pic4 == "link" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 4
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleGalleryEventModal(this.state.Pic5, 5)}
              disabled={this.state.Pic5 == "link" ? true : false}
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
                    color: this.state.Pic5 == "link" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                ></Icon>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: this.state.Pic5 == "link" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 5
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleGalleryEventModal(this.state.Pic6, 6)}
              disabled={this.state.Pic6 == "link" ? true : false}
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
                    color: this.state.Pic6 == "link" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                ></Icon>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: this.state.Pic6 == "link" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 6
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleGalleryEventModal(this.state.Pic7, 7)}
              disabled={this.state.Pic7 == "link" ? true : false}
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
                    color: this.state.Pic7 == "link" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                ></Icon>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: this.state.Pic7 == "link" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 7
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleGalleryEventModal(this.state.Pic8, 8)}
              disabled={this.state.Pic8 == "link" ? true : false}
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
                    color: this.state.Pic8 == "link" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                ></Icon>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: this.state.Pic8 == "link" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 8
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleGalleryEventModal(this.state.Pic9, 9)}
              disabled={this.state.Pic9 == "link" ? true : false}
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
                    color: this.state.Pic9 == "link" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                ></Icon>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: this.state.Pic9 == "link" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 9
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleGalleryEventModal(this.state.Pic10, 10)}
              disabled={this.state.Pic10 == "link" ? true : false}
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
                    color: this.state.Pic10 == "link" ? "#aaa" : "#000E1E",
                    paddingRight: "3%",
                  }}
                ></Icon>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: "1%",
                    color: this.state.Pic10 == "link" ? "#aaa" : "#000E1E",
                  }}
                >
                  Picture 10
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ height: "3%" }}></View>
          <Button
            disabled={this.state.IsImageuploaded}
            onPress={this.AlertUploadImage}
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
          <View style={{ heigh: "30%", width: "100%" }}>
            <FlatList
              data={this.state.Notes}
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
                      name="remove"
                      style={{ fontSize: 12, color: "#aaa" }}
                    ></Icon>
                    <Text style={{ fontSize: 12, color: "#aaa" }}>
                      {" "}
                      {item.note}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => this.RemoveNotesAlert(item)}>
                    <Icon
                      name="close-circle"
                      style={{ fontSize: 20, color: "#FFCA5D" }}
                    ></Icon>
                  </TouchableOpacity>
                </View>
              )}
            ></FlatList>
          </View>
          <View style={{ height: 17 }}></View>
          <Text style={{ color: "#aaa", fontSize: 10 }}>
            Note: Kindly scroll screen upwards if the textbox hides behind the
            keyboard.
          </Text>
          <View style={{ height: 2 }}></View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="ios-newspaper-outline"
              style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
            ></Icon>
            <TextInput
              ref="textInputMobile"
              style={{ fontSize: 15, color: "#000E1E", width: "83%" }}
              placeholder="Type note here"
              defaultValue={this.state.Note}
              placeholderTextColor="#000E1E"
              underlineColorAndroid="transparent"
              onChangeText={(Note) => {
                this.setState({ Note });
              }} //email set
            />
            <TouchableOpacity onPress={this.addNote}>
              <Icon
                name="add-circle"
                style={{ fontSize: 25, color: "#000E1E" }}
              ></Icon>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: "#aaa",
              borderBottomWidth: 2,
              width: "100%",
              paddingTop: "3%",
            }}
          ></View>
          <View style={{ height: "3%" }}></View>
          <Button
            onPress={this.AlertPreJobHandler}
            title="NEXT"
            color="#FFCA5D"
          />

          <View style={{ height: 30 }}></View>
          <Button title="" color="#fff" />

          <Modal
            isVisible={this.state.isPicvisible}
            onSwipeComplete={() => this.setState({ isPicvisible: false })}
            swipeDirection={["left", "right", "down"]}
            onBackdropPress={() => this.setState({ isPicvisible: false })}
          >
            <View
              style={[styles.GalleryEventModel, { backgroundColor: "#fff" }]}
            >
              <Image
                style={{ width: "80%", height: "80%", alignSelf: "center" }}
                source={{ uri: this.state.selectedPic }}
              />
              <Text> </Text>

              <Button
                disabled={this.state.IsImageuploaded}
                onPress={() => this.RemoveImages()}
                title="REMOVE IMAGE"
                color="#FFCA5D"
              />
              <Text> </Text>
              <Text> </Text>
              <Button
                onPress={() => this.setState({ isPicvisible: false })}
                title="CLOSE"
                color="#FFCA5D"
              />
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: "5%",
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
