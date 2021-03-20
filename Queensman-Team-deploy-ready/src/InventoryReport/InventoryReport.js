import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, Button, AsyncStorage, TextInput, ScrollView } from 'react-native';

import { Container, Header, Content, List, ListItem, Row, Icon, Col, Left, Right, Picker } from 'native-base';
import axios from 'axios';
import _ from 'lodash';


export default class InventoryReport extends React.Component {

    constructor(props) {
        super(props)
        today = new Date();
        var dat = today.getDate()
        var year = today.getFullYear()
        var month = today.getMonth() + 1
        var dts = year + "-" + month + "-" + dat
        var date = today.toString()
        var dt = date.substring(0, 15);
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
            selectedDate: dts,
            showDate: this.props.navigation.getParam('it', '').checked_on == "" ? dt : this.props.navigation.getParam('it', '').checked_on,
            teamID: this.props.navigation.getParam('it', '').ops_team_id,
            inspectedBy: this.props.navigation.getParam('it', '').inspection_done_by,
            Summery: this.props.navigation.getParam('it', '').summary,
            PropertyID: this.props.navigation.getParam('propertyid', 'Something'),
            InventoryReportID: this.props.navigation.getParam('it', '').id
        })

    }

    passItem = (item) => {
        this.props.navigation.navigate('InventoryReportRoom', {
            it: item,
            InventoryReportID: this.state.InventoryReportID,
        });
    }
    addRoom = () => {
        this.props.navigation.navigate('InventoryReportRoom', {
            InventoryReportID: this.state.InventoryReportID,
        });
    }

    SetdateToday = () => {
        today = new Date();
        var dat = today.getDate()
        var year = today.getFullYear()
        var month = today.getMonth() + 1
        var dts = year + "-" + month + "-" + dat
        var date = today.toString()
        var dt = date.substring(0, 15);
        this.setState({
            selectedDate: dts,
            showDate: dt,
        });


    }


    async  componentWillMount() {
        this.subs = this.props.navigation.addListener("didFocus", async () => {
            var clientsArray = [];
            var roomIDs = [];
            this.setState({ loading: true })
            link = "https://www.queensman.com/phase_2/queens_admin_Apis/fetchInventoryArticlesViaInventoryReportID.php?report_id=" + this.state.InventoryReportID
            console.log(link)
            axios.get(link).then((result) => {
                var arrayLength = result.data.server_response.length
                console.log(arrayLength)
                this.setState({
                    TotalClient: arrayLength
                })
                for (var i = 0; i < arrayLength; i++) {

                    var roomsL = { "room_id": result.data.server_response[i].rooms_and_articles.room_id, "room": result.data.server_response[i].rooms_and_articles.room }
                    if (!roomIDs.includes(result.data.server_response[i].rooms_and_articles.room_id)) {
                        roomIDs.push(result.data.server_response[i].rooms_and_articles.room_id)
                        clientsArray.push(roomsL)
                    }
                    else {
                        console.log(roomsL + "this")
                    }


                }
                console.log(clientsArray)
                this.setState({
                    clientList: clientsArray,
                    totalData: clientsArray,
                    StaticData: clientsArray,
                })
                this.setState({ loading: false })
            })

        })
    }
    componentWillUnmount() {
        this.subs.remove();
    }

    contains = ({ full_name, phone, id }, query) => {

        if (full_name.includes(query) || phone.includes(query) || id.includes(query)) {
            return true;
        }
        return false;
    }


    searchData = text => {
        const data = _.filter(this.state.totalData, StaticData => { return this.contains(StaticData, text); })
        this.setState({ query: text, clientList: data, });

    }
    SaveInfo = () => {
        link = "https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryReport.php?property_id=" + this.state.PropertyID + "&ops_team_id=" + this.state.teamID + "&inspection_done_by=" + this.state.inspectedBy + "&summary=" + this.state.Summery + "&checked_on=" + this.state.selectedDate
        console.log(link)
        axios.get(link).then((result) => {
            console.log(result.data)
            if (result.data.server_response == "Successfully Submitted Inventory Report Details.")
                alert("Successfully Submitted Inventory Report Details.");
            else
                alert("Failed Submitted Inventory Report Details.");
            setTimeout(() => {
                this.props.navigation.goBack();
            }, 1000);

        })


    }

    render() {
        const { isDateTimePickerVisible, selectedDate } = this.state;
        return (
            <ScrollView style={styles.container}>
                <View style={{ paddingHorizontal: '6%', }}>
                    <Button
                        style={{ width: '100%', }}
                        onPress={() => this.SaveInfo()}
                        title="Save Information"
                        color="#FFCA5D"
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '6%', }}>
                    <Icon name="people" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        defaultValue={this.state.teamID}
                        style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}
                        placeholder='Team ID'
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={(teamID) => { this.setState({ teamID }); }}//email set
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '6%', }}>
                    <Icon name="calendar" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TouchableOpacity
                        onPress={this.SetdateToday}
                        style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}


                    >
                        <Text>{this.state.showDate} (Click to set it today)</Text>

                    </TouchableOpacity>
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '6%', }}>
                    <Icon name="clipboard" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        defaultValue={this.state.inspectedBy}
                        style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}
                        placeholder='Inspection Done By'
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={(inspectedBy) => { this.setState({ inspectedBy }); }}//email set
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '6%', }}>
                    <Icon name="document" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        defaultValue={this.state.Summery}
                        style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}
                        placeholder='Summary'
                        multiline={true}
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={(Summery) => { this.setState({ Summery }); }}//email set
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>

                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%', paddingHorizontal: '5%' }}>Rooms </Text>
                <View style={{ paddingHorizontal: '6%', }}>
                    <Button
                        style={{ width: '100%', }}
                        onPress={() => this.passItem("ss")}
                        title="Add Rooms"
                        color="#FFCA5D"
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>

                {/* <Text style={{
                    alignSelf: 'center',
                    fontSize: 15,
                    margin: "2%",
                    color: '#000E1E',
                    fontWeight: '500'
                }}>Total Clients: {this.state.TotalClient}</Text> */}
                {this.state.clientList.length <= 0 ? <Text style={[styles.TextFam, { fontSize: 14, color: '#aaa', paddingTop: '3%', alignSelf: 'center' }]}>No Inventory Available </Text> :
                    <View>
                        {this.state.loading ? <ActivityIndicator size='large' color="#FFCA5D" /> :
                            <FlatList
                                data={this.state.clientList}
                                contentContainerStyle={{ paddingBottom: 100 }}
                                renderItem={({ item }) =>
                                    <View>
                                        <TouchableOpacity onPress={() => this.passItem(item)}>
                                            <View style={styles.Card}>

                                                <Text style={[styles.TextFam, { fontSize: 15, fontWeight: 'bold', }]}>{item.room} </Text>
                                                <Text style={[styles.TextFam, { fontSize: 10 }]}>Room ID : {item.room_id}</Text>


                                            </View>
                                        </TouchableOpacity>
                                        <Text>    </Text>

                                    </View>
                                }
                                keyExtractor={(item, index) => index.toString()}
                            />}
                    </View>}

            </ScrollView>
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
        padding: 22,
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