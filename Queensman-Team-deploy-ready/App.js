/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const version = "v0.4.8";
import React, { PureComponent } from "react";
// import * as SplashScreen from "expo-splash-screen";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
  LogBox,
} from "react-native";

import {
  createSwitchNavigator,
  createAppContainer,
  createMaterialTopTabNavigator,
} from "react-navigation";

import { DrawerItems, createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";

import { Icon, Box, NativeBaseProvider, extendTheme } from "native-base";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AppLoading from "expo-app-loading";

import { NhostApolloProvider } from "@nhost/react-apollo";
import { NhostAuthProvider } from "@nhost/react-auth";
import { auth } from "./src/utils/nhost";

//Classes import
import Login from "./src/Login";
import Home from "./src/Home";
import Job from "./src/Job/Job";
import JobComplete from "./src/Job/JobComplete";
import JobsList from "./src/Job/JobsList";
import JobsSteps from "./src/Job/JobsSteps";
import PostJob from "./src/Job/PostJob";
import PreJob from "./src/Job/PreJob";
import TicketListing from "./src/Job/TicketListing";
import CreateTicket from "./src/Job/CreateTicket";
import ImagePicker from "./src/Job/ImagePicker";
import Settings from "./src/Components/Settings";
// import ServicesHistory from "./src/Components/ServicesHistory";
import AuthLogin from "./src/Auth/AuthLogin";
import ServicesHistoryItem from "./src/Components/ServicesHistoryItem";
//Inventory Report
import ClientList from "./src/InventoryReport/ClientList";
import PropertiesList from "./src/InventoryReport/PropertiesList";
import InventoryReportList from "./src/InventoryReport/InventoryReportList";
import InventoryReport from "./src/InventoryReport/InventoryReport";
import InventoryReportRoom from "./src/InventoryReport/InventoryReportRoom";
import Articles from "./src/InventoryReport/Articles";
import Scheduler from "./src/Scheduler";
import ClientListFromRequestCallout from "./src/RequestCallout/ClientListFromRequestCallout";
import PropertiesListFromRequestCallout from "./src/RequestCallout/PropertiesListFromRequestCallout";
import RequestCallOut from "./src/RequestCallout/RequestCallOut";
import SelectSchedule from "./src/RequestCallout/SelectSchedule";
import Notification from "./src/Notification";

import getTheme from "./native-base-theme/components";
import commonColor from "./native-base-theme/variables/commonColor";

/** App main loading */
// Prevent native splash screen from autohiding before App component declaration
// SplashScreen.preventAutoHideAsync()
//   .then((result) => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
//   .catch(console.warn); // it's good to explicitly catch and inspect any error

export default class App extends PureComponent {
  state = {
    isReady: false,
  };

  componentDidMount() {
    LogBox.ignoreAllLogs();
  }

  render() {
    console.log({ isReady: this.state.isReady });
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={_cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.error}
        />
      );
    }
    const theme = extendTheme({
      components: {
        Button: {
          defaultProps: {
            colorScheme: "amber",
          },
        },
        Text: {
          baseStyle: {
            color: "amber.300",
          },
          defaultProps: {
            color: "amber.300",
          },
        },
      },
      config: {
        // Changing initialColorMode to 'dark'
        initialColorMode: "dark",
      },
    });
    // SplashScreen.hideAsync();
    return (
      <NhostAuthProvider auth={auth}>
        <NhostApolloProvider auth={auth} gqlEndpoint="https://hasura-8106d23e.nhost.app/v1/graphql">
          <NativeBaseProvider theme={theme}>
            <AppContainer />
            <Box ml="auto" mr={12}>
              <Text>{version}</Text>
            </Box>
          </NativeBaseProvider>
        </NhostApolloProvider>
      </NhostAuthProvider>
    );
  }
}

async function _cacheResourcesAsync() {
  return Promise.resolve();
}

/** Setting Screen */
const SettingStackNavigator = createStackNavigator(
  {
    Settings: {
      screen: Settings,
      navigationOptions: ({ navigation }) => ({
        title: "Settings",
        headerTransparent: true,
        // headerTitleStyle: {
        //   fontFamily: "serif"
        // },
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <View style={{ flexDirection: "row" }}>
              <Text> </Text>
              <Icon
              as={Ionicons}
                name="arrow-back"
                style={{ fontSize: 18, color: "#000" }}
              />
            </View>
          </TouchableOpacity>
        ),
      }),
    },
  },
  {
    initialRouteName: "Settings",
    //transitionConfig: () => fromTop(500),
  }
);
createAppContainer(SettingStackNavigator);

/** Request Callout stack navigator */
const RequestCalloutStackNavigator = createStackNavigator(
  {
    ClientListFromRequestCallout: {
      screen: ClientListFromRequestCallout,
      navigationOptions: ({ navigation }) => ({
        title: "Clients (Request Callout)",
        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            
          >
            <View style={{ flexDirection: "row", marginLeft: 20 }}>
              <Text> </Text>
              <Icon
              as={Ionicons}
                name="arrow-back"
                style={{ fontSize: 24, color: "#fff" }}
              />
            </View>
          </TouchableOpacity>
        ),
      }),
    },
    PropertiesListFromRequestCallout: {
      screen: PropertiesListFromRequestCallout,
      navigationOptions: ({ navigation }) => ({
        title: "Client Properties",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    RequestCallOut: {
      screen: RequestCallOut,
      navigationOptions: ({ navigation }) => ({
        title: "Request Callout",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    SelectSchedule: {
      screen: SelectSchedule,
      navigationOptions: ({ navigation }) => ({
        title: "Select Schedule",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
  },
  {
    initialRouteName: "ClientListFromRequestCallout",
    //transitionConfig: () => fromTop(500),
  }
);
createAppContainer(RequestCalloutStackNavigator);

/** Inventory Report Screen */
const InventoryReportStackNavigator = createStackNavigator(
  {
    ClientList: {
      screen: ClientList,
      navigationOptions: ({ navigation }) => ({
        title: "Clients (Inventory)",
        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            
          >
            <View style={{ flexDirection: "row", marginLeft: 20 }}>
              <Text> </Text>
              <Icon
              as={Ionicons}
                name="arrow-back"
                style={{ fontSize: 24, color: "#fff" }}
              />
            </View>
          </TouchableOpacity>
        ),
      }),
    },
    PropertiesList: {
      screen: PropertiesList,
      navigationOptions: ({ navigation }) => ({
        title: " Client Properties",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    InventoryReportList: {
      screen: InventoryReportList,
      navigationOptions: ({ navigation }) => ({
        title: " Inventory Reports",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    InventoryReport: {
      screen: InventoryReport,
      navigationOptions: ({ navigation }) => ({
        title: " Inventory Report",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    InventoryReportRoom: {
      screen: InventoryReportRoom,
      navigationOptions: ({ navigation }) => ({
        title: " Inventory Report Room",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    Articles: {
      screen: Articles,
      navigationOptions: ({ navigation }) => ({
        title: " Room Article",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
  },
  {
    initialRouteName: "ClientList",
    //transitionConfig: () => fromTop(500),
  }
);
createAppContainer(InventoryReportStackNavigator);

/** HomeScreen Stack Naviagtor */
const HomeScreenStackNavigator = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        headerTransparent: true,
        // headerLeft: (
        //   <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        //     <Image source={require('./assets/Home/menuicon.png')} style={{ height: 35, width: 35,marginBottom: 2,marginLeft:20,marginTop:15 }}></Image>
        //   </TouchableOpacity>

        // ),
      }),
    },
    Notification: {
      screen: Notification,
      navigationOptions: ({ navigation }) => ({
        title: "Notification",
        headerTransparent: false,
        headerTintColor: "#FFCA5D",
        headerStyle: {
          backgroundColor: '#000E1E'
        }
      }),
    },

    Job: {
      screen: Job,
      navigationOptions: ({ navigation }) => ({
        title: "Job Description",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    JobComplete: {
      screen: JobComplete,
      navigationOptions: ({ navigation }) => ({
        title: "Customer Satisfaction",
        //headerTransparent: true,
        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    JobList: {
      screen: JobsList,
      navigationOptions: ({ navigation }) => ({
        title: "Assigned Services",
        //headerTransparent: true,
        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    TicketListing: {
      screen: TicketListing,
      navigationOptions: ({ navigation }) => ({
        title: "Job Tickets",
        //headerTransparent: true,
        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    ImagePicker: {
      screen: ImagePicker,
      navigationOptions: ({ navigation }) => ({
        title: "Select Images",
        //headerTransparent: true,
        headerShown: false,
        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    CreateTicket: {
      screen: CreateTicket,
      navigationOptions: ({ navigation }) => ({
        title: "Create A Ticket ",

        //headerTransparent: true,
        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    JobSteps: {
      screen: JobsSteps,
      navigationOptions: ({ navigation }) => ({
        title: "Safety Precautions",
        //headerTransparent: true,
        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    PostJob: {
      screen: PostJob,
      navigationOptions: ({ navigation }) => ({
        title: "Post Job",
        //headerTransparent: true,
        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    PreJob: {
      screen: PreJob,
      navigationOptions: ({ navigation }) => ({
        title: "Pre Job",
        //headerTransparent: true,
        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    // ServicesHistory: {
    //   screen: ServicesHistory,
    //   navigationOptions: ({ navigation }) => ({
    //     title: "Services History",

    //     headerStyle: {
    //       backgroundColor: "#000E1E",
    //     },
    //     headerTintColor: "#fff",
    //     headerTitleStyle: {
    //       fontWeight: "bold",
    //     },
    //   }),
    // },
    ServicesHistoryItem: {
      screen: ServicesHistoryItem,
      navigationOptions: ({ navigation }) => ({
        title: "Services Details",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
    Scheduler: {
      screen: Scheduler,
      navigationOptions: ({ navigation }) => ({
        title: "Scheduler",

        headerStyle: {
          backgroundColor: "#000E1E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }),
    },
  },
  {
    initialRouteName: "Home",
  }
);
createAppContainer(HomeScreenStackNavigator);

/** Drawer navigation Conponent */
const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{ flex: 1 }}>
    <View
      style={{
        height: 150,
        backgroundColor: "white",
        marginTop: 30,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("./assets/icon4.png")}
        style={{ height: 90, width: 150, marginBottom: 4 }}
      ></Image>
    </View>
    <View
      style={{
        borderBottomColor: "#FFCA5D",
        borderBottomWidth: 1,
        marginHorizontal: 30,
        marginVertical: 15,
      }}
    ></View>

    <DrawerItems {...props}></DrawerItems>
  </SafeAreaView>
);

/**Drawer Navigator */
const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreenStackNavigator /**TO HomeScreen Stack navigator */,
      navigationOptions: {
        drawerLabel: "Home",
        // labelStyle: { fontFamily: 'serif', },
        drawerIcon: ({ tintColor }) => (
          <Icon
          as={Ionicons}
            name="md-home"
            style={{ fontSize: 24, color: tintColor }}
          />
        ),
      },
    },
    InventoryRMenu: {
      screen: InventoryReportStackNavigator,
      navigationOptions: {
        drawerLabel: "Inventory Report",
        // labelStyle: { fontFamily: 'serif', },
        drawerIcon: ({ tintColor }) => (
          <Icon
          as={Ionicons} name="folder" style={{ fontSize: 24, color: tintColor }}/>
        ),
      },
    },
    RequestCallout: {
      screen: RequestCalloutStackNavigator,
      navigationOptions: {
        drawerLabel: "Request Callout",
        // labelStyle: { fontFamily: 'serif', },
        drawerIcon: ({ tintColor }) => (
          <Icon
          as={Ionicons} name="folder" style={{ fontSize: 24, color: tintColor }}/>
        ),
      },
    },

    // Settings: {
    //   screen: SettingStackNavigator,
    //   navigationOptions: {
    //     drawerLabel: "Settings",
    //     //  labelStyle: { fontFamily: 'serif', },
    //     drawerIcon: ({ tintColor }) => (
    //       <Icon
    //       as={Ionicons}
    //         name="settings"
    //         style={{ fontSize: 24, color: tintColor }}
    //       />
    //     ),
    //   },
    // },
  },
  {
    contentComponent: CustomDrawerComponent,
    contentOptions: {
      activeTintColor: "#000E1E",
      labelStyle: {
        // fontFamily: 'serif',
        fontWeight: "300",
      },
    },
  }
);
createAppContainer(AppDrawerNavigator);

/** App start Switch navigator */
const SwithStartNavigator = createSwitchNavigator({
  AuthLogin: AuthLogin,
  Login: Login,
  AppDrawer: AppDrawerNavigator,
});

const AppContainer = createAppContainer(SwithStartNavigator);
