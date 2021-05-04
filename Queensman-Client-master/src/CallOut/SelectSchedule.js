import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Button } from "native-base";
import colors from "../../native-base-theme/variables/commonColor";
import moment from "moment";
export default function SelectSchedule(props) {
  const [selectedDate, setselectedDate] = useState(null);
  const [modalVisible, setmodalVisible] = useState(false);
  const [markedDate, setmarkedDate] = useState({});

  useEffect(() => {
    const date = new Date();
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setMarkedDATE(formattedDate);
  }, []);

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

  return (
    <View style={{ flex: 1 }}>
      <CalendarList
        minDate={Date.now()}
        pastScrollRange={0}
        markedDates={markedDate}
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
