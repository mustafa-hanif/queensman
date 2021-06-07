import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  AsyncStorage,
} from "react-native";

import { Icon } from "native-base";

import Toast from "react-native-whc-toast";
import axios from "axios";

import PTRView from "react-native-pull-to-refresh";
class OngoingCallout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onGoingCallouts: [], //Ismain hayn saaray client ke ongoing callouts.
      loading: false,
      Id: "",
      dataAvaible: true,
      cusID: "",
      propID: "",
    };
  }
  passItem = (item) => {
    this.props.navigation.navigate("OngoingcalloutItem", {
      it: item,
    });
  };

  async componentDidMount() {
    this.setState({
      loading: true,
    });
    // fetch customer orrder list
    const ID = await AsyncStorage.getItem("QueensUserID"); // assign customer id here
    const property_ID = await AsyncStorage.getItem("QueensPropertyID"); // assign customer id here
    const g = await AsyncStorage.getItem("Queens");
    console.log(" my" + g);
    this.setState({
      cusID: ID,
      propID: property_ID,
    });
    if (property_ID == "asd" || property_ID == g) {
      alert(
        "Please select property first from 'Property Details' tab in the menu."
      );
      this.props.navigation.navigate("HomeNaviagtor");
    }
    link =
      "https://www.queensman.com/phase_2/queens_client_Apis/fetchOngoingCalloutsViaPropertyID.php?property_id=" +
      property_ID;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data.server_responce);

      if (result.data.server_responce == -1) {
        this.refs.customToast.show("No Callout scheduled");
        this.setState({
          loading: false,
          dataAvaible: false,
        });
      } else {
        this.setState({ onGoingCallouts: result.data.server_responce });
        //console.log(this.state.onGoingCallouts)
        this.setState({
          loading: false,
          dataAvaible: true,
        });
      }
    });
  }
  _refresh = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // fetch customer orrder list
        const ID = this.state.cusID; // assign customer id here

        link =
          "https://www.queensman.com/phase_2/queens_client_Apis/fetchOngoingCalloutsViaPropertyID.php?property_id=" +
          this.state.propID;
        console.log(link);
        axios.get(link).then((result) => {
          console.log(result.data.server_responce);

          if (result.data.server_responce == -1) {
            this.refs.customToast.show("No Scheduled Services");
            this.setState({
              loading: false,
              dataAvaible: false,
            });
          } else {
            this.setState({ onGoingCallouts: result.data.server_responce });
            //console.log(this.state.onGoingCallouts)
            this.setState({
              loading: false,
              dataAvaible: true,
            });
          }
        });
        resolve();
      }, 2000);
    });
  };

  render() {
    return (
      <PTRView onRefresh={this._refresh}>
        <View style={styles.container}>
          <Text style={{ paddingTop: "5%" }}> </Text>
          <Toast
            ref="customToast"
            textStyle={{
              color: "#fff",
            }}
            style={{
              backgroundColor: "#000E1E",
            }}
          />

          <Text style={styles.HeadingStyle}>Scheduled Services</Text>
          <Text
            style={[
              styles.TextFam,
              {
                fontSize: 12,
                color: "#000E1E",
                paddingTop: "2%",
                alignSelf: "center",
              },
            ]}
          >
            Viewing services for currently selected property
          </Text>
          <Text> </Text>
          {!this.state.dataAvaible ? (
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
              No Scheduled Services
            </Text>
          ) : (
            <View>
              {this.state.loading ? (
                <ActivityIndicator size="large" color="#FFCA5D" />
              ) : (
                <FlatList
                  data={this.state.onGoingCallouts}
                  renderItem={({ item }) => (
                    <View>
                      <TouchableOpacity onPress={() => this.passItem(item)}>
                        <View style={styles.Card}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={[
                                styles.TextFam,
                                { fontSize: 15, fontWeight: "bold" },
                              ]}
                            >
                              Job Type: {item.Client_property.job_type}{" "}
                            </Text>
                            <Icon
                              name="flag"
                              style={{
                                fontSize: 24,
                                color:
                                  item.Client_property.urgency_level == "High"
                                    ? "red"
                                    : item.Client_property.urgency_level ==
                                      "Scheduled"
                                    ? "#aaa"
                                    : "#FFCA5D",
                                paddingRight: "5%",
                              }}
                            ></Icon>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              flex: 1,
                              paddingBottom: "5%",
                              alignItems: "center",
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
                                  Callout ID :{item.Client_property.id}
                                </Text>
                                <Text
                                  style={[styles.TextFam, { fontSize: 10 }]}
                                >
                                  Property ID :
                                  {item.Client_property.property_id}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: "column",
                                paddingRight: "5%",
                                alignItems: "flex-end",
                              }}
                            >
                              <Text
                                style={[
                                  styles.TextFam,
                                  {
                                    fontSize: 10,
                                    color: "#000",
                                    fontWeight: "600",
                                  },
                                ]}
                              >
                                Status: {item.Client_property.status}
                              </Text>
                              <Text
                                style={[
                                  styles.TextFam,
                                  { fontSize: 9, color: "#aaa" },
                                ]}
                              >
                                Request time:{" "}
                                {item.Client_property.request_time}
                              </Text>
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
      </PTRView>
    );
  }
}

export default OngoingCallout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    // justifyContent: 'center'
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

    // fontFamily: "Helvetica",
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
    // fontFamily: "Helvetica",
  },
});
