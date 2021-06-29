import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { ImageBrowser } from "expo-image-picker-multiple";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class ImagePicker extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    count: 0,
    donefunc: () => {},
  };

  imagesCallback = (callback) => {
    callback
      .then((photos) => {
        console.log("callback call hora");
        console.log(photos);
        this.props.navigation.navigate("CreateTicket", {
          selectedPhotos: photos,
        });
      })
      .catch((e) => console.log(e));
  };

  updateHandler = (count, onSubmit) => {
    this.setState({
      count,
      donefunc: onSubmit,
    });
  };

  renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  render() {
    const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
    const noCameraPermissionComponent = (
      <Text style={styles.emptyStay}>No access to camera</Text>
    );

    return (
      <View style={[styles.flex, styles.container]}>
        <View
          style={{
            width: "100%",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "black",
            alignItems: "center",
            paddingHorizontal: "2%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
            }}
          >
            <Text style={styles.headerText}>Back</Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 3,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
            }}
          >
            <Text style={styles.headerText}>
              {this.state.count} Images Selected
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (this.state.count > 0) {
                this.state.donefunc();
              }
            }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
            }}
          >
            {this.state.count > 0 && (
              <Text style={styles.headerText}>Done</Text>
            )}
          </TouchableOpacity>
        </View>

        <ImageBrowser
          max={10}
          onChange={this.updateHandler}
          callback={this.imagesCallback}
          renderSelectedComponent={this.renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
          noCameraPermissionComponent={noCameraPermissionComponent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingTop: 25,
    position: "relative",
  },
  emptyStay: {
    textAlign: "center",
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: "absolute",
    right: 3,
    bottom: 3,
    justifyContent: "center",
    backgroundColor: "#0580FF",
  },
  countBadgeText: {
    fontWeight: "bold",
    alignSelf: "center",
    padding: "auto",
    color: "#ffffff",
  },
  headerText: {
    fontSize: 18,
    color: "white",
  },
});
