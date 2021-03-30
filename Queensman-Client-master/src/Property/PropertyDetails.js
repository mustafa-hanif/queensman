import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
  

import { ListItem, Icon, Picker } from 'native-base';

import Toast from 'react-native-whc-toast'
import axios from 'axios';



export default class PropertyDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({
      leasedPropertyData: [],
      OwnedPropertyData: [],    //Ismain store horahi hayn client ki property details yahan se daaldio usmain.
      loading: false,
      taped: '',
      selected: "Owned",
      PropertyData: [],
      LeasedDataAvaible: true,
      OwnedDataAvaible: true,
      cusID: '',
    })

  }
  onValueChange(value) {
    this.setState({
      selected: value
    });

  }
  Ontaps = (item) => {
    this.refs.customToast.show('New Property Selected');

    console.log(item.Client_property.property_id)
    this._storeData(item.Client_property.property_id, "owned", item.Client_property.country)


  }
  Ontaps2 = (item) => {
    this.refs.customToast.show('New Property Selected');

    console.log(item.lease_property.property_id)
    this._storeData(item.lease_property.property_id, "leased", item.lease_property.country)


  }

  _storeData = async (id, type, country) => {

    try {
      await AsyncStorage.setItem('QueensPropertyID', id);
      await AsyncStorage.setItem('QueensPropertyType', type);
      await AsyncStorage.setItem('QueensPropertyCountry', country);
      setTimeout(() => {
        this.props.navigation.navigate('HomeNaviagtor')
      }, 800);
    } catch (error) {
      // Error saving data
    }

  }
  async  componentDidMount() {
    this.setState({
      loading: true,
    })
    // fetch customer orrder list
    const ID = await AsyncStorage.getItem('QueensUserID'); // assign customer id here
    this.setState({
      cusID: ID,
    })
    link = "http://13.250.20.151/queens_client_Apis/FetchClientOwnedPropertyViaClientID.php?ID=" + ID
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data)
      if (result.data.server_responce == -1) {

        this.setState({
          loading: false,
          OwnedDataAvaible: false,
        })
      }
      else {
        this.setState({ OwnedPropertyData: result.data.server_responce, })
        //console.log(this.state.onGoingCallouts)
        this.setState({
          loading: false,
          OwnedDataAvaible: true,
        })
      }

    })
    link = "http://13.250.20.151/queens_client_Apis/FetchClientLeasedPropertiesViaClientID.php?ID=" + ID
    console.log(link);
    axios.get(link).then((result) => {
      console.log(result.data)
      if (result.data.server_responce == -1) {

        this.setState({
          loading: false,
          LeasedDataAvaible: false,
        })
      }
      else {
        this.setState({ leasedPropertyData: result.data.server_responce })
        //console.log(this.state.onGoingCallouts)
        this.setState({
          loading: false,
          LeasedDataAvaible: true,
        })
      }




    })
  }

  _refresh = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // fetch customer orrder list
        const ID = this.state.cusID// assign customer id here
        link = "http://13.250.20.151/queens_client_Apis/FetchClientOwnedPropertyViaClientID.php?ID=" + ID
        console.log(link);
        axios.get(link).then((result) => {
          console.log(result.data)
          if (result.data.server_responce == -1) {

            this.setState({
              loading: false,
              OwnedDataAvaible: false,
            })
          }
          else {
            this.setState({ OwnedPropertyData: result.data.server_responce, })
            //console.log(this.state.onGoingCallouts)
            this.setState({
              loading: false,
              OwnedDataAvaible: true,
            })
          }

        })
        link = "http://13.250.20.151/queens_client_Apis/FetchClientLeasedPropertiesViaClientID.php?ID=" + ID
        console.log(link);
        axios.get(link).then((result) => {
          console.log(result.data)
          if (result.data.server_responce == -1) {

            this.setState({
              loading: false,
              LeasedDataAvaible: false,
            })
          }
          else {
            this.setState({ leasedPropertyData: result.data.server_responce })
            //console.log(this.state.onGoingCallouts)
            this.setState({
              loading: false,
              LeasedDataAvaible: true,
            })
          }
        })
        resolve()
      }, 2000)
    });
  }




  render() {




    return (

      <View style={styles.container}>
        <Text style={{ paddingTop: "5%" }}>   </Text>

        <Toast ref='customToast'
          textStyle={{
            color: '#fff',
          }}
          style={{
            backgroundColor: '#FFCA5D',
          }} />

        <Text style={styles.HeadingStyle}>Property Details</Text>
        <Text style={[styles.TextFam, { fontSize: 14, color: '#aaa', paddingTop: '2%', paddingLeft: '4%' }]}>Tap to select the property</Text>
        <Text>  </Text>

        <View style={{ paddingHorizontal: '5%', flexDirection: 'column' }}>
          <Text style={[styles.TextFam, { fontSize: 10, color: '#FFCA5D', }]}>Select Property Type:</Text>
          <Picker
            note
            mode="dialog"
            style={{ paddingTop: '2%', }}
            itemStyle={{ fontFamily: 'Helvetica' }}
            selectedValue={this.state.selected}
            onValueChange={this.onValueChange.bind(this)}
          >
            <Picker.Item label="Owned Properties" value="Owned" />
            <Picker.Item label="Leased Properties" value="Leased" />

          </Picker>
        </View>
        <Text>  </Text>
        <Text>  </Text>
        {this.state.loading ? <ActivityIndicator size='large' color="#FFCA5D" /> :

          <View>
            {this.state.selected == 'Owned' ?
              <View>
                {!this.state.OwnedDataAvaible ? <Text style={[styles.TextFam, { fontSize: 14, color: '#aaa', paddingTop: '3%', alignSelf: 'center' }]}>No Owned Property</Text> :

                  <FlatList
                    data={this.state.OwnedPropertyData}
                    renderItem={({ item }) =>
                      <View>
                        <TouchableOpacity onPress={() => this.Ontaps(item)}>
                          <View style={styles.Card}>



                            <Text style={[styles.TextFam, { fontSize: 15, fontWeight: 'bold', paddingLeft: '5%', paddingTop: '3%' }]}>{item.Client_property.address} </Text>
                            <Text style={[styles.TextFam, { fontSize: 10, color: '#aaa', paddingLeft: '5%', paddingTop: '1%' }]}>{item.Client_property.community},{item.Client_property.city}</Text>

                            <ListItem>
                              <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                                <Text style={styles.TextFam}>{item.Client_property.country}</Text>
                                <Text style={styles.TextFam}>Property ID: {item.Client_property.property_id}</Text>

                                <Text style={styles.TextFam}>Property Category: {item.Client_property.category ? item.Client_property.category : "Not Listed"}</Text>

                              </View>
                            </ListItem>

                          </View>
                        </TouchableOpacity>
                        <Text> </Text>
                        {this.state.taped == item.Client_property.property_id ?
                          <View style={{ position: 'absolute', paddingLeft: '8%', paddingTop: '10%' }}>
                            <Icon name="checkmark-circle" style={{ height: 50, width: 50, color: '#FFCA5D' }}></Icon>
                          </View> : <View></View>}
                      </View>
                    }
                    keyExtractor={(item, index) => index.toString()}
                  />}</View> :
              <View>
                {!this.state.LeasedDataAvaible ? <Text style={[styles.TextFam, { fontSize: 14, color: '#aaa', paddingTop: '3%', alignSelf: 'center' }]}>No Leased Property</Text> :
                  <FlatList
                    data={this.state.leasedPropertyData}
                    renderItem={({ item }) =>
                      <View>
                        <TouchableOpacity onPress={() => this.Ontaps2(item)}>
                          <View style={styles.Card}>



                            <Text style={[styles.TextFam, { fontSize: 15, fontWeight: 'bold', paddingLeft: '5%', paddingTop: '3%' }]}>{item.lease_property.address} </Text>
                            <Text style={[styles.TextFam, { fontSize: 10, color: '#aaa', paddingLeft: '5%', paddingTop: '1%' }]}>{item.lease_property.community},{item.lease_property.city}</Text>

                            <ListItem>
                              <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                                <Text style={styles.TextFam}>{item.lease_property.country}</Text>
                                <Text style={styles.TextFam}>Property ID: {item.lease_property.property_id}</Text>
                                <Text style={styles.TextFam}>Property Category: {item.lease_property.category ? item.Client_property.category : "Not Listed"}</Text>
                              </View>
                            </ListItem>

                          </View>
                        </TouchableOpacity>
                        <Text> </Text>
                        {this.state.taped == item.lease_property.property_id ?
                          <View style={{ position: 'absolute', paddingLeft: '8%', paddingTop: '10%' }}>
                            <Icon name="checkmark-circle" style={{ height: 50, width: 50, color: '#FFCA5D' }}></Icon>
                          </View> : <View></View>}
                      </View>
                    }
                    keyExtractor={(item, index) => index.toString()}
                  />}</View>}
          </View>

        }

      </View>

    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  Name: {
    marginTop: "10%",
    marginLeft: '3%',
  },
  HeadingStyle: {
    fontSize: 23,
    paddingTop: '6%',
    paddingLeft: "4%",
    color: '#FFCA5D',

    fontFamily: 'Helvetica'
  },
  Card: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS 
    elevation: 3, // Android
    width: '90%',

    // marginBottom: '3%',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  TextFam: {
    fontFamily: 'Helvetica'
  }
});
