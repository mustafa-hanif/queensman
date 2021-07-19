/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Dimensions } from "react-native";

import { Camera } from "expo-camera";
import { Audio } from "expo-av";
import { Icon } from "native-base";
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const VideoScreen = ({ setShowVideoScreen, saveVideo }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(false);
  const camera = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      const { status: status2 } = await Audio.requestPermissionsAsync();
      setHasPermission(status === "granted" && status2 === "granted");
    })();
  }, []);

  const startRecording = () => {
    camera.current
      .recordAsync({ maxDuration: 30, quality: Camera.Constants.VideoQuality["720p"] })
      .then((video) => {
        setShowVideoScreen(false);
        saveVideo(video);
      })
      .catch((e) => {
        alert(JSON.stringify(e));
      });
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
    camera.current.stopRecording();
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styleCamera.container}>
      <Camera
        style={styleCamera.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => {
          camera.current = ref;
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={styleCamera.buttonContainer}>
            <TouchableOpacity
              style={styleCamera.button}
              onPress={() => {
                setShowVideoScreen(false);
              }}
            >
              <Icon as={Ionicons} name="close-circle-outline" style={{ fontSize: 32, color: "red", marginLeft: "auto" }} />
            </TouchableOpacity>
          </View>
          {recording ? (
            <View style={styleCamera.recordButtonContainer}>
              {/* <Icon as={Ionicons} name="square-outline" style={styleCamera.recordButtonOutline} /> */}
              <Pressable
                style={styleCamera.recordButtonButton}
                onPress={() => {
                  stopRecording();
                }}
              >
                <Icon as={Ionicons} name="square" style={styleCamera.recordButton} />
              </Pressable>
            </View>
          ) : (
            <View style={styleCamera.recordButtonContainer}>
              <Icon as={Ionicons} name="ellipse-outline" style={styleCamera.recordButtonOutline} />
              <Pressable
                style={styleCamera.recordButtonButton}
                onPress={() => {
                  startRecording();
                }}
              >
                <Icon as={Ionicons} name="ellipse" style={styleCamera.recordButton} />
              </Pressable>
            </View>
          )}
        </View>
      </Camera>
    </View>
  );
};

export default VideoScreen;

const styleCamera = StyleSheet.create({
  recordButtonContainer: {
    flex: 0.3,
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  recordButtonOutline: {
    fontSize: 100,
    position: "absolute",
    bottom: 0,
    left: Dimensions.get("window").width - 255,
    color: "white",
  },
  recordButtonButton: {
    position: "absolute",
    bottom: 16,
    left: Dimensions.get("window").width - 241,
  },
  recordButton: {
    fontSize: 70,
    color: "red",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  camera: {
    backgroundColor: "black",
    height: 600,
  },
  buttonContainer: {
    flex: 0.7,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
