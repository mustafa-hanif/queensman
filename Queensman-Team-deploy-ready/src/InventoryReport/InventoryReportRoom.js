import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, Button, ScrollView, TextInput, Alert } from 'react-native';

import { Container, Header, Content, List, ListItem, Row, Icon, Col, Left, Right, Picker } from 'native-base';
import axios from 'axios';
import _ from 'lodash';

import Modal from "react-native-modal";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default class InventoryReportRoom extends React.Component {

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
            MenuSelected: "art",
            ImagesList: [
                // { imageSel: 'Devin' },
                // { imageSel: 'Jackson' },

            ],
            room_id: this.props.navigation.getParam('it', '').room_id,
            room: this.props.navigation.getParam('it', '').room,
            selectedPic: null,
            InventoryReportID: this.props.navigation.getParam('InventoryReportID', 'Something'),

        })

    }

    passItem = (item) => {
        this.props.navigation.navigate('Articles', {
            it: item,
            room_id: this.state.room_id,

        });
    }

    CreateNewArticles = () => {
        this.props.navigation.navigate('Articles', {
            room_id: this.state.room_id,

        });
    }
    componentDidMount() {
        this.subs = this.props.navigation.addListener("didFocus", async () => {
            var clientsArray = [];
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
                    if (result.data.server_response[i].rooms_and_articles.room_id == this.state.room_id)
                        clientsArray.push(result.data.server_response[i].rooms_and_articles)
                }
                //   console.log(clientsArray)
                this.setState({
                    clientList: clientsArray,
                    totalData: clientsArray,
                    StaticData: clientsArray,
                    loading: false
                }, ()=>
                {
                    console.log(this.state.clientList)
                })
                this.setState({})


            })

            link = "https://www.queensman.com/phase_2/queens_admin_Apis/fetchInventoryPicturesViaInventoryReportID.php?report_id=47"// + this.state.InventoryReportID
            console.log(link)
            axios.get(link).then((result) => {
                var picData = [];
                //  console.log(result.data.server_response)
                if (result.data.server_response != "") {
                    var arrayLeng = result.data.server_response.length
                    console.log(arrayLeng)

                    for (var i = 0; i < arrayLeng; i++) {
                        if (result.data.server_response[i].pictures.room_id == this.state.room_id) {
                            var img = { imageSel: result.data.server_response[i].pictures.picture_location }
                            picData.push(img)
                        }
                    }
                    console.log(picData)
                    this.setState({ ImagesList: picData })
                }

            })
        })
    }

    componentWillUnmount() {
        this.subs.remove();
    }
    changeselected = (value) => {
        this.setState({ MenuSelected: value })
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
    toggleGalleryEventModal = (vale) => {
        this.setState({ isPicvisible: !this.state.isPicvisible, selectedPic: vale, });
    };

    CameraSnap = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            exif: true,
            quality: 0.2
        });
        if (!result.cancelled) {
            var picList = this.state.ImagesList
            var img = { imageSel: result.uri }
            picList.push(img)
            //        console.log(picList)
            this.setState({ ImagesList: picList })
        }
    }

    RemoveImages = () => {
        var picList = []
        var len = picList.length
        this.state.ImagesList.map((data) => {

            if (data.imageSel != this.state.selectedPic) {
                picList.push(data.imageSel)
            }

        })
        this.setState({ ImagesList: picList, isPicvisible: !this.state.isPicvisible })

    }
    SaveInfo = () => {
        console.log(this.state.room)
        link = "https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryRoom.php?inventory_report_id=" + this.state.InventoryReportID + "&room=" + this.state.room
        console.log(link)
        axios.get(link).then((result) => {
            console.log(result.data)
            // if(result.data.server_response=="Successfully Submitted Inventory Report Details.")
            alert("Successfully Added Room In Inventory Report Details.");
            // else
            //  alert("Failed Submitted Inventory Report Details.");
            setTimeout(() => {
                this.props.navigation.goBack();
            }, 1000);
        })

    }
    urlToUPLOAD = async (url, link) => {
        let localUri = url
        let filename = localUri.split('/').pop();
        //    console.log(this.state.CallOutID)
        blink = "https://www.queensman.com/phase_2/queens_worker_Apis/uploadInventoryPicture_b.php?inventory_room_id=" + this.state.room_id + "&picture_location=" + filename
        console.log(blink)
        axios.get(blink).then((result) => {
            console.log(result.data)
        })
        console.log(filename)
        this.setState({
            picturename: filename
        })
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append('photo', { uri: localUri, name: filename, type });
        console.log(formData)
        console.log(link)
        return await fetch(link, {
            method: 'POST',
            body: formData,
            header: {
                'content-type': 'multipart/form-data',
            },
        }).then((result) => {
            console.log(result.data);
        })
    }
    UploadImages = () => {
        link = "https://www.queensman.com/phase_2/queens_worker_Apis/uploadInventoryPicture_a.php"
        this.state.ImagesList.map((data) => {

            console.log(data.imageSel)
            console.log(link)
            this.urlToUPLOAD(data.imageSel, link)

            // setTimeout(() => {
            //     alert("All pictures uploaded!")
            // }, 5000);

        })
    }

    render() {
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
                    <Icon name="bed" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        defaultValue={this.state.room}
                        style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}
                        placeholder='Room Name'
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={(room) => { this.setState({ room }); }}
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '20%', }}>
                    <Button

                        onPress={() => this.changeselected("art")}
                        title="    Articles   "
                        color={this.state.MenuSelected == "art" ? "#FFCA5D" : "#000E1E"}
                    />
                    <Button

                        onPress={() => this.changeselected("pic")}
                        title="   Pictures    "
                        color={this.state.MenuSelected == "pic" ? "#FFCA5D" : "#000E1E"}
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>
                {this.state.MenuSelected == "art" ?
                    <View>
                        <View style={{ paddingHorizontal: '6%', }}>
                            <Button
                                style={{ width: '100%', }}
                                onPress={() => this.CreateNewArticles()}
                                title="Add Article"
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
                        {this.state.clientList.length <= 0 ? <Text style={[styles.TextFam, { fontSize: 14, color: '#aaa', paddingTop: '3%', alignSelf: 'center' }]}>No Article Available. </Text> :
                            <View>
                                {this.state.loading ? <ActivityIndicator size='large' color="#FFCA5D" /> :
                                    <FlatList
                                        data={this.state.clientList}
                                        contentContainerStyle={{ paddingBottom: 100 }}
                                        renderItem={({ item }) =>
                                            <View>
                                                <TouchableOpacity onPress={() => this.passItem(item)}>
                                                    <View style={styles.Card}>
                                                        <Text style={[styles.TextFam, { fontSize: 15, fontWeight: 'bold', }]}>{item.type} </Text>


                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingBottom: '5%', }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Image source={require('../../assets/Home/linehis.png')} style={{ height: 20, width: 20, }}></Image>
                                                                <View style={{ flexDirection: 'column' }}>
                                                                    <Text style={[styles.TextFam, { fontSize: 10 }]}>Article ID : {item.article_id}</Text>
                                                                    <Text style={[styles.TextFam, { fontSize: 10 }]}>Description : {item.description} </Text>
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
                    </View> : <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '20%', marginBottom: 10 }}>
                            <Button

                                onPress={() => this.CameraSnap()}
                                title="Camera"
                                color="#FFCA5D"
                            />
                            <Button

                                onPress={() => this.UploadImages()}
                                title="Upload"
                                color="#FFCA5D"
                            />
                        </View>

                        <FlatList
                            data={this.state.ImagesList}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            renderItem={({ item }) =>
                                <View style={{ paddingHorizontal: '6%' }}>
                                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(item.imageSel)} >
                                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', }}>

                                            <Icon name="link" style={{ fontSize: 20, color: '#000E1E', paddingRight: "3%", }}></Icon>
                                            <Text style={{ fontSize: 13, marginBottom: '1%', color: '#000E1E' }}>Picture </Text>

                                        </View>

                                    </TouchableOpacity>


                                </View>
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />


                    </View>}
                <Modal
                    isVisible={this.state.isPicvisible}
                    onSwipeComplete={() => this.setState({ isPicvisible: false })}
                    swipeDirection={['left', 'right', 'down']}
                    onBackdropPress={() => this.setState({ isPicvisible: false })}

                >
                    <View style={[styles.GalleryEventModel, { backgroundColor: "#fff" }]}>
                        <Image
                            style={{ width: "80%", height: '80%', alignSelf: 'center' }}
                            source={{ uri: this.state.selectedPic }}
                            resizeMode={"contain"}
                        />
                        <Text> </Text>
                        <Button
                            onPress={() => this.RemoveImages()}
                            disabled={this.state.IsImageuploaded}
                            title="REMOVE IMAGE"
                            color="#FFCA5D"
                        />
                        <Text> </Text>
                        <Text> </Text>
                        <Button

                            onPress={() => this.setState({ isPicvisible: false })}
                            title="CLOSE"
                            color="#FFCA5D"
                        />


                    </View>
                </Modal>

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
    },
    GalleryEventModel: {

        //backgroundColor: '',
        padding: 22,
        //   backgroundColor: '#65061B',
        justifyContent: 'space-around',
        // alignItems: 'center',
        borderRadius: 4,
        height: '70%',
        borderColor: 'rgba(0, 0, 0, 0.1)',



    },
});