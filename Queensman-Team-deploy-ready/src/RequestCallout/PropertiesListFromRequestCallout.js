import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, AsyncStorage, TextInput } from 'react-native';

import { Container, Header, Content, List, ListItem, Row, Icon, Col, Left, Right, Button, Picker } from 'native-base';
import axios from 'axios';
import _ from 'lodash';


export default class clientList extends React.Component {

    constructor(props) {
        super(props)
        this.state = ({
            assignedCallouts: [
                { key: 'Devin' },
                { key: 'Jackson' },
                { key: 'James' },
                { key: 'Joel' },
                { key: 'John' },
                { key: 'Jillian' },
                { key: 'Jimmy' },
                { key: 'Julie' },
            ], //Ismain hayn saaray client ke ongoing callouts.
            query: '',
            loading: false,
            Id: '',
            dataAvaible: true,
            cusID: '',
            selected: "Owned",
            workerID: 1,
            TotalClient: 0,
            clientList: [],
            totalData: [],
            StaticData: [],
            clientID: this.props.navigation.getParam('it', 'Something').id,   //Taseen ye item se jo ayegi wo lagadiyo idher client id.
            clientLeasedProperties: [], //CLient ki leased properties.
            clientOwnedProperties: [], //Client ki owned properties.
            Clientdata: this.props.navigation.getParam('it', 'Something'),

        })

    }

    passItem = (item, clientID) => {
        console.log(item, clientID)
        this.props.navigation.navigate('RequestCallOut', {
            it: item, clientID
        });
    }

    async  componentDidMount() {
        var clientsArray = [];
        this.setState({ loading: true })
        // link = "https://www.queensman.com/phase_2/queens_admin_Apis/fetchClients.php"
        // console.log(link)
        // axios.get(link).then((result) => {
        //     var arrayLength = result.data.server_response.length
        //     console.log(arrayLength)
        //     this.setState({
        //         TotalClient: arrayLength
        //     })
        //     for (var i = 0; i < arrayLength; i++) {
        //         clientsArray[i] = result.data.server_response[i].clients
        //     }
        //  //   console.log(clientsArray)
        //     this.setState({
        //         clientList: clientsArray,
        //         totalData: clientsArray,
        //         StaticData: clientsArray,
        //     })
        this.setState({ loading: false })
        // })

        link = "https://www.queensman.com/phase_2/queens_client_Apis/FetchClientOwnedPropertyViaClientID.php?ID=" + this.state.clientID
        console.log(link)
        axios.get(link).then((result) => {
            var arrayLength = result.data.server_responce.length
            var properties = []
            for (var i = 0; i < arrayLength; i++) {
                var property = { property_id: result.data.server_responce[i].Client_property.property_id, address: result.data.server_responce[i].Client_property.address, type: "Owned Property", property_category: result.data.server_responce[i].Client_property.category }
                properties.push(property)
            }

            link = "https://www.queensman.com/phase_2/queens_client_Apis/FetchClientLeasedPropertiesViaClientID.php?ID=" + this.state.clientID
            console.log(link)
            axios.get(link).then((result) => {
                var arrayLength = result.data.server_responce.length

                for (var i = 0; i < arrayLength; i++) {
                    var property = { property_id: result.data.server_responce[i].lease_property.property_id, address: result.data.server_responce[i].lease_property.address, type: "Leased Property", property_category: result.data.server_responce[i].lease_property.category }
                    properties.push(property)
                }

                console.log(properties)
                this.setState({
                    clientList: properties,
                    totalData: properties,
                    StaticData: properties,
                })
            })
        })

    }

    contains = ({ property_id, address }, query) => {

        if (property_id.includes(query) || address.includes(query)) {
            return true;
        }
        return false;
    }


    searchData = text => {
        const data = _.filter(this.state.totalData, StaticData => { return this.contains(StaticData, text); })
        this.setState({ query: text, clientList: data, });

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '6%', }}>
                    <Icon name="search" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        defaultValue={this.state.search}
                        style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}
                        placeholder='Search'
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={this.searchData}
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%', paddingHorizontal: '5%' }}>Client details</Text>
                <View style={{ width: '100%', paddingHorizontal: '10%' }}>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>ID: {this.state.Clientdata.id}</Text>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>Name: {this.state.Clientdata.full_name}</Text>

                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>Phone Number: {this.state.Clientdata.phone}</Text>

                </View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '3%', paddingHorizontal: '5%' }}>Properties details</Text>
                {/* <Text style={{
                    alignSelf: 'center',
                    fontSize: 15,
                    margin: "2%",
                    color: '#000E1E',
                    fontWeight: '500'
                }}>Total Clients: {this.state.TotalClient}</Text> */}
                {this.state.clientList.length <= 0 ? <Text style={[styles.TextFam, { fontSize: 14, color: '#aaa', paddingTop: '3%', alignSelf: 'center' }]}>No Properties Listed</Text> :
                    <View>
                        {this.state.loading ? <ActivityIndicator size='large' color="#FFCA5D" /> :
                            <FlatList
                                data={this.state.clientList}
                                contentContainerStyle={{ paddingBottom: 100 }}
                                renderItem={({ item }) =>
                                    <View>
                                        <TouchableOpacity onPress={() => this.passItem(item, this.state.clientID)}>
                                            <View style={styles.Card}>

                                                <Text style={[styles.TextFam, { fontSize: 15, fontWeight: 'bold', }]}>{item.address} </Text>

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingBottom: '5%', }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Image source={require('../../assets/Home/linehis.png')} style={{ height: 20, width: 20, }}></Image>
                                                        <View style={{ flexDirection: 'column' }}>
                                                            <Text style={[styles.TextFam, { fontSize: 10 }]}>Property ID : {item.property_id}</Text>
                                                            <Text style={[styles.TextFam, { fontSize: 10 }]}>Type : {item.type}</Text>
                                                            <Text style={[styles.TextFam, { fontSize: 10 }]}>Property Category : {item.property_category}</Text>

                                                        </View>
                                                    </View>



                                                </View>

                                            </View>
                                        </TouchableOpacity>
                                        <Text>    </Text>

                                    </View>
                                }
                                keyExtractor={(item, index) => index.toString()}
                            />}
                    </View>}

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
        paddingTop: '5%',

    },
    Name: {
        marginTop: "10%",
        marginLeft: '3%',
    },
    HeadingStyle: {
        fontSize: 23,
        paddingTop: '10%',
        paddingLeft: "6%",
        color: '#FFCA5D',

        // fontFamily: 'Helvetica'
    },
    Card: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS 
        elevation: 3, // Android
        width: '90%',
        paddingHorizontal: "5%",
        paddingVertical: '5%',
        // marginBottom: '3%',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#FFF',
        borderRadius: 5,
    },
    TextFam: {
        // fontFamily: ''
    }
});