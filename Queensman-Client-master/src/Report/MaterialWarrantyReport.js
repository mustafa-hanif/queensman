import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Linking,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { ListItem } from "native-base";

import axios from "axios";

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

var checkArray = {};

export default class GenerateReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeFill: "1",
      selected: "",
      checkData: [],
      monthArray: [],
      loading: true,
      AlertText: " ",
      isNoData: false,
      response: [],
    };
  }
  async componentDidMount() {
    this.setState({ loading: true });
    var property_ID = await AsyncStorage.getItem("QueensPropertyID"); // assign customer id here
    link =
      "http://queensman.com/queens_client_Apis/fetchMaterialWarrantyReport.php?ID=" +
      property_ID;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data.server_response);
      if (result.data.server_response.length == 0) {
        alert("No reports available");
        this.setState({
          loading: false,
        });
        this.props.navigation.navigate("CalloutReportItem");
      } else {
        this.setState({
          response: result.data.server_response,
          loading: false,
        });
      }
    });
  }

  Reporthandle = async (link) => {
    //this.setState({ loading: true })
    console.log("in report handle");
    console.log(link);
    Linking.openURL(link);

    this.setState({ loading: false });
    // }
  };

  render() {
    return (
      //content as view type  and touch exit
      <View style={styles.container}>
        {/* background gradinet   */}
        <LinearGradient
          colors={["#000E1E", "#001E2B", "#000E1E"]}
          style={styles.gradiantStyle}
        ></LinearGradient>
        <View
          style={{ paddingHorizontal: "5%", flexDirection: "column" }}
        ></View>
        <View style={{ height: "3%" }}></View>
        {this.state.loading ? (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ marginTop: "10%" }}
          />
        ) : (
          <View style={{ height: deviceHeight - deviceHeight / 5 }}>
            <FlatList
              data={this.state.response}
              renderItem={({ item }) => (
                <View>
                  <View style={{ paddingBottom: "3%" }}>
                    <TouchableOpacity
                      style={{ backgroundColor: "#FFCA5D" }}
                      onPress={() =>
                        this.Reporthandle(item.server_response.report_location)
                      }
                    >
                      <View style={styles.Card}>
                        <Text
                          style={[
                            styles.TextFam,
                            {
                              backgroundColor: "#FFCA5D",
                              paddingBottom: "2%",
                              textAlign: "center",
                              fontSize: 25,
                              fontWeight: "bold",
                              paddingLeft: "5%",
                              paddingTop: "3%",
                            },
                          ]}
                        >
                          {item.server_response.report_upload_date}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
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
    paddingHorizontal: "10%",
    paddingVertical: "25%",
  },
  gradiantStyle: {
    width: deviceWidth,
    height: deviceHeight,
    position: "absolute",
    alignSelf: "center",
  },
  HeadingStyle: {
    fontSize: 23,
    color: "#FFCA5D",
    paddingBottom: "5%",
    fontFamily: "Helvetica",
  },
  buttonstyle: {
    // backgroundColor: "#FFCA5D",
    alignContent: "center",
    justifyContent: "center",
    height: "7%",
  },
  buttonTxt: {
    color: "#000E1E",
    fontSize: 13,
    fontFamily: "Helvetica",
    alignSelf: "center",
  },
  Card: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 3, // Android
    width: "90%",

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
