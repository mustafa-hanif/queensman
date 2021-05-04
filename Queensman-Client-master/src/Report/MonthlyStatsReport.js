import React from "react";
import { StyleSheet, Text, View, Button, Dimensions, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Picker } from "native-base";
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
      loading: false,
      AlertText: " ",
      isNoData: false,
    };
  }
  async componentDidMount() {
    this.setState({ loading: true });
    var property_ID = await AsyncStorage.getItem("QueensPropertyID"); // assign customer id here
    link = "http://13.250.20.151/queens_client_Apis/fetchMonthlyServicesReport.php?ID=" + property_ID;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data.server_response);
      if (result.data.server_response.length == 0) {
        this.setState({
          selected: "2020",
        });
        const year = [
          "2018",
          "2019",
          "2020",
          "2021",
          "2022",
          "2023",
          "2024",
          "2025",
          "2026",
          "2027",
          "2028",
          "2029",
          "2030",
        ];
        for (var i = 0; i < year.length; i++) {
          checkArray[year[i]] = {
            1: -1,
            2: -1,
            3: -1,
            4: -1,
            5: -1,
            6: -1,
            7: -1,
            8: -1,
            9: -1,
            10: -1,
            11: -1,
            12: -1,
          };
        }

        alert("No monthly services report exists till now.");
        this.setState({
          // AlertText: "No Monthly Services Report Exist till now",
          //  isNodata: true,
          loading: false,
        });
        this.props.navigation.navigate("CalloutReportItem");
      } else {
        var arrayLength = result.data.server_response.length;
        this.setState({
          selected: result.data.server_response[0].server_response.report_year,
        });
        for (var i = 0; i < arrayLength; i++) {
          //checkArray.push([result.data.server_response[i].server_response.report_year])e
          if (result.data.server_response[i].server_response.report_year in checkArray) {
            console.log(result.data.server_response[i].server_response.report_year + "Exists already");
            checkArray[result.data.server_response[i].server_response.report_year][
              result.data.server_response[i].server_response.report_month
            ] = result.data.server_response[i].server_response.report_location;
            //  checkArray[result.data.server_response[i].server_response.report_year].push(result.data.server_response[i].server_response.report_month)
            //     checkArray[result.data.server_response[i].server_response.report_year][result.data.server_response[i].server_response.report_month]=result.data.server_response[i].server_response.report_location
          } else {
            checkArray[result.data.server_response[i].server_response.report_year] = {
              1: -1,
              2: -1,
              3: -1,
              4: -1,
              5: -1,
              6: -1,
              7: -1,
              8: -1,
              9: -1,
              10: -1,
              11: -1,
              12: -1,
            };
            checkArray[result.data.server_response[i].server_response.report_year][
              result.data.server_response[i].server_response.report_month
            ] = result.data.server_response[i].server_response.report_location;
            //  checkArray[result.data.server_response[i].server_response.report_year][result.data.server_response[i].server_response.report_month]=result.data.server_response[i].server_response.report_location
          }
        }
        console.log(checkArray);

        value = result.data.server_response[0].server_response.report_year;
        if (value in checkArray) {
          // console.log(result.data.server_response[i].server_response.report_year + "Exists already")
          //checkArray[value]
          this.setState({
            selected: value,
            monthArray: checkArray[value],
          });
          checkArray[value] = {
            1: -1,
            2: -1,
            3: -1,
            4: -1,
            5: -1,
            6: -1,
            7: -1,
            8: -1,
            9: -1,
            10: -1,
            11: -1,
            12: -1,
          };
          console.log("yes");
        } else {
          alert("No monthly services report in " + value);
          console.log("no");
        }
        this.setState({ loading: false });
        //check ARRAY MAIN STORED HAYN YEARS ALONG WITH THE MONTHS. TASEEN!!!
      }
    });
  }
  onValueChange(value) {
    if (value in checkArray) {
      this.setState({
        selected: value,
        monthArray: checkArray[value],
        //  isNodata: false,
      });
      console.log("yes");
    } else {
      alert("No monthly services report in " + value + ".");
      console.log("no");
    }
  }

  Reporthandle = async (link) => {
    this.setState({ loading: true });

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
        <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle}></LinearGradient>
        <View style={{ paddingHorizontal: "5%", flexDirection: "column" }}>
          <Text style={[styles.TextFam, { fontSize: 10, color: "#FFCA5D" }]}>Select Year:</Text>
          <Picker
            note
            mode="dialog"
            style={{ paddingTop: "1%" }}
            itemStyle={{ fontFamily: "Helvetica" }}
            selectedValue={this.state.selected}
            onValueChange={this.onValueChange.bind(this)}
          >
            <Picker.Item label="2018" value="2018" />
            <Picker.Item label="2019" value="2019" />
            <Picker.Item label="2020" value="2020" />
            <Picker.Item label="2021" value="2021" />
            <Picker.Item label="2022" value="2022" />
            <Picker.Item label="2023" value="2023" />
            <Picker.Item label="2024" value="2024" />
            <Picker.Item label="2025" value="2025" />
            <Picker.Item label="2026" value="2026" />
            <Picker.Item label="2027" value="2027" />
            <Picker.Item label="2028" value="2028" />
            <Picker.Item label="2029" value="2029" />
            <Picker.Item label="2030" value="2030" />
          </Picker>
        </View>
        <View style={{ height: "3%" }}></View>
        {this.state.loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: "10%" }} />
        ) : (
          <View>
            <TouchableOpacity
              disabled={this.state.monthArray[1] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[1] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[1])}
            >
              <Text style={styles.buttonTxt}>January</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[2] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[2] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[2])}
            >
              <Text style={styles.buttonTxt}>February</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[3] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[3] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[3])}
            >
              <Text style={styles.buttonTxt}>March</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[4] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[4] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[4])}
            >
              <Text style={styles.buttonTxt}>April</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[5] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[5] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[5])}
            >
              <Text style={styles.buttonTxt}>May</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[6] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[6] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[6])}
            >
              <Text style={styles.buttonTxt}>June</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[7] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[7] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[7])}
            >
              <Text style={styles.buttonTxt}>July</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[8] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[8] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[8])}
            >
              <Text style={styles.buttonTxt}>August</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[9] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[9] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[9])}
            >
              <Text style={styles.buttonTxt}>September</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[10] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[10] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[10])}
            >
              <Text style={styles.buttonTxt}>October</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[11] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[11] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[11])}
            >
              <Text style={styles.buttonTxt}>November</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
            <TouchableOpacity
              disabled={this.state.monthArray[12] == -1 ? true : false}
              style={[
                styles.buttonstyle,
                {
                  backgroundColor: this.state.monthArray[12] != -1 ? "#FFCA5D" : "#d3d3d3",
                },
              ]}
              onPress={() => this.Reporthandle(this.state.monthArray[12])}
            >
              <Text style={styles.buttonTxt}>December</Text>
            </TouchableOpacity>
            <View style={{ height: "3%" }}></View>
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
});
