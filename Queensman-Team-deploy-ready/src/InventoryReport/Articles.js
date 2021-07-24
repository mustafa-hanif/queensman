/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  ScrollView,
} from "react-native";

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { Icon, Select } from "native-base";
import axios from "axios";

import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";

const insertInventoryArticleQuery = gql`
  mutation InventoryArticle(
    $work_description: String = ""
    $type: String = ""
    $remarks: String = ""
    $inventory_room_id: Int = 10
    $inspection: String = ""
    $description: String = ""
  ) {
    insert_inventory_article_one(
      object: {
        description: $description
        inspection: $inspection
        inventory_room_id: $inventory_room_id
        remarks: $remarks
        type: $type
        work_description: $work_description
      }
    ) {
      id
    }
  }
`;

const UpdateInspectionQuery = gql`
  mutation UpdateInventoryArticleInspection(
    $id: Int = 10
    $inspection: String = ""
  ) {
    update_inventory_article_by_pk(
      pk_columns: { id: $id }
      _set: { inspection: $inspection }
    ) {
      id
    }
  }
`;

const UpdateWorkDescriptionQuery = gql`
  mutation UpdateInventoryArticle(
    $id: Int = 10
    $work_description: String = ""
  ) {
    update_inventory_article_by_pk(
      pk_columns: { id: $id }
      _set: { work_description: $work_description }
    ) {
      id
    }
  }
`;

const UpdateDescriptionQuery = gql`
  mutation UpdateInventoryArticle($id: Int = 10, $description: String = "") {
    update_inventory_article_by_pk(
      pk_columns: { id: $id }
      _set: { description: $description }
    ) {
      id
    }
  }
`;

const UpdateRemarksQuery = gql`
  mutation UpdateInventoryArticleRemarks($id: Int = 10, $remarks: String = "") {
    update_inventory_article_by_pk(
      pk_columns: { id: $id }
      _set: { remarks: $remarks }
    ) {
      id
    }
  }
`;

export default function Articles(props) {
  const [updateRemarks, { loading: URloading, error: UrError }] =
    useMutation(UpdateRemarksQuery);

  const [updateDescription, { loading: UDloading, error: UDError }] =
    useMutation(UpdateDescriptionQuery);

  const [updateWorkDescription, { loading: wdloading, error: wdError }] =
    useMutation(UpdateWorkDescriptionQuery);

  const [updateInspection, { loading: UIloading, error: UIError }] =
    useMutation(UpdateInspectionQuery);

  const [insertInventoryArticle, { loading, error }] = useMutation(
    insertInventoryArticleQuery
  );

  return (
    <ArticlesClass
      updateRemarks={updateRemarks}
      updateDescription={updateDescription}
      updateWorkDescription={updateWorkDescription}
      updateInspection={updateInspection}
      insertInventoryArticle={insertInventoryArticle}
      {...props}
    ></ArticlesClass>
  );
}

class ArticlesClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignedCallouts: [
        { key: "Devin" },
        { key: "Jackson" },
        { key: "James" },
        { key: "Joel" },
        { key: "John" },
        { key: "Jillian" },
        { key: "Jimmy" },
        { key: "Julie" },
      ], //Ismain hayn saaray client ke ongoing callouts.
      query: "",
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
      Discription1: this.props.navigation.getParam("it", "").description,
      Inspection1: this.props.navigation.getParam("it", "").inspection,
      WorkDescription1: this.props.navigation.getParam("it", "")
        .work_description,
      Remarks1: this.props.navigation.getParam("it", "").remarks,
      JobType: this.props.navigation.getParam("it", "").type,
      articleId: this.props.navigation.getParam("it", "").article_id,
      Discription: this.props.navigation.getParam("it", "").description,
      Inspection: this.props.navigation.getParam("it", "").inspection,
      WorkDescription: this.props.navigation.getParam("it", "")
        .work_description,
      Remarks: this.props.navigation.getParam("it", "").remarks,
      RoomID: this.props.navigation.getParam("room_id", "Something"),
    };
  }

  componentDidMount = () => {
    console.log("Article id is: " + this.state.articleId);
    console.log(this.props.navigation.getParam("it", ""));
  };
  onValueChange(value) {
    this.setState({
      JobType: value,
    });
  }
  saveArticles = () => {
    if (!this.state.articleId) {
      var type = this.state.JobType;

      this.props
        .insertInventoryArticle({
          variables: {
            work_description: this.state.WorkDescription1,
            type: type,
            inventory_room_id: this.state.RoomID,
            description: this.state.Discription1,
            remarks: this.state.Remarks1,
            inspection: this.state.Inspection1,
          },
        })
        .then((result) => {
          console.log(result.data);
          alert("Successfully Submitted Inventory Article Details.");
          setTimeout(() => {
            this.props.navigation.goBack();
          }, 1000);
        })
        .catch((error) => {
          console.log(error);
          alert("Failed To Submitted Inventory Article Details..", error);
        });
    } else {
      console.log("Article already exists");
      if (this.state.Discription1 != this.state.Discription) {
        // ($id: Int = 10, $description: String = "")
        console.log("Updating Discription1 ");
        this.props
          .updateDescription({
            variables: {
              description: this.state.Discription1,
              id: this.state.articleId,
            },
          })
          .then((result) => {
            console.log(result.data);
            setTimeout(() => {
              this.props.navigation.goBack();
            }, 1000);
          });
      }
      if (this.state.WorkDescription1 != this.state.WorkDescription) {
        console.log("Updating WorkDescription ");

        this.props
          .updateWorkDescription({
            variables: {
              id: this.state.articleId,
              work_description: this.state.WorkDescription1,
            },
          })
          .then((result) => {
            console.log(result.data);
            setTimeout(() => {
              this.props.navigation.goBack();
            }, 1000);
          });
      }
      if (this.state.Inspection1 != this.state.Inspection) {
        this.props
          .updateInspection({
            variables: {
              id: this.state.articleId,
              inspection: this.state.Inspection1,
            },
          })
          .then((result) => {
            console.log(result.data);
            setTimeout(() => {
              this.props.navigation.goBack();
            }, 1000);
          });
      }
      if (this.state.Remarks1 != this.state.Remarks) {
        // mutation UpdateInventoryArticleRemarks($id: Int = 10, $remarks: String = "") {

        this.props
          .updateRemarks({
            variables: {
              id: this.state.articleId,
              remarks: this.state.Remarks1,
            },
          })
          .then((result) => {
            console.log(result.data);
            setTimeout(() => {
              this.props.navigation.goBack();
            }, 1000);
          });
      }
      alert("Successfully updated article!");
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text
          style={{
            alignSelf: "center",
            fontSize: 15,
            margin: "2%",
            color: "#000E1E",
            fontWeight: "500",
          }}
        >
          Room Name :{" "}
        </Text>

        <Text
          style={[
            styles.TextFam,
            {
              color: "#000E1E",
              fontSize: 16,
              paddingHorizontal: "6%",
              marginBottom: "1%",
            },
          ]}
        >
          Article Type
        </Text>

        <View>
          <Select
            mx={2}
            color="black"
            borderColor="amber.600"
            placeholder="Select"
            onValueChange={this.onValueChange.bind(this)}
            selectedValue={this.state.JobType}
          >
            <Select.Item label="Select" value="none" />
            <Select.Item
              label="ELECTRICAL Services (repair and replace warranty cover)"
              value="ELECTRICAL Services (repair and replace warranty cover)"
            />
            <Select.Item
              label="CARPENTRY, PAINT & TILING Services (repair and replace warranty cover)"
              value="CARPENTRY, PAINT & TILING Services (repair and replace warranty cover)"
            />
            <Select.Item
              label="AC (HVAC) Services (repair and replace warranty cover)"
              value="AC (HVAC) Services (repair and replace warranty cover)"
            />
            <Select.Item
              label="WATER SYSTEM & PLUMIBING Services (repair and replace warranty cover)"
              value="WATER SYSTEM & PLUMIBING Services (repair and replace warranty cover)"
            />
            <Select.Item label="General Services" value="General Services" />
          </Select>
        </View>

        {/* {this.state.JobType == "General Services" ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: "6%",
            }}
          >
            <Icon
              name="hammer"
              style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
            ></Icon>
            <TextInput
              defaultValue={this.state.ArticleType}
              style={{
                fontSize: 15,
                color: "#000E1E",
                width: "90%",
                paddingStart: "1%",
              }}
              placeholder="Other Article type"
              placeholderTextColor="#000E1E"
              underlineColorAndroid="transparent"
              onChangeText={(ArticleType) => {
                this.setState({ ArticleType });
              }}
            />
          </View>
        ) : null} */}

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
            name="today"
            as={Ionicons}
            style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
          ></Icon>
          <TextInput
            defaultValue={this.state.Discription}
            style={{
              fontSize: 15,
              color: "#000E1E",
              width: "90%",
              paddingStart: "1%",
            }}
            placeholder="Description"
            multiline={true}
            placeholderTextColor="#000E1E"
            underlineColorAndroid="transparent"
            onChangeText={(Discription1) => {
              this.setState({ Discription1 });
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: "6%",
          }}
        >
          <Icon
            name="today"
            as={Ionicons}
            style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
          ></Icon>
          <TextInput
            defaultValue={this.state.Inspection}
            style={{
              fontSize: 15,
              color: "#000E1E",
              width: "90%",
              paddingStart: "1%",
            }}
            placeholder="Inspection"
            multiline={true}
            placeholderTextColor="#000E1E"
            underlineColorAndroid="transparent"
            onChangeText={(Inspection1) => {
              this.setState({ Inspection1 });
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: "6%",
          }}
        >
          <Icon
            name="clipboard"
            as={Ionicons}
            style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
          ></Icon>
          <TextInput
            defaultValue={this.state.WorkDescription}
            style={{
              fontSize: 15,
              color: "#000E1E",
              width: "90%",
              paddingStart: "1%",
            }}
            placeholder="Work Description"
            multiline={true}
            placeholderTextColor="#000E1E"
            underlineColorAndroid="transparent"
            onChangeText={(WorkDescription1) => {
              this.setState({ WorkDescription1 });
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: "6%",
          }}
        >
          <Icon
            name="document"
            as={Ionicons}
            style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
          ></Icon>
          <TextInput
            defaultValue={this.state.Remarks}
            style={{
              fontSize: 15,
              color: "#000E1E",
              width: "90%",
              paddingStart: "1%",
            }}
            placeholder="Remarks"
            multiline={true}
            placeholderTextColor="#000E1E"
            underlineColorAndroid="transparent"
            onChangeText={(Remarks1) => {
              this.setState({ Remarks1 });
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

        <View style={{ paddingHorizontal: "6%" }}>
          <Button
            style={{ width: "100%" }}
            onPress={() => this.saveArticles()}
            title="Save Details"
            color="#FFCA5D"
          />
        </View>
        <View style={{ height: 30 }}></View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: "5%",
  },
  PickerStyle: {
    width: "90%",
    height: 28,
    backgroundColor: "#FFCA5D",
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 1, // Android
    borderRadius: 5,
    justifyContent: "center",
    marginBottom: "3%",
    alignSelf: "center",
  },
});
