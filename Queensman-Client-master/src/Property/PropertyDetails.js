/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useRef } from "react";
import { gql, useQuery } from "@apollo/client";

import Toast from "react-native-whc-toast";
import axios from "axios";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ListItem, Icon, Select } from "native-base";
import { auth } from "../utils/nhost";

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
    paddingTop: "6%",
    paddingLeft: "4%",
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

const GET_PROPERTIES = gql`
  query MyQuery($email: String) {
    client(where: { email: { _eq: $email } }) {
      property_owneds {
        property {
          address
          community
          city
          id
          country
        }
      }
    }
  }
`;

const PropertyDetails = (props) => {
  const [state, setState] = useState({
    leasedPropertyData: [],
    OwnedPropertyData: [], // Ismain store horahi hayn client ki property details yahan se daaldio usmain.
    // loading: false,
    taped: "",
    selected: "Owned",
    PropertyData: [],
    LeasedDataAvaible: true,
    OwnedDataAvaible: true,
    cusID: "",
  });

  const email = auth?.currentSession?.session?.user?.email;
  console.log("email", email);
  const { loading, data, error } = useQuery(GET_PROPERTIES, {
    variables: { email },
  });
  const customToast = useRef();

  const _storeData = async (id, type, country) => {
    try {
      await AsyncStorage.setItem("QueensPropertyID", JSON.stringify(id));
      await AsyncStorage.setItem("QueensPropertyType", JSON.stringify(type));
      await AsyncStorage.setItem("QueensPropertyCountry", JSON.stringify(country));
      console.log("Item saved in asyncstorage");
      setTimeout(() => {
        props.navigation.navigate("HomeNaviagtor");
      }, 800);
      // eslint-disable-next-line no-shadow
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  };

  const onValueChange = (value) => {
    setState({
      selected: value,
    });
  };

  const Ontaps = (item) => {
    // customToast.show("New Property Selected");
    console.log(item.id);
    console.log({ item });
    _storeData(item.id, "owned", item.country);
  };

  const Ontaps2 = (item) => {
    console.log(item.id);
    _storeData(item.id, "leased", item.country);
  };

  /* async componentDidMount() {
    setState({
      loading: true,
    });
    // fetch customer orrder list
    const ID = await AsyncStorage.getItem("QueensUserID"); // assign customer id here
    setState({
      cusID: ID,
    });
    let link = `http://queensman.com/queens_client_Apis/FetchClientOwnedPropertyViaClientID.php?ID=${ID}`;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data);
      if (result.data.server_responce == -1) {
        setState({
          loading: false,
          OwnedDataAvaible: false,
        });
      } else {
        setState({ OwnedPropertyData: result.data.server_responce });
        // console.log(state.onGoingCallouts)
        setState({
          loading: false,
          OwnedDataAvaible: true,
        });
      }
    });
    link = `http://queensman.com/queens_client_Apis/FetchClientLeasedPropertiesViaClientID.php?ID=${ID}`;
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data);
      if (result.data.server_responce == -1) {
        setState({
          loading: false,
          LeasedDataAvaible: false,
        });
      } else {
        setState({ leasedPropertyData: result.data.server_responce });
        // console.log(state.onGoingCallouts)
        setState({
          loading: false,
          LeasedDataAvaible: true,
        });
      }
    });
  } */

  const _refresh = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // fetch customer orrder list
        const ID = state.cusID; // assign customer id here
        let link = `http://queensman.com/queens_client_Apis/FetchClientOwnedPropertyViaClientID.php?ID=${ID}`;
        console.log(link);
        axios.get(link).then((result) => {
          console.log(result.data);
          if (result.data.server_responce === -1) {
            setState({
              loading: false,
              OwnedDataAvaible: false,
            });
          } else {
            setState({ OwnedPropertyData: result.data.server_responce });
            // console.log(state.onGoingCallouts)
            setState({
              loading: false,
              OwnedDataAvaible: true,
            });
          }
        });
        link = `http://queensman.com/queens_client_Apis/FetchClientLeasedPropertiesViaClientID.php?ID=${ID}`;
        console.log(link);
        axios.get(link).then((result) => {
          console.log(result.data);
          if (result.data.server_responce === -1) {
            setState({
              loading: false,
              LeasedDataAvaible: false,
            });
          } else {
            setState({ leasedPropertyData: result.data.server_responce });
            // console.log(state.onGoingCallouts)
            setState({
              loading: false,
              LeasedDataAvaible: true,
            });
          }
        });
        resolve();
      }, 2000);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ paddingTop: "5%" }}> </Text>

      <Toast
        ref={customToast}
        textStyle={{
          color: "#fff",
        }}
        style={{
          backgroundColor: "#FFCA5D",
        }}
      />

      <Text style={styles.HeadingStyle}>Property Details</Text>
      <Text
        style={[
          styles.TextFam,
          {
            fontSize: 14,
            color: "#aaa",
            paddingTop: "2%",
            paddingLeft: "4%",
          },
        ]}
      >
        Tap to select the property
      </Text>
      <Text> </Text>

      <View style={{ paddingHorizontal: "5%", flexDirection: "column" }}>
        <Text style={[styles.TextFam, { fontSize: 10, color: "#FFCA5D" }]}>Select Property Type:</Text>
        <Select
          note
          mode="dialog"
          style={{ paddingTop: "2%" }}
          itemStyle={{ fontFamily: "Helvetica" }}
          selectedValue={state.selected}
          onValueChange={onValueChange}
        >
          <Select.Item label="Owned Properties" value="Owned" />
          <Select.Item label="Leased Properties" value="Leased" />
        </Select>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#FFCA5D" />
      ) : (
        <View>
          {state.selected === "Owned" ? (
            <View>
              {data?.client?.[0]?.property_owneds.length === 0 ? (
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
                  No Owned Property
                </Text>
              ) : (
                <FlatList
                  data={data?.client?.[0]?.property_owneds}
                  renderItem={({ item: { property } }) => {
                    return (
                      <View>
                        <TouchableOpacity onPress={() => Ontaps(property)}>
                          <View style={styles.Card}>
                            <Text
                              style={[
                                styles.TextFam,
                                {
                                  fontSize: 15,
                                  fontWeight: "bold",
                                  paddingLeft: "5%",
                                  paddingTop: "3%",
                                },
                              ]}
                            >
                              {property.address}
                            </Text>
                            <Text
                              style={[
                                styles.TextFam,
                                {
                                  fontSize: 10,
                                  color: "#aaa",
                                  paddingLeft: "5%",
                                  paddingTop: "1%",
                                },
                              ]}
                            >
                              {property.community},{property.city}
                            </Text>

                            <ListItem>
                              <View
                                style={{
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  flex: 1,
                                }}
                              >
                                <Text style={styles.TextFam}>{property.country}</Text>
                                <Text style={styles.TextFam}>Property ID: {property.id}</Text>

                                <Text style={styles.TextFam}>
                                  Property Category: {property.category ? property.category : "Not Listed"}
                                </Text>
                              </View>
                            </ListItem>
                          </View>
                        </TouchableOpacity>
                        <Text> </Text>
                        {state.taped === property.id ? (
                          <View
                            style={{
                              position: "absolute",
                              paddingLeft: "8%",
                              paddingTop: "10%",
                            }}
                          >
                            <Icon
                              name="checkmark-circle"
                              style={{
                                height: 50,
                                width: 50,
                                color: "#FFCA5D",
                              }}
                            />
                          </View>
                        ) : (
                          <View />
                        )}
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
          ) : (
            <View>
              {!state.LeasedDataAvaible ? (
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
                  No Leased Property
                </Text>
              ) : (
                <FlatList
                  data={state.leasedPropertyData}
                  renderItem={({ item }) => (
                    <View>
                      <TouchableOpacity onPress={() => Ontaps2(item)}>
                        <View style={styles.Card}>
                          <Text
                            style={[
                              styles.TextFam,
                              {
                                fontSize: 15,
                                fontWeight: "bold",
                                paddingLeft: "5%",
                                paddingTop: "3%",
                              },
                            ]}
                          >
                            {item.lease_property.address}{" "}
                          </Text>
                          <Text
                            style={[
                              styles.TextFam,
                              {
                                fontSize: 10,
                                color: "#aaa",
                                paddingLeft: "5%",
                                paddingTop: "1%",
                              },
                            ]}
                          >
                            {item.lease_property.community},{item.lease_property.city}
                          </Text>

                          <ListItem>
                            <View
                              style={{
                                flexDirection: "column",
                                justifyContent: "space-between",
                                flex: 1,
                              }}
                            >
                              <Text style={styles.TextFam}>{item.lease_property.country}</Text>
                              <Text style={styles.TextFam}>Property ID: {item.lease_property.property_id}</Text>
                              <Text style={styles.TextFam}>
                                Property Category:{" "}
                                {item.lease_property.category ? item.Client_property.category : "Not Listed"}
                              </Text>
                            </View>
                          </ListItem>
                        </View>
                      </TouchableOpacity>
                      <Text> </Text>
                      {state.taped === item.lease_property.property_id ? (
                        <View
                          style={{
                            position: "absolute",
                            paddingLeft: "8%",
                            paddingTop: "10%",
                          }}
                        >
                          <Icon
                            name="checkmark-circle"
                            style={{
                              height: 50,
                              width: 50,
                              color: "#FFCA5D",
                            }}
                          />
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default PropertyDetails;
