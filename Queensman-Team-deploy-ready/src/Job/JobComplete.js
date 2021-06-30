import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage, KeyboardAvoidingView, TextInput, Button, Alert, Platform, AppState, Image } from 'react-native';
import StarRating from 'react-native-star-rating';

import { Content, Icon } from 'native-base';
// import { takeSnapshotAsync } from "expo";
import { captureRef as takeSnapshotAsync } from "react-native-view-shot";
import axios from 'axios';
import * as ExpoPixi from 'expo-pixi';

const isAndroid = Platform.OS === 'android';
function uuidv4() {
    //https://stackoverflow.com/a/2117523/4047926
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}


export default class JobComplete extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            starCount: null,
            feedback: "",
            signature: null,
            image: null,
            strokeColor: 0,
            appState: AppState.currentState,
            SignatureUrl: null,
            CallOutID: this.props.navigation.getParam('QJobID', 'Something'),
            WorkerID: this.props.navigation.getParam('workerId', 'Something'),
            Solution: this.props.navigation.getParam('Sol', 'Something'),
        };
    }
    handleAppStateChangeAsync = nextAppState => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            if (isAndroid && this.sketch) {
                this.setState({ appState: nextAppState, id: uuidv4(), lines: this.sketch.lines });
                return;
            }
        }
        this.setState({ appState: nextAppState });
    };

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChangeAsync);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChangeAsync);
    }

    onReady = () => {
        console.log('ready!');
    };

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        },
            () => {
                console.log(this.state.starCount + " " + rating)


            })

    }



    AlertJobDone = () => {
        Alert.alert(
            "Job Completion.",
            "Are you sure you want to finish the job?",
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => this.DoneJob() },
            ],
            { cancelable: false },
        );
    }

    DoneJob = async () => {
        let localUri = this.state.SignatureUrl
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append('photo', { uri: localUri, name: filename, type });
        console.log(formData)
        link = "https://www.queensman.com/phase_2/queens_worker_Apis/finishJob.php?callout_id=" + this.state.CallOutID + "&worker_id=" + this.state.WorkerID + "&solution=" + this.state.Solution
        console.log(link)
        axios.get(link).then((result) => {
            console.log(result.data)
        })
        link = "https://www.queensman.com/phase_2/queens_worker_Apis/recordCustomerFeedback.php?callout_id=" + this.state.CallOutID + "&rating=" + this.state.starCount + "&feedback=" + this.state.feedback + "&signature=" + filename
        console.log(link)
        axios.get(link).then((result) => {
            console.log(result.data)
            alert("Service has been successfully completed. Great Job!")
            this.props.navigation.navigate('HomeNaviagtor')
        })
        link = "https://www.queensman.com/phase_2/queens_worker_Apis/uploadSignature.php"
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

    onChange = async ({ width, height }) => {
        const options = {
            format: 'png', /// PNG because the view has a clear background
            quality: 0.1, /// Low quality works because it's just a line
            result: 'tmpfile',
            height,
            width
        };
        /// Using 'Expo.takeSnapShotAsync', and our view 'this.sketch' we can get a uri of the image
        const uri = await takeSnapshotAsync(this.sketch, options);
        console.log(uri)
        this.setState({
            SignatureUrl: uri
        })
        console.log(this.state.SignatureUrl)
    };


    render() {
        return (
            <Content scrollEnabled={true} contentContainerStyle={styles.container}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%' }}>Rating</Text>
                <Text style={{ fontSize: 12, fontWeight: '500', color: '#001E2B', marginBottom: '1.5%' }}>How would you rate our services? </Text>
                <View style={{ height: '4%' }}></View>
                <View style={{ width: '70%' }}>
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        fullStarColor={'#001E2B'}
                        rating={this.state.starCount}
                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                    />
                </View>
                <View style={{ height: '4%' }}></View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%' }}>Feedback</Text>
                <View style={{ height: 20 }}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Icon name="contacts" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        ref="textInputMobile"
                        style={{ fontSize: 15, color: '#000E1E', width: '83%' }}
                        placeholder='Please type your valuable feedback here..'
                        defaultValue={this.state.feedback}
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={(feedback) => { this.setState({ feedback }); }}//email set
                    />
                </View>
                <View style={{ borderBottomColor: '#aaa', borderBottomWidth: 2, width: '100%', paddingTop: '3%', }}></View>
                <View style={{ height: '4%' }}></View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%' }}>Signature</Text>

                <View style={styles.sketchContainer}>
                    <ExpoPixi.Signature
                        ref={ref => (this.sketch = ref)}
                        style={styles.sketch}
                        strokeColor={'#000E1E'}
                        strokeAlpha={1}
                        onReady={this.onReady}
                        onChange={this.onChange}
                    />
                </View>
                <View style={{ height: '4%' }}></View>
                <Button
                    color="#FFCA5D"
                    title="CLEAR"
                    style={styles.button}
                    onPress={() => {
                        this.sketch.clear();
                    }}
                />
                <View style={{ height: '4%' }}></View>
                <Button
                    onPress={this.AlertJobDone}
                    title="FINISH THE JOB"
                    color="#FFCA5D"
                />
            </Content >
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
    sketch: {
        flex: 1,
    },
    sketchContainer: {
        height: '30%',
        backgroundColor: '#f1f1f1'
    },
});