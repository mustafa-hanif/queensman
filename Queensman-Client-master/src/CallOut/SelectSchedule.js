import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Button } from "native-base";
import colors from "../../native-base-theme/variables/commonColor";
import moment from "moment";

import { gql, useQuery, useLazyQuery } from "@apollo/client";

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

export default function SelectSchedule(props) {
  const [selectedDate, setselectedDate] = useState(null);
  const [modalVisible, setmodalVisible] = useState(false);
  const [markedDate, setmarkedDate] = useState({});

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
    const mark = {};
    mark[date] = { selected: true, marked: true };
    setmarkedDate(mark);
  };

  const onConfirmButtonPress = () => {
    setmodalVisible(false);
    props.navigation.navigate("HomeNaviagtor");
  };

  const Confirmmodal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setmodalVisible(false)}
            style={{ flex: 1 }}
          ></TouchableOpacity>
          <View
            style={{
              backgroundColor: "white",
              borderWidth: 1,
              borderTopEndRadius: 30,
              borderTopLeftRadius: 30,
              padding: 35,
            }}
          >
            <Text style={{ ...styles.heading }}> Schedule The Service for {selectedDate}</Text>
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={colors.brandPrimary} size={"large"}></ActivityIndicator>
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

    return {
      "2021-05-16": disable,
      "2021-05-17": disable,
      "2021-05-18": disable,
      "2021-05-19": disable,
    };

    const markedDates = {};
    data.scheduler.forEach((element) => {
      markedDates[element.start] = { selected: true, marked: true };
    });
    console.log(markedDates);
    return markedDates;
  };

  return (
    <View style={{ flex: 1 }}>
      <CalendarList
        minDate={Date.now()}
        pastScrollRange={0}
        markedDates={getMarkedDates()}
        onDayPress={(day) => {
          console.log({ day });
          setselectedDate(day.dateString);
          setMarkedDATE(day.dateString);
          setmodalVisible(true);
        }}
        hideArrows={true}
        hideExtraDays={true}
        disableMonthChange={true}
        firstDay={1}
        hideDayNames={true}
        showWeekNumbers={false}
        disableArrowLeft={true}
        disableArrowRight={true}
        disableAllTouchEventsForDisabledDays={true}
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
      <Confirmmodal></Confirmmodal>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: { fontSize: 18, fontWeight: "bold", paddingTop: 10, paddingBottom: 10, color: "#5E60CE", paddingRight: 5 },
  heading: { fontSize: 18, alignSelf: "center" },
});
