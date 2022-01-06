/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable */ 
import React, { useState, useEffect } from "react";
import { format, parseISO, parse, differenceInHours } from "date-fns";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Box, Modal, Button, Spinner, Center } from "native-base";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";

import { gql, useQuery, useMutation, useLazyQuery, setLogVerbosity } from "@apollo/client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { marginBottom } from "styled-system";
import { auth, storage } from "../utils/nhost";
import colors from "../../native-base-theme/variables/commonColor";
import { HASURA } from "../_config";

const GET_SCHEDULE = gql`
  query MyQuery($date_on_calendar: date) {
    scheduler(where: { date_on_calendar: { _eq: $date_on_calendar }, callout: { status: { _neq: "Closed" } } }) {
      id
      start: date_on_calendar
      startTime: time_on_calendar
      end: end_date_on_calendar
      endTime: end_time_on_calendar
      title: notes
      blocked
      worker {
        full_name
      }
      callout {
        callout_by_email
      }
      callout_id
    }
  }
`;

const UPDATE_CALLOUT = gql`
  mutation UpdateSchedule(
    $callout_id: Int!
    $date_on_calendar: date = ""
    $time_on_calendar: time = ""
    $end_date_on_calendar: date!
    $end_time_on_calendar: time
  ) {
    update_scheduler(
      where: { callout_id: { _eq: $callout_id } }
      _set: {
        date_on_calendar: $date_on_calendar
        time_on_calendar: $time_on_calendar
        end_time_on_calendar: $end_time_on_calendar
        end_date_on_calendar: $end_date_on_calendar
      }
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
    $end_date_on_calendar: date
    $time_on_calendar: time
    $end_time_on_calendar: time
    $notes: String
    $email: String
    $category: String
    $job_type: String
    $job_type_id: Int
    $status: String
    $picture1: String
    $picture2: String
    $picture3: String
    $picture4: String
    $video: String
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
            job_type_id: $job_type_id
            status: $status
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
        end_date_on_calendar: $end_date_on_calendar
        end_time_on_calendar: $end_time_on_calendar
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

const GET_HOLIDAY = gql`
  query MyQuery {
    holidays {
      day
    }
  }
`;

export default function SelectSchedule(props) {
  const [selectedDate, setselectedDate] = useState(null);
  const [markedDate, setmarkedDate] = useState(false);
  const [loadingRequestModal, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);

  const [time, settime] = useState(null);
  const [blockedDay, setBlockedDay] = useState(null);

  const [addJobTicket, { loading: addJobTicketLoading, data: addJobTicketData }] = useMutation(ADD_JOB_TICKET);

  const [requestCalloutApiCall, { loading: requestCalloutLoading, data: requestCalloutData }] = useMutation(
    REQUEST_CALLOUT,
    {
      onCompleted: (data) => {
        addJobTicket({
          variables: {
            callout_id: data?.insert_scheduler_one?.callout_id,
            scheduler_id: data?.insert_scheduler_one?.id,
            notes: state.Description,
            client_email: auth.user().email,
          },
        });
      },
    }
  );
  const [updateCalloutApi, { loading: updateCalloutLoading, error: updatecalloutError }] = useMutation(UPDATE_CALLOUT);

  const { state } = props.route.params;
  const { commingFrom } = props.route.params;
  const callout_id_fromNotification = props.route.params.callout_id;
  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const [getSchedule, { loading, data, error }] = useLazyQuery(GET_SCHEDULE);
  const [getHoliday, { loading: holidayLoading, data: holidayData }] = useLazyQuery(GET_HOLIDAY);
  useEffect(() => {
    getHoliday();
  }, []);

  const LoadingModal = () => (
    <Modal isOpen={loadingRequestModal}>
      <Modal.Content justifyContent="center" py={4} pr={4}>
        <Text style={{ ...styles.heading }}>Finding relevant worker for you</Text>
        <Text style={{ ...styles.heading, marginBottom: 5 }}>Please wait</Text>
        <Text style={{ ...styles.heading, color: "#C7A602" }}>
          {contentLoading ? <ActivityIndicator color="white" size="large" /> : "Worker Found!"}
        </Text>
      </Modal.Content>
    </Modal>
  );

  const expoFileToFormFile = (url) => {
    const localUri = url;
    const filename = localUri.split("/").pop();

    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    return { uri: localUri, name: filename, type };
  };

  const onConfirmButtonPress = async () => {
    settime(null);
    setLoading(true);
    setContentLoading(true);
    if (commingFrom === "Notification") {
      updateCalloutApi({
        variables: {
          time_on_calendar: time,
          date_on_calendar: selectedDate,
          callout_id: callout_id_fromNotification,
          end_time_on_calendar: moment(time).add(2, "hours").toDate(),
          end_date_on_calendar: selectedDate,
        },
      })
        .then((res) => {
          setLoading(false);
          setContentLoading(false);
          props.navigation.navigate("HomeNaviagtor");
        })
        .catch((err) => console.log({ err }));
    } else {
      let category = "Uncategorized";
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
              return [`picture${i}`, `${HASURA}/storage/o/callout_pics/${file.name}`];
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
          end_time_on_calendar: moment(parse(time, "HH:mm:ss", new Date())).add(2, "hours").format("HH:mm:ss"),
          end_date_on_calendar: selectedDate,
          date_on_calendar: selectedDate,
          category,
          job_type: state.Job.value,
          job_type_id: state.Job.id,
          status: "Requested",
          urgency_level: "Medium",
          video: state.videoUrl,
          ...pictures,
        },
      })
        .then((res) => {
          setTimeout(() => {
            setContentLoading(false);
            setTimeout(() => {
              setLoading(false);
              SubmittedCalloutAlert();
              props.navigation.navigate("HomeNaviagtor");
            }, 2000);
          }, 7000);
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
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const Confirmmodal = () => {
    if (!time) {
      return null;
    }
    return (
      <Modal isOpen={time} onClose={() => settime(null)}>
        <Modal.Content justifyContent="center" pr={4}>
          <Text style={{ ...styles.heading }}>Schedule the service for</Text>
          <Text style={{ ...styles.heading }}>
            {moment(selectedDate).format("Do MMMM, YYYY")} at {format(parse(time, "HH:mm:ss", new Date()), "hh:mm aa")}
          </Text>
          <Button onPress={() => onConfirmButtonPress()} width={200} mx="auto" mt={4} mb={4}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Confirm</Text>
          </Button>
        </Modal.Content>
      </Modal>
    );
  };

  // eslint-disable-next-line prefer-const
  let slots = [];
  for (let i = 0; i < 4; i += 1) {
    slots.push({
      startTime: `${`${i * 2 + 9}`.padStart(2, 0)}:00:00`,
      endTime: `${((i + 1) * 2 + 8) % 24}:59`,
      text: `${`${(i * 2 + 9) % 24}`.padStart(2, 0)}:00 to ${((i + 1) * 2 + 9) % 24}:00`,
    });
  }
  (data?.scheduler ?? []).forEach((element, i) => {
    const startTimeOnCalender = parseISO(`${element.start}T${element.startTime}`);
    const endTimeOnCalender = parseISO(`${element.end}T${element.endTime}`);
    slots = slots.map((slot) => {
      const startTimeOnSlot = parseISO(`${selectedDate}T${slot.startTime}`);
      const endTimeOnSlot = parseISO(`${selectedDate}T${slot.endTime}`);
      if (element.blocked || element.callout.callout_by_email === auth.user().email) {
        if (
          startTimeOnCalender <= endTimeOnSlot &&
          (endTimeOnCalender >= endTimeOnSlot || endTimeOnCalender > startTimeOnSlot)
        )
          if (element.callout.callout_by_email === auth.user().email) {
            return { ...slot, disabled: true, blockedBy: "Already booked by you", i };
          } else {
            return { ...slot, disabled: true, i };
          }
      }
      return slot;
    });
  });

  const selectSlot = (time) => {
    setmarkedDate(false);
    settime(time);
  };

  const onDayPress = (day) => {
    let dayOfWeek = moment(day.dateString).format("dddd");
    if (holidayData?.holidays.filter((date) => date.day === dayOfWeek).length > 0) {
      setBlockedDay(true);
      setselectedDate(day.dateString);
      setmarkedDate({ date: day.dateString });
    } else if (day.dateString.substring(5) == "12-02") {
      setBlockedDay(true);
      setselectedDate(day.dateString);
      setmarkedDate({ date: day.dateString });
    } else {
      getSchedule({
        variables: {
          date_on_calendar: day.dateString,
        },
      });
      setselectedDate(day.dateString);
      setmarkedDate({ date: day.dateString });
    }
  };

  // const dateComponent = React.useMemo(() => {
  //   return (
  //     show && (
  //       <DateTimePicker
  //         value={date}
  //         mode="time"
  //         is24Hour={false}
  //         display="default"
  //         disabled={!show}
  //         onChange={onChange}
  //       />
  //     )
  //   );
  // }, [show]);

  if (requestCalloutLoading || updateCalloutLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={colors.brandPrimary} size="large" />
      </View>
    );
  }
  return (
    <Box style={{ flex: 1 }}>
      <Box>
        <CalendarList
          minDate={moment().format("YYYY-MM-DD")}
          current={moment().format("YYYY-MM-DD")}
          pastScrollRange={0}
          // markedDates={getMarkedDates()}
          onDayPress={onDayPress}
          hideArrows
          hideExtraDays
          disableMonthChange
          firstDay={1}
          // hideDayNames
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
                <Text style={{ marginLeft: 5, ...styles.textStyle }}>{month}</Text>
                <Text style={{ marginRight: 5, ...styles.textStyle }}>{year}</Text>
              </View>
            );
          }}
          enableSwipeMonths={false}
        />
      </Box>
      <Box>
        <Confirmmodal />
        <LoadingModal />

        <Modal
          isOpen={markedDate}
          onClose={() => {
            setmarkedDate(false);
            settime(false);
            setTimeout(() => {
              setBlockedDay(false);
            }, 5);
          }}
        >
          {blockedDay ? (
            <Modal.Content>
              <Box>
                <Text
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "white",
                    marginBottom: 15,
                  }}
                >
                  No teams available
                </Text>
                <Button
                  mx="auto"
                  width={240}
                  mb={8}
                  color="#fb5624"
                  onPress={() => {
                    setmarkedDate(false);
                    settime(false);
                    setTimeout(() => {
                      setBlockedDay(false);
                    }, 5);
                  }}
                >
                  Close
                </Button>
              </Box>
            </Modal.Content>
          ) : (
            <Modal.Content>
              <Box>
                {loading ? (
                  <Spinner mb={8} color="lightText" size="sm" />
                ) : moment(selectedDate).format("dddd") === "Friday" ? (
                  slots
                    .filter((slot, index) => index === 0 || index === 3)
                    .map((slot, index) => (
                      <Button
                        key={index}
                        mb={8}
                        mx="auto"
                        width={240}
                        isDisabled={slot.disabled}
                        onPress={() => selectSlot(slot.startTime)}
                      >
                        <Text style={{ textAlign: "center", justifyContent: "center", fontSize: 16 }}>{slot.text}</Text>

                        {slot?.blockedBy && (
                          <Text style={{ textAlign: "center", justifyContent: "center", fontSize: 14, color: "white" }}>
                            {slot?.blockedBy}
                          </Text>
                        )}
                      </Button>
                    ))
                ) : (
                  slots.map((slot, index) => (
                    <Button
                      key={index}
                      mb={8}
                      mx="auto"
                      width={240}
                      isDisabled={slot.disabled}
                      onPress={() => selectSlot(slot.startTime)}
                    >
                      <Text style={{ textAlign: "center", justifyContent: "center", fontSize: 16 }}>{slot.text}</Text>

                      {slot?.blockedBy && (
                        <Text style={{ textAlign: "center", justifyContent: "center", fontSize: 14, color: "white" }}>
                          {slot?.blockedBy}
                        </Text>
                      )}
                    </Button>
                  // eslint-disable-next-line prettier/prettier
                  ))
                )}
                <Text style={{ textAlign: "center", color: "white", marginBottom: 16 }}>
                  Disabled slots indicates no Teams are free.
                </Text>
              </Box>
            </Modal.Content>
          )}
        </Modal>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 10,
    paddingBottom: 10,
    color: "#C7A602",
    paddingRight: 5,
  },
  heading: { color: "white", fontSize: 18, alignSelf: "center" },
});
