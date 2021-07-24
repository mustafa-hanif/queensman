import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Row,
  Icon,
  Col,
  Left,
  Right,
  Button,
  Select,
} from "native-base";
import axios from "axios";

export default class ServicesHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ServicesHistory: [], //Ismain hayn saaray client ke ongoing callouts.
      loading: false,
      Id: "",
      dataAvaible: true,
      cusID: "",
      selected: "Owned",
      workerID: 1,
      TotalData: [],
    };
  }
  onValueChange(value) {
    this.setState(
      {
        selected: value,
      },
      () => {
        if (this.state.selected == "date") {
          const myData = [].concat(this.state.ServicesHistory);
          console.log(myData);
          // myData.sort(function(a,b)
          // {
          //     var idA = a.service_details.request_time
          //     var idB = b.service_details.request_time
          //     console.log(idA)
          //     console.log(idB)
          //     if(idA > idB)
          //     {
          //         return 1;
          //     }
          //     if(idA < idB)
          //     {
          //         return -1;
          //     }

          //     return 0;
          // })
          // console.log(myData)
          this.setState({
            ServicesHistory: this.state.TotalData,
          });
        }
        if (this.state.selected == "medium") {
          const myData = [].concat(this.state.ServicesHistory);
          console.log(myData);
          myData.sort(function (a, b) {
            var idA = a.service_details.urgency_level;
            var idB = b.service_details.urgency_level;
            console.log(idA);
            console.log(idB);
            if (idA == "Medium" && idB != "Medium") {
              return -1;
            }
            if (idA != "Medium" && idB == "Medium") {
              return 1;
            }

            return 0;
          });
          this.setState(
            {
              ServicesHistory: myData,
            },
            () => {
              console.log(this.state.ServicesHistory);
            }
          );
        }
        if (this.state.selected == "high") {
          const myData = [].concat(this.state.ServicesHistory);
          console.log(myData);
          myData.sort(function (a, b) {
            var idA = a.service_details.urgency_level;
            var idB = b.service_details.urgency_level;
            console.log(idA);
            console.log(idB);
            if (idA == "High" && idB != "High") {
              return -1;
            }
            if (idA != "High" && idB == "High") {
              return 1;
            }

            return 0;
          });
          console.log(myData);
          this.setState({
            ServicesHistory: myData,
          });
        }
        if (this.state.selected == "scheduled") {
          const myData = [].concat(this.state.ServicesHistory);
          console.log(myData);
          myData.sort(function (a, b) {
            var idA = a.service_details.urgency_level;
            var idB = b.service_details.urgency_level;
            console.log(idA);
            console.log(idB);
            if (idA == "Scheduled" && idB != "Scheduled") {
              return -1;
            }
            if (idA != "Scheduled" && idB == "Scheduled") {
              return 1;
            }

            return 0;
          });
          console.log(myData);
          this.setState({
            ServicesHistory: myData,
          });
        }
      }
    );
  }
  passItem = (item) => {
    this.props.navigation.navigate("ServicesHistoryItem", {
      it: item,
    });
  };

  async componentDidMount() {
    const WorkerID = await AsyncStorage.getItem("QueensmanWorkerID"); // assign customer id here
    this.setState({ loading: true, workerID: WorkerID });
    let link =
      "https://www.queensman.com/phase_2/queens_worker_Apis/fetchServicesHistoryViaWorkerID.php?ID=" +
      this.state.workerID;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data);
      if (result.data.server_response != -1) {
        this.setState(
          {
            ServicesHistory: result.data.server_response,
            dataAvaible: true,
            TotalData: result.data.server_response,
          },
          () => {}
        );
      } else {
        this.setState({ dataAvaible: false });
      }
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: "6%",
            marginBottom: "4%",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",
              color: "#FFCA5D",
              marginRight: "4%",
            }}
          >
            Sort
          </Text>

          <Select
            note
            mode="dialog"
            style={{ marginTop: "1%", fontSize: 20 }}
            selectedValue={this.state.selected}
            onValueChange={this.onValueChange.bind(this)}
          >
            <Select.Item label="Select" value="Select" />
            <Select.Item label="Date" value="date" />
            <Select.Item label="Urgency Level:Medium" value="medium" />
            <Select.Item label="Urgency Level:High" value="high" />
            <Select.Item label="Urgency Level:Scheduled" value="scheduled" />
          </Select>
        </View>
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
                data={this.state.ServicesHistory}
                keyExtractor={(item, index) => `${index}`}
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
                            Job type : {item.service_details.job_type}
                          </Text>
                          <Icon
                            name="flag"
                            style={{
                              fontSize: 24,
                              color:
                                item.service_details.urgency_level == "High"
                                  ? "red"
                                  : item.service_details.urgency_level ==
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
                              <Text style={[styles.TextFam, { fontSize: 10 }]}>
                                Callout ID : {item.service_details.id}
                              </Text>
                              <Text style={[styles.TextFam, { fontSize: 10 }]}>
                                Property ID : {item.service_details.property_id}
                              </Text>
                            </View>
                          </View>

                          <Text
                            style={[
                              styles.TextFam,
                              {
                                fontSize: 9,
                                color: "#aaa",
                                paddingRight: "5%",
                                alignSelf: "center",
                              },
                            ]}
                          >
                            Resolved time : {item.service_details.resolved_time}{" "}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <Text> </Text>
                  </View>
                )}
              />
            )}
          </View>
        )}
      </View>
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

    // fontFamily: 'serif'
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
    // fontFamily: "serif",
  },
});
