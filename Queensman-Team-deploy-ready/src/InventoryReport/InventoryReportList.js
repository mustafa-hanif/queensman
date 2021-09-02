import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Button,
  RefreshControl,
  ScrollView
} from "react-native";

import axios from "axios";
import _ from "lodash";

import { gql, useQuery, useLazyQuery } from "@apollo/client";

const FetchInventoryReportsViID = gql`
  query FetchInventoryReportsViID($_eq: Int!) {
    inventory_report(
      where: { property_id: { _eq: $_eq } }
      order_by: { checked_on: asc }
    ) {
      id
      checked_on
      summary
      inspection_done_by
      approved
      ops_team_id
    }
  }
`;

export default InventoryReportList = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const propertyId = props.navigation.getParam("it", {}).property_id;

  const { loading, data, error, refetch: refetchInventory, } = useQuery(FetchInventoryReportsViID, {
    variables: {
      _eq: propertyId,
    },
    onCompleted: (data2) => {
      console.log(data2, "COMPLETED")
      setRefreshing(false);
    },
    onError: (err) => {
      setRefreshing(false)
      console.log("error", err);
    },
  });

  
  const onRefresh = React.useCallback(() => {
    console.log("meow")
    setRefreshing(true);
    refetchInventory();
    console.log("done")
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFCA5D" />
      </View>
    );
  }

  return (
    <InventoryReportListClass
      loading={loading}
      data={data.inventory_report}
      refetchInventory={refetchInventory}
      onRefresh={onRefresh}
      refreshing={refreshing}
      {...props}
    ></InventoryReportListClass>
  );
}

const InventoryReportListClass = (props) => {
    const [state, setState] = useState({
      query: "",
      loading: false,
      Id: "",
      dataAvaible: true,
      cusID: "",
      selected: "Owned",
      workerID: props.navigation.getParam("workerId", {}),
      TotalClient: 0,
      clientList: [],
      totalData: [],
      StaticData: [],
      PropertyID: props.navigation.getParam("it", "Something").property_id,
    });

  const passItem = (item) => {
    props.navigation.navigate("InventoryReport", {
      it: item,
      propertyid: state.PropertyID,
      workerId: state.workerID
    });
  };
  const CreateInventoryReport = () => {
    props.navigation.navigate("InventoryReport", {
      propertyid: state.PropertyID,
      workerId: state.workerID
    });
  };

  useEffect(() => {
    let clientsArray = props.data;
    setState({...state, 
      clientList: clientsArray,
      totalData: clientsArray,
      StaticData: clientsArray,
    });
  }, [])

  const contains = ({ full_name, phone, id }, query) => {
    if (
      full_name.includes(query) ||
      phone.includes(query) ||
      id.includes(query)
    ) {
      return true;
    }
    return false;
  };

  const searchData = (text) => {
    const data = _.filter(state.totalData, (StaticData) => {
      return contains(StaticData, text);
    });
    setState({ ...state, query: text, clientList: data });
  };

    return (
      <ScrollView style={styles.container}  
      refreshControl={
        <RefreshControl
          refreshing={props.refreshing}
          onRefresh={props.onRefresh}
        />
      }>
        <View style={{ paddingHorizontal: "6%" }}>
          <Button
            style={{ width: "100%" }}
            onPress={() => CreateInventoryReport()}
            title="Create New Report"
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
                }}>Total Clients: {state.TotalClient}</Text> */}
        {state.clientList.length <= 0 ? (
          <View>
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
            No Inventory Reports Available{" "}
          </Text>
          <Text
              style={[
              styles.TextFam,
              {
                fontSize: 14,
                color: "#aaa",
                paddingTop: "3%",
                paddingBottom: "10%",
                alignSelf: "center",
              },
            ]}
            >
            Pull down to refresh
          </Text>
          </View>
        ) : (
          <View>
            <FlatList
              data={state.clientList}
              contentContainerStyle={{ paddingBottom: 10 }}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity onPress={() => passItem(item)}>
                    <View style={styles.Card}>
                      <Text
                        style={[
                          styles.TextFam,
                          { fontSize: 15, fontWeight: "bold" },
                        ]}
                      >
                        {item.inspection_done_by}{" "}
                      </Text>

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
                              Report ID : {item.id}
                            </Text>
                            <Text style={[styles.TextFam, { fontSize: 10 }]}>
                              Summary : {item.summary}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Text> </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
             <Text
              style={[
              styles.TextFam,
              {
                fontSize: 14,
                color: "#aaa",
                paddingTop: "3%",
                paddingBottom: "10%",
                alignSelf: "center",
              },
            ]}
            >
            Pull down to refresh
          </Text>
          </View>
        )}
      </ScrollView>
    );
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
    paddingHorizontal: "5%",
    paddingVertical: "5%",
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
