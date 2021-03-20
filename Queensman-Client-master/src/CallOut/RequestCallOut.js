import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, NetInfo, ActivityIndicator, AsyncStorage, KeyboardAvoidingView, ScrollView, Image } from 'react-native';


import { Picker, ListItem, Row, Icon, Col, Button, Left, } from 'native-base';
import Toast from 'react-native-whc-toast'
import axios from 'axios';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient'

import Modal from "react-native-modal";
export default class RequestCallOut extends React.Component {
    constructor(props) {
        super(props)
        this.state = ({
            PropertyDetails: [],
            property_type: "",
            address: "",
            community: "",
            city: "",
            country: "",
            JobType: 'none',
            OtherJobType: '',
            Urgency: '',
            Description: '',
            to: 'aalvi@queensman.com',
            subject: 'Callout from Queensman Spades',
            message: 'Just checking hehe',
            customermessage: 'Thankyou for registering a callout.A representative from Queensman Spades will get in touch with you as soon as possible. \n'
                + 'Best regards, \n'
                + 'Queensman Spades',
            picture1: '',
            picture2: '',
            picture3: '',
            picture4: '',
            customerID: '',
            PropertyID: "",
            Email: '',
            UserName: '',
            Mobile: '',
            PropertyDetailLoading: false,
            CalloutID: '',
            loading: false,
            isPicvisible: false, //veiw image app kay lia
            connections: true,
            selectedPic: '',
            selectedNo: 0,

        })

    }
    onValueChange(value) {
        this.setState({
            JobType: value
        });
    }
    async componentWillMount() {

        this.setState({
            PropertyDetailLoading: true,
        })
        const ID = await AsyncStorage.getItem('QueensUserID'); // assign customer id here

        property_ID = await AsyncStorage.getItem('QueensPropertyID');; // assign customer id here
        const g = await AsyncStorage.getItem('Queens');
        console.log(" my" + g)

        if (property_ID == 'asd' || property_ID == g) {
            alert("Please select property first from 'Property Details' tab in the menu.");
            this.props.navigation.navigate('HomeNaviagtor')

        }
        this.setState({
            customerID: ID,
            PropertyID: property_ID,
        })
        // link = "./fetchClientProfile.php?ID=" + ID;
        link = "http://13.250.20.151/queens_client_Apis/FetchClientSinglePropertyViaPropID.php?ID=" + property_ID
        console.log(link);
        axios.get(link).then((result) => {
            console.log(result.data.server_responce);
            this.setState({ PropertyDetails: result.data.server_responce })
            console.log(this.state.PropertyDetails[0].Client_property.address)

            this.setState({
                property_type: this.state.PropertyDetails[0].Client_property.category,
                address: this.state.PropertyDetails[0].Client_property.address,
                community: this.state.PropertyDetails[0].Client_property.community,
                city: this.state.PropertyDetails[0].Client_property.city,
                country: this.state.PropertyDetails[0].Client_property.country,
                PropertyDetailLoading: false,
            })

        })
    }



    selectFromGallery = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.1
        });
        if (!result.cancelled) {
            this._uploadImage(result.uri);
        }
    }

    _uploadImage = (uri) => {
        console.log("My:" + uri)
        if (this.state.picture1 == '') {
            this.setState({
                picture1: uri
            })
            console.log(this.state.picture1)
        }
        else if (this.state.picture2 == '') {
            this.setState({
                picture2: uri
            })
            console.log(this.state.picture2)

        } else if (this.state.picture3 == '') {
            this.setState({
                picture3: uri
            })
        } else if (this.state.picture4 == '') {
            this.setState({
                picture4: uri
            })
        } else {
            alert("Please select up to 4 images.")
        }


    }

    urlToUPLOAD = async (url, link) => {
        let localUri = url
        let filename = localUri.split('/').pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append('photo', { uri: localUri, name: filename, type });

        return await fetch(link, {
            method: 'POST',
            body: formData,
            header: {
                'content-type': 'multipart/form-data',
            },
        });
    }
    toggleGalleryEventModal = (vale, no) => {
        this.setState({ isPicvisible: !this.state.isPicvisible, selectedPic: vale, selectedNo: no });
    };
    askSubmitCallout = () => {
        Alert.alert(
            "Callout Request Confirmation.",
            'Kindly click YES to submit this callout.',
            [

                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => this.submitCallout() },
            ],
            { cancelable: false },
        );
    }
    SubmittedCalloutAlert = () => {
        Alert.alert(
            "Callout Request Submitted.",
            'One of our team will be in touch shortly.',
            [

                {
                    text: 'Ok',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },

            ],
            { cancelable: false },
        );
    }



    submitCallout = async () => {

        if (this.state.picture1 == '' || this.state.Urgency == "" || this.state.JobType == 'none') {
            alert("Kindly fill all the required details.")
        }
        else {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    var JOBS = "";
                    if (this.state.OtherJobType == '') {
                        JOBS = this.state.JobType
                    } else {
                        JOBS = "Other: " + this.state.OtherJobType
                    }
                    var pic1name = ''
                    var pic2name = ''
                    var pic3name = ''
                    var pic4name = ''

                    if (this.state.picture1 != '') {
                        pic1name = this.state.picture1.split('/').pop();
                    }
                    if (this.state.picture1 != '') {
                        pic2name = this.state.picture2.split('/').pop();
                    }
                    if (this.state.picture1 != '') {
                        pic3name = this.state.picture3.split('/').pop();
                    }
                    if (this.state.picture1 != '') {
                        pic4name = this.state.picture4.split('/').pop();
                    }





                    this.setState({ loading: true })
                    link = "http://13.250.20.151/queens_client_Apis/submitCallOut.php?client_id=" + this.state.customerID + "&prop_id=" + this.state.PropertyID + "&job=" + JOBS + "&describe=" + this.state.Description + "&property_type=" + this.state.property_type + "&urg_lvl=" + this.state.Urgency + "&picture1=" + pic1name + "&picture2=" + pic2name + "&picture3=" + pic3name + "&picture4=" + pic4name
                    console.log(link);
                    axios.get(link).then(result => {
                        console.log(result.data.server_responce)

                        link = "http://13.250.20.151/queens_client_Apis/uploadPhoto.php"
                        if (this.state.picture1 != '') {
                            this.urlToUPLOAD(this.state.picture1, link)
                        }
                        if (this.state.picture2 != '') {
                            this.urlToUPLOAD(this.state.picture2, link)
                        }
                        if (this.state.picture3 != '') {
                            this.urlToUPLOAD(this.state.picture3, link)
                        }
                        if (this.state.picture4 != '') {
                            this.urlToUPLOAD(this.state.picture4, link)
                        }
                        setTimeout(() => {
                            link = "http://13.250.20.151/queens_client_Apis/fetchNewCalloutID.php?ID=" + this.state.customerID
                            console.log(link);
                            axios.get(link).then((result) => {
                                console.log(result.data.server_response[0].id);
                                this.setState({
                                    CalloutID: result.data.server_response[0].id,
                                })
                                setTimeout(() => {


                                    link = "http://13.250.20.151/queens_client_Apis/fetchClientProfile.php?ID=" + this.state.customerID
                                    console.log(link);

                                    axios.get(link).then((result) => {
                                        console.log(result.data.server_responce);
                                        this.setState({
                                            Email: result.data.server_responce.email,
                                            UserName: result.data.server_responce.full_name,
                                            Mobile: result.data.server_responce.phone,
                                        });
                                        link = "http://13.250.20.151/queens_client_Apis/sendEmail2.php?subject=" + this.state.subject + "&callout_id=" + this.state.CalloutID + "&client_id=" + this.state.customerID + "&client_name=" + this.state.UserName + "&client_email=" + this.state.Email + "&job=" + JOBS + "&description=" + this.state.Description + "&callout_urgency=" + this.state.Urgency + "&property_id=" + this.state.PropertyID + "&property_address=" + this.state.address + "&community=" + this.state.community + "&city=" + this.state.city + "&country=" + this.state.country + "&client_phone=" + this.state.Mobile
                                        console.log(link);
                                        axios.get(link).then(result => {
                                            console.log(result.data);
                                            this.SubmittedCalloutAlert();
                                            // this.refs.customToast.show('Callout Successfully Sent');
                                            this.setState({ loading: false })
                                            setTimeout(() => {
                                                this.props.navigation.navigate('HomeNaviagtor')
                                            }, 800);
                                        }).catch(error => {
                                            console.log(error);
                                            this.refs.customToast.show(error);
                                            this.setState({ loading: false })
                                        })



                                    })
                                }, 2000);
                            })
                        }, 2000);

                    }).catch(error => console.log(error));


                }
                else {
                    this.refs.customToast.show('No Internet Connection Callout failed');
                }

            });
        }
    }
    RemoveImages = () => {
        if (this.state.selectedNo == 1) {
            this.setState({
                picture1: '',
            })

        }
        else if (this.state.selectedNo == 2) {
            this.setState({
                picture2: '',
            })

        } else if (this.state.selectedNo == 3) {
            this.setState({
                picture3: '',
            })

        } else if (this.state.selectedNo == 4) {
            this.setState({
                picture4: '',
            })

        }
        this.setState({ isPicvisible: false })
    }
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
            quality: 0.2,
        });
        if (!result.cancelled) {
            this._uploadImage(result.uri);
        }
    }

    render() {
        return (

            <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'space-between', }} behavior="padding" enabled>


                <Toast ref='customToast'
                    textStyle={{
                        color: '#fff',
                    }}
                    style={{
                        backgroundColor: '#000E1E',
                    }} />
                <LinearGradient
                    colors={['#000E1E', '#001E2B', '#000E1E']}
                    style={styles.gradiantStyle}
                ></LinearGradient>
                <View style={{ paddingHorizontal: '10%', top: "13%" }}>
                    <Text style={[styles.TextFam, { color: '#FFCA5D', fontSize: 10 }]} >Callout Address</Text>
                    {!this.state.PropertyDetailLoading ?
                        <View style={{}}>
                            <Text style={[styles.TextFam, { fontSize: 16, fontWeight: 'bold', color: '#fff' }]}>{this.state.address}</Text>
                            <Text style={[styles.TextFam, { fontSize: 10, color: '#fff' }]}>{this.state.community},{this.state.city},{this.state.country}</Text>
                        </View> : <Text style={[styles.TextFam, { fontSize: 20, fontWeight: 'bold', color: '#fff' }]}>Loading please wait...</Text>
                    }
                    <View style={{ height: "2%" }}></View>
                </View>


                <View style={styles.Card}>
                    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                        <Text style={[styles.TextFam, { color: '#000E1E', fontSize: 16, }]}>Job Type</Text>

                        <View style={styles.PickerStyle}>
                            <Picker
                                note
                                mode="dialog"
                                onValueChange={this.onValueChange.bind(this)}
                                selectedValue={this.state.JobType}
                                itemStyle={{ fontSize: 30, fontFamily: 'Helvetica' }}
                                style={{}}

                            >
                                <Picker.Item label="Select" value="none" />
                                <Picker.Item label="AC" value="AC" />
                                <Picker.Item label="Plumbing" value="Plumbing" />
                                <Picker.Item label="Electric" value="Electric" />
                                <Picker.Item label="Woodworks" value="Woodworks" />
                                <Picker.Item label="Paintworks" value="Paintworks" />
                                <Picker.Item label="Masonry" value="Masonry" />
                                <Picker.Item label="Other" value="other" />
                            </Picker>

                        </View>

                        {this.state.JobType == 'other' ? <View style={{ paddingTop: '3%' }}>
                            <View style={styles.OthertxtStyle}>
                                <TextInput
                                    ref="textInputMobile"
                                    style={{ fontSize: 14, fontFamily: 'Helvetica' }}
                                    placeholder='Type other here....'
                                    underlineColorAndroid="transparent"
                                    numberOfLines={1}
                                    onChangeText={(OtherJobType) => { this.setState({ OtherJobType }); }}
                                />
                            </View>

                        </View> : null}
                        <View style={{ height: "3%" }}></View>
                        <Text style={[styles.TextFam, { color: '#000E1E', fontSize: 16, }]}>Urgency</Text>
                        <View style={{ height: "2%" }}></View>
                        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: '5%' }}>
                            <TouchableOpacity
                                style={styles.circle}
                                onPress={() => this.setState({ Urgency: 'high' })} // we set our value state to key
                            >
                                {this.state.Urgency == 'high' ? <View style={styles.checkedCircle}></View> : null}
                            </TouchableOpacity>

                            <Text style={[styles.TextFam, { paddingLeft: '2%', paddingRight: '3%', fontSize: 14 }]}>High</Text>
                            <Icon name='flag' style={{ fontSize: 24, color: 'red', paddingRight: '20%' }}></Icon>
                            <TouchableOpacity
                                style={styles.circle}
                                onPress={() => this.setState({ Urgency: 'medium' })} // we set our value state to key
                            >
                                {this.state.Urgency == 'medium' ? <View style={styles.checkedCircle}></View> : null}
                            </TouchableOpacity>
                            <Text style={[styles.TextFam, { paddingLeft: '2%', paddingRight: '3%', fontSize: 14 }]}>Medium</Text>
                            <Icon name='flag' style={{ fontSize: 24, color: '#FFCA5D', paddingRight: '6%' }}></Icon>
                        </View>
                        <View style={{ height: "3%" }}></View>
                        <Text style={[styles.TextFam, { color: '#000E1E', fontSize: 16, }]}>Description</Text>
                        <View style={{ height: "2%" }}></View>
                        <View style={styles.DestxtStyle}>
                            <TextInput
                                ref="textInputMobile"
                                style={{ fontSize: 14, color: '#8c8c8c', width: '90%', fontFamily: 'Helvetica', paddingTop: '2%' }}
                                placeholder='Type description here ....'
                                placeholderTextColor='#8c8c8c'
                                multiline={true}
                                numberOfLines={1}
                                underlineColorAndroid="transparent"
                                onChangeText={(Description) => { this.setState({ Description }); }}//email set
                            />
                        </View>
                        <View style={{ height: "3%" }}></View>
                        <Text style={[styles.TextFam, { color: '#000E1E', fontSize: 16, }]}>Images</Text>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>

                            <TouchableOpacity style={styles.ImageSelectStyle} onPress={this.CameraSnap}>
                                <Text style={[styles.TextFam, { color: '#000E1E', fontSize: 10, }]}>          Camera            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ImageSelectStyle} onPress={this.selectFromGallery}>
                                <Text style={[styles.TextFam, { color: '#000E1E', fontSize: 10, }]}> Select Images From Gallery </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: "2%" }}></View>
                        <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.picture1, 1)} disabled={this.state.picture1 == '' ? true : false}>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', }}>

                                    <Icon name="link" style={{ fontSize: 20, color: (this.state.picture1 == '' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                                    <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.picture1 == '' ? '#aaa' : '#000E1E') }}>Picture 1</Text>

                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.picture2, 2)} disabled={this.state.picture2 == '' ? true : false}>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                    <Icon name="link" style={{ fontSize: 20, color: (this.state.picture2 == '' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                                    <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.picture2 == '' ? '#aaa' : '#000E1E') }}>Picture 2</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: "1%" }}></View>
                        <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.picture3, 3)} disabled={this.state.picture3 == '' ? true : false}>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                    <Icon name="link" style={{ fontSize: 20, color: (this.state.picture3 == '' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                                    <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.picture3 == '' ? '#aaa' : '#000E1E') }}>Picture 3</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.picture4, 4)} disabled={this.state.picture4 == '' ? true : false}>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                    <Icon name="link" style={{ fontSize: 20, color: (this.state.picture4 == '' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                                    <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.picture4 == '' ? '#aaa' : '#000E1E') }}>Picture 4</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={{ height: "5%" }}></View>
                        <TouchableOpacity style={styles.SubmitCallout} onPress={() => this.askSubmitCallout()}>
                            {this.state.loading ? <ActivityIndicator size='large' color="#fff" style={{ alignSelf: 'center' }} /> : <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Helvetica', alignSelf: 'center' }}>Submit Callout</Text>}
                        </TouchableOpacity>
                        <View style={{ height: 100 }}></View>
                    </ScrollView>
                </View>


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
                            resizeMode='contain'
                        />
                        <Text> </Text>


                        <TouchableOpacity onPress={() => this.RemoveImages()}>
                            <View style={styles.ButtonSty}><Text style={{ fontWeight: 'bold', color: '#ffff', fontSize: 15 }}>Remove Image</Text></View>
                        </TouchableOpacity>
                        <Text> </Text>
                        <Text> </Text>

                        <TouchableOpacity onPress={() => this.setState({ isPicvisible: false })}>
                            <View style={styles.ButtonSty}><Text style={{ fontWeight: 'bold', color: '#ffff', fontSize: 15 }}>Close</Text></View>
                        </TouchableOpacity>



                    </View>
                </Modal>


            </KeyboardAvoidingView >

        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',


    },
    gradiantStyle: {
        width: '100%',
        height: "100%",
        position: 'absolute',
        alignSelf: 'center',
    },
    RowFlex: {
        flexDirection: 'row',
        paddingLeft: '10%',
    },
    ColFlex: {
        flexDirection: 'column',
        paddingLeft: '10%',
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ACACAC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#FFCA5D',
    },
    Card: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS 
        elevation: 1, // Android
        width: '100%',
        height: '72%',
        alignSelf: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#FFF',
        paddingHorizontal: '10%',
        paddingVertical: 15
    },
    TextFam: {
        fontFamily: 'Helvetica'
    },
    ButtonSty: {
        backgroundColor: "#FFCA5D",
        //  borderRadius: 20,
        alignSelf: 'center',
        width: '90%',
        // justifyContent: 'center',
        alignItems: 'center',
        // height:'25%'
        paddingVertical: '3%',

    },
    GalleryEventModel: {

        //backgroundColor: '',
        padding: 22,
        //   backgroundColor: '#65061B',
        justifyContent: 'space-around',
        // alignItems: 'center',
        borderRadius: 4,
        height: '80%',
        borderColor: 'rgba(0, 0, 0, 0.1)',

    },
    PickerStyle: {
        width: '100%',
        height: 28,
        backgroundColor: "#FFCA5D",
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS 
        elevation: 1, // Android
        borderRadius: 5,
        justifyContent: 'center',


    },
    OthertxtStyle: {
        width: '100%',
        height: 28,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#FFCA5D',
        backgroundColor: '#eeeeee',
        paddingHorizontal: '3%'


    },
    DestxtStyle: {
        width: '100%',
        height: 65,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#FFCA5D',
        backgroundColor: '#eeeeee',
        paddingHorizontal: '3%'
    },
    ImageSelectStyle: {
        height: 25,
        paddingHorizontal: '2%',
        backgroundColor: "#FFCA5D",
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS 
        elevation: 1, // Android
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    SubmitCallout: {
        height: 38,
        width: "100%",
        backgroundColor: "#001E2B",
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS 
        elevation: 1, // Android
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
