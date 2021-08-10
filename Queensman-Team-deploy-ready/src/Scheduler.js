/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios'
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { auth } from "./utils/nhost";


const GET_SCHEDULE = gql`
query GetSchedule($id: Int!) {
  scheduler(where: {time_on_calendar: {_is_null: false}, worker_id: {_eq: $id}}) {
    callout_id
    date_on_calendar
    time_on_calendar
    worker_id
    notes
  }
}
`

const App = (props) => {
  const workerId = props.navigation.getParam("workerId", {})

  const {loading, data, error} = useQuery(GET_SCHEDULE, {variables: {
    id: workerId
  }})

  const [state, setState] = useState({
    items: {},
    schedules: [],
    names: [],
    dates: [],
    colors: [],
    length: 0,
    markedDates: {},
    isLoading: false,
  })

  useEffect(() => {
    
    if(!loading) {
      let name = []
      let schedule = []
      let date = []
      data?.scheduler.map(userObject => {
        let item = userObject.callout_id + ' / ' + userObject.worker_id + ' / ' + userObject.notes
        name.push(item)
        schedule.push(userObject);
        date.push(userObject.date_on_calendar)
      })
          setState({...state,
            length: data?.scheduler.length,
            schedules: schedule,
            names: name,
            dates: date,
            isLoading: true,
          })
    }
  }, [data])

  const renderItem = (item, index) => {
    console.log(item)
      let color_code = 'grey'
      return item.data.map(item => (
        <TouchableOpacity
        style={[styles.item, { backgroundColor: color_code }]}
      >
        <Text style={{ color: 'white' }}>Callout ID: {item.callout_id}</Text>
        <Text style={{ color: 'white' }}>Ops Team ID: {item.worker_id}</Text>
        <Text style={{ color: 'white' }}>Notes: {item.notes}</Text>
      </TouchableOpacity>
      ))
  }

  const renderEmptyData = () => {
    return (
     <View>
 <Text style={{ color: 'black', alignSelf: 'center', paddingTop: '5%' }}>No schedule for this date.</Text>
     </View>
  //    <View style={styles.emptyDate}>
  //    <Text>This is empty date!</Text>
  //  </View>
    );
  }

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  }

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }


  const loadItems = (day) => {
    // console.log(state.schedules.filter(val => { return val.date_on_calendar === "2021-08-06" }))
    setTimeout(() => {
      for (let i = 0; i < state.dates.length; i++) {
        const strTime = state.dates[i];
        if (!state.items[strTime]) {
          let backup = state.schedules
          state.items[strTime] = [];
          let result = backup.filter(val => { return val.date_on_calendar === strTime })
          const dot = []
          result.map(res => dot.push({color: "blue", selectedDotColor: 'white'}))
          console.log(strTime,result)
          state.markedDates[strTime] = {dots:dot,selected: false, marked: true};
            state.items[strTime].push({
              data: result,
              // height: Math.max(80)
            });
        }
      }
      const newItems = {};
      Object.keys(state.items).forEach(key => { newItems[key] = state.items[key]; });
      setState({...state,
        items: newItems,
      });
    }, 1000);
  }

    if (!loading) {
      return (
        <Agenda
        markingType={'multi-dot'}
          style={{ marginTop: 20, height: "100%" }}
          items={state.items}
          loadItemsForMonth={loadItems}
          selected={new Date()}
          renderEmptyData={renderEmptyData}
          renderItem={renderItem}
          rowHasChanged={rowHasChanged}
          markedDates={state.markedDates}
        />
      );
    } else {
      return (
        <ActivityIndicator size="large" color="#FFCA5D" />
      );  
    }
    
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'gray',
    color: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    // height: 15,
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'gray',
  }
});

export default App;