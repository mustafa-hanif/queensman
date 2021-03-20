import React from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, Alert, Image, TouchableOpacity, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Content, Icon } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient'
let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height



export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = ({
      connections: true,
    })

  }

  componentDidMount() {
    console.log("componentDidMount");
  }

  AssignCalloutHandler = () => {
    console.log(this.props.navigation)
    this.props.navigation.navigate('JobList')
  }

  ServicesHistoryHandler = () => {
    this.props.navigation.navigate('ServicesHistory')
  }

  ScheduleHandler = () => {
    this.props.navigation.navigate('Scheduler')
  }

  InventoryReportHandler = () => {
    this.props.navigation.navigate('ClientList')
  }

  RequestCalloutHandler = () => {
    this.props.navigation.navigate('ClientListFromRequestCallout')
  }

  AlertLogout = () => {
    Alert.alert(
      "Logout.",
      "Are you sure you want to logout?",
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.logout() },
      ],
      { cancelable: false },
    );
  }

  logout = async () => {
    try {
      await AsyncStorage.setItem('QueensmanWorkerID', "asd");
      setTimeout(() => {
        this.props.navigation.navigate('Login')
      }, 500);
    } catch (error) {
      // Error saving data
    }
  }

  render() {
    console.log("render")
    // NetInfo.fetch().then(isConnected => {
    //   this.setState({ connections: isConnected ? true : false })
    // });
    return (
      <View style={styles.container}>

        {/* background gradinet   
        <LinearGradient
          colors={['#000E1E', '#001E2B', '#000E1E']}
          style={styles.gradiantStyle}
        ></LinearGradient>
        */}

        <View style={styles.Name}>
          <TouchableOpacity onPress={() => this.AlertLogout()}>
            <Icon name="power" style={{ fontSize: 25, color: '#FFCA5D', }}></Icon>
            {/* <Image source={require('../assets/Home/menu.png')} style={{ height: 25, width: 25, }}></Image> */}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', paddingTop: "7%" }}>
            <Image source={require('../assets/Login/Queensman_logo3.png')} style={{ height: 50, width: 50, }}></Image>
            <View style={{ flexDirection: 'column', width: '100%', }}>
              <Text style={[{ fontSize: 18, color: '#FFCA5D' }, styles.TextStyles]}>  Property Maintenance...</Text>
              <Text style={[{ fontSize: 18, color: '#FFCA5D', }, styles.TextStyles]}> Perfectly Managed!</Text>
            </View>
          </View>
        </View>
        <View style={{ height: '10%' }}></View>
        {this.state.connections ?

          <View style={[{ flex: 1, flexDirection: 'column', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: '2%' }]}>
            <View style={[{ width: deviceWidth - deviceWidth / 8, flex: 1, flexDirection: 'row' }]}>
              <TouchableOpacity style={{ flex: 1, paddingRight: '2%' }} onPress={this.AssignCalloutHandler} >
                <View style={[styles.button]}>
                  <Image source={require('../assets/Home/calloutHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Assigned</Text>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E' }, styles.TextStyles]}>Services</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={this.ScheduleHandler} >
                <View style={[styles.button]}>
                  <Image source={require('../assets/Home/calloutHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Scheduler</Text>

                </View>
              </TouchableOpacity>
            </View>
            <View style={{ height: '3%' }}></View>

            <View style={[{ width: deviceWidth - deviceWidth / 8, flex: 1, flexDirection: 'row' }]}>
              <TouchableOpacity style={{ flex: 1, paddingRight: '2%' }} onPress={this.ServicesHistoryHandler} >
                <View style={styles.button}>
                  <Image source={require('../assets/Home/pendingHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Services</Text>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E' }, styles.TextStyles]}>History</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={this.InventoryReportHandler} >
                <View style={styles.button}>
                  <Image source={require('../assets/Home/pendingHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Inventory</Text>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E' }, styles.TextStyles]}>Report</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ height: '3%' }}></View>
            <TouchableOpacity style={{ width: deviceWidth - deviceWidth / 8, flex: 1 }} onPress={this.RequestCalloutHandler} >
              <View style={styles.button}>
                <Image source={require('../assets/Home/pendingHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
                <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Request Callout</Text>
              </View>
            </TouchableOpacity>

          </View>

          // <View style={[styles.bottomView]}>
          //   <TouchableOpacity style={{ flex: 1 }} onPress={this.AssignCalloutHandler} >
          //     <View style={[styles.button,]}>
          //       <Image source={require('../assets/Home/calloutHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
          //       <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Assigned</Text>
          //       <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E' }, styles.TextStyles]}>Services</Text>
          //     </View>
          //   </TouchableOpacity>
          //   <Text>     </Text>
          //   <TouchableOpacity style={{ flex: 1 }} onPress={this.ServicesHistoryHandler} >
          //     <View style={styles.button}>
          //       <Image source={require('../assets/Home/pendingHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
          //       <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Services</Text>
          //       <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E' }, styles.TextStyles]}>History</Text>
          //     </View>
          //   </TouchableOpacity>
          // </View>

          :
          <View style={styles.NoInternetCard}>
            <Text style={{ fontSize: 24, paddingHorizontal: 20, color: '#FFCA5D' }}>No Internet</Text>
            <Text style={{ fontSize: 10, paddingTop: 30, paddingHorizontal: 20, color: '#fff' }}>Queensmen Spades App require internet connection.</Text>
          </View>

        }



      </View >
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
    paddingVertical: '10%',
    // justifyContent: 'center'
  },
  Name: {
    marginTop: "13%",
    width: '100%',
    paddingHorizontal: '5%',
  },
  TextStyles: {

    shadowColor: 'rgba(0,0,0, .4)', // IOS
    textShadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS 
    elevation: 3, // Android
    // fontFamily: 'serif'

  },
  bottomView: {
    // shadowColor: 'rgba(0,0,0, .4)', // IOS
    // shadowOffset: { height: 1, width: 1 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS 
    // elevation: 3, // Android
    flex: 1,
    //   backgroundColor: 'rgba(255, 204, 89, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignContent: 'flex-start',
    flexDirection: 'column',
    //marginTop: '10%'
    paddingHorizontal: '30%'

  },
  // externalContainer: {
  //   flex: 1,
  //   flexDirection: 'row'
  // },
  button: {
    shadowColor: 'rgba(255,255,255, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS 
    elevation: 3, // Android
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFCA5D',

  },
  gradiantStyle: {
    width: deviceWidth,
    height: deviceHeight,
    position: 'absolute',
    alignSelf: 'center',
  },
  NoInternetCard: {
    // shadowColor: 'rgba(0,0,0, .4)', // IOS
    // shadowOffset: { height: 1, width: 1 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS 
    // elevation: 2, // Android
    width: '90%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#FFF',
    borderRadius: 10,
    alignSelf: 'center'


  },
});