/* eslint-disable camelcase */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Box, Button } from "native-base";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";

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

const UPDATE_CALLOUT = gql`
  mutation UpdateSchedule($callout_id: Int!, $date_on_calendar: date = "", $time_on_calendar: time = "") {
    update_scheduler(
      where: { callout_id: { _eq: $callout_id } }
      _set: { date_on_calendar: $date_on_calendar, time_on_calendar: $time_on_calendar }
    ) {
      returning {
        date_on_calendar
      }
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
    $picture1: String
    $picture2: String
    $picture3: String
    $picture4: String
    $video: String
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
            picture1: $picture1
            picture2: $picture2
            picture3: $picture3
            picture4: $picture4
            video: $video
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

  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setHours(9);
    now.setMinutes(0);
    now.setMilliseconds(0);
    return now;
  });
  const [show, setShow] = useState(false);
  const [time, settime] = useState(null);

  const [requestCalloutApiCall, { loading: requestCalloutLoading, error: mutationError }] = useMutation(
    REQUEST_CALLOUT
  );
  const [updateCalloutApi, { loading: updateCalloutLoading, error: updatecalloutError }] = useMutation(UPDATE_CALLOUT);

  const state = props.route.params.state;
  const commingFrom = props.route.params.commingFrom;
  const callout_id_fromNotification = props.route.params.callout_id;
  console.log({ commingFrom, callout_id_fromNotification });
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

  const onChange = (event, selectedDate) => {
    setDate(selectedDate);
    const currentTime = moment(selectedDate).format("hh:mm a");
    settime(currentTime);
    
  };

  const onConfirmTime = () => {
    setShow(false);
    setmodalVisible(true);
  }

  const expoFileToFormFile = (url) => {
    const localUri = url;
    const filename = localUri.split("/").pop();

    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    return { uri: localUri, name: filename, type };
  };

  const onConfirmButtonPress = async () => {
    if (commingFrom === "Notification") {
      updateCalloutApi({
        variables: {
          time_on_calendar: time,
          date_on_calendar: selectedDate,
          callout_id: callout_id_fromNotification,
        },
      })
        .then((res) => {
          props.navigation.navigate("HomeNaviagtor");
        })
        .catch((err) => console.log({ err }));
    } else {
      const property_id = await AsyncStorage.getItem("QueensPropertyID");
      let category = "Uncategorized";
      const current = new Date();
      setmodalVisible(false);

      if (
        state.property_type?.indexOf("AMC") >= 0 ||
        state.property_type?.indexOf("Annual Maintenance Contract") >= 0
      ) {
        category = "AMC";
      } else if (state.property_type?.indexOf("MTR") >= 0 || state.property_type?.indexOf("Metered") >= 0) {
        category = "Metered Service";
      }
      const pictures = Object.fromEntries(
        [...Array(4)]
          .map((_, i) => {
            const _statePic = state[`picture${i}`];
            if (_statePic) {
              const file = expoFileToFormFile(_statePic);
              storage.put(`/callout_pics/${file.name}`, file).then(console.log).catch(console.error);
              return [`picture${i}`, `https://backend-8106d23e.nhost.app/storage/o/callout_pics/${file.name}`];
            }
            return null;
          })
          .filter(Boolean)
      );

      requestCalloutApiCall({
        variables: {
          property_id: state.PropertyID,
          email: auth.user().email,
          notes: state.Description,
          time_on_calendar: time,
          date_on_calendar: selectedDate,
          category,
          job_type: state.JobType,
          status: "Requested",
          request_time: current.toLocaleDateString(),
          urgency_level: "Medium",
          video: state.videoUrl,
          ...pictures,
        },
      })
        .then((res) => {
          props.navigation.navigate("HomeNaviagtor");
          setTimeout(() => {
            SubmittedCalloutAlert();
          }, 500);
        })
        .catch((err) => console.log({ err }));
    }
  };

  const SubmittedCalloutAlert = () => {
    Alert.alert(
      "Callout Request Submitted.",
      "One of our team will be in touch shortly.",
      [
        {
          text: "Ok",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
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
            <Text style={{ ...styles.heading }}>
              {moment(selectedDate).format("Do MMMM, YYYY")} at {time}
            </Text>
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

  if (requestCalloutLoading || loading || updateCalloutLoading) {
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

  const onDayPress = (day) => {
    console.log({ day });
    setselectedDate(day.dateString);
    setMarkedDATE(day.dateString);
    setShow(true);
  };

  console.log(show);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <CalendarList
          minDate={Date.now()}
          pastScrollRange={0}
          markedDates={getMarkedDates()}
          onDayPress={onDayPress}
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
      </View>
      <Confirmmodal />
      {show && <Modal animationType="slide" transparent visible={show}>
        <View style={{ backgroundColor: 'white', width:'100%', borderTopColor: "black",
    borderTopWidth: StyleSheet.hairlineWidth, height: 320, flex: 0.25, position: 'absolute', bottom: 0 }}>
          <DateTimePicker 
          value={date}
          mode="time" 
          is24Hour={false} 
          display="spinner" 
          onChange={onChange} 
        />
        <Box p={4}>
          <Button onPress={onConfirmTime}>Confirm Time</Button>
        </Box>
        </View>
      </Modal>}
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: { fontSize: 18, fontWeight: "bold", paddingTop: 10, paddingBottom: 10, color: "#5E60CE", paddingRight: 5 },
  heading: { fontSize: 18, alignSelf: "center" },
});
