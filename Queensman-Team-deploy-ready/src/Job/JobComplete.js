/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import StarRating from "react-native-star-rating";
import { gql, useMutation } from "@apollo/client";
import { auth } from "../utils/nhost";
import { Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { SECRECT } from "../_config";
// import { takeSnapshotAsync } from "expo";
// import ExpoPixi from "expo-pixi";

const FINISH_JOB = gql`
  mutation FinishFinalJob(
    $id: Int!
    $updater_id: Int
    $callout_id: Int!
    $feedback: String!
    $rating: Int!
    $solution: String!
    $signature: String!
  ) {
    insert_job_history_one(
      object: {
        callout_id: $callout_id
        updater_id: $updater_id
        updated_by: "Ops Team"
        status_update: "Closed"
      }
    ) {
      time
    }
    update_callout_by_pk(
      pk_columns: { id: $callout_id }
      _set: { status: "Closed" }
    ) {
      status
    }
    insert_job_one( object: {
      callout_id: $callout_id
      solution: $solution
      rating: $rating
      signature: $signature
      feedback: $feedback
    }) {
      solution
    }
    
    update_job_tickets_by_pk(
      pk_columns: { id: $id }
      _set: { status: "Closed" }
    ) {
      id
    }
  }
`;

const FINISH_JOB_SINGLE = gql`
  mutation UpdateJobAndJobTicket(
    $id: Int!
    $callout_id: Int!
    $feedback: String!
    $rating: Int!
    $solution: String!
    $signature: String!
  ) {
    insert_job_one( object: {
      callout_id: $callout_id
      solution: $solution
      rating: $rating
      signature: $signature
      feedback: $feedback
    }) {
      solution
    }

    update_job_tickets_by_pk(
      pk_columns: { id: $id }
      _set: { status: "Closed" }
    ) {
      id
    }
  }
`;
const JobComplete = (props) => {
  const ticketCount = props.navigation.getParam("ticketCount", {});
  console.log(ticketCount)
  const workerId = props.navigation.getParam("workerId", {})
  const ticketId = props.navigation.getParam("ticketDetails", {}).id;
  const clientEmail = props.navigation.getParam("it", {}).client.email;
  const clientPhone = props.navigation.getParam("it", {}).client.phone;
  const jobType = props.navigation.getParam("it", {}).job_type;
  const subject = `Job Type: ${jobType}`;
  console.log(jobType)
  console.log(subject)
  const signatureCanvas = useRef();
  const [state, setState] = useState({
    starCount: 0,
    feedback: "",
    signature: null,
    image: null,
    strokeColor: 0,
    SignatureUrl: null,
    CallOutID: props.navigation.getParam("QJobID", "Something"),
    Solution: props.navigation.getParam("Sol", "Something"),
  });

  const [finishJob, { loading, error }] = useMutation(FINISH_JOB);

  const [finishJobSingle] = useMutation(FINISH_JOB_SINGLE);

  // const saveCanvas = async ({ width, height }) => {
  //   const options = {
  //     format: "png", /// PNG because the view has a clear background
  //     quality: 0.1, /// Low quality works because it's just a line
  //     result: "tmpfile",
  //     height,
  //     width,
  //   };
  //   /// Using 'Expo.takeSnapShotAsync', and our view 'this.sketch' we can get a uri of the image
  //   const uri = await signatureCanvas.takeSnapshotAsync(sketch, options);
  //   console.log(uri);
  //   setState({
  //     SignatureUrl: uri,
  //   });
  //   console.log(SignatureUrl);
  // };

  const onStarRatingPress = (rating) => {
    setState({ ...state, starCount: rating });
  };

  const AlertJobDone = () => {
    Alert.alert(
      "Job Completion.",
      "Are you sure you want to finish the job?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => doneJob() },
      ],
      { cancelable: false }
    );
  };

  const doneJob = async () => {
    // saveCanvas()
    console.log(ticketCount, "TICKET COUNT");
    if (ticketCount == 1) {
      console.log("One Job");
      // console.log({
      //   id: ticketId,
      //   updater_id: workerId,
      //   callout_id: state.CallOutID,
      //   feedback: state.feedback,
      //   rating: state.starCount,
      //   solution: state.Solution,
      //   signature: auth.user().email
      // })

      const form = new FormData();
      /*eslint-disable*/
      form.append(
        "arguments",
        JSON.stringify({
          subject,
          email: clientEmail,
          description: `Feedback: ${state.feedback}`,
          status: "Closed",
          lastTicket: true,
          score: state.starCount,
        })
      );

      try {
        const result = await fetch(
          "https://www.zohoapis.com/crm/v2/functions/createzohodeskticket/actions/execute?auth_type=apikey&zapikey=1003.db2c6e3274aace3b787c802bb296d0e8.3bef5ae5ee6b1553f7d3ed7f0116d8cf",
          {
            method: "POST",
            headers: {
              "x-hasura-admin-secret": SECRECT,
            },
            body: form,
          }
        );
        let resultJson = await result.json();
        let output = resultJson.details.output;
        if (output.substring(0, 14) == "No email found") {
          console.log(output);
        }
      } catch (e) {
        console.log("ERROR");
        console.log(e);
      }

      console.log({
        id: ticketId,
        updater_id: workerId,
        callout_id: state.CallOutID,
        feedback: state.feedback,
        rating: state.starCount,
        solution: state.Solution,
        signature: auth.user().email,
      });
      try {
        await finishJob({
          variables: {
            id: ticketId,
            updater_id: workerId,
            callout_id: state.CallOutID,
            feedback: state.feedback,
            rating: state.starCount,
            solution: state.Solution,
            signature: auth.user().email,
          },
        });
        alert("Service has been successfully completed. Great Job!");
        setTimeout(() => {
          props.navigation.navigate("Home");
        }, 1000);
      } catch (e) {
        console.log(e);
        alert("Could not submit Job!");
      }
    } else {
      console.log("Many job");
      const form = new FormData();
      /*eslint-disable*/
      form.append(
        "arguments",
        JSON.stringify({
          subject,
          email: clientEmail,
          description: `Feedback: ${state.feedback}`,
          status: "Closed",
          lastTicket: false,
          score: state.starCount,
        })
      );

      try {
        const result = await fetch(
          "https://www.zohoapis.com/crm/v2/functions/createzohodeskticket/actions/execute?auth_type=apikey&zapikey=1003.db2c6e3274aace3b787c802bb296d0e8.3bef5ae5ee6b1553f7d3ed7f0116d8cf",
          {
            method: "POST",
            headers: {
              "x-hasura-admin-secret": SECRECT,
            },
            body: form,
          }
        );
        let resultJson = await result.json();
        let output = resultJson.details.output;
        if (output.substring(0, 14) == "No email found") {
          console.log(output);
        }
      } catch (e) {
        console.log("ERROR");
        console.log(e);
      }

      try {
        await finishJobSingle({
          variables: {
            id: ticketId,
            callout_id: state.CallOutID,
            feedback: state.feedback,
            rating: state.starCount,
            solution: state.Solution,
            signature: auth.user().email,
          },
        });
        alert("Job ticket has been successfully submitted");
        setTimeout(() => {
          props.navigation.navigate("Home");
        }, 1000);
      } catch (e) {
        console.log(e);
        alert("Could not submit Job!");
      }
    }
  };

  return (
    <ScrollView scrollEnabled={true} contentContainerStyle={styles.container}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "1.5%",
        }}
      >
        Rating
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "500",
          color: "#001E2B",
          marginBottom: "1.5%",
        }}
      >
        How would you rate our services?{" "}
      </Text>
      <View style={{ height: "4%" }}></View>
      <View style={{ width: "70%" }}>
        <StarRating
          disabled={false}
          maxStars={5}
          fullStarColor={"#001E2B"}
          rating={state.starCount}
          selectedStar={(rating) => onStarRatingPress(rating)}
        />
      </View>
      <View style={{ height: "4%" }}></View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#FFCA5D",
          marginBottom: "1.5%",
        }}
      >
        Feedback
      </Text>
      <View style={{ height: 20 }}></View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon
          as={MaterialIcons}
          name="feedback"
          style={{ fontSize: 18, color: "#000E1E", paddingRight: "4%" }}
        ></Icon>
        <TextInput
          // ref="textInputMobile"
          style={{ fontSize: 15, color: "#000E1E", width: "83%" }}
          placeholder="Please type your valuable feedback here.."
          defaultValue={state.feedback}
          placeholderTextColor="#000E1E"
          underlineColorAndroid="transparent"
          onChangeText={(feedback) => {
            setState({ ...state, feedback });
          }} //email set
        />
      </View>
      <View
        style={{
          borderBottomColor: "#aaa",
          borderBottomWidth: 2,
          width: "100%",
          paddingTop: "3%",
        }}
      ></View>
      <View style={{ height: "4%" }}></View>
      {/* <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            color: "#FFCA5D",
            marginBottom: "1.5%",
          }}
        >
          Signature
        </Text>

        <View style={styles.sketchContainer}>
          <ExpoPixi.Signature
            ref={signatureCanvas}
            style={styles.sketch}
            strokeColor={"#000E1E"}
            strokeAlpha={1}
            strokeWidth={3}
          />
        </View> */}
      <View style={{ height: "4%" }}></View>
      <Button onPress={AlertJobDone} title="FINISH THE JOB" color="#FFCA5D" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: "5%",
    paddingHorizontal: "5%",
  },
  sketch: {
    flex: 1,
  },
  sketchContainer: {
    height: "30%",
    backgroundColor: "#f1f1f1",
  },
});

export default JobComplete;
