/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios'
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Modal } from 'native-base'
import { auth } from "./utils/nhost";
import moment from 'moment'


const GET_SCHEDULE = gql`
query GetSchedule($id: Int!) {
  scheduler(where: {time_on_calendar: {_is_null: false}, worker_id: {_eq: $id}, callout: {status: {_neq: "Closed"}}}, order_by: {date_on_calendar: asc, time_on_calendar: asc}) {
    callout_id
    date_on_calendar
    time_on_calendar
    worker_id
    notes
    callout {
      urgency_level
      status
    }
  }
}

`

const GET_CALLOUT = gql`
query getCallout($id: Int!) {
  callout(where: { id: {_eq: $id } }
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
    video
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
    job_worker {
      worker {
        full_name
        email
      }
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
const App = (props) => {
  const workerId = props.navigation.getParam("workerId", {})
  const [modalLoaing, setModalLoading] = useState(false)

  const [getCallout, { loading: calloutLoading, data: calloutData, error: calloutError }] =
    useLazyQuery(GET_CALLOUT, { onCompleted: (data) => {
      setModalLoading(false);
      console.log(data.callout[0])
      props.navigation.navigate("TicketListing", {
        it: data.callout[0],
        workerId,
      }); 
    }, 
  onError: (error) => {
    console.log(error)
    setModalLoading(false)
    alert("Unable to navigate.")
  }});

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

  const itemPressed = (item) => {
    console.log(calloutLoading)
    setModalLoading(true)
    console.log(item)
    getCallout({
      variables: {
        id: item.callout_id
      }
    })
  }
  const renderItem = (item, index) => {
      return item.data.map(item => {
        let color_code = item?.callout?.urgency_level === "High" ? "red" : "grey"
        return (
        <TouchableOpacity
        key={item.callout_id}
        onPress={ () => itemPressed(item)}
        style={[styles.item, { backgroundColor: color_code }]}
      >
        <Text style={{ color: 'white' }}>Callout ID: {item.callout_id}</Text>
        <Text style={{ color: 'white' }}>Ops Team ID: {item.worker_id}</Text>
        <Text style={{ color: 'white' }}>Notes: {item.notes}</Text>
        <Text style={{ color: "white" }}>Date: {moment(item.date_on_calendar).format("dddd, Do, MMMM YYYY")}</Text>
        <Text style={{ color: "white" }}>Time: {moment(item.time_on_calendar, "h:mm a").format("h:mm A")}</Text>
      </TouchableOpacity>
        )
      })
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
        <>
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
         <Modal isOpen={modalLoaing} size="full" onClose={() => setModalLoading(false)}>
        <Modal.Header pr={3}>
          <ActivityIndicator size="large" color="white" />
        </Modal.Header>
      </Modal>
        </>
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