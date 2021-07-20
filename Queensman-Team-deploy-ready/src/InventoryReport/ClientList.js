/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/prop-types */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

import { Icon } from "native-base";
import _ from "lodash";

import { gql, useQuery } from "@apollo/client";

const FETCH_CLIENTS = gql`
  query FetchClients {
    client(where: { active: { _eq: 1 } }) {
      id
      full_name
      email
      phone
      password
      sec_email
      sec_phone
      account_type
      occupation
      organization
      age_range
      gender
      family_size
      ages_of_children
      earning_bracket
      nationality
      years_expatriate
      years_native
      referred_by
      other_properties
      contract_start_date
      contract_end_date
      sign_up_time
    }
  }
`;

export default function ClientList(props) {
  const { loading, data, error } = useQuery(FETCH_CLIENTS);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFCA5D" />
      </View>
    );
  }

  return (
    <ClientListClass
      loading={loading}
      data={data?.client || []}
      {...props}
    ></ClientListClass>
  );
}

class ClientListClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignedCallouts: [
        { key: "Devin" },
        { key: "Jackson" },
        { key: "James" },
        { key: "Joel" },
        { key: "John" },
        { key: "Jillian" },
        { key: "Jimmy" },
        { key: "Julie" },
      ], //Ismain hayn saaray client ke ongoing callouts.
      query: "",
      loading: false,
      Id: "",
      dataAvaible: true,
      cusID: "",
      selected: "Owned",
      workerID: 1,
      TotalClient: 0,
      clientList: [],
      totalData: [],
      StaticData: [],
    };
  }

  passItem = (item) => {
    this.props.navigation.navigate("PropertiesList", {
      it: item,
    });
  };

  async componentDidMount() {
    var clientsArray = this.props.data;

    this.setState({
      clientList: clientsArray,
      totalData: clientsArray,
      StaticData: clientsArray,
    });
  }

  contains = ({ full_name, phone, id }, query) => {
    if (
      full_name.toString().toLowerCase().includes(query.toLowerCase()) ||
      phone.toString().includes(query) ||
      id.toString().includes(query)
    ) {
      return true;
    }
    return false;
  };

  searchData = (text) => {
    const data = _.filter(this.state.totalData, (StaticData) => {
      return this.contains(StaticData, text);
    });
    this.setState({ query: text, clientList: data });
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: "6%",
          }}
        >
          <Icon
            name="search"
            style={{ fontSize: 25, color: "#000E1E", paddingRight: "4%" }}
          ></Icon>
          <TextInput
            defaultValue={this.state.search}
            style={{
              fontSize: 15,
              color: "#000E1E",
              width: "90%",
              paddingStart: "1%",
            }}
            placeholder="Search"
            placeholderTextColor="#000E1E"
            underlineColorAndroid="transparent"
            onChangeText={this.searchData}
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
                }}>Total Clients: {this.state.TotalClient}</Text> */}
        {this.state.clientList.length <= 0 ? (
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
            No Such Clients Available.{" "}
          </Text>
        ) : (
          <View>
            <FlatList
              data={this.state.clientList}
              contentContainerStyle={{ paddingBottom: 100 }}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity onPress={() => this.passItem(item)}>
                    <View style={styles.Card}>
                      <Text
                        style={[
                          styles.TextFam,
                          { fontSize: 15, fontWeight: "bold" },
                        ]}
                      >
                        {item.full_name}{" "}
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
                              Client ID : {item.id}
                            </Text>
                            <Text style={[styles.TextFam, { fontSize: 10 }]}>
                              Phone : {item.phone}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Text> </Text>
                </View>
              )}
              keyExtractor={(_item, index) => index.toString()}
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
