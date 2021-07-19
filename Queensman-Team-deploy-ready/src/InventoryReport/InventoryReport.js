import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  TextInput,
  ScrollView,
} from "react-native";

import { Icon } from "native-base";
import axios from "axios";
import _ from "lodash";

import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";

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

const insertInventoryReport = gql`
  mutation InsertInventoryReport(
    $checked_on: timestamp = ""
    $inspection_done_by: String = ""
    $ops_team_id: Int = 10
    $property_id: Int = 10
    $summary: String = ""
  ) {
    insert_inventory_report_one(
      object: {
        property_id: $property_id
        ops_team_id: $ops_team_id
        inspection_done_by: $inspection_done_by
        summary: $summary
        checked_on: $checked_on
      }
    ) {
      id
    }
  }
`;

export default function InventoryReportRoom(props) {
  const InventoryReportID = props.navigation.getParam("it", "").id;

  const [insertInventory, { loading: invetoryLoading, error: inventoryError }] =
    useMutation(insertInventoryReport);

  const { loading, data, error } = useQuery(
    fetchInventoryArticlesViaInventoryReportID,
    {
      variables: {
        _eq: InventoryReportID,
      },
    }
  );

  if (loading) {
    return null;
  }
  //   return null;
  return (
    <InventoryReportClass
      insertInventory={insertInventory}
      loading={loading}
      data={data?.inventory_room || []}
      {...props}
    ></InventoryReportClass>
  );
}

class InventoryReportClass extends React.Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var dat = today.getDate();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var dts = year + "-" + month + "-" + dat;
    var date = today.toString();
    var dt = date.substring(0, 15);
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
      selectedDate: dts,
      showDate:
        this.props.navigation.getParam("it", "").checked_on == ""
          ? dt
          : this.props.navigation.getParam("it", "").checked_on,
      teamID: this.props.navigation.getParam("it", "").ops_team_id,
      inspectedBy: this.props.navigation.getParam("it", "").inspection_done_by,
      Summery: this.props.navigation.getParam("it", "").summary,
      PropertyID: this.props.navigation.getParam("propertyid", "Something"),
      InventoryReportID: this.props.navigation.getParam("it", "").id,
    };
  }

  passItem = (item) => {
    this.props.navigation.navigate("InventoryReportRoom", {
      it: item,
      InventoryReportID: this.state.InventoryReportID,
    });
  };
  addRoom = () => {
    this.props.navigation.navigate("InventoryReportRoom", {
      InventoryReportID: this.state.InventoryReportID,
    });
  };

  SetdateToday = () => {
    const today = new Date();
    var dat = today.getDate();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var dts = year + "-" + month + "-" + dat;
    var date = today.toString();
    var dt = date.substring(0, 15);
    this.setState({
      selectedDate: dts,
      showDate: dt,
    });
  };

  async componentDidMount() {
    var clientsArray = this.props.data;

    this.setState({
      clientList: clientsArray,
      totalData: clientsArray,
      StaticData: clientsArray,
    });
  }

  contains = ({ full_name, phone, id }, query) => {
    if (
      full_name.toString().toLowerCase().includes(query.toLowerCase()) ||
      phone.toString().includes(query) ||
      id.toString().includes(query)
    ) {
      return true;
    }
    return false;
  };

  searchData = (text) => {
    const data = _.filter(this.state.totalData, (StaticData) => {
      return this.contains(StaticData, text);
    });
    this.setState({ query: text, clientList: data });
  };
  SaveInfo = () => {
    // $checked_on: timestamp = ""
    // $inspection_done_by: String = ""
    // $ops_team_id: Int = 10
    // $property_id: Int = 10
    // $summary: String = ""

    const params = {
      checked_on: this.state.selectedDate,
      inspection_done_by: this.state.inspectedBy,
      ops_team_id: this.state.teamID,
      property_id: this.state.PropertyID,
      summary: this.state.Summery,
    };

    this.props
      .insertInventory({
        variables: params,
      })
      .then((res) => {
        console.log({ res });
        alert("Successfully Submitted Inventory Report Details.");
        setTimeout(() => {
          this.props.navigation.goBack();
        }, 1000);
      });

    // link =
    //   "https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryReport.php?property_id=" +
    //   this.state.PropertyID +
    //   "&ops_team_id=" +
    //   this.state.teamID +
    //   "&inspection_done_by=" +
    //   this.state.inspectedBy +
    //   "&summary=" +
    //   this.state.Summery +
    //   "&checked_on=" +
    //   this.state.selectedDate;
    // console.log(link);
    // axios.get(link).then((result) => {
    //   console.log(result.data);
    //   if (
    //     result.data.server_response ==
    //     "Successfully Submitted Inventory Report Details."
    //   )
    //     alert("Successfully Submitted Inventory Report Details.");
    //   else alert("Failed Submitted Inventory Report Details.");
    //   setTimeout(() => {
    //     this.props.navigation.goBack();
    //   }, 1000);
    // });
  };

  render() {
    const { isDateTimePickerVisible, selectedDate } = this.state;
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
            name="people"
            style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
          ></Icon>
          <TextInput
            defaultValue={this.state.teamID}
            style={{
              fontSize: 15,
              color: "#000E1E",
              width: "90%",
              paddingStart: "1%",
            }}
            placeholder="Team ID"
            placeholderTextColor="#000E1E"
            underlineColorAndroid="transparent"
            onChangeText={(teamID) => {
              this.setState({ teamID });
            }} //email set
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
            name="calendar"
            style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
          ></Icon>
          <TouchableOpacity
            onPress={this.SetdateToday}
            style={{
              fontSize: 15,
              color: "#000E1E",
              width: "90%",
              paddingStart: "1%",
            }}
          >
            <Text>{this.state.showDate} (Click to set it today)</Text>
          </TouchableOpacity>
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
            style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
          ></Icon>
          <TextInput
            defaultValue={this.state.inspectedBy}
            style={{
              fontSize: 15,
              color: "#000E1E",
              width: "90%",
              paddingStart: "1%",
            }}
            placeholder="Inspection Done By"
            placeholderTextColor="#000E1E"
            underlineColorAndroid="transparent"
            onChangeText={(inspectedBy) => {
              this.setState({ inspectedBy });
            }} //email set
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
            style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
          ></Icon>
          <TextInput
            defaultValue={this.state.Summery}
            style={{
              fontSize: 15,
              color: "#000E1E",
              width: "90%",
              paddingStart: "1%",
            }}
            placeholder="Summary"
            multiline={true}
            placeholderTextColor="#000E1E"
            underlineColorAndroid="transparent"
            onChangeText={(Summery) => {
              this.setState({ Summery });
            }} //email set
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

        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            color: "#FFCA5D",
            marginBottom: "1.5%",
            paddingHorizontal: "5%",
          }}
        >
          Rooms{" "}
        </Text>
        <View style={{ paddingHorizontal: "6%" }}>
          <Button
            style={{ width: "100%" }}
            onPress={() => this.passItem("ss")}
            title="Add Rooms"
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
        {this.state.clientList.length <= 0 ? (
          <Text
            style={[
              styles.TextFam,
              {
                fontSize: 14,
                color: "#aaa",
                paddingTop: "3%",
                alignSelf: "center",
              },
            ]}
          >
            No Inventory Available{" "}
          </Text>
        ) : (
          <View>
            {this.props.loading ? (
              <ActivityIndicator size="large" color="#FFCA5D" />
            ) : (
              <FlatList
                data={this.state.clientList}
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
                          {item.room}{" "}
                        </Text>
                        <Text style={[styles.TextFam, { fontSize: 10 }]}>
                          Room ID : {item.room_id}
                        </Text>
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
    padding: 22,
    // marginBottom: '3%',
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  TextFam: {
    // fontFamily: ''
  },
});
