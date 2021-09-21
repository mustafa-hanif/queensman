/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Text,
  FlatList,
  HStack,
  VStack,
  Button,
  Icon,
  Divider,
  Modal,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { formatDistance } from "date-fns";
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator, Pressable } from "react-native";

const UPDATE_NOTIFICATIONS = gql`
  mutation UpdateNotifications($id: Int!) {
    update_notifications_by_pk(
      pk_columns: { id: $id }
      _set: { isRead: true }
    ) {
      id
    }
  }
`;

const GET_JOBS_LIST_ALL = gql`
  query JobsList($id: Int!) {
    callout(
      where: { id: { _eq: $id } }
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
      property_id
      schedulers {
        date_on_calendar
        time_on_calendar
      }
    }
  }
`;

export default function NotificationList({
  navigation,
  item,
  updateNotifications: reloadNotification,
  viewStyle,
  textStyle,
  dotStyle,
  setNotifications,
  notifications,
  index,
  workerId
}) {
  const [modalLoaing, setModalLoading] = useState(false)
  const [getJobsFromEmail, { loading, data, error, refetch }] = useLazyQuery(GET_JOBS_LIST_ALL, {
    onCompleted: (item) => {
      console.log(item)
      setModalLoading(false)
      navigation.navigate("TicketListing", {
        it: item.callout[0],
        workerId
      });
    }, onError: (error) => {
      console.log(error)
      setModalLoading(false)
    }
  });
  const [updateNotifications] = useMutation(UPDATE_NOTIFICATIONS, {
    onCompleted: () => {
      reloadNotification();
    },
  });

  const markAsRead = (id) => {
    updateNotifications({
      variables: {
        id,
      },
    });
  };
  if (!item.isRead) {
    return (
      <>
      <Pressable
        onLongPress={() => {
          console.log("pre2ss")
          setModalLoading(true)
          console.log(item)
          getJobsFromEmail({ variables: {
            id: item?.callout_id
          }})
        }}>
      <VStack space={2} p={4} bg="white">
        <Text color="black">{item.text}</Text>
        <Text color="black" fontSize="xs">{`${formatDistance(
          new Date(),
          new Date(item.created_at),
          { includeSeconds: true }
        )} ago`}</Text>
        {item?.data?.callout_id && <Button onPress={() => {
          setModalLoading(true)
          getJobsFromEmail({ variables: {
            id: item?.data?.callout_id
          }})
        }} size="xs" height={6} width={100} bg="amber.300">
          <Text color="black" fontSize="xs">
            View Callout
          </Text>
        </Button>}
        <Button
          onPress={() => markAsRead(item.id)}
          zIndex={100}
          size="xs"
          width={100}
          ml="auto"
          bg="lightBlue.50"
        >
          <Text color="lightBlue.600" fontSize="xxs">
            Mark as read
          </Text>
        </Button>
      </VStack>
      <Divider bg="gray.200" />
      </Pressable>
       <Modal isOpen={modalLoaing} size="full" onClose={() => setModalLoading(false)}>
       <Modal.Header pr={3}>
         <ActivityIndicator size="large" color="white" />
       </Modal.Header>
     </Modal>
      </>
    );
  }
  return null;
}
