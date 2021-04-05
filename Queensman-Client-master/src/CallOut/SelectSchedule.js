import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import moment from "moment";
export default function SelectSchedule() {
  const [selectedDate, setselectedDate] = useState();
  return (
    <View style={{ flex: 1 }}>
      <CalendarList
        selected={selectedDate}
        // current={'2021-08-07'}
        minDate={Date.now()}
        pastScrollRange={0}
        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => {
          console.log({ day });
          setselectedDate(day);
        }}
        // Handler which gets executed on day long press. Default = undefined
        onDayLongPress={(day) => {
          console.log("selected day", day);
        }}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={"yyyy MM"}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange={(month) => {
          console.log("month changed", month);
        }}
        // Hide month navigation arrows. Default = false
        hideArrows={true}
        // Replace default arrows with custom ones (direction can be 'left' or 'right')
        // renderArrow={(direction) => <Arrow />}
        // Do not show days of other months in month page. Default = false
        hideExtraDays={true}
        // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
        // day from another month that is visible in calendar page. Default = false
        disableMonthChange={true}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay={1}
        hideDayNames={true}
        showWeekNumbers={false}
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        onPressArrowLeft={(subtractMonth) => subtractMonth()}
        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
        onPressArrowRight={(addMonth) => addMonth()}
        // Disable left arrow. Default = false
        disableArrowLeft={true}
        // Disable right arrow. Default = false
        disableArrowRight={true}
        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
        disableAllTouchEventsForDisabledDays={true}
        // Replace default month and year title with custom one. the function receive a date as parameter.
        renderHeader={(date) => {
          const header = date.toString("MMMM yyyy");
          const [month, year] = header.split(" ");
          const textStyle = {
            fontSize: 18,
            fontWeight: "bold",
            paddingTop: 10,
            paddingBottom: 10,
            color: "#5E60CE",
            paddingRight: 5,
          };

          return (
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "space-between",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ marginLeft: 5, ...textStyle }}>{`${month}`}</Text>
              <Text style={{ marginRight: 5, ...textStyle }}>{year}</Text>
            </View>
          );
        }}
        onVisibleMonthsChange={(months) => {
          console.log("now these months are visible", months);
        }}
        // Enable the option to swipe between months. Default = false
        enableSwipeMonths={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
