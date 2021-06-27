import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "native-base";
import commonColor from "../../native-base-theme/variables/commonColor";

const TicketType = [
  { name: "Material Request" },
  { name: "Patch Job" },
  { name: "Full Job" },
];

export default function CreateTicket() {
  const [selectedType, setselectedType] = useState(null);

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
            {TicketType.map((val) => (
              <Picker.Item label={val.name} value={val.name} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  const RenderForm = () => {
    return (
      <View>
        <Text style={styles.label}>Ticket Name</Text>
        <TextInput
          placeholder={"Enter Ticket Name"}
          style={[{ borderWidth: 0.5, padding: 5 }]}
        ></TextInput>
        <Text style={styles.label}>Ticket Message / Description</Text>
        <TextInput
          placeholder={
            "Please provide as the detail of the problem as much as you can"
          }
          multiline={true}
          style={styles.textinput}
        ></TextInput>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <RenderLogo></RenderLogo>
      <Text
        style={{
          fontSize: 20,
          color: commonColor.goldText,
        }}
      >
        Tickets
      </Text>
      <RenderPicker></RenderPicker>
      <RenderForm></RenderForm>
      <TouchableOpacity style={styles.button}>
        <Text>Upload Pictures</Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20%",
        }}
      >
        <Image source={require("../../assets/ok.png")}></Image>
        <Image source={require("../../assets/Cancel.png")}></Image>
      </View>
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
