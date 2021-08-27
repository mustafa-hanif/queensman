/* eslint-disable react/no-unescaped-entities */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable default-case */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import React from "react";
import { format, parseISO } from "date-fns";
import { StyleSheet, View, Dimensions, Linking } from "react-native";
import {
  Box,
  FlatList,
  Spinner,
  Text,
  ScrollView,
  Modal,
  Button,
  Divider,
  VStack,
  HStack,
  Icon,
  AlertDialog,
  Center,
} from "native-base";

import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { storage, auth } from "../utils/nhost";
import { calloutTemplate } from "./pdf_template";

const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pdf Content</title>
        <style>
            body {
                font-size: 16px;
                color: rgb(255, 196, 0);
            }
            h1 {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <h1>Hello, UppLabs!</h1>
    </body>
    </html>
`;

const expoFileToFormFile = (url) => {
  const localUri = url;
  const filename = localUri.split("/").pop();

  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;
  return { uri: localUri, name: filename, type };
};

const createAndSavePDF = async (html, propertyID) => {
  console.log(propertyID);
  try {
    const { uri } = await Print.printToFileAsync({ html });
    const file = expoFileToFormFile(uri);
    console.log(file);
    storage
      .put(`/public/${file.name}`, file)
      .then((fileUploaded) => {
        console.log(fileUploaded);
        Linking.openURL(`https://backend-8106d23e.nhost.app/storage/o/public/${file.name}`);
      })
      .catch(console.error);
  } catch (error) {
    console.error(error);
  }
};
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

  setPropertyId = (id) => {
    this.setState({ ...this.state, propertyID: id });
  };

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
    } else if (value === 3) {
      this.setState({
        isReportModelVisible: !this.state.isReportModelVisible,
        modeltype: false,
        value,
        // ModelData: this.state.MarkertReportData,
      });
    }
  };

  HandleMaterialwarranty = () => {
    this.props.navigation.navigate("MaterialWarrantyReport", {
      propertyId: this.state.propertyID,
    });
  };

  PerfReporthandle = () => {
    this.props.navigation.navigate("MonthlyStatsReport");
  };

  Reporthandle = async (Value) => {
    this.setState({ loading: true });
    this.setState({ isReportModelVisible: !this.state.isReportModelVisible });

    Linking.openURL(Value);
    this.setState({ loading: false });
  };

  renderReportModalContent = () => (
    <Box>
      {this.state.value === 1 ? (
        <Text>Property Management Reports</Text>
      ) : this.state.value === 2 ? (
        <Text>Markert Analysis Reports</Text>
      ) : (
        <Text>Inventory Reports</Text>
      )}
      <Text mb={4}>Tap to view or download a report.</Text>
      {this.state.value === 3 ? (
        <MyFlatList2
          property_ID={this.state.propertyID}
          setPropertyId={this.setPropertyId}
          value={this.state.value}
          Reporthandle={this.Reporthandle}
        />
      ) : (
        <MyFlatList
          property_ID={this.state.propertyID}
          setPropertyId={this.setPropertyId}
          value={this.state.value}
          Reporthandle={this.Reporthandle}
        />
      )}
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
        <LoadProperties setPropertyId={this.setPropertyId} props={this.props} />
        <Text style={styles.HeadingStyle}>Reports</Text>
        <Text color="white" paddingBottom={2}>
          Select the type of report to download{" "}
        </Text>

        <View style={{ height: "10%" }} />

        <View style={{ width: "100%", height: "100%" }}>
          <GetContractCopy />

          <Button mb={10} onPress={() => this.toggleReportModel(3)}>
            Inventory Report
          </Button>
          <MonthlyReportPDF propertyID={this.state.propertyID} />
        </View>
      </ScrollView>
    );
  }
}

const GET_CALLOUTS = gql`
  query MyQuery($callout_by_email: String!, $property_id: Int!, $today: date!) {
    callout(
      where: {
        callout_by_email: { _eq: $callout_by_email }
        property_id: { _eq: $property_id }
        schedule: { date_on_calendar: { _lte: $today } }
      }
      order_by: { schedule: { date_on_calendar: desc } }
    ) {
      id
      property_id
      request_time
      resolved_time
      planned_time
      picture1
      picture2
      picture3
      picture4
      job_type
      status
      urgency_level
      schedule {
        date_on_calendar
        time_on_calendar
      }
      callout_job {
        rating
        feedback
        signature
        solution
        instructions
      }
      client_callout_email {
        client_id: id
        client_username: email
        phone
        full_name
      }
      property {
        address
        community
        city
      }
    }
  }
`;

const MonthlyReportPDF = ({ propertyID }) => {
  const user = auth?.currentSession?.session?.user;
  const email = user?.email;
  const [loadCallouts, { loading, data, error }] = useLazyQuery(GET_CALLOUTS, {
    onCompleted: (data2) => {
      createAndSavePDF(calloutTemplate(data2.callout[0]), propertyID);
    },
  });
  // console.log(loading, data, error);
  return (
    <Button
      mb={10}
      onPress={() => {
        loadCallouts({
          variables: {
            callout_by_email: email,
            property_id: propertyID,
            today: new Date(),
          },
        });
      }}
    >
      {loading ? "Loading..." : "Monthly Report"}
    </Button>
  );
};
const LoadProperties = ({ setPropertyId, props }) => {
  const user = auth?.currentSession?.session?.user;
  const email = user?.email;

  const {
    loading,
    data: allProperties,
    error,
  } = useQuery(GET_PROPERTIES, {
    variables: { email },
    onCompleted: ({ client }) => {
      setPropertyId(client?.[0]?.property_owneds?.[0]?.property?.id);
    },
  });

  if (allProperties?.client?.[0].property_owneds.length === 0) {
    console.log("mewo");
    return (
      <Center>
        <AlertDialog isOpen motionPreset="fade">
          <AlertDialog.Content>
            <AlertDialog.Header fontSize="lg" fontWeight="bold">
              No property found
            </AlertDialog.Header>
            <AlertDialog.Body>You currently don't have any property assigned.</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button onPress={() => props.navigation.navigate("HomeNaviagtor")}>Ok</Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
    );
  }
  return <></>;
};

const GET_CONTRACT_COPY = gql`
  query MyQuery($email: String) {
    client(where: { email: { _eq: $email } }) {
      documents {
        document_name
      }
    }
  }
`;

const GetContractCopy = () => {
  const user = auth?.currentSession?.session?.user;
  const email = user?.email;
  const { loading, data, error } = useQuery(GET_CONTRACT_COPY, {
    variables: { email },
  });
  const openContractCopy = () => {
    const document_id =
      data?.client?.[0]?.documents?.[data?.client?.[0]?.documents?.length - 1].document_name.split(", ")[1];
    Linking.openURL(`https://api-8106d23e.nhost.app/?document_id=${document_id}`);
  };

  return (
    <Button mb={10} onPress={openContractCopy}>
      Contract Copy
    </Button>
  );
};

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

const INVENTORY_REPORT = gql`
  query MyQuery($_eq: String!) {
    inventory_report(where: { property: { property_owneds: { client: { email: { _eq: $_eq } } } } }) {
      id
      approved
      inventory_report_pdfs {
        inventory_report_id
        property_id
        id
        report_location
        report_upload_date
      }
      property {
        city
        community
        country
        id
      }
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

const MyFlatList2 = ({ property_ID, value, Reporthandle }) => {
  const openInventory = (report_location) => {
    // const document_id = data?.client?.[0]?.documents?.[data?.client?.[0]?.documents?.length - 1].document_name.split(", ")[1];
    Linking.openURL(report_location);
  };

  const TimeLine = ({ status }) => {
    switch (status) {
      case 0:
        return (
          <VStack space={1}>
            <HStack space={1} alignItems="center">
              <Text color="white">Awaiting for report to be uploaded</Text>
              <Icon as={Ionicons} name="arrow-back-circle-outline" size={5} color="white" />
            </HStack>
            <HStack>
              <Text color="#939393" fontSize="xs">
                Awaiting Approval from Ops Coordinator
              </Text>
            </HStack>
            <HStack>
              <Text color="#939393" fontSize="xs">
                Awaiting Approval from Ops Manager
              </Text>
            </HStack>
          </VStack>
        );
      case 1:
        return (
          <VStack>
            <HStack space={1} alignItems="center">
              <Text color="#2a9d3d" fontSize="xs">
                Awaiting for report to be uploaded
              </Text>
              <Icon as={Ionicons} name="checkmark-circle-outline" size={3} color="#2a9d3d" />
            </HStack>
            <HStack space={1} alignItems="center">
              <Text color="white">Awaiting Approval from Ops Coordinator</Text>
              <Icon as={Ionicons} name="arrow-back-circle-outline" size={5} color="white" />
            </HStack>
            <HStack>
              <Text color="#939393" fontSize="xs">
                Awaiting Approval from Ops Manager
              </Text>
            </HStack>
          </VStack>
        );
      case 2:
        return (
          <VStack>
            <HStack space={1} alignItems="center">
              <Text color="#2a9d3d" fontSize="xs">
                Awaiting for report to be uploaded
              </Text>
              <Icon as={Ionicons} name="checkmark-circle-outline" size={3} color="#2a9d3d" />
            </HStack>
            <HStack space={1} alignItems="center">
              <Text color="#2a9d3d" fontSize="xs">
                Awaiting Approval from Ops Coordinator
              </Text>
              <Icon as={Ionicons} name="checkmark-circle-outline" size={3} color="#2a9d3d" />
            </HStack>
            <HStack space={1} alignItems="center">
              <Text color="white">Awaiting Approval from Ops Manager</Text>
              <Icon as={Ionicons} name="arrow-back-circle-outline" size={5} color="white" />
            </HStack>
          </VStack>
        );
    }
  };

  let ModelData = [];
  const user = auth?.currentSession?.session?.user;
  const email = user?.email;
  const {
    loading: invReportLoading,
    data: inventoryReport,
    error: invError,
  } = useQuery(INVENTORY_REPORT, {
    variables: { _eq: email },
    skip: !email,
  });
  ModelData = inventoryReport?.inventory_report;
  if (invReportLoading) {
    return <Spinner size="sm" />;
  }
  if (invError) {
    return <Text>{invError}</Text>;
  }
  if (ModelData?.length === 0) {
    return <Text>There are no inventory reports for this property</Text>;
  }
  return (
    <>
      {/* <Text fontSize={18} paddingBottom={2}>Inventory Reports</Text> */}
      {ModelData?.length === 0 ? (
        <Text>There are no inventory reports for this property</Text>
      ) : (
        <FlatList
          data={ModelData}
          pr={6}
          renderItem={({ item }) => (
            <View>
              <Text>Property ID: {item?.property?.id}</Text>
              <Text paddingBottom={1}>
                {item?.property?.country}, {item?.property?.city}, {item?.property?.community}
              </Text>
              {item?.approved !== 3 ? (
                <TimeLine status={item?.approved} />
              ) : (
                <Button mb={2} onPress={() => openInventory(item?.inventory_report_pdfs?.[0].report_location)}>
                  {format(parseISO(item?.inventory_report_pdfs?.[0].report_upload_date), "MMMM, yyyy")}
                </Button>
              )}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </>
  );
};

const MyFlatList = ({ property_ID, value, Reporthandle }) => {
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
  if (!property_ID || reportLoading || reportLoading2) {
    return <Spinner size="sm" />;
  }
  if (mError || mError2) {
    return <Text>{mError || mError2}</Text>;
  }
  if (ModelData?.length === 0) {
    return <Text>There are no reports for this property</Text>;
  }
  return (
    <>
      {ModelData?.length === 0 ? (
        <Text>There are no managment reports for this property</Text>
      ) : (
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
      )}
    </>
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
