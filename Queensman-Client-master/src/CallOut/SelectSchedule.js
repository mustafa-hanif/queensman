/* eslint-disable camelcase */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Button } from "native-base";
import moment from "moment";

import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, storage } from "../utils/nhost";
import colors from "../../native-base-theme/variables/commonColor";

const GET_SCHEDULE = gql`
  query MyQuery($_gte: date!, $_lte: date!) {
    scheduler(where: { date_on_calendar: { _gte: $_gte, _lte: $_lte } }) {
      id
      start: date_on_calendar
      startTime: time_on_calendar
      title: notes
      worker {
        full_name
      }
      callout_id
    }
  }
`;

const REQUEST_CALLOUT = gql`
  mutation AddCallout(
    $property_id: Int
    $date_on_calendar: date
    $notes: String
    $time_on_calendar: time
    $email: String
    $category: String
    $job_type: String
    $status: String
    $request_time: timestamp
    $urgency_level: String
  ) {
    insert_scheduler_one(
      object: {
        callout: {
          data: {
            callout_by_email: $email
            property_id: $property_id
            category: $category
            job_type: $job_type
            status: $status
            request_time: $request_time
            urgency_level: $urgency_level
            active: 1
          }
        }
        date_on_calendar: $date_on_calendar
        time_on_calendar: $time_on_calendar
        notes: $notes
      }
    ) {
      date_on_calendar
    }
  }
`;

export default function SelectSchedule(props) {
  const [selectedDate, setselectedDate] = useState(null);
  const [modalVisible, setmodalVisible] = useState(false);
  const [markedDate, setmarkedDate] = useState({});

  const [requestCalloutApiCall, { loading: requestCalloutLoading, error: mutationError }] = useMutation(
    REQUEST_CALLOUT
  );

  const state = props.navigation.getParam("state", {});

  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const GetCurrentDate = () => {
    return "2020-08-01";
    return formatDate(new Date());
  };

  const GetOneYearFromNow = () => {
    return formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
  };

  const { loading, data, error } = useQuery(GET_SCHEDULE, {
    variables: {
      _gte: GetCurrentDate(),
      _lte: GetOneYearFromNow(),
    },
  });

  // console.log({
  //   loading,
  //   data: data?.scheduler.map((val) => {
  //     return { [val.start]: { selected: true, marked: true } };
  //   }),
  //   error,
  // });

  const setMarkedDATE = (date) => {
    const mark = markedDate;
    mark[date] = { selected: true, marked: true };
    // console.log({ mark });
    setmarkedDate(mark);
  };

  const onConfirmButtonPress = async () => {
    // console.log(state);
    const property_id = await AsyncStorage.getItem("QueensPropertyID");
    let category = "Uncategorized";
    const current = new Date();
    setmodalVisible(false);
    console.log(state.property_type);
    if (state.property_type?.indexOf("AMC") >= 0 || state.property_type?.indexOf("Annual Maintenance Contract") >= 0) {
      category = "AMC";
    } else if (state.property_type?.indexOf("MTR") >= 0 || state.property_type?.indexOf("Metered") >= 0) {
      category = "Metered Service";
    }

    // let pic1name = '';
    // let pic2name = '';
    // let pic3name = '';
    // let pic4name = '';
    // if (state.picture1 !== "") {
    //   pic1name = state.picture1.split("/").pop();
    // }
    // if (state.picture1 !== "") {
    //   pic2name = state.picture2.split("/").pop();
    // }
    // if (state.picture1 !== "") {
    //   pic3name = state.picture3.split("/").pop();
    // }
    // if (state.picture1 !== "") {
    //   pic4name = state.picture4.split("/").pop();
    // }
    // console.log(state.picture1);
    // storage.put(`/callout_pics/${pic1name}`, state.picture1).then(console.log).catch(console.error);

    requestCalloutApiCall({
      variables: {
        property_id: state.PropertyID,
        email: auth.user().email,
        notes: state.Description,
        time_on_calendar: current.toLocaleTimeString(),
        date_on_calendar: selectedDate,
        category,
        job_type: state.JobType,
        status: "Requested",
        request_time: current.toLocaleDateString(),
        urgency_level: "Medium",
      },
    })
      .then((res) => {
        props.navigation.navigate("HomeNaviagtor");
      })
      .catch((err) => console.log({ err }));
  };

  // console.log({ markedDate });

  const Confirmmodal = () => {
    return (
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={1} onPress={() => setmodalVisible(false)} style={{ flex: 1 }} />
          <View
            style={{
              backgroundColor: "white",
              borderColor: "#cccccc",
              borderWidth: 0.2,
              borderTopEndRadius: 12,
              borderTopLeftRadius: 12,
              padding: 35,
            }}
          >
            <Text style={{ ...styles.heading }}>Schedule the service for</Text>
            <Text style={{ ...styles.heading }}>{moment(selectedDate).format("Do MMMM, YYYY")}</Text>
            <Button
              onPress={() => onConfirmButtonPress()}
              style={{ backgroundColor: colors.buttonPrimaryBg, marginVertical: 20 }}
              block
            >
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>Confirm</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  };

  if (requestCalloutLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={colors.brandPrimary} size="large" />
      </View>
    );
  }

  const getMarkedDates = () => {
    const disable = {
      // selected: true,
      selectedColor: colors.buttonDisabledBg,
      disabled: true,
      disableTouchEvent: true,
      activeOpacity: 0.1,
    };

    const markedDates = {};
    data.scheduler.forEach((element) => {
      markedDates[element.start] = disable;
    });
    // console.log(markedDates);

    return markedDates;
  };

  return (
    <View style={{ flex: 1 }}>
      <CalendarList
        minDate={Date.now()}
        pastScrollRange={0}
        markedDates={getMarkedDates()}
        onDayPress={(day) => {
          // console.log({ day });
          setselectedDate(day.dateString);
          setMarkedDATE(day.dateString);
          setmodalVisible(true);
        }}
        hideArrows
        hideExtraDays
        disableMonthChange
        firstDay={1}
        hideDayNames
        showWeekNumbers={false}
        disableArrowLeft
        disableArrowRight
        disableAllTouchEventsForDisabledDays
        renderHeader={(date) => {
          const header = date.toString("MMMM yyyy");
          const [month, year] = header.split(" ");

          return (
            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
              }}
            >
              <Text style={{ marginLeft: 5, ...styles.textStyle }}>{`${month}`}</Text>
              <Text style={{ marginRight: 5, ...styles.textStyle }}>{year}</Text>
            </View>
          );
        }}
        enableSwipeMonths={false}
      />
      <Confirmmodal />
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: { fontSize: 18, fontWeight: "bold", paddingTop: 10, paddingBottom: 10, color: "#5E60CE", paddingRight: 5 },
  heading: { fontSize: 18, alignSelf: "center" },
});
