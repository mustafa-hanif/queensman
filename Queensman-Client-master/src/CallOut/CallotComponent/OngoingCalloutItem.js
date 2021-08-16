/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
import {
  Icon,
  View,
  CircleIcon,
  Center,
  Image,
  Spinner,
  Button,
  Select,
  Stack,
  Text,
  Heading,
  CheckIcon,
  Box,
  Modal,
  FlatList,
  ChevronDownIcon,
  HStack,
  VStack,
  Divider,
  Pressable,
} from "native-base";
import moment from "moment";
import React, { useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function OngoingCalloutItem(props) {
  console.log(props.route.params.it);
  const [state, setState] = useState({
    OngoingCallOutData: props.route.params.it,
    link: "photos/0690da3e-9c38-4a3f-ba45-8971697bd925.jpg",
    selectedPic: "",
    isPicvisible: false, // veiw image app kay lia
  });
  const toggleGalleryEventModal = (value) => {
    setState({ ...state, isPicvisible: !state.isPicvisible, selectedPic: value });
  };

  return (
    <Box pt={4} bg="amber.100" height="100%">
      {/* background gradinet   */}
      <Item item={state.OngoingCallOutData} toggleGalleryEventModal={toggleGalleryEventModal} />

      <Modal isOpen={state.isPicvisible} onClose={() => setState({ ...state, isPicvisible: false })}>
        <Modal.Content p={4}>
          <Image size="2xl" mx="auto" source={{ uri: state.selectedPic }} alt="Alt" />
        </Modal.Content>
      </Modal>
    </Box>
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
    shadowRadius: 1, // IOS
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
    // backgroundColor: '',
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

const colors = {
  Waiting: "rose.600",
  "In Progress": "amber.600",
};
const Item = ({ item, toggleGalleryEventModal }) => {
  const color = item?.urgency_level === "High" ? "rose.600" : "amber.600";
  const statusColor = colors[item?.status] ? colors[item?.status] : "lightBlue.600";
  return (
    <Box bg="white">
      <Stack space={2.5} p={4}>
        <HStack alignItems="center">
          <CircleIcon size={4} mr={0.5} color={color} />
          <Text color={color} mr={2} fontSize="xs">
            {item?.urgency_level}
          </Text>
          <CircleIcon size={4} mr={0.5} color={statusColor} />
          <Text color={statusColor} fontSize="xs">
            {item?.status}
          </Text>
          <Text color="black" ml="auto" fontSize="xs">
            {item?.id}
          </Text>
        </HStack>

        <Heading color="black" size="md" noOfLines={2}>
          {item?.job_type}
        </Heading>
        {item?.client?.full_name && (
          <HStack>
            <Text mr={1} color="black" fontSize="sm">
              Reported by
            </Text>
            <Text color="amber.800" bold fontSize="sm">
              {item?.client?.full_name}
            </Text>
          </HStack>
        )}
        <HStack>
          <Text mr={1} color="black" fontSize="sm">
            Assigned to
          </Text>
          <Text color="indigo.800" bold fontSize="sm">
            {item?.job_worker?.[0]?.worker?.full_name}
          </Text>
        </HStack>
        <VStack>
          <Text mr={1} color="black" fontSize="sm">
            On Property
          </Text>
          <Text color="cyan.800" fontSize="sm">
            {item?.property?.address}, {item?.property?.city}
          </Text>
        </VStack>

        {item?.description && (
          <Text lineHeight={[5, 5, 7]} noOfLines={[4, 4, 2]} color="gray.700">
            {item?.description}
          </Text>
        )}
        <Divider bg="gray.200" />
        <VStack space={2}>
          <Text color="black" fontSize="sm">
            Scheduled at
          </Text>
          {item?.schedule?.date_on_calendar && (
            <HStack space={2} alignItems="center">
              <AntDesign name="calendar" size={18} />
              <Text color="black" fontSize="sm">
                {moment(item?.schedule?.date_on_calendar).format("Do MMMM, YYYY")}
              </Text>
            </HStack>
          )}
          {item?.schedule?.time_on_calendar && (
            <HStack space={2} alignItems="center">
              <AntDesign name="clockcircle" size={18} />
              <Text color="black" fontSize="sm">
                {moment(`2013-02-08T${item?.schedule?.time_on_calendar}`).format("hh:mm A")}
              </Text>
            </HStack>
          )}
        </VStack>
        <Divider bg="gray.200" />
        <VStack space={2}>
          <Text fontSize="lg" color="black">
            Pictures
          </Text>
          <HStack>
            {Array(4)
              .fill()
              .map((_, i) => {
                const uri = item[`picture${i + 1}`];
                return (
                  uri && (
                    <Pressable onPress={() => toggleGalleryEventModal(uri)}>
                      <Image
                        key={uri}
                        source={{
                          uri,
                        }}
                        size="xl"
                        alt="Alt"
                      />
                    </Pressable>
                  )
                );
              })}
          </HStack>
        </VStack>
      </Stack>
    </Box>
  );
};
