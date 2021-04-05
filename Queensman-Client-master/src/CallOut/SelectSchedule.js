<<<<<<< HEAD
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
=======
import React, { Component } from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import { Agenda } from "react-native-calendars";
import axios from "axios";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {},
      schedules: [],
      names: [],
      dates: [],
      colors: [],
      length: 0,
      markedDates: {},
      isLoading: false,
    };
  }

  componentDidMount() {
    let name = new Array();
    let schedule = new Array();
    let date = new Array();
    let markedDates = new Array();
    let colors = new Array();
    // axios
    //   .get("https://www.queensman.com/phase_2/queens_admin_Apis/fetchAllSchedule.php")
    //   .then((response) => {
    //     for (let userObject of response.data.server_response) {
    //       let item =
    //         userObject.schedule.callout_id + " / " + userObject.schedule.worker_id + " / " + userObject.schedule.notes;
    //       name.push(item);
    //       schedule.push(userObject.schedule);
    //       date.push(userObject.schedule.date_on_calendar);
    //       colors.push(userObject.schedule.color_code);
    //       console.log(userObject);
    //     }
    //     console.log("gg");
    //     this.setState({
    //       length: response.data.server_response.length,
    //       schedules: schedule,
    //       names: name,
    //       dates: date,
    //       isLoading: true,
    //       colors: colors,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  render() {
    return (
      <SafeAreaView style={{flex:1}}>
        <Agenda
        //   style={{ marginTop: 80 }}
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={new Date()}
          renderEmptyData={this.renderEmptyData.bind(this)}
          renderItem={this.renderItem.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          markedDates={this.state.markedDates}
        />
      </SafeAreaView>
    );
  }

  renderItem(item, index) {
    console.log(index);
    let color_code = "";
    if (item.data[0].color_code !== null) {
      color_code = "#" + item.data[0].color_code.toUpperCase();
    } else {
      color_code = "grey";
    }
    return (
      <TouchableOpacity style={[styles.item, { backgroundColor: color_code }, { height: item.height }]}>
        <Text style={{ color: "white" }}>Callout ID: {item.data[0].callout_id}</Text>
        <Text style={{ color: "white" }}>Ops Team ID: {item.data[0].worker_id}</Text>
        <Text style={{ color: "white" }}>Notes: {item.data[0].notes}</Text>
      </TouchableOpacity>
    );
  }

  renderEmptyData() {
    return (
      <View>
        <Text style={{ color: "black", alignSelf: "center", paddingTop: "5%" }}>No schedule for this date.</Text>
      </View>
      //    <View style={styles.emptyDate}>
      //    <Text>This is empty date!</Text>
      //  </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = 0; i < this.state.dates.length; i++) {
        const strTime = this.state.dates[i];
        if (!this.state.items[strTime]) {
          let backup = this.state.schedules;
          this.state.items[strTime] = [];
          this.state.markedDates[strTime] = { selected: true, marked: true };
          let result = backup.filter((val) => {
            return val.date_on_calendar === strTime;
          });
          const numItems = result.length;
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              data: result,
              height: Math.max(80),
            });
          }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach((key) => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems,
      });
    }, 1000);
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "gray",
    color: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    backgroundColor: "gray",
  },
});
>>>>>>> 7f35a25eb824e361814ecb10eefe34d195bdfd7d
