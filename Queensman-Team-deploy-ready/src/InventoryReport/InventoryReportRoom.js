/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";

import { Button as MyButton, HStack, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";
import moment from "moment";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";

import { storage } from "../utils/nhost";

import * as Permissions from "expo-permissions";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { fontSize } from "styled-system";

const fetchInventoryArticlesViaInventoryReportID = gql`
  query InventoryArticles($_eq: Int = 10) {
    inventory_room(where: { inventory_report_id: { _eq: $_eq } }) {
      inventory_articles {
        type
        description
        inspection
        work_description
        remarks
        article_id: id
      }
      room
      room_id: id
    }
  }
`;

const fetchInvetoryPictures = gql`
query MyQuery($inventory_room_id: Int = 10) {
  inventory_picture(
    where: { inventory_room_id: { _eq: $inventory_room_id } }
  ) {
    picture_id: id
    picture_location
    upload_time
  }
}
`;

const insertInventoryRoomQuery = gql`
  mutation InsertInventoryRoom(
    $inventory_report_id: Int = 10
    $room: String = ""
  ) {
    insert_inventory_room_one(
      object: { inventory_report_id: $inventory_report_id, room: $room }
    ) {
      id
    }
  }
`;

const deleteInventoryRoomQuery = gql`
mutation MyMutation($id: Int!) {
  delete_inventory_room_by_pk(id: $id) {
    id
  }
}
`

const insertInventoryPicturesQuery = gql`
  mutation InventoryPicture(
    $inventory_room_id: Int!
    $picture_location: String!
  ) {
    insert_inventory_picture_one(
      object: {
        inventory_room_id: $inventory_room_id
        picture_location: $picture_location
      }
    ) {
      id
    }
  }
`;

export default function InventoryReportRoom(props) {
  const InventoryReportID = props.navigation.getParam("InventoryReportID", "");
  const room_id = props.navigation.getParam("it", "").room_id;
  const [ImagesList, setImagesList] = useState([]);

  const [insertInventoryRoom, { loading: IRoomLoading, error: IRoomError }] =
    useMutation(insertInventoryRoomQuery);

  const [deleteInventoryRoom, { loading: deleteRoomLoading, error: deleteRoomError }] =
  useMutation(deleteInventoryRoomQuery);

  const [insertInventoryPictures, { loading: IPLoading, error: IPError }] =
    useMutation(insertInventoryPicturesQuery);

  const [loadArticles, { loading, data, error }] = useLazyQuery(
    fetchInventoryArticlesViaInventoryReportID,
    {
      variables: {
        _eq: InventoryReportID,
      },
    }
  );

  const [
    loadPics,
    { loading: picturesloading, data: pictures, error: pictureError },
  ] = useLazyQuery(fetchInvetoryPictures, {
    variables: {
      inventory_room_id: room_id,
    },
  });

  useEffect(() => {
    const { navigation } = props;
    const focusListener = navigation.addListener("didFocus", () => {
      console.log("calling apis");
      loadArticles();
      loadPics();
    });
    return () => {
      focusListener.remove();
      return focusListener;
    };
  }, []);

  const [isloading, setisloading] = useState(true);
  useEffect(() => {
    if (data || pictures) {
      setisloading(false);
      const images = pictures?.inventory_picture?.map((val, i) => {
        return {
          index: (i + 1),
          imageSel: val.picture_location,
          fromDB: true,
          upload_time: val.upload_time
        };
      });

      setImagesList(images);
    }
  }, [data, pictures]);

  if (isloading) {
    return null;
  }

  return (
    <InventoryReportRoomClass
      loading={loading}
      room_id={room_id}
      ImagesList={ImagesList}
      setImagesList={setImagesList}
      insertInventoryRoom={insertInventoryRoom}
      deleteInventoryRoom={deleteInventoryRoom}
      IPLoading={IPLoading}
      insertInventoryPictures={insertInventoryPictures}
      data={ data?.inventory_room?.[0]?.inventory_articles}
      {...props}
    ></InventoryReportRoomClass>
  );
}

class InventoryReportRoomClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      Id: "",
      dataAvaible: true,
      cusID: "",
      selected: "Owned",
      workerID: 1,
      TotalClient: 0,
      clientList: [],
      totalData: [],
      StaticData: [],
      MenuSelected: "art",
      ImagesList: [],
      room_id: this.props.navigation.getParam("it", "").room_id,
      room: this.props.navigation.getParam("it", "").room,
      selectedPic: null,
      InventoryReportID: this.props.navigation.getParam(
        "InventoryReportID",
        "Something"
      ),
    };
  }

  passItem = (item) => {
    this.props.navigation.navigate("Articles", {
      it: item,
      room_id: this.state.room_id,
    });
  };

  CreateNewArticles = () => {
    this.props.navigation.navigate("Articles", {
      room_id: this.state.room_id,
    });
  };
  componentDidMount() {
    var clientsArray = this.props.data;

    // const images = this.props?.inventory_picture?.map((val) => {
    //   return {
    //     imageSel: val.picture_location,
    //   };
    // });

    this.setState({...this.state,
      clientList: clientsArray,
      totalData: clientsArray,
      StaticData: clientsArray,
      loading: false,
      ImagesList: this.props.ImagesList,
    });
  }

  changeselected = (value) => {
    this.setState({...this.state, MenuSelected: value });
  };

  contains = ({ full_name, phone, id }, query) => {
    if (
      full_name.includes(query) ||
      phone.includes(query) ||
      id.includes(query)
    ) {
      return true;
    }
    return false;
  };

  searchData = (text) => {
    const data = _.filter(this.state.totalData, (StaticData) => {
      return this.contains(StaticData, text);
    });
    this.setState({...this.state, query: text, clientList: data });
  };
  toggleGalleryEventModal = (vale, upload_time, fromDB) => {
    this.setState({...this.state,
      isPicvisible: !this.state.isPicvisible,
      fromDB,
      selectedPic: vale,
      upload_time
    });
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
      allowsEditing: true,
      exif: true,
      quality: 0.2,
    });
    if (!result.cancelled) {
      var picList = [...this.props.ImagesList];
      let picArrayLength = picList.length + 1
      var img = { index: picArrayLength, imageSel: result.uri, fromDB: false, upload_time: new Date() };
      picList.push(img);
      //        console.log(picList)
      this.props.setImagesList(picList);
      this.setState({...this.state, ImagesList: picList });
    }
  };

  RemoveImages = () => {
    var picList = [];

    picList = this.props.ImagesList.filter((data) => {
      if (data.imageSel != this.state.selectedPic) {
        return data
      }
    });

    this.props.setImagesList(picList);
    this.setState({...this.state,
      ImagesList: picList,
      isPicvisible: !this.state.isPicvisible,
    });
  };
  SaveInfo = () => {
    console.log(this.state.room);
    if (!this.state.room) {
      return alert("Cannot Add Empty Name");
    }
    this.props
      .insertInventoryRoom({
        variables: {
          inventory_report_id: this.state.InventoryReportID,
          room: this.state.room,
        },
      })
      .then((result) => {
        console.log(result.data);
        alert("Successfully Added Room In Inventory Report Details.");

        setTimeout(() => {
          this.props.navigation.goBack();
        }, 1000);
      }).catch(() => {
        alert("Information saved");
        setTimeout(() => {
          this.props.navigation.goBack();
        }, 1000);
      });
  };

  DeleteRoomAlert = () => {
    Alert.alert(
      "Delete Room",
      "Are you sure you want to delete the room?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => this.deleteRoom() },
      ],
      { cancelable: true }
    );
  };

  deleteRoom = () => {
    this.props.deleteInventoryRoom({
        variables: {
          id: this.props.room_id,
        },
      })
      .then((result) => {
        console.log(result.data);
        alert("Room Deleted");
        setTimeout(() => {
          this.props.navigation.goBack();
        }, 1000);
      }).catch((e) => {
        console.log(e)
        alert("Error deleting room");
      });
  };

  uploadPics = async () => {
    const imagesToUplaod = this.props.ImagesList.filter(
      (value) =>
        !value.imageSel.startsWith("https://backend-8106d23e.nhost.app")
    );

    if (imagesToUplaod.length > 0) {
      await Promise.all(
        imagesToUplaod.map((value) => {
          const file = expoFileToFormFile(value.imageSel);
          console.log({ file });
          return storage
            .put(`/inventory_pictures/${file.name}`, file)
            .then((res) => {
              return `https://backend-8106d23e.nhost.app/storage/o/inventory_pictures/${file.name}`;
            })
            .catch(console.error);
        })
      ).then(async (values) => {
        const res = await Promise.all(
          values.map((val) => {
            this.props.insertInventoryPictures({
              variables: {
                inventory_room_id: this.state.room_id,
                picture_location: val,
              },
            });
          })
        );
        alert("Pictures Uploaded Successfully");
        this.props.navigation.goBack();
      });
    }
  };

  UploadImages = () => {
    Alert.alert(
      "Upload Images",
      "Are you sure you want to upload images? You cannot remove it later!",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => this.uploadPics() },
      ],
      { cancelable: true }
    );
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{ paddingHorizontal: "6%" }}>
          <Button
            style={{ width: "100%" }}
            onPress={() => this.SaveInfo()}
            title="Save Information"
            color="#FFCA5D"
          />
        </View>

        <View
          style={{
            borderBottomColor: "#FFCA5D",
            borderBottomWidth: 2,
            width: "94%",
            paddingTop: "3%",
            marginBottom: "4%",
            alignSelf: "center",
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: "6%",
          }}
        >
          <Icon
            as={Ionicons}
            name="bed"
            style={{ fontSize: 18, color: "#000E1E", paddingRight: "4%" }}
          ></Icon>
          <TextInput
            defaultValue={this.state.room}
            style={{
              fontSize: 15,
              color: "#000E1E",
              width: "90%",
              paddingStart: "1%",
            }}
            placeholder="Room Name"
            placeholderTextColor="#000E1E"
            underlineColorAndroid="transparent"
            onChangeText={(room) => {
              this.setState({...this.state, room });
            }}
          />
        </View>

        <View
          style={{
            borderBottomColor: "#FFCA5D",
            borderBottomWidth: 2,
            width: "94%",
            paddingTop: "3%",
            marginBottom: "4%",
            alignSelf: "center",
          }}
        ></View>
        {this.props.room_id && (
          <HStack space={4} mx="auto">
            <Button
              onPress={() => this.changeselected("art")}
              title="Articles"
              color={this.state.MenuSelected == "art" ? "#FFCA5D" : "#000E1E"}
            />
            <Button
              onPress={() => this.changeselected("pic")}
              title="Pictures"
              color={this.state.MenuSelected == "pic" ? "#FFCA5D" : "#000E1E"}
            />
          </HStack>
        )}

        {this.props.room_id && (
          <View
            style={{
              borderBottomColor: "#FFCA5D",
              borderBottomWidth: 2,
              width: "94%",
              paddingTop: "3%",
              marginBottom: "4%",
              alignSelf: "center",
            }}
          ></View>
        )}

        {this.props.room_id ? (
          this.state.MenuSelected == "art" ? (
            <View>
              <View style={{ paddingHorizontal: "6%" }}>
                <Button
                  style={{ width: "100%" }}
                  onPress={() => this.CreateNewArticles()}
                  title="Add Article"
                  color="#FFCA5D"
                />
              </View>

              <View
                style={{
                  borderBottomColor: "#FFCA5D",
                  borderBottomWidth: 2,
                  width: "94%",
                  paddingTop: "3%",
                  marginBottom: "4%",
                  alignSelf: "center",
                }}
              ></View>

              {/* <Text style={{
                    alignSelf: 'center',
                    fontSize: 15,
                    margin: "2%",
                    color: '#000E1E',
                    fontWeight: '500'
                }}>Total Clients: {this.state.TotalClient}</Text> */}
              {this.props.data?.length <= 0 ? (
                <Text
                  style={[
                    styles.TextFam,
                    {
                      fontSize: 14,
                      color: "#aaa",
                      paddingTop: "3%",
                      paddingBottom: "5%",
                      alignSelf: "center",
                    },
                  ]}
                >
                  No Article Available.{" "}
                </Text>
              ) : (
                <View>
                  {this.state.loading ? (
                    <ActivityIndicator size="large" color="#FFCA5D" />
                  ) : (
                    <FlatList
                      data={this.props.data}
                      contentContainerStyle={{ paddingBottom: 100 }}
                      renderItem={({ item }) => (
                        <View>
                          <TouchableOpacity onPress={() => this.passItem(item)}>
                            <View style={styles.Card}>
                              <Text
                                style={[
                                  styles.TextFam,
                                  { fontSize: 15, fontWeight: "bold" },
                                ]}
                              >
                                {item.type}{" "}
                              </Text>

                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  flex: 1,
                                  paddingBottom: "5%",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    source={require("../../assets/Home/linehis.png")}
                                    style={{ height: 20, width: 20 }}
                                  ></Image>
                                  <View style={{ flexDirection: "column" }}>
                                    <Text
                                      style={[styles.TextFam, { fontSize: 10 }]}
                                    >
                                      Article ID : {item.article_id}
                                    </Text>
                                    <Text
                                      style={[styles.TextFam, { fontSize: 10 }]}
                                    >
                                      Description : {item.description}{" "}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                          <Text> </Text>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  )}
                </View>
              )}
            </View>
          ) : (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: "20%",
                  marginBottom: 10,
                }}
              >
                <Button
                  onPress={() => this.CameraSnap()}
                  title="Camera"
                  color="#FFCA5D"
                />
                <Button
                  disabled={this.props.IPLoading}
                  onPress={() => this.UploadImages()}
                  title="Upload"
                  color="#FFCA5D"
                />
              </View>
                <Text style={{textAlign: "center", marginBottom: "2%", fontSize: 10, color: "red"}}>Images cannot be removed once uploaded</Text>
              <FlatList
                data={this.props.ImagesList}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => (
                  <View style={{ paddingHorizontal: "6%" }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.toggleGalleryEventModal(item.imageSel, item.upload_time, item?.fromDB)
                      }
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
                            fontSize: 18,
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
                          Picture {item.index}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )
        ) : null}
        {this.props.room_id && 
        <Button
              style={{marginBottom: "25%"}}
              onPress={() => this.DeleteRoomAlert()}
              title="Delete Room"
              color="#FFCA5D"
            />}
        <Modal
          isVisible={this.state.isPicvisible}
          onSwipeComplete={() => this.setState({...this.state, isPicvisible: false })}
          swipeDirection={["left", "right", "down"]}
          onBackdropPress={() => this.setState({...this.state, isPicvisible: false })}
        >
          <View style={[styles.GalleryEventModel, { backgroundColor: "#fff" }]}>
          <Text style={{marginBottom: "15%", textAlign: "center"}}>{moment(this.state.upload_time).format('MMMM Do YYYY, h:mm:ss a')}</Text>
            <Image
              style={{ width: "80%", height: "80%", alignSelf: "center"}}
              source={{ uri: this.state.selectedPic }}
              resizeMode={"contain"}
            />
            <View style={{marginBottom: "25%"}}></View>
            {!this.state.fromDB && 
            <Button
              style={{marginBottom: "25%"}}
              onPress={() => this.RemoveImages()}
              disabled={this.state.IsImageuploaded}
              title="REMOVE IMAGE"
              color="#FFCA5D"
            />}
            <Text> </Text>
            <Text> </Text>
            <Button            
              onPress={() => this.setState({...this.state, isPicvisible: false })}
              title="CLOSE"
              color="#FFCA5D"
            />
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    // justifyContent: 'center'
    paddingTop: "5%",
  },
  Name: {
    marginTop: "10%",
    marginLeft: "3%",
  },
  HeadingStyle: {
    fontSize: 23,
    paddingTop: "10%",
    paddingLeft: "6%",
    color: "#FFCA5D",

    // fontFamily: 'Helvetica'
  },
  Card: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 3, // Android
    width: "90%",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    // marginBottom: '3%',
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  TextFam: {
    // fontFamily: ''
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
});

const expoFileToFormFile = (url) => {
  const localUri = url;
  const filename = localUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;
  return { uri: localUri, name: filename, type };
};

const Button = ({ title, ...props }) => {
  return <MyButton {...props}>{title}</MyButton>;
};
