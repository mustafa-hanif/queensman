import React, { PureComponent } from 'react';
import { Text, View, SafeAreaView, Image, TouchableOpacity, Linking } from 'react-native';
import { createDrawerNavigator, DrawerItems, createSwitchNavigator, createStackNavigator, createAppContainer, } from 'react-navigation';
import { Icon } from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
//Classes import
import LoginScreen from "./src/Login/LoginScreen"
import AuthLoginCheck from "./src/Auth/AuthLoginCheck"
import HomeScreen from "./src/Home/HomeScreen"
import PropertyDetails from "./src/Property/PropertyDetails"

import GenerateReport from "./src/Report/GenerateReport"
import MonthlyStatsReport from "./src/Report/MonthlyStatsReport";
import MaterialWarrantyReport from "./src/Report/MaterialWarrantyReport";
import ContactUs from "./src/Component/ContactUs"
import Settings from "./src/Component/Settings"
import RequestCallOut from "./src/CallOut/RequestCallOut"
import CalloutHistory from "./src/CallOut/CalloutHistory"
import OngoingCallout from "./src/CallOut/OngoingCallout";
import OngoingCalloutItem from "./src/CallOut/CallotComponent/OngoingCalloutItem";
import CallOutHistoryItem from "./src/CallOut/CallotComponent/CallOutHistoryItem";
import SignupChangePassword from "./src/Login/SignupChangePassword";
import PinVerfication from "./src/Auth/PinVerfication";
import SignupContectUs from "./src/Login/SignupContectUs";
import SettingPasswordChange from "./src/Component/SettingPasswordChange";
import ForgotPassword from "./src/Login/ForgotPassword";

import Amplify from "aws-amplify"
import config from "./aws-exports"

Amplify.configure(config)

/** App main loading */

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends PureComponent {
  state = {
    fontsAreLoaded: false,
    isReady: false,
  };


  render() {
    // if (!this.state.fontsAreLoaded) {
    //   return <AppLoading />;
    // }
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <AppContainer></AppContainer>
    );
  }
  async _cacheResourcesAsync() {
    const images = [
      require('./assets/PartnerswithSkynners2.png'),
      require('./assets/Login/Queensman_logo3.png'),
      require('./assets/Login/Queensman_logo2.png'),
      require('./assets/Login/Username_field3.png'),
      require('./assets/Login/Password_field4.png'),
      require('./assets/Login/Proceed2.png'),
      require('./assets/Login/Phone.png'),
      require('./assets/Home/calloutHome.png'),
      require('./assets/Home/historyHome.png'),
      require('./assets/Home/linehis.png'),
      require('./assets/Home/mens.png'),
      require('./assets/Home/menu.png'),
      require('./assets/Home/pendingHome.png'),
      require('./assets/Home/reportHome.png'),
    ];
    //this.FontLoad();
    await Font.loadAsync({
      'Helvetica-Bold': require('./assets/Fonts/Helvetica-Bold.ttf'),
      'Helvetica': require('./assets/Fonts/Helvetica.ttf'),
      'helvetica-rounded-bold': require('./assets/Fonts/helvetica-rounded-bold-5871d05ead8de.otf'),
      'Helvetica-Oblique': require('./assets/Fonts/Helvetica-Oblique.ttf'),
    });

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }
  async FontLoad() {
    await Font.loadAsync({
      'Helvetica-Bold': require('./assets/Fonts/Helvetica-Bold.ttf'),
      'Helvetica': require('./assets/Fonts/Helvetica.ttf'),
      'helvetica-rounded-bold': require('./assets/Fonts/helvetica-rounded-bold-5871d05ead8de.otf'),
      'Helvetica-Oblique': require('./assets/Fonts/Helvetica-Oblique.ttf'),
    });

    this.setState({ fontsAreLoaded: true });
  }

}

/** Login Screen */
const LoginStackNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({

      headerTransparent: true,

    })
  },
  PinVerify: {
    screen: PinVerfication,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: '#fff',
      headerTransparent: true,

    })
  },
  SignUpChangePass: {
    screen: SignupChangePassword,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: '#fff',
      headerTransparent: true,

    })
  },
  SignUpContectUs: {
    screen: SignupContectUs,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: '#fff',
      headerTransparent: true,

    })
  },
  SelectProperty: {
    screen: PropertyDetails,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: '#fff',
      headerTransparent: true,

    })
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: '#fff',
      headerTransparent: true,

    })
  },



}, {
  initialRouteName: 'Login',
  //transitionConfig: () => fromTop(500),
})
createAppContainer(LoginStackNavigator);


/** Setting Screen */
const SettingStackNavigator = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => ({
      title: 'Settings',
      headerTransparent: true,
      headerTitleStyle: {
        fontFamily: "Helvetica"
      },
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{ flexDirection: 'row' }}>
            <Text>     </Text>
            <Icon name='arrow-back' style={{ fontSize: 24, color: '#000', }}></Icon>
          </View>
        </TouchableOpacity>

      ),


    })
  },
  SettingPasswordChange: {
    screen: SettingPasswordChange,
    navigationOptions: ({ navigation }) => ({

      headerTintColor: '#fff',
      headerTransparent: true,


    })
  },



}, {
  initialRouteName: 'Settings',
  //transitionConfig: () => fromTop(500),
})
createAppContainer(SettingStackNavigator);




/** HomeScreen Stack Naviagtor */
const HomeScreenStackNavigator = createStackNavigator({
  HomeNaviagtor: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      //  title:'ABB',

      headerTransparent: true,

    })
  },
  RequestCallOut: {
    screen: RequestCallOut,
    navigationOptions: ({ navigation }) => ({
      title: 'Request Callout',
      headerTransparent: true,
      headerTintColor: '#FFCA5D',
      headerTitleStyle: {
        fontFamily: "Helvetica"
      }

    })
  },
  CalloutHistory: {
    screen: CalloutHistory,
    navigationOptions: ({ navigation }) => ({
      //title: 'Callout History',
      headerTransparent: true,

    })
  },
  CalloutOngoing: {
    screen: OngoingCallout,
    navigationOptions: ({ navigation }) => ({
      // title: 'Callout History',
      headerTransparent: true,

    })
  },
  OngoingcalloutItem: {
    screen: OngoingCalloutItem,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: '#fff',
      headerTransparent: true,

    })
  },
  CalloutHistoryItem: {
    screen: CallOutHistoryItem,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: '#fff',
      headerTransparent: true,

    })
  },
  CalloutReportItem: {
    screen: GenerateReport,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: '#fff',
      headerTransparent: true,

    })
  },
  MonthlyStatsReport: {
    screen: MonthlyStatsReport,
    navigationOptions: ({ navigation }) => ({
      title: 'Monthly Services Reports',
      headerTintColor: '#fff',
      headerTransparent: true,


    })
  },
  MaterialWarrantyReport: {
    screen: MaterialWarrantyReport,
    navigationOptions: ({ navigation }) => ({
      title: 'Material Warranty Reports',
      headerTintColor: '#fff',
      headerTransparent: true,


    })
  }





}, {
  initialRouteName: 'HomeNaviagtor',

})
createAppContainer(HomeScreenStackNavigator);


/** Drawer navigation Conponent */
const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{ height: 150, backgroundColor: 'white', marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={require('./assets/Login/Queensman_logo2.png')} style={{ height: 90, width: 150, marginBottom: 4 }}></Image>

    </View>
    <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 1, marginHorizontal: 30, marginVertical: 15 }}></View>

    <DrawerItems {...props}></DrawerItems>
    <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: '8%', marginVertical: '0.2%' }}>
      <TouchableOpacity onPress={() => Linking.openURL('https://www.skynners.com')}>
        <Image source={require('./assets/PartnerswithSkynners2.png')} style={{ height: 35, width: 150, }}></Image>
      </TouchableOpacity>
      <Text> </Text>
    </View>
  </SafeAreaView>

)

/**Drawer Navigator */
const AppDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeScreenStackNavigator,/**TO HomeScreen Stack navigator */
    navigationOptions: {
      drawerLabel: 'Home',
      labelStyle: { fontFamily: 'Helvetica', },
      drawerIcon: ({ tintColor }) => (
        <Icon name='md-home' style={{ fontSize: 24, color: tintColor }}></Icon>
      )
    }
  },
  PropertyDetails:
  {
    screen: PropertyDetails,/**TO Property Stack navigator */
    navigationOptions: {
      drawerLabel: 'Property Details',
      labelStyle: { fontFamily: 'Helvetica', },
      drawerIcon: ({ tintColor }) => (
        <Icon name='business' style={{ fontSize: 24, color: tintColor }}></Icon>
      )
    }
  },
  ContactUs: {
    screen: ContactUs,
    navigationOptions: {
      drawerLabel: 'Contact Us Now',
      labelStyle: { fontFamily: 'Helvetica', },
      drawerIcon: ({ tintColor }) => (
        <Icon name='call' style={{ fontSize: 24, color: tintColor }}></Icon>
      ),
      headerTransparent: true,

    }
  },
  Settings: {
    screen: SettingStackNavigator,
    navigationOptions: {
      drawerLabel: 'Settings',
      labelStyle: { fontFamily: 'Helvetica', },
      drawerIcon: ({ tintColor }) => (
        <Icon name='settings' style={{ fontSize: 24, color: tintColor }}></Icon>
      )
    }
  },
}, {
  contentComponent: CustomDrawerComponent,
  contentOptions: {
    activeTintColor: '#FFCA5D',
    labelStyle: {
      fontFamily: 'Helvetica',
      fontWeight: '300'

    },
  },

})
createAppContainer(AppDrawerNavigator);


/** App start Switch navigator */
const SwithStartNavigator = createSwitchNavigator({
  AuthLogin: AuthLoginCheck,
  Login: LoginStackNavigator,
  AppDrawer: AppDrawerNavigator,

})

const AppContainer = createAppContainer(SwithStartNavigator);


