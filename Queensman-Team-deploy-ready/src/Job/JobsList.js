/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";

import {
  Icon,
  Select,
  CheckIcon
} from "native-base";
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import dayjs from "dayjs";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { auth } from "../utils/nhost";

const GET_JOBS_LIST = gql`
  query JobsList($email: String) {
    callout(
      order_by: { request_time: desc },
      where: {job_worker: {worker: {email: {_eq: $email}}}, status: {_neq: "Closed"}}
    ) {
      id
      property_id
      job_type
      description
      status
      request_time
      planned_time
      picture1
      picture2
      picture3
      picture4
      urgency_level
      client_id: callout_by
      client: client_callout_email {
        full_name
        email
        phone
      }
      job: callout_job {
        instructions
      }
      property {
        id
        address
        community
        country
        city
      }
      schedulers {
        date_on_calendar
        time_on_calendar
      }
    }
  }
`;

const GET_JOBS_LIST_ALL = gql`
query JobsList($email: String) {
  callout(order_by: {request_time: desc}, limit: 10) {
    id
    property_id
    job_type
    description
    status
    request_time
    planned_time
    picture1
    picture2
    picture3
    picture4
    urgency_level
    client_id: callout_by
    client: client_callout_email {
      full_name
      email
      phone
    }
    job: callout_job {
      instructions
    }
    property {
      id
      address
      community
      country
      city
    }
    schedulers {
      date_on_calendar
      time_on_calendar
    }
  }
}
`;

const JobsList = (props) => {
  const workerId = props.navigation.getParam("workerId", {})
  const [state, setState] = useState({
    assignedCallouts: [], //Ismain hayn saaray client ke ongoing callouts.
    dataAvaible: true,
    selected: null,
    TotalData: [],
  });

  const [getJobsFromEmail, { loading, data, error, refetch }] = useLazyQuery(GET_JOBS_LIST, {
    variables: {
      email: auth?.currentSession?.session?.user.email,
    },
  });

  const [getAllJobs, { loading: allLoading, data: allData, error: allError }] = useLazyQuery(GET_JOBS_LIST_ALL);

  // if (state.selected == "date") {
  //   const myData = [].concat(state.assignedCallouts);
  //   // console.log(myData);
  //   setState({
  //     ...state,
  //     assignedCallouts: state.TotalData,
  //   });
  // } else if (state.selected == "medium") {
  //   const myData = [].concat(state.assignedCallouts);
  //   // console.log(myData);
  //   myData.sort(function (a, b) {
  //     var idA = a.urgency_level;
  //     var idB = b.urgency_level;
  //     // console.log(idA);
  //     // console.log(idB);
  //     if (idA == "Medium" && idB != "Medium") {
  //       return -1;
  //     }
  //     if (idA != "Medium" && idB == "Medium") {
  //       return 1;
  //     }

  //     return 0;
  //   });
  //   setState({
  //     ...state,
  //     assignedCallouts: myData,
  //   });
  // } else if (state.selected == "high") {
  //   const myData = [].concat(state.assignedCallouts);
  //   // console.log(myData);
  //   myData.sort(function (a, b) {
  //     var idA = a.urgency_level;
  //     var idB = b.urgency_level;
  //     // console.log(idA);
  //     // console.log(idB);
  //     if (idA == "High" && idB != "High") {
  //       return -1;
  //     }
  //     if (idA != "High" && idB == "High") {
  //       return 1;
  //     }

  //     return 0;
  //   });
  //   // console.log(myData);
  //   setState({
  //     ...state,
  //     assignedCallouts: myData,
  //   });
  // } else if (state.selected == "scheduled") {
  //   const myData = [].concat(state.assignedCallouts);
  //   // console.log(myData);
  //   myData.sort(function (a, b) {
  //     var idA = a.urgency_level;
  //     var idB = b.urgency_level;
  //     // console.log(idA);
  //     // console.log(idB);
  //     if (idA == "Scheduled" && idB != "Scheduled") {
  //       return -1;
  //     }
  //     if (idA != "Scheduled" && idB == "Scheduled") {
  //       return 1;
  //     }

  //     return 0;
  //   });
  //   console.log(myData);
  //   setState({
  //     ...state,
  //     assignedCallouts: myData,
  //   });
  // } else {
  //   if(allData?.callout) {
  //     setState({
  //       ...state,
  //       assignedCallouts: allData.callout,
  //       dataAvaible: true,
  //       TotalData: allData.callout,
  //     });
  //   } else if(data?.callout) {
  //     setState({
  //       ...state,
  //       assignedCallouts: data?.callout,
  //       dataAvaible: true,
  //       TotalData: data?.callout,
  //     });
  //   } else {
  //     setState({ ...state, dataAvaible: false });
  //   }
  // }

  const onValueChange = (value) => {
    console.log(value)
    setState({
      ...state,
      selected: value,
    });
  };

  const passItem = (item) => {
    console.log(item)
    props.navigation.navigate("TicketListing", {
      it: item,
      workerId
    });
  };

  useEffect(() => {
    const workerEmail = auth?.currentSession?.session?.user.email;
    setState({ workerEmail });
    if(auth?.currentSession?.session?.user.email == "opscord@queensman.com") {
      getAllJobs()
    } else {
      getJobsFromEmail()
    }

    if(allData?.callout) {
      setState({
        ...state,
        assignedCallouts: allData.callout,
        dataAvaible: true,
        TotalData: allData.callout,
      });
    } else if(data?.callout) {
      setState({
        ...state,
        assignedCallouts: data?.callout,
        dataAvaible: true,
        TotalData: data?.callout,
      });
    } else {
      setState({ ...state, dataAvaible: false });
    }
  }, [data?.callout, allData?.callout]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
            color: "#FF2222",
            marginRight: "4%",
          }}
        >
          Error
        </Text>
      </View>
    );
  }

  if(loading || allLoading) {
    return (
      <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
    <ActivityIndicator size="large" color="#FFCA5D" />
    </View>
    )
  } 

  return (
    <View style={styles.container}>
      <View style={{width: "100%",  paddingHorizontal: "4%"}}>
      <Select
          // note
          // mode="dialog"
          color={"black"}
          style={{ marginTop: "1%" }}
          selectedValue={state.selected}
          placeholder="Sort options"
          onValueChange={(itemValue) => {onValueChange(itemValue)}}
          _selectedItem={{
            // bg: "teal.600",
            endIcon: <CheckIcon size={5} />,
          }}
        >
          <Select.Item label="All" value="All" />
          <Select.Item label="Date" value="date" />
          <Select.Item label="Urgency Level:Medium" value="medium" />
          <Select.Item label="Urgency Level:High" value="high" />
          <Select.Item label="Urgency Level:Scheduled" value="scheduled" />
        </Select>
        </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: "6%",
          marginBottom: "4%",
        }}
      >
 
      </View>
      {(data?.callout.length || allData?.callout.length) === 0 ? (
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
          No Assigned Services
        </Text>
      ) : (
        (!loading || !allLoading )&&
        (data || allData) && (
          <View>
            <FlatList
              data={state.assignedCallouts}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity onPress={() => passItem(item)}>
                    <View style={styles.Card}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={[
                            styles.TextFam,
                            { fontSize: 15, fontWeight: "bold" },
                          ]}
                        >
                          Job type : {item.job_type}{" "}
                        </Text>
                        <Icon
                        as={Ionicons}
                          name="flag"
                          style={{
                            fontSize: 24,
                            color:
                              item.urgency_level == "High"
                                ? "red"
                                : item.urgency_level == "Scheduled"
                                ? "#aaa"
                                : "#FFCA5D",
                            paddingRight: "5%",
                          }}
                        />
                      </View>

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
                            // eslint-disable-next-line no-undef
                            source={require("../../assets/Home/linehis.png")}
                            style={{ height: 20, width: 20 }}
                          ></Image>
                          <View style={{ flexDirection: "column" }}>
                            <Text style={[styles.TextFam, { fontSize: 10 }]}>
                              Callout ID : {item.id}
                            </Text>
                            <Text style={[styles.TextFam, { fontSize: 10 }]}>
                              Property ID : {item.property_id}
                            </Text>
                            <Text style={[styles.TextFam, { fontSize: 10 }]}>
                              Status : {item.status}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={[
                            styles.TextFam,
                            {
                              fontSize: 9,
                              color: "#aaa",
                              paddingRight: "5%",
                              alignSelf: "center",
                            },
                          ]}
                        >
                          Request time :{" "}
                          {dayjs(item.request_time).format("DD/MM/YYYY")}
                        </Text>
                      </View>
                      {item?.schedulers?.[0]?.date_on_calendar ? 
                      <View>
                        <Text
                          style={[
                            styles.TextFam,
                            {
                              fontSize: 9,
                              color: "#aaa",
                              paddingRight: "5%",
                              alignSelf: "center",
                            },
                          ]}
                        >
                          Schedule time :{" "}
                          {dayjs(`${item?.schedulers?.[0]?.date_on_calendar}`).format("DD/MM/YYYY")}
                        </Text>
                        <Text
                          style={[
                            styles.TextFam,
                            {
                              fontSize: 9,
                              color: "#aaa",
                              paddingRight: "5%",
                              alignSelf: "center",
                            },
                          ]}
                        >
                          Schedule time :{" "}
                          {item?.schedulers?.[0]?.time_on_calendar}
                        </Text>
                        </View>
               : <Text style={[
                styles.TextFam,
                {
                  fontSize: 9,
                  color: "#aaa",
                  paddingRight: "5%",
                  alignSelf: "center",
                },
              ]}
            >No scheduled time</Text>}
                    </View>
                  </TouchableOpacity>
                  <Text> </Text>
                </View>
              )}
            />
          </View>
        )
      )}
    </View>
  );
};

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

    fontFamily: "serif",
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
    // fontFamily: 'serif'
  },
});

export default JobsList;
