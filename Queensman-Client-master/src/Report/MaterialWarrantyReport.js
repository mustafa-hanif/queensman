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

import { gql, useQuery } from "@apollo/client";

import { LinearGradient } from "expo-linear-gradient";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

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
    
    alignSelf: "center",
  },
  Card: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, // IOS
    elevation: 3, // Android
    width: "90%",

    // marginBottom: '3%',
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  TextFam: {
    
  },
});

const MR = gql`
  query MyQuery($_eq: Int!) {
    material_warranty_report(where: { property_id: { _eq: $_eq } }) {
      report_upload_date
      report_location
    }
  }
`;

const MaterialWarrantyReport = ({ route }) => {
  const Reporthandle = async (link) => {
    Linking.openURL(link);
  };

  const { loading, data, error } = useQuery(MR, {
    variables: { _eq: route.params.propertyId },
  });

  return (
    // content as view type  and touch exit
    <View style={styles.container}>
      {/* background gradinet   */}
      <LinearGradient colors={["#000E1E", "#001E2B", "#000E1E"]} style={styles.gradiantStyle} />
      <View style={{ paddingHorizontal: "5%", flexDirection: "column" }} />
      <View style={{ height: "3%" }} />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: "10%" }} />
      ) : (
        <View style={{ height: deviceHeight - deviceHeight / 5 }}>
          <FlatList
            data={data.material_warranty_report}
            renderItem={({ item }) => (
              <View>
                <View style={{ paddingBottom: "3%" }}>
                  <TouchableOpacity
                    style={{ backgroundColor: "#FFCA5D" }}
                    onPress={() => Reporthandle(item.report_location)}
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
                        {item.report_upload_date}
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
};

export default MaterialWarrantyReport;
