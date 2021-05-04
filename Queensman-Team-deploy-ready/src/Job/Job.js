import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, AsyncStorage, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';

import axios from 'axios';



import Modal from "react-native-modal";

import { Content, Icon } from 'native-base';
import content from 'react-native-signature-canvas/h5/html';

export default class Job extends React.Component {

    constructor(props) {
        super(props)
        this.state = ({
            Pic1: "photos/0690da3e-9c38-4a3f-ba45-8971697bd925.jpg",
            Pic2: "link",
            Pic3: "link",
            Pic4: "link",
            selectedPic: "https://en.wikipedia.org/wiki/Art#/media/File:Art-portrait-collage_2.jpg",
            isPicvisible: false, //veiw image app kay lia
            JobData: this.props.navigation.getParam('it', 'Something'),
            workerList: [],
            workerID: 1,
            W1ID: "none",
            W1Name:"none",
            W1Phone:"none",
            W1Email:"none",
            W2ID: "none",
            W2Name:"none",
            W2Phone:"none",
            W2Email:"none",
            W3ID: "none",
            W3Name:"none",
            W3Phone:"none",
            W3Email:"none",
            
        })


    }
    async componentDidMount() {
        const WorkerID = await AsyncStorage.getItem('QueensmanWorkerID'); // assign customer id here
        this.setState({ workerID: WorkerID })
        link = "https://www.queensman.com/phase_2/queens_worker_Apis/fetchJobWorkers.php?ID=" + this.props.navigation.getParam('it', 'Something').service_details.id
        console.log(link)
        axios.get(link).then((result) => {
            console.log(result.data)
            this.setState({
                workerList: result.data.server_response,
                W1ID:result.data.server_response[0].id,
                W1Name:result.data.server_response[0].full_name,
                W1Phone:result.data.server_response[0].phone,
                W1Email:result.data.server_response[0].email,
                W2ID: result.data.server_response[1].id,
                W2Name:result.data.server_response[1].full_name,
                W2Phone:result.data.server_response[1].phone,
                W2Email:result.data.server_response[1].email,
                W3ID: result.data.server_response[2].id,
                W3Name:result.data.server_response[2].full_name,
                W3Phone:result.data.server_response[2].phone,
                W3Email:result.data.server_response[2].email,

            })

        })


    }
    AlertStartJob = () => {
        Alert.alert(
            "Start the Job.",
            'Are you sure you want to start the job?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => this.StartJobHandler() },
            ],
            { cancelable: false },
        );


    }
    StartJobHandler = () => {
        link = "https://www.queensman.com/phase_2/queens_worker_Apis/startJob.php?callout_id=" + this.state.JobData.service_details.id + "&worker_id=" + this.state.workerID
        console.log(link)
        axios.get(link).then((result) => {
            console.log(result.data)

            this.props.navigation.navigate('JobSteps', {
                QJobID: this.state.JobData.service_details.id,
            });
        })


    }
    toggleGalleryEventModal = (value) => {
        this.setState({ isPicvisible: !this.state.isPicvisible, selectedPic: value });
    };
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ height: 20 }}></View>
                <Text style={styles.HeadingStyle}>{this.state.JobData.service_details.request_time}</Text>
                <Text style={{ fontSize: 17, fontWeight: '800', 
                 // fontFamily: 'serif', 
                marginBottom: '3%' }}>Job type: {this.state.JobData.service_details.job_type} </Text>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%' }}>Client details</Text>
                <View style={{ width: '100%', paddingHorizontal: '5%' }}>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>Callout Name: {this.state.JobData.service_details.client_name}</Text>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>Callout Email: {this.state.JobData.service_details.client_email}</Text>
                    <Text style={{ fontSize: 13, marginBottom: '3%' }}>Callout Phone Number: {this.state.JobData.service_details.client_phone}</Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%' }}>Callout details</Text>
                <View style={{ width: '100%', paddingHorizontal: '5%' }}>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>Callout ID: {this.state.JobData.service_details.id}</Text>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>Description: {this.state.JobData.service_details.description}</Text>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>Urgency Level: {this.state.JobData.service_details.urgency_level}</Text>
                    <Text style={{ fontSize: 13, marginBottom: '3%' }}>Request Time: {this.state.JobData.service_details.request_time}</Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%' }}>Property details</Text>
                <View style={{ width: '100%', paddingHorizontal: '5%' }}>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>Property ID: {this.state.JobData.service_details.property_id}</Text>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>Property Address: {this.state.JobData.service_details.address}</Text>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>Community: {this.state.JobData.service_details.community}</Text>
                    <Text style={{ fontSize: 13, marginBottom: '1%' }}>City: {this.state.JobData.service_details.city}</Text>
                    <Text style={{ fontSize: 13, marginBottom: '3%' }}>Country: {this.state.JobData.service_details.country}</Text>

                </View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%' }}>Callout Images</Text>
                <View style={{ width: '100%', paddingHorizontal: '5%', marginTop: '2%', }}>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.JobData.service_details.picture1)} disabled={this.state.JobData.service_details.picture1 == '' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="image" style={{ fontSize: 20, color: (this.state.JobData.service_details.picture1 == '' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.JobData.service_details.picture1 == '' ? '#aaa' : '#000E1E') }}>Picture 1</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.JobData.service_details.picture2)} disabled={this.state.JobData.service_details.picture2 == '' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="image" style={{ fontSize: 20, color: (this.state.JobData.service_details.picture2 == '' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.JobData.service_details.picture2 == '' ? '#aaa' : '#000E1E') }}>Picture 2</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.JobData.service_details.picture3)} disabled={this.state.JobData.service_details.picture3 == '' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="image" style={{ fontSize: 20, color: (this.state.JobData.service_details.picture3 == '' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.JobData.service_details.picture3 == '' ? '#aaa' : '#000E1E') }}>Picture 3</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.JobData.service_details.picture4)} disabled={this.state.JobData.service_details.picture4 == '' ? true : false}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                            <Icon name="image" style={{ fontSize: 20, color: (this.state.JobData.service_details.picture4 == '' ? '#aaa' : '#000E1E'), paddingRight: "3%", }}></Icon>
                            <Text style={{ fontSize: 13, marginBottom: '1%', color: (this.state.JobData.service_details.picture4 == '' ? '#aaa' : '#000E1E') }}>Picture 4</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <View style={{ height: '3%' }}></View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '1.5%' }}>Instructions from Admin</Text>
                <Text style={{ fontSize: 13, marginBottom: '3%', paddingHorizontal: '5%' }}>{this.state.JobData.service_details.instructions}</Text>

                <Text style={{ fontSize: 15, fontWeight: '500', color: '#FFCA5D', marginBottom: '2%' }}>Assigned Ops Team</Text>
                <Text style={{ fontSize: 13, marginBottom: '1%', paddingHorizontal: '5%' }}>ID: {this.state.W1ID}</Text>
                <Text style={{ fontSize: 13, marginBottom: '1%', paddingHorizontal: '5%' }}>Full Name: {this.state.W1Name}</Text>
                <Text style={{ fontSize: 13, marginBottom: '1%', paddingHorizontal: '5%' }}>Phone: {this.state.W1Phone}</Text>
                <Text style={{ fontSize: 13, marginBottom: '3%', paddingHorizontal: '5%' }}>Email: {this.state.W1Email}</Text>
             
                <Text style={{ fontSize: 13, marginBottom: '1%', paddingHorizontal: '5%' }}>ID: {this.state.W2ID}</Text>
                <Text style={{ fontSize: 13, marginBottom: '1%', paddingHorizontal: '5%' }}>Full Name: {this.state.W2Name}</Text>
                <Text style={{ fontSize: 13, marginBottom: '1%', paddingHorizontal: '5%' }}>Phone: {this.state.W2Phone}</Text>
                <Text style={{ fontSize: 13, marginBottom: '3%', paddingHorizontal: '5%' }}>Email: {this.state.W2Email}</Text>
               
                <Text style={{ fontSize: 13, marginBottom: '1%', paddingHorizontal: '5%' }}>ID: {this.state.W3ID}</Text>
                <Text style={{ fontSize: 13, marginBottom: '1%', paddingHorizontal: '5%' }}>Full Name: {this.state.W3Name}</Text>
                <Text style={{ fontSize: 13, marginBottom: '1%', paddingHorizontal: '5%' }}>Phone: {this.state.W3Phone}</Text>
                <Text style={{ fontSize: 13, marginBottom: '7%', paddingHorizontal: '5%' }}>Email: {this.state.W3Email}</Text>
            
                <Button
                    style={{ width: '20%', }}
                    onPress={this.AlertStartJob}
                    title="Start Job"
                    color="#FFCA5D"
                />
                <View style={{ height: 80 }}></View>

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
                        <TouchableOpacity onPress={() => this.setState({ isPicvisible: false })}>
                            <View style={styles.ButtonSty}><Text style={{ fontWeight: 'bold', color: '#ffff', fontSize: 15 }}>Close</Text></View>
                        </TouchableOpacity>

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

        paddingHorizontal: '5%',

    },
    HeadingStyle: {
        fontSize: 20,
        // fontFamily: 'serif',
        marginBottom: '2%',

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