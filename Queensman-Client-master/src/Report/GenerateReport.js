/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { StyleSheet, View, Dimensions, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Box, FlatList, Spinner, Text, ScrollView, Modal, Button } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { auth, storage } from "../utils/nhost";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

class GenerateReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      value: -1,
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
    // this.setState({ loading: true });
    // if (property_ID === "asd") {
    //   alert("Please select property first from 'Property Details' tab in the menu.");
    //   this.props.navigation.navigate("HomeNaviagtor");
    // }
    // if (property_Type === "leased") {
    //   alert("Reports are only available for owned properties.");
    //   this.props.navigation.navigate("HomeNaviagtor");
    // }
    // link = `http://queensman.com/queens_client_Apis/fetchManagementReport.php?ID=${property_ID}`;
    // // console.log(link);
    // axios.get(link).then((result) => {
    //   // console.log(result.data.server_response);
    //   this.setState({ ManagementReportData: result.data.server_response, propertyID: property_ID });
    //   link = `http://queensman.com/queens_client_Apis/fetchMarketReport.php?ID=${property_ID}`;
    //   //console.log(link);
    //   axios.get(link).then((result) => {
    //     console.log(result.data);
    //     this.setState({ MarkertReportData: result.data.server_response, loading: false });
    //   });
    // });
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
    <Box>
      {this.state.modeltype ? <Text>Property Management Reports</Text> : <Text>Markert Analysis Reports</Text>}
      <Text mb={4}>Tap to view or download a report.</Text>
      <MyFlatList value={this.state.value} Reporthandle={this.Reporthandle} />
    </Box>
  );

  render() {
    return (
      // content as view type  and touch exit
      <ScrollView backgroundColor="#000E1E" p={12}>
        <Modal
          size="full"
          isOpen={this.state.isReportModelVisible}
          onClose={() => this.setState({ isReportModelVisible: false })}
        >
          <Modal.Content h={400}>{this.renderReportModalContent()}</Modal.Content>
        </Modal>
        {/* background gradinet   */}

        <Text style={styles.HeadingStyle}>Reports</Text>
        <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Helvetica", paddingBottom: "15%" }}>
          Select the type of report to download{" "}
        </Text>

        <View style={{ height: "10%" }} />

        <View style={{ width: "100%", height: "100%" }}>
          <Button onPress={this.PerfReporthandle}>Monthly Services</Button>
          <View style={{ height: "10%" }} />

          <Button onPress={() => this.toggleReportModel(1)}>Property Management</Button>

          <View style={{ height: "10%" }} />

          <Button onPress={() => this.toggleReportModel(2)}>Market Analysis</Button>

          <View style={{ height: "10%" }} />

          <Button onPress={() => this.HandleMaterialwarranty()}>Material Warranty</Button>
        </View>
      </ScrollView>
    );
  }
}

const GET_PROPERTIES = gql`
  query MyQuery($email: String) {
    client(where: { email: { _eq: $email } }) {
      property_owneds {
        property {
          address
          community
          city
          id
          type
          country
        }
      }
    }
  }
`;

const MANAG_REPORT = gql`
  query ManagementReport($_eq: Int!) {
    management_report(where: { property_id: { _eq: $_eq } }) {
      id
      report_location
      report_month: report_upload_date
      report_year: report_upload_date
    }
  }
`;

const MARKET_REPORT = gql`
  query ManagementReport($_eq: Int!) {
    market_report(where: { property_id: { _eq: $_eq } }) {
      id
      report_location
      report_month: report_upload_date
      report_year: report_upload_date
    }
  }
`;

const MyFlatList = ({ value, Reporthandle }) => {
  const [property_ID, setPropertyId] = useState(null);

  const user = auth?.currentSession?.session?.user;
  const email = user?.email;

  const {
    loading,
    data: allProperties,
    error,
  } = useQuery(GET_PROPERTIES, {
    variables: { email },
    onCompleted: ({ client }) => {
      setPropertyId(client[0].property_owneds[0].property.id);
    },
  });

  const {
    loading: reportLoading,
    data: ManagementReportData,
    error: mError,
  } = useQuery(MANAG_REPORT, {
    variables: { _eq: 90 },
    skip: !property_ID,
  });

  const {
    loading: reportLoading2,
    data: MarkertReportData,
    error: mError2,
  } = useQuery(MARKET_REPORT, {
    variables: { _eq: property_ID },
    skip: !property_ID,
  });

  let ModelData = [];
  if (value === 1) {
    ModelData = ManagementReportData?.management_report;
  } else if (value === 2) {
    ModelData = MarkertReportData?.market_report;
  }
  if (loading || reportLoading || reportLoading2) {
    return <Spinner size="sm" />;
  }
  if (error || mError || mError2) {
    return <Text>{error || mError || mError2}</Text>;
  }
  if (ModelData?.length === 0) {
    return <Text>There are no reports for this property</Text>;
  }
  return (
    <FlatList
      data={ModelData}
      pr={6}
      renderItem={({ item }) => (
        <Button mb={2} onPress={() => Reporthandle(item.report_location)}>
          {format(parseISO(item.report_year), "MMMM, yyyy")}
        </Button>
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
