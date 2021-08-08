/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Box, Modal, Button } from "native-base";
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
            description: $notes
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
      id
      callout_id
    }
  }
`;

const ADD_JOB_TICKET = gql`
  mutation AddJobTicket($callout_id: Int, $scheduler_id: Int, $notes: String, $client_email: String) {
    insert_job_tickets_one(
      object: {
        callout_id: $callout_id
        scheduler_id: $scheduler_id
        type: "Full Job"
        name: $notes
        description: $notes
        status: "Open"
        client_email: $client_email
      }
    ) {
      id
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

  const [addJobTicket, { loading: addJobTicketLoading, data: addJobTicketData }] = useMutation(ADD_JOB_TICKET);

  const [requestCalloutApiCall, { loading: requestCalloutLoading, data }] = useMutation(REQUEST_CALLOUT, {
    onCompleted: (data) => {
      console.log({
        callout_id: data?.insert_scheduler_one?.callout_id,
        scheduler_id: data?.insert_scheduler_one?.id,
        notes: state.Description,
        client_email: auth.user().email,
      });
      addJobTicket({
        variables: {
          callout_id: data?.insert_scheduler_one?.callout_id,
          scheduler_id: data?.insert_scheduler_one?.id,
          notes: state.Description,
          client_email: auth.user().email,
        },
      });
    },
  });
  const [updateCalloutApi, { loading: updateCalloutLoading, error: updatecalloutError }] = useMutation(UPDATE_CALLOUT);

  const { state } = props.route.params;
  const { commingFrom } = props.route.params;
  const callout_id_fromNotification = props.route.params.callout_id;
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

  // const { loading, data, error } = useQuery(GET_SCHEDULE, {
  //   variables: {
  //     _gte: GetCurrentDate(),
  //     _lte: GetOneYearFromNow(),
  //   },
  // });

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
    if (selectedDate === undefined) {
      setShow(false);
      return;
    }
    setDate(selectedDate);
    const currentTime = moment(selectedDate).format("hh:mm a");
    settime(currentTime);
    onConfirmTime();
  };

  const onConfirmTime = () => {
    setShow(false);
    setmodalVisible(true);
  };

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
              storage.put(`/callout_pics/${file.name}`, file).then().catch(console.error);
              return [`picture${i}`, `https://backend-8106d23e.nhost.app/storage/o/callout_pics/${file.name}`];
            }
            return null;
          })
          .filter(Boolean)
      );
      console.log({
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
      });
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
        .catch((err) => alert(JSON.stringify({ err })));
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
      <Modal animationType="slide" transparent isOpen={modalVisible}>
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

  const getMarkedDates = () => {
    const disable = {
      // selected: true,
      selectedColor: colors.buttonDisabledBg,
      disabled: true,
      disableTouchEvent: true,
      activeOpacity: 0.1,
    };

    const markedDates = {};
    // data.scheduler.forEach((element) => {
    //   markedDates[element.start] = disable;
    // });
    // console.log(markedDates);

    return markedDates;
  };

  const onDayPress = (day) => {
    setselectedDate(day.dateString);
    setMarkedDATE(day.dateString);
    setShow(true);
  };

  const dateComponent = React.useMemo(() => {
    return (
      show && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={false}
          display="default"
          disabled={!show}
          onChange={onChange}
        />
      )
    );
  }, [show]);

  if (requestCalloutLoading || updateCalloutLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={colors.brandPrimary} size="large" />
      </View>
    );
  }
  console.log("time", time);
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
      {/* <Confirmmodal /> */}
      {/* <Modal isOpen={markedDate}>
        <Modal.Content>
          <Box pt={4}>
            <Button onPress={onConfirmTime}>Confirm Time</Button>
          </Box>
        </Modal.Content>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: { fontSize: 18, fontWeight: "bold", paddingTop: 10, paddingBottom: 10, color: "#5E60CE", paddingRight: 5 },
  heading: { fontSize: 18, alignSelf: "center" },
});
