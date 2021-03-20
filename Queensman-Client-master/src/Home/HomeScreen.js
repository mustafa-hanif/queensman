import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, NetInfo, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient'
let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height
import Toast from 'react-native-whc-toast'


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = ({

      connections: true,

    })

  }


  async componentWillMount() {
    const PropID = await AsyncStorage.getItem('QueensPropertyID'); // assign customer id here
    const g = await AsyncStorage.getItem('Queens');


    if (PropID == 'asd' || PropID == g) {
      alert("Please select property first from 'Property Details' tab in the menu.");


    }

  }
  requestCallOutPress = () => {
    var time = new Date().getHours()
    console.log(time)
    if (time >= 19 || time < 8) {
      alert("During off timings i.e. 07:00 PM - 08:00 AM, please make sure you Call/WhatsApp us at one of these numbers after you have submitted the callout for our urgent response\n1. Ojong +971 54 996 4421\n2. Julius +971 54 996 5925\n3. Faizan +971 55 380 5827")
    }

    this.props.navigation.navigate('RequestCallOut')

  }

  onGoingCallOutPress = () => {
    this.props.navigation.navigate('CalloutOngoing')


  }
  CallOutHistoryPress = () => {

    this.props.navigation.navigate('CalloutHistory')

  }

  CallOutReportPress = () => {
    this.props.navigation.navigate('CalloutReportItem')


  }

  render() {

    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ connections: isConnected ? true : false })
    });
    return (
      <View style={styles.container}>
        <Toast ref='customToast'
          textStyle={{
            color: '#fff',
          }}
          style={{
            backgroundColor: '#FFCA5D',
          }} />
        {/* background gradinet   */}
        <LinearGradient
          colors={['#000E1E', '#001E2B', '#000E1E']}
          style={styles.gradiantStyle}
        ></LinearGradient>

        <View style={styles.Name}>
          <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
            <Image source={require('../../assets/Home/menu.png')} style={{ height: 25, width: 25, }}></Image>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', paddingTop: "7%" }}>
            <Image source={require('../../assets/Login/Queensman_logo3.png')} style={{ height: 50, width: 50, }}></Image>
            <View style={{ flexDirection: 'column', width: '100%', }}>
              <Text style={[{ fontSize: 18, color: '#FFCA5D' }, styles.TextStyles]}>  Property Maintenance...</Text>
              <Text style={[{ fontSize: 18, color: '#FFCA5D', }, styles.TextStyles]}>                 Perfectly Managed!</Text>
            </View>
          </View>
        </View>
        <View style={{ height: '10%' }}></View>
        {this.state.connections ?
          <View animation="fadeInUpBig" iterationCount={1} duration={1000} style={{ flex: 1 }}>
            <View style={[styles.bottomView]}>

              <TouchableOpacity style={{ flex: 1 }} onPress={this.requestCallOutPress} >
                <View style={[styles.button,]}>
                  <Image source={require('../../assets/Home/calloutHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Request</Text>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E' }, styles.TextStyles]}>Callout</Text>
                </View>
              </TouchableOpacity>
              <Text>     </Text>
              <TouchableOpacity style={{ flex: 1 }} onPress={this.onGoingCallOutPress} >
                <View style={styles.button}>
                  <Image source={require('../../assets/Home/pendingHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Scheduled</Text>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E' }, styles.TextStyles]}>Services</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ height: '3%' }}></View>
            <View style={[styles.bottomView]}>

              <TouchableOpacity style={{ flex: 1 }} onPress={this.CallOutHistoryPress} >
                <View style={styles.button}>
                  <Image source={require('../../assets/Home/historyHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Services</Text>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E' }, styles.TextStyles]}>History</Text>
                </View>
              </TouchableOpacity>
              <Text>     </Text>
              <TouchableOpacity style={{ flex: 1 }} onPress={this.CallOutReportPress} >
                <View style={styles.button}>
                  <Image source={require('../../assets/Home/reportHome.png')} style={{ height: 40, width: 40, alignSelf: 'center', }}></Image>
                  <Text style={[{ alignSelf: 'center', fontSize: 12, color: '#000E1E', marginTop: '4%' }, styles.TextStyles]}>Reports</Text>

                </View>
              </TouchableOpacity>


            </View>


          </View> :
          <Animatable.View animation="zoomIn" iterationCount={1} style={styles.NoInternetCard}>
            <Text style={{ fontSize: 24, paddingHorizontal: 20, color: '#FFCA5D' }}>No Internet</Text>
            <Text style={{ fontSize: 10, paddingTop: 30, paddingHorizontal: 20 }}>Queensmen Spades App require internet connection.</Text>
          </Animatable.View>

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

    paddingHorizontal: '5%',
  },
  TextStyles: {

    shadowColor: 'rgba(0,0,0, .4)', // IOS
    textShadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS 
    elevation: 3, // Android
    fontFamily: 'Helvetica'

  },
  bottomView: {
    // shadowColor: 'rgba(0,0,0, .4)', // IOS
    // shadowOffset: { height: 1, width: 1 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS 
    // elevation: 3, // Android
    flex: 0.5,
    //   backgroundColor: 'rgba(255, 204, 89, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    //marginTop: '10%'
    paddingHorizontal: '10%',



  },
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
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS 
    elevation: 2, // Android
    width: '90%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignSelf: 'center'


  },
});
