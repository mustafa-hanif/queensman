/* eslint-disable react/prop-types */
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, KeyboardAvoidingView, TextInput, Button, Alert, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";

import { Content, Icon } from 'native-base';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';


export default class PostJob extends React.Component {

    constructor(props) {
        super(props)
        this.state = ({
            solution: '',
            Pic1: "link",
            Pic2: "link",
            Pic3: "link",
            Pic4: "link",
            Pic5: "link",
            Pic6: 'link',
            Pic7: "link",
            Pic8: 'link',
            Pic9: 'link',
            Pic10: 'link',
            picturename: '',
            CallOutID: this.props.navigation.getParam('QJobID', 'Something'),
            selectedPic: "https://en.wikipedia.org/wiki/Art#/media/File:Art-portrait-collage_2.jpg",
            isPicvisible: false, //veiw image app kay lia
            IsImageuploaded: false,
            selectedNo: 0,
            ViewOpacity: 1,
            workerID: 1,

        })

    }


    async componentDidMount() {
        const WorkerID = await AsyncStorage.getItem('QueensmanWorkerID'); // assign customer id here
        this.setState({ workerID: WorkerID })
    }

    toggleGalleryEventModal = (vale, no) => {
        this.setState({ isPicvisible: !this.state.isPicvisible, selectedPic: vale, selectedNo: no });
    };




    PostJobHandler = () => {
        if (this.state.solution == "") {
            alert("Please type solution first!")
        } else if (this.state.IsImageuploaded == false) {
            alert("Please upload image first!")
        } else {
       

                this.props.navigation.navigate('JobComplete', {
                    QJobID: this.state.CallOutID,
                    Sol:this.state.solution,
                    workerId:this.state.workerID
                });

         
        }

    }
    AlertPostJobHandler = () => {
        Alert.alert(
            "Proceed.",
            "Are you sure you want to proceed?",
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => this.PostJobHandler() },
            ],
            { cancelable: false },
        );

    }

    AlertUploadImage = () => {
        Alert.alert(
            "Upload Images.",
            "Are you sure you want to upload the selected images?",
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => this.UploadImage() },
            ],
            { cancelable: false },
        );

    }

    SelectImages = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            quality:0.1
        });
        if (!result.cancelled) {
            this._uploadImage(result.uri);
        }

    }
    UploadImage = () => {
        if (this.state.Pic1 != 'link') {
ls
            if (this.state.Pic1 != "link") {
                this.urlToUPLOAD(this.state.Pic1, link)

            }
            if (this.state.Pic2 != "link") {
                this.urlToUPLOAD(this.state.Pic2, link)
            }
            if (this.state.Pic3 != "link") {
                this.urlToUPLOAD(this.state.Pic3, link)
            }
            if (this.state.Pic4 != "link") {
                this.urlToUPLOAD(this.state.Pic4, link)
            }
            if (this.state.Pic5 != "link") {
                this.urlToUPLOAD(this.state.Pic5, link)
            }
            if (this.state.Pic6 != "link") {
                this.urlToUPLOAD(this.state.Pic6, link)
            }
            if (this.state.Pic7 != "link") {
                this.urlToUPLOAD(this.state.Pic7, link)
            }
            if (this.state.Pic8 != "link") {
                this.urlToUPLOAD(this.state.Pic8, link)
            }
            if (this.state.Pic9 != "link") {
                this.urlToUPLOAD(this.state.Pic9, link)
            }
            if (this.state.Pic10 != "link") {
                this.urlToUPLOAD(this.state.Pic10, link)
            }
            this.setState({ IsImageuploaded: true })
        } else {
            alert("Please select atleast 1 image!");
        }


    }
    _uploadImage = (uri) => {
        if (this.state.Pic1 == 'link') {
            this.setState({
                Pic1: uri
            })
            //console.log(this.state.picture1)
        }
        else if (this.state.Pic2 == 'link') {
            this.setState({
                Pic2: uri
            })
          //  console.log(this.state.picture2)

        } else if (this.state.Pic3 == 'link') {
            this.setState({
                Pic3: uri
            })
        } else if (this.state.Pic4 == 'link') {
            this.setState({
                Pic4: uri
            })
        } else if (this.state.Pic5 == 'link') {
            this.setState({
                Pic5: uri
            })
        } else if (this.state.Pic6 == 'link') {
            this.setState({
                Pic6: uri
            })
        } else if (this.state.Pic7 == 'link') {
            this.setState({
                Pic7: uri
            })
        } else if (this.state.Pic8 == 'link') {
            this.setState({
                Pic8: uri
            })
        } else if (this.state.Pic9 == 'link') {
            this.setState({
                Pic9: uri
            })
        } else if (this.state.Pic10 == 'link') {
            this.setState({
                Pic10: uri
            })
        } else {
            alert("Pictures Limit Reached, i.e 10")
        }


    }
    urlToUPLOAD = async (url, link) => {
        let localUri = url
        let filename = localUri.split('/').pop();
        console.log(this.state.CallOutID)
        blink = "https://www.queensman.com/phase_2/queens_worker_Apis/uploadPostPicture_b.php?target_file=" + filename + "&ID=" + this.state.CallOutID
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
    
    RemoveImages = () => {
        if (this.state.selectedNo == 1) {
            this.setState({
                Pic1: "link"
            })

        }
        else if (this.state.selectedNo == 2) {
            this.setState({
                Pic2: "link"
            })

        } else if (this.state.selectedNo == 3) {
            this.setState({
                Pic3: "link"
            })

        } else if (this.state.selectedNo == 4) {
            this.setState({
                Pic4: "link"
            })

        } else if (this.state.selectedNo == 5) {
            this.setState({
                Pic5: "link"
            })

        } else if (this.state.selectedNo == 6) {
            this.setState({
                Pic6: "link"
            })

        } else if (this.state.selectedNo == 7) {
            this.setState({
                Pic7: "link"
            })

        } else if (this.state.selectedNo == 8) {
            this.setState({
                Pic8: "link"
            })

        } else if (this.state.selectedNo == 9) {
            this.setState({
                Pic9: "link"
            })

        } else if (this.state.selectedNo == 10) {
            this.setState({
                Pic10: "link"
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
            quality:0.2
        });
        if (!result.cancelled) {
            this._uploadImage(result.uri);
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%' }}>Solution</Text>
                <View style={{ height: 15 }}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Icon name="today" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        ref="textInputMobile"
                        style={{ fontSize: 15, color: '#000E1E', width: '83%' }}
                        placeholder='Type solution here'
                        defaultValue={this.state.solution}
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={(solution) => { this.setState({ solution }); }}//email set
                    />
                </View>
                <View style={{ borderBottomColor: '#aaa', borderBottomWidth: 2, width: '100%', paddingTop: '3%', }}></View>
                <View style={{ height: '3%' }}></View>

                <View style={{ height: '7%' }}></View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%' }}>Post Images</Text>
                <View style={{ height: '2%' }}></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',paddingHorizontal:'5%', opacity: (this.state.IsImageuploaded ? 0.3 : 1) }} pointerEvents={this.state.IsImageuploaded ? 'none' : 'auto'}>
                    <TouchableOpacity onPress={this.CameraSnap}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="camera" style={{ fontSize: 20, color: '#000E1E', paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%' }}>Camera</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>OR</Text>

                    <TouchableOpacity onPress={this.SelectImages}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="add-circle" style={{ fontSize: 20, color: '#000E1E', paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%' }}>Select images to upload</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', paddingHorizontal: '5%', marginTop: '2%', opacity: (this.state.IsImageuploaded ? 0.3 : 1) }} >
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.Pic1, 1)} disabled={this.state.Pic1 == 'link' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', }}>

                            <Icon name="link" style={{ fontSize: 20, color: (this.state.Pic1 == 'link' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.Pic1 == 'link' ? '#aaa' : '#000E1E') }}>Picture 1</Text>

                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.Pic2, 2)} disabled={this.state.Pic2 == 'link' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="link" style={{ fontSize: 20, color: (this.state.Pic2 == 'link' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.Pic2 == 'link' ? '#aaa' : '#000E1E') }}>Picture 2</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.Pic3, 3)} disabled={this.state.Pic3 == 'link' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="link" style={{ fontSize: 20, color: (this.state.Pic3 == 'link' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.Pic3 == 'link' ? '#aaa' : '#000E1E') }}>Picture 3</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.Pic4, 4)} disabled={this.state.Pic4 == 'link' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="link" style={{ fontSize: 20, color: (this.state.Pic4 == 'link' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.Pic4 == 'link' ? '#aaa' : '#000E1E') }}>Picture 4</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.Pic5, 5)} disabled={this.state.Pic5 == 'link' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="link" style={{ fontSize: 20, color: (this.state.Pic5 == 'link' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.Pic5 == 'link' ? '#aaa' : '#000E1E') }}>Picture 5</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.Pic6, 6)} disabled={this.state.Pic6 == 'link' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="link" style={{ fontSize: 20, color: (this.state.Pic6 == 'link' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.Pic6 == 'link' ? '#aaa' : '#000E1E') }}>Picture 6</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.Pic7, 7)} disabled={this.state.Pic7 == 'link' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="link" style={{ fontSize: 20, color: (this.state.Pic7 == 'link' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.Pic7 == 'link' ? '#aaa' : '#000E1E') }}>Picture 7</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.Pic8, 8)} disabled={this.state.Pic8 == 'link' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="link" style={{ fontSize: 20, color: (this.state.Pic8 == 'link' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.Pic8 == 'link' ? '#aaa' : '#000E1E') }}>Picture 8</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.Pic9, 9)} disabled={this.state.Pic9 == 'link' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="link" style={{ fontSize: 20, color: (this.state.Pic9 == 'link' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.Pic9 == 'link' ? '#aaa' : '#000E1E') }}>Picture 9</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.Pic10, 10)} disabled={this.state.Pic10 == 'link' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="link" style={{ fontSize: 20, color: (this.state.Pic10 == 'link' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.Pic10 == 'link' ? '#aaa' : '#000E1E') }}>Picture 10</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ height: '3%' }}></View>
                <View style={{ height: '3%' }}></View>
                <Button
                    disabled={this.state.IsImageuploaded}
                    onPress={this.AlertUploadImage}
                    title="UPLOAD IMAGES"
                    color="#FFCA5D"
                />
                <View style={{ height: '2%' }}></View>
                <Button
                    onPress={this.AlertPostJobHandler}
                    title="PROCEED"
                    color="#FFCA5D"
                />
                <View style={{ height: 180 }}></View>
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
        marginTop: '5%',
        paddingHorizontal: '5%'
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
    ButtonSty: {
        backgroundColor: "#FFCA5D",
        //  borderRadius: 20,
        alignSelf: 'center',
        width: '90%',
        // justifyContent: 'center',
        alignItems: 'center',
        // height:'25%'
        paddingVertical: '3%',

    }
});