import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity ,TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { Content ,Icon} from 'native-base';
import axios from 'axios';



let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height


export default class SignupContectUs extends React.Component {
    constructor(props) {
        super(props)
        this.state = ({
            code: '',
            showPassword:true,
            Email: '',
            PhoneNo: '',
            Name: '',
           
            OldPass:this.props.route.params.UserPassword,
        })

    }
    toggleSwitch = () => {
        this.setState({ showPassword: !this.state.showPassword });
      }
    submithandle = () => {

        link="http://queensman.com/queens_client_Apis/setContactDetail.php?name="+this.state.Name+"&email="+this.state.Email+"&phone="+this.state.PhoneNo
        console.log(link);
        axios.get(link).then(result=> console.log(result.data.server_responce))
        .catch(error => console.log(error));
        this.props.navigation.goBack(null);
    }

    render() {
        return (
            //content as view type  and touch exit
            <Content scrollEnabled={false} contentContainerStyle={styles.container} >

                {/* background gradinet   */}
                <LinearGradient
                    colors={['#000E1E', '#001E2B', '#000E1E']}
                    style={styles.gradiantStyle}
                ></LinearGradient>

                <Text style={styles.HeadingStyle}>Contact us</Text>
                <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Helvetica', paddingBottom: '15%' }}>Kindly provide details to connect with us.</Text>


                <View style={{ flexDirection: 'row', }}>
                <Icon name="person" style={{ fontSize: 25, color: '#E7B675', paddingRight: "4%" }}></Icon>
                    <TextInput
                        ref="textInputMobile"
                        style={{ fontSize: 15, color: '#FFCA5D', width: '90%' }}
                        placeholder='Full Name'
                        placeholderTextColor='#ffe3aa'
                       // secureTextEntry={this.state.showPassword}
                        underlineColorAndroid="transparent"
                        onChangeText={(Name) => { this.setState({ Name }); }}//email set
                    />


                </View>
                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '100%', paddingTop: '3%' }}></View>
               
                <View style={{ height: '10%' }}></View>
                <View style={{ flexDirection: 'row', }}>
                <Icon name="mail" style={{ fontSize: 25, color: '#E7B675', paddingRight: "4%" }}></Icon>
                    <TextInput
                        ref="textInputMobile"
                        style={{ fontSize: 15, color: '#FFCA5D', width: '90%' }}
                        placeholder='Email'
                        placeholderTextColor='#ffe3aa'
                        place
                       // secureTextEntry={this.state.showPassword}
                        underlineColorAndroid="transparent"
                        onChangeText={(Email) => { this.setState({ Email }); }}//email set
                    />


                </View>
                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '100%', paddingTop: '3%' }}></View>
                <View style={{ height: '10%' }}></View>
                <View style={{ flexDirection: 'row', }}>
                <Icon name="call" style={{ fontSize: 25, color: '#E7B675', paddingRight: "4%" }}></Icon>
                    <TextInput
                        ref="textInputMobile"
                        style={{ fontSize: 15, color: '#FFCA5D', width: '90%' }}
                        placeholder='Phone Number'
                        placeholderTextColor='#ffe3aa'
                       // secureTextEntry={this.state.showPassword}
                        underlineColorAndroid="transparent"
                        onChangeText={(PhoneNo) => { this.setState({ PhoneNo }); }}//email set
                    />


                </View>
                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '100%', paddingTop: '3%' }}></View>
                <View style={{ height: '30%' }}></View>

                <TouchableOpacity style={{ backgroundColor: "#FFCA5D", alignContent: 'center', justifyContent: 'center', height: '15%' }} onPress={this.submithandle}>

                    <Text style={{ color: '#000E1E', fontSize: 15, fontFamily: 'Helvetica', alignSelf: 'center' }}>Submit</Text>

                </TouchableOpacity>

            </Content>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: "10%",
        paddingVertical: "25%",

    },
    gradiantStyle: {
        width: deviceWidth,
        height: deviceHeight,
        position: 'absolute',
        alignSelf: 'center',
    },
    HeadingStyle: {
        fontSize: 23,
        color: '#FFCA5D',
        paddingBottom: '5%',
        fontFamily: 'Helvetica'
    },
});
