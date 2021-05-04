import React from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Icon } from "native-base";

import Toast from "react-native-whc-toast";
import axios from "axios";
import PTRView from "react-native-pull-to-refresh";

class CalloutHistoryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CallOutData: [], //Ismain store horahi hayn client ki CallOut Histroy details yahan se daaldio usmain.
      loading: false,
      Id: "",
      dataAvaible: true,
      cusID: "",
      propID: "",
    };
  }

  passItem = (item) => {
    // console.log({item:this.props.navigation.push})
    // this.props.navigation.navigate("HomeNaviagtor");
    this.props.navigation.navigate("CalloutHistoryItem", {
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

    console.log({ ID, property_ID, g });
    this.setState({
      cusID: ID,
      propID: property_ID,
    });
    // if (property_ID == "asd" || property_ID == g) {
    //   alert(
    //     "Please select property first from 'Property Details' tab in the menu."
    //   );
    // this.props.navigation.navigate("HomeNaviagtor");
    // }
    link = `http://queensman.com/queens_client_Apis/fetchCalloutHistoryViaPropertyID.php?property_id=${property_ID}`;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data);

      if (result.data.server_responce == -1) {
        this.refs.customToast.show("No History available");
        this.setState({
          loading: false,
          dataAvaible: false,
        });
      } else {
        this.setState({ CallOutData: result.data.server_responce });
        console.log(this.state.CallOutData);
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
        link = `http://queensman.com/queens_client_Apis/fetchCalloutHistoryViaPropertyID.php?property_id=${this.state.propID}`;
        console.log(link);
        axios.get(link).then((result) => {
          console.log(result.data);

          if (result.data.server_responce == -1) {
            this.refs.customToast.show("No History available");
            this.setState({
              loading: false,
              dataAvaible: false,
            });
          } else {
            this.setState({ CallOutData: result.data.server_responce });
            console.log(this.state.CallOutData);
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
          <Toast
            ref="customToast"
            textStyle={{
              color: "#fff",
            }}
            style={{
              backgroundColor: "#000E1E",
            }}
          />
          <Text style={{ paddingTop: "5%" }}> </Text>

          <Text style={styles.HeadingStyle}> Services History</Text>
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
              No Services History
            </Text>
          ) : (
            <View>
              {this.state.loading ? (
                <ActivityIndicator size="large" color="#FFCA5D" />
              ) : (
                <FlatList
                  data={this.state.CallOutData}
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
                            <Text style={[styles.TextFam, { fontSize: 15, fontWeight: "bold" }]}>
                              Job Type: {item.Client_property.job_type}{" "}
                            </Text>
                            <Icon
                              name="flag"
                              style={{
                                fontSize: 24,
                                color:
                                  item.Client_property.urgency_level == "High"
                                    ? "red"
                                    : item.Client_property.urgency_level == "Scheduled"
                                    ? "#aaa"
                                    : "#FFCA5D",
                                paddingRight: "5%",
                              }}
                            />
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
                              />
                              <View style={{ flexDirection: "column" }}>
                                <Text style={[styles.TextFam, { fontSize: 10 }]}>
                                  Callout ID :{item.Client_property.id}
                                </Text>
                                <Text style={[styles.TextFam, { fontSize: 10 }]}>
                                  Property ID :{item.Client_property.property_id}
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
                                  {
                                    fontSize: 9,
                                    color: "#aaa",
                                    alignSelf: "center",
                                  },
                                ]}
                              >
                                Resolved Date: {item.Client_property.resolved_time}
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

// export default CalloutHistory;

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

    fontFamily: "Helvetica",
  },
  Card: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, // IOS
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
    fontFamily: "Helvetica",
  },
});

export default function CalloutHistory(props) {
  return <CalloutHistoryClass {...props}></CalloutHistoryClass>;
}
