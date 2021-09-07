/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

// import Toast from "react-native-whc-toast";
import axios from "axios";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Linking } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ListItem, Icon, Select, ScrollView, CheckIcon } from "native-base";
import { Ionicons } from "@expo/vector-icons";

import { auth } from "../utils/nhost";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  Name: {
    marginTop: "10%",
    marginLeft: "3%",
  },
  HeadingStyle: {
    fontSize: 24,
    paddingTop: "3%",
    textAlign: "center",
    color: "#FFCA5D",
    fontWeight: "bold"
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

const GET_LEASED_PROPERTIES = gql`
query MyQuery($email: String) {
  lease(where: {client: {email: {_eq: $email}}}) {
    property {
      address
      community
      city
      country
      id
    }
  }
}
`;

const PropertyDetails = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState({
    leasedPropertyData: [],
    OwnedPropertyData: [], // Ismain store horahi hayn client ki property details yahan se daaldio usmain.
    // loading: false,
    taped: "",
    phoneno: "97148721301",
    selected: "Owned",
    PropertyData: [],
    LeasedDataAvaible: true,
    OwnedDataAvaible: true,
    cusID: "",
  });

  const email = auth?.currentSession?.session?.user?.email;
  console.log("id", state.taped);
  const { loading, data, error, refetch: refetchProperties } = useQuery(GET_PROPERTIES, {
    variables: { email },
    onCompleted: () => {
      setRefreshing(false)
    },
    onError: (err) => {
      console.log("error", err);
    }
  });
  const { loading: leasedLoading, data: leasedData, error: leasedError, refetch: refetchLeased } = useQuery(GET_LEASED_PROPERTIES, {
    variables: { email },
    onCompleted: () => {
      setRefreshing(false)
    },
    onError: (err) => {
      console.log("error", err);
    }
  });
  // const customToast = useRef();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetchProperties();
    refetchLeased();
  }, []);

  useEffect(() => {
    const load = async () => {
      const propertyDetails = await AsyncStorage.getItem("QueensPropertyDetails");
      if (propertyDetails) {
        setState({...state, taped: JSON.parse(propertyDetails).id})
      }
    }
    load()
  }, [])

  const _storeData = async (item) => {
    try {
      await AsyncStorage.setItem("QueensPropertyDetails", JSON.stringify(item));
      setState({...state, taped: item.id})
      // setTimeout(() => {
      //   props.navigation.navigate("HomeNaviagtor");
      // }, 800);
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
    _storeData(item);
  };

  const ContactUsFuntion = () => {
    // navigation.navigate("SignUpContectUs");
      const url = "tel://+" + state.phoneno;
      Linking.openURL(url);
  };
  return (
    <ScrollView
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    style={styles.container}
  >
     
      <Text style={{ paddingTop: "5%" }}> </Text>
      <TouchableOpacity onPress={() => props.navigation.toggleDrawer()} style={{zIndex: 10}}>
          <Icon as={Ionicons} name="arrow-back" style={{ fontSize: 24, color: "black", marginLeft: "5%", marginTop: "3%" }} />
        </TouchableOpacity>
        <View style={{marginTop: "-13%"}}>
      <Text style={styles.HeadingStyle}>Property Details</Text>
      <Text
        style={[
          {
            fontSize: 14,
            color: "black",
            textAlign: "center",
            paddingBottom: "2%"
          },
        ]}
      >
        Tap to select the property
      </Text>
      </View>
      <View style={{ paddingHorizontal: "5%", flexDirection: "column", marginBottom: "5%", marginTop: "5%" }}>
        {/* <Text style={{ marginBottom: 5, marginTop: 10, color: "black" }}>Select Property Type:</Text> */}
        <Select
          mode="dialog"
          style={{ paddingTop: "2%", color: "black"}}
          bg="#FFCA5D"
          selectedValue={state.selected}
          onValueChange={onValueChange}
          _selectedItem={{
            bg: "#FFCA5D",
            endIcon: <CheckIcon size={4} />,
          }}
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
              {(data?.client?.[0]?.property_owneds?.length ?? []) === 0 ? (
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
                              {property.community}, {property.city}
                            </Text>

                            <View>
                              <View
                                style={{
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  flex: 1,
                                  paddingLeft: "5%",
                                  paddingBottom: "3%"
                                }}
                              >
                                <Text>{property.country}</Text>
                                <Text>Property ID: {property.id}</Text>

                                <Text>
                                  Property Category: {property.category ? property.category : "Not Listed"}
                                </Text>
                              </View>
                            </View>
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
                            as={Ionicons}
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
              {leasedData?.lease?.length === 0  ? (
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
                  data={leasedData?.lease}
                  renderItem={({ item: { property } }) => {
                    console.log(property)
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
                              {property.community}, {property.city}
                            </Text>

                            <View>
                              <View
                                style={{
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  flex: 1,
                                  paddingLeft: "5%",
                                  paddingBottom: "3%"
                                }}
                              >
                                <Text>{property.country}</Text>
                                <Text>Property ID: {property.id}</Text>

                                <Text>
                                  Property Category: {property.category ? property.category : "Not Listed"}
                                </Text>
                              </View>
                            </View>
                          </View>
                      </TouchableOpacity>
                      <Text> </Text>
                      {state.taped === property?.id ? (
                        <View
                          style={{
                            position: "absolute",
                            paddingLeft: "8%",
                            paddingTop: "10%",
                          }}
                        >
                          <Icon
                          as={Ionicons}
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
                    )}}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
          )}
          <TouchableOpacity onPress={ContactUsFuntion}>
          <View style={{ flexDirection: "column", paddingTop: "5%", alignSelf: "center" }}>
            <Text style={{ fontSize: 11, color: "black", textAlign: "center" }}>Cannot find your property?</Text>

            <Text
              style={{
                fontSize: 20,
                color: "#FFCA5D",
                textDecorationLine: "underline",
                textAlign: "center"
              }}
            >
              CONTACT US
            </Text>
          </View>
        </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default PropertyDetails;
