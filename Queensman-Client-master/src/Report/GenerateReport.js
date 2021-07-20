/* eslint-disable no-console */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Modal } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

class GenerateReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      isReportModelVisible: false,
      modeltype: true, // true for property manage ment false for market
      ModelData: [],
      ManagementReportData: [],
      MarkertReportData: [],
      loading: false,
      propertyID: "",
    };
  }

  toggleReportModel = (value) => {
    if (value === 1) {
      this.setState({
        isReportModelVisible: !this.state.isReportModelVisible,
        modeltype: true,
        value,
        // ModelData: this.state.ManagementReportData,
      });
    } else if (value === 2) {
      this.setState({
        isReportModelVisible: !this.state.isReportModelVisible,
        modeltype: false,
        value,
        // ModelData: this.state.MarkertReportData,
      });
    }
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const property_ID = await AsyncStorage.getItem("QueensPropertyID"); // assign customer id here
    const property_Type = await AsyncStorage.getItem("QueensPropertyType");
    if (property_ID === "asd") {
      alert("Please select property first from 'Property Details' tab in the menu.");
      this.props.navigation.navigate("HomeNaviagtor");
    }
    if (property_Type === "leased") {
      alert("Reports are only available for owned properties.");
      this.props.navigation.navigate("HomeNaviagtor");
    }
    link = `http://queensman.com/queens_client_Apis/fetchManagementReport.php?ID=${property_ID}`;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data.server_response);
      this.setState({ ManagementReportData: result.data.server_response, propertyID: property_ID });
      link = `http://queensman.com/queens_client_Apis/fetchMarketReport.php?ID=${property_ID}`;
      console.log(link);
      axios.get(link).then((result) => {
        console.log(result.data);
        this.setState({ MarkertReportData: result.data.server_response, loading: false });
      });
    });
  }

  HandleMaterialwarranty = () => {
    console.log("material warranty clicked");
    this.props.navigation.navigate("MaterialWarrantyReport");
  };

  PerfReporthandle = () => {
    this.props.navigation.navigate("MonthlyStatsReport");
  };

  Reporthandle = async (Value) => {
    this.setState({ loading: true });
    console.log("Management Report");
    this.setState({ isReportModelVisible: !this.state.isReportModelVisible });

    console.log(Value);
    Linking.openURL(Value);
    this.setState({ loading: false });
  };

  renderReportModalContent = () => (
    <View style={styles.ReportModel}>
      {this.state.modeltype ? (
        <Text style={{ fontSize: 17, color: "#FFCA5D", fontWeight: "700", paddingBottom: "2%" }}>
          Property Management Reports
        </Text>
      ) : (
        <Text style={{ fontSize: 20, color: "#FFCA5D", fontWeight: "700", paddingBottom: "2%" }}>
          Markert Analysis Reports
        </Text>
      )}
      <Text style={{ fontSize: 10, color: "#aaa", fontWeight: "400", paddingBottom: "3%" }}>
        Tap to view or download a report.
      </Text>
      <View style={{ borderBottomColor: "#aaa", borderBottomWidth: 0.5, width: "100%", paddingTop: "3%" }} />
      <MyFlatList value={this.value} Reporthandle={this.Reporthandle} />
    </View>
  );

  render() {
    return (
      // content as view type  and touch exit
      <Box mt={4}>
        {/* background gradinet   */}
        <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />

        <Text style={styles.HeadingStyle}>Reports</Text>
        <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Helvetica", paddingBottom: "15%" }}>
          Select the type of report to download{" "}
        </Text>

        <View style={{ height: "10%" }} />

        {this.state.loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginbottom: "10%" }} />
        ) : (
          <View style={{ width: "100%", height: "100%" }}>
            <TouchableOpacity
              style={{ backgroundColor: "#FFCA5D", alignContent: "center", justifyContent: "center", height: "15%" }}
              onPress={this.PerfReporthandle}
            >
              <Text style={{ color: "#000E1E", fontSize: 15, fontFamily: "Helvetica", alignSelf: "center" }}>
                Monthly Services
              </Text>
            </TouchableOpacity>
            <View style={{ height: "10%" }} />

            <TouchableOpacity
              style={{ backgroundColor: "#FFCA5D", alignContent: "center", justifyContent: "center", height: "15%" }}
              onPress={() => this.toggleReportModel(1)}
            >
              <Text style={{ color: "#000E1E", fontSize: 15, fontFamily: "Helvetica", alignSelf: "center" }}>
                Property Management
              </Text>
            </TouchableOpacity>

            <View style={{ height: "10%" }} />

            <TouchableOpacity
              style={{ backgroundColor: "#FFCA5D", alignContent: "center", justifyContent: "center", height: "15%" }}
              onPress={() => this.toggleReportModel(2)}
            >
              <Text style={{ color: "#000E1E", fontSize: 15, fontFamily: "Helvetica", alignSelf: "center" }}>
                Market Analysis
              </Text>
            </TouchableOpacity>

            <View style={{ height: "10%" }} />

            <TouchableOpacity
              style={{ backgroundColor: "#FFCA5D", alignContent: "center", justifyContent: "center", height: "15%" }}
              onPress={() => this.HandleMaterialwarranty()}
            >
              <Text style={{ color: "#000E1E", fontSize: 15, fontFamily: "Helvetica", alignSelf: "center" }}>
                Material Warranty
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          isVisible={this.state.isReportModelVisible}
          onSwipeComplete={() => this.setState({ isReportModelVisible: false })}
          swipeDirection={["left", "right", "down"]}
          onBackdropPress={() => this.setState({ isReportModelVisible: false })}
        >
          <Modal.Content>{this.renderReportModalContent()}</Modal.Content>
        </Modal>
      </Box>
    );
  }
}

const MyFlatList = ({ value, Reporthandle }) => {
  const ModelData = [];
  return (
    <FlatList
      data={ModelData}
      renderItem={({ item }) => (
        <View>
          <TouchableOpacity
            style={{ width: "100%", paddingTop: "3%" }}
            onPress={() => Reporthandle(item.server_response.report_location)}
          >
            <Text>
              {item.server_response.report_month},{item.server_response.report_year}
            </Text>
          </TouchableOpacity>
          <View style={{ borderBottomColor: "#aaa", borderBottomWidth: 0.5, width: "100%", paddingTop: "3%" }} />
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};
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
  ReportModel: {
    backgroundColor: "#fff",
    padding: 22,
    //   backgroundColor: '#65061B',
    justifyContent: "center",
    // alignItems: 'center',
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});

export default GenerateReport;
