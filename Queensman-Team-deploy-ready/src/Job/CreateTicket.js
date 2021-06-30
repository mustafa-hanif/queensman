import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "native-base";
import commonColor from "../../native-base-theme/variables/commonColor";
import { ImageBrowser } from "expo-image-picker-multiple";
import { auth, storage } from "../utils/nhost";
import { gql, useQuery, useMutation } from "@apollo/client";

const CREATE_TICKET = gql`
  mutation AddTicket(
    $callout_id: Int!
    $description: String = ""
    $name: String = ""
    $pictures: _text = "[]"
    $type: String!
    $worker_email: String!
  ) {
    insert_job_tickets_one(
      object: {
        callout_id: $callout_id
        description: $description
        name: $name
        pictures: $pictures
        worker_email: $worker_email
        type: $type
      }
    ) {
      callout_id
      name
      worker_email
    }
  }
`;

export default function CreateTicket(props) {
  const [selectedType, setselectedType] = useState(null);
  const [ticketName, setticketName] = useState("");
  const [ticketMessage, setticketMessage] = useState("");
  const [photos, setphotos] = useState(null); //local uri

  const [imageUplaodLoader, setimageUplaodLoader] = useState(false);

  const [createNewTicket, { loading, error }] = useMutation(CREATE_TICKET);
  const callout_id = props.navigation.getParam("callout_id", null);
  const user = auth?.currentSession?.session?.user;
  useEffect(() => {
    const selectedPhotos = props.navigation.getParam("selectedPhotos", null);
    setphotos(selectedPhotos);
  }, [props.navigation.getParam("selectedPhotos", null)]);

  const RenderLogo = () => {
    return (
      <View style={{ width: "100%", flexDirection: "row", margin: "3%" }}>
        <Image
          source={require("../../assets/Login/Queensman_logo3.png")}
          style={{ height: 50, width: 50 }}
        ></Image>
        <View style={{ flexDirection: "column", width: "100%" }}>
          <Text style={[{ fontSize: 18, color: "#FFCA5D" }, styles.TextStyles]}>
            Property Maintenance...
          </Text>
          <Text style={[{ fontSize: 18, color: "#FFCA5D" }, styles.TextStyles]}>
            Perfectly Managed!
          </Text>
        </View>
      </View>
    );
  };

  const RenderPicker = () => {
    return (
      <View>
        <Text style={styles.label}>New Ticket Information</Text>
        <View style={{ marginTop: "1%", borderWidth: 0.5 }}>
          <Picker
            note
            mode="dialog"
            itemStyle={{
              fontSize: 18,
            }}
            selectedValue={selectedType}
            onValueChange={(val) => {
              setselectedType(val);
            }}
          >
            <Picker.Item label="Select" value="Select" />
            <Picker.Item label="Material Request" value="Material Request" />
            <Picker.Item label="Patch Job" value="Patch Job" />
            <Picker.Item label="Full Job" value="Full Job" />
            {/* {TicketType.map((val) => (
              <Picker.Item label={val.name} value={val.name} />
            ))} */}
          </Picker>
        </View>
      </View>
    );
  };

  const renderImage = (item, i) => {
    return (
      <Image
        style={{ height: 50, width: 50 }}
        source={{ uri: item.uri }}
        key={i}
      />
    );
  };

  const onTickPress = () => {
    if (!selectedType) {
      return alert("Please Select a Ticket Type");
    }
    if (!ticketName) {
      return alert("Please Enter a Ticket Name");
    }
    if (!ticketMessage) {
      return alert("Please Provide Ticket Description");
    }

    if (!photos) {
      return alert("Please Select Photos");
    }

    setimageUplaodLoader(true);
    Promise.all(
      photos.map((value) => {
        const file = expoFileToFormFile(value.uri);
        return storage
          .put(`/callout_pics/${file.name}`, file)
          .then((res) => {
            return `https://backend-8106d23e.nhost.app/storage/o/callout_pics/${file.name}`;
          })
          .catch(console.error);
      })
    ).then((values) => {
      // image successfully uploaded

      const pictures = "{" + values.join(",") + "}";

      console.log({
        callout_id: callout_id,
        description: ticketMessage,
        name: ticketName,
        pictures: pictures,
        type: selectedType,
        worker_email: user?.email,
      });

      createNewTicket({
        variables: {
          callout_id: callout_id,
          description: ticketMessage,
          name: ticketName,
          pictures: pictures,
          type: selectedType,
          worker_email: user?.email,
        },
      })
        .then((response) => {
          setimageUplaodLoader(false);
          console.log({ response });

          props.navigation.navigate("TicketListing", { refresh: true });
        })
        .catch(console.log);
    });
  };

  const onCrossPress = () => {
    props.navigation.navigate("TicketListing", { refresh: false });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <RenderLogo></RenderLogo>
        <Text
          style={{
            fontSize: 20,
            color: commonColor.goldText,
          }}
        >
          Tickets
        </Text>
        {RenderPicker()}

        <Text style={styles.label}>Ticket Name</Text>
        <TextInput
          value={ticketName}
          onChangeText={(text) => {
            setticketName(text.trimLeft());
          }}
          placeholder={"Enter Ticket Name"}
          style={[{ borderWidth: 0.5, padding: 5 }]}
        ></TextInput>
        <Text style={styles.label}>Ticket Message / Description</Text>
        <TextInput
          value={ticketMessage}
          onChangeText={(text) => {
            setticketMessage(text.trimLeft());
          }}
          placeholder={
            "Please provide as the detail of the problem as much as you can"
          }
          multiline={true}
          style={styles.textinput}
        ></TextInput>

        {photos && (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: "5%" }}
          >
            {photos.map((item, i) => renderImage(item, i))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            !imageUplaodLoader && props.navigation.push("ImagePicker");
          }}
          style={styles.button}
        >
          <Text>Selct Pictures</Text>
        </TouchableOpacity>

        {imageUplaodLoader ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              margin: "20%",
            }}
          >
            <ActivityIndicator size="large" color="#FFCA5D" />
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "20%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                onTickPress();
              }}
            >
              <Image source={require("../../assets/ok.png")}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onCrossPress();
              }}
            >
              <Image source={require("../../assets/Cancel.png")}></Image>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: "3%", backgroundColor: "white", flex: 1 },
  TextStyles: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    textShadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 3, // Android
    // fontFamily: 'serif'
  },
  label: {
    fontSize: 16,
    marginVertical: "2%",
  },
  textinput: {
    width: "100%",
    height: 90,
    borderWidth: 0.5,
    textAlignVertical: "top",
    padding: 5,
  },
  button: {
    backgroundColor: commonColor.primaryGold,
    padding: "5%",
    alignSelf: "center",
    marginTop: "5%",
  },
});

const expoFileToFormFile = (url) => {
  const localUri = url;
  const filename = localUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;
  return { uri: localUri, name: filename, type };
};
