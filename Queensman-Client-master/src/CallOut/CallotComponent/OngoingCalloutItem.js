import React, { useState } from "react";
import { StyleSheet, Modal, Text, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Box, VStack, HStack, Icon } from "native-base";

export default function OngoingCalloutItem(props) {
  console.log(props.route.params.it)
    const [state, setState] = useState({
      OngoingCallOutData: props.route.params.it,
      link: "photos/0690da3e-9c38-4a3f-ba45-8971697bd925.jpg",
      selectedPic: "",
      isPicvisible: false, //veiw image app kay lia
    })
  toggleGalleryEventModal = (value) => {
    setState({ ...state, isPicvisible: !state.isPicvisible, selectedPic: value });
  };

    return (
      <View style={styles.container}>
        {/* background gradinet   */}
        <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle}></LinearGradient>
        <View style={styles.Card}>
          <Box contentContainerStyle={{ paddingTop: "6%" }}>
            <VStack>
              <View style={{ alignSelf: "center" }}>
                <Text style={[styles.TextFam, { fontSize: 17, fontWeight: "bold" }]}>
                  {state.OngoingCallOutData?.Client_property?.address}
                </Text>
                <Text style={[styles.TextFam, { fontSize: 10, color: "#aaa" }]}>
                  {state.OngoingCallOutData?.Client_property?.community},
                  {state.OngoingCallOutData?.Client_property?.city},
                  {state.OngoingCallOutData?.Client_property?.country}
                </Text>
              </View>
              <HStack>
                    <Text style={[styles.TextFam, { color: "#8c8c8c" }]}>Callout ID</Text>
                    <Text style={styles.TextFam}>{state.OngoingCallOutData?.Client_property?.id}</Text>
              </HStack>

              <HStack >
                    <Text style={[styles.TextFam, { color: "#8c8c8c" }]}>Urgency Level</Text>

                  <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end" }}>
                    <Text style={styles.TextFam}>{state.OngoingCallOutData?.Client_property?.urgency_level} </Text>
                    <Icon
                      name="flag"
                      style={{
                        fontSize: 24,
                        color:
                          state.OngoingCallOutData?.Client_property?.urgency_level == "High"
                            ? "red"
                            : state.OngoingCallOutData?.Client_property?.urgency_level == "Scheduled"
                            ? "#aaa"
                            : "#FFCA5D",
                      }}
                    ></Icon>
                  </View>
              </HStack>
              <HStack>
                    <Text style={[styles.TextFam, { color: "#8c8c8c" }]}>Request Time</Text>
                  <Text style={[styles.TextFam, { alignSelf: "flex-end" }]}>
                    {state.OngoingCallOutData?.Client_property?.request_time}
                  </Text>
              </HStack>
              {state.OngoingCallOutData?.Client_property?.status == "Planned" ? (
                <HStack>
                      <Text style={[styles.TextFam, { color: "#8c8c8c" }]}>Planned Time</Text>
                    <Text style={[styles.TextFam, { alignSelf: "flex-end" }]}>
                      {state.OngoingCallOutData?.Client_property?.planned_time}
                    </Text>
                </HStack>
              ) : null}
              <HStack>
                    <Text style={[styles.TextFam, { color: "#8c8c8c" }]}>Status</Text>
                  <Text style={[styles.TextFam, { alignSelf: "flex-end" }]}>
                    {state.OngoingCallOutData?.Client_property?.status}
                  </Text>
              </HStack>
              <HStack>
                <VStack>
                  <Text style={[styles.TextFam, { color: "#8c8c8c" }]}>Description</Text>
                  <Text style={styles.TextFam}>{state.OngoingCallOutData?.Client_property?.description}</Text>
                </VStack>
              </HStack>
              <HStack >
                <VStack>
                  <Text style={[styles.TextFam, { color: "#8c8c8c" }]}>Pictures</Text>
                  <Text> </Text>
                    <TouchableOpacity
                      onPress={() =>
                        toggleGalleryEventModal(state.OngoingCallOutData?.Client_property?.picture1)
                      }
                    >
                      <Image
                        style={styles.ImageStyle}
                        source={{ uri: state.OngoingCallOutData?.Client_property?.picture1 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <Text> </Text>
                    <TouchableOpacity
                      onPress={() =>
                        toggleGalleryEventModal(state.OngoingCallOutData?.Client_property?.picture2)
                      }
                    >
                      <Image
                        style={styles.ImageStyle}
                        source={{ uri: state.OngoingCallOutData?.Client_property?.picture2 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <Text> </Text>
                  <View style={{ height: "1%" }}></View>
                    <TouchableOpacity
                      onPress={() =>
                        toggleGalleryEventModal(state.OngoingCallOutData?.Client_property?.picture3)
                      }
                    >
                      <Image
                        style={styles.ImageStyle}
                        source={{ uri: state.OngoingCallOutData?.Client_property?.picture3 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <Text> </Text>
                    <TouchableOpacity
                      onPress={() =>
                        toggleGalleryEventModal(state.OngoingCallOutData?.Client_property?.picture4)
                      }
                    >
                      <Image
                        style={styles.ImageStyle}
                        source={{ uri: state.OngoingCallOutData?.Client_property?.picture4 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <Text> </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
        </View>

        <Modal
          isVisible={state.isPicvisible}
          onSwipeComplete={() => setState({...state, isPicvisible: false })}
          swipeDirection={["left", "right", "down"]}
          onBackdropPress={() => setState({...state, isPicvisible: false })}
        >
          <View style={[styles.GalleryEventModel, { backgroundColor: "#fff" }]}>
            <Image
              style={{ width: "80%", height: "80%", alignSelf: "center" }}
              source={{ uri: state.selectedPic }}
            />
            <Text> </Text>
            <TouchableOpacity onPress={() => setState({...state, isPicvisible: false })}>
              <View style={styles.ButtonSty}>
                <Text style={{ fontWeight: "bold", color: "#ffff", fontSize: 15 }}>Close</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  gradiantStyle: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignSelf: "center",
  },
  Card: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 1, // Android
    width: "85%",
    height: "80%",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFF",
    marginTop: "10%",
    borderRadius: 5,
  },
  ImageStyle: {
    height: 100,
    width: 100,
  },
  TextFam: {
    fontFamily: "Helvetica",
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
