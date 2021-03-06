/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const buttonTextStyle = {
  color: "#FFCA5D",
};

const JobsSteps = (props) => {
  const [state, setState] = useState({
    JobID: props.navigation.getParam("QJobID", null),
  });

  const onSubmitSteps = () => {
    props.navigation.navigate("PreJob", {
      QJobID: state.JobID,
    });
  };

  const defaultScrollViewProps = {
    keyboardShouldPersistTaps: "handled",
    contentContainerStyle: {
      flex: 1,
      justifyContent: "center",
    },
  };

  const progressStepsStyle = {
    activeStepIconBorderColor: "#FFCA5D",
    activeLabelColor: "#fff",
    activeStepNumColor: "#FFCA5D",
    activeStepIconColor: "#fff",
    completedStepIconColor: "#FFCA5D",
    completedProgressBarColor: "#FFCA5D",
    completedCheckColor: "#fff",
  };

  return (
    <View style={{ flex: 1 }}>
      <ProgressSteps {...progressStepsStyle}>
        <ProgressStep
          label="First Step"
          nextBtnTextStyle={buttonTextStyle}
          scrollViewProps={defaultScrollViewProps}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              style={styles.StepImageStyle}
              source={require("../../assets/steps/step1.jpg")}
            />
            <View style={{ height: "5%" }}></View>
            <Text>Uniform is full and car is equipped</Text>
          </View>
        </ProgressStep>

        <ProgressStep
          label="Second Step"
          nextBtnTextStyle={buttonTextStyle}
          scrollViewProps={defaultScrollViewProps}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              style={styles.StepImageStyle}
              source={require("../../assets/steps/step2.png")}
            />
            <View style={{ height: "5%" }}></View>
            <Text>Vehicle parked correctly and street banner in place</Text>
          </View>
        </ProgressStep>
        <ProgressStep
          label="Third Step"
          nextBtnTextStyle={buttonTextStyle}
          scrollViewProps={defaultScrollViewProps}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              style={styles.StepImageStyle}
              source={require("../../assets/steps/step3.png")}
            />
            <View style={{ height: "5%" }}></View>
            <Text>Ring Bell,if no answer,ring again after 30 sec</Text>
            <Text>After three knocks & no answer contact administration</Text>
          </View>
        </ProgressStep>
        <ProgressStep
          label="Fourth Step"
          nextBtnTextStyle={buttonTextStyle}
          scrollViewProps={defaultScrollViewProps}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              style={styles.StepImageStyle}
              source={require("../../assets/steps/step4.png")}
            />
            <View style={{ height: "5%" }}></View>
            <Text>Greet Customer,Ask Permission for site access</Text>
            <Text>Site protection and make safe in place</Text>
          </View>
        </ProgressStep>
        <ProgressStep
          label="Fifth Step"
          nextBtnTextStyle={buttonTextStyle}
          scrollViewProps={defaultScrollViewProps}
          onSubmit={onSubmitSteps}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              style={styles.StepImageStyle}
              source={require("../../assets/steps/step5.jpg")}
            />
            <View style={{ height: "5%" }}></View>
            <Text>Wear appropraite protective equipment</Text>
            <Text>(gloves,shoe,cover,etc)</Text>
          </View>
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  StepImageStyle: {
    height: 200,
    width: 200,
  },
});

export default JobsSteps;
