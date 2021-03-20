import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { Content, Icon } from 'native-base';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import Toast from 'react-native-whc-toast'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height


export default class SettingPasswordChange extends React.Component {
    constructor(props) {
        super(props)
        this.state = ({
            password: '',
            code: '',
            showOldPassword: true,
            showNewPassword: true,
            OldPass: '',
            email: this.props.navigation.getParam('UserEmail', 'Something'),
            passwordcheck: ''

        })

    }
    toggleOldSwitch = () => {
        this.setState({ showOldPassword: !this.state.showOldPassword });
    }

    toggleNewSwitch = () => {
        this.setState({ showNewPassword: !this.state.showNewPassword });
    }
    donehandle = () => {

        link = "http://13.250.20.151/queens_client_Apis/checkPassword.php?email=" + this.state.email
        console.log(link);
        axios.get(link).then((result) => {
            console.log(result.data.server_responce.password)
            this.setState({
                passwordcheck: result.data.server_responce.password
            })
        })
        if (this.state.password.length < 8) {
            this.refs.customToast.show('Password length should be greater than 8');
        }
        else if (this.state.passwordcheck == this.state.OldPass){
            const OldPass = this.state.OldPass
            const password = this.state.password
            Auth.currentAuthenticatedUser()
                .then(user => {
                    return Auth.changePassword(user, OldPass, password);
                })
                .then(data => console.log(data))
                .catch(err => console.log(err));

            link = "http://13.250.20.151/queens_client_Apis/UpdatePassword.php?password=" + this.state.password + "&email=" + this.state.email
            console.log(link);
            axios.get(link).then((result) => {
                console.log(result.data.server_responce);
                this.refs.customToast.show('Password Updated');
                setTimeout(() => {
                    this.props.navigation.navigate('Settings')
                }, 800);
            })
        }

    }

    render() {
        return (
            //content as view type  and touch exit
            <Content scrollEnabled={false} contentContainerStyle={styles.container} >


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

                <Text style={styles.HeadingStyle}>Change Password</Text>
                <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Helvetica', paddingBottom: '5%' }}>Please type old password and then new password for this account. </Text>
                <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Helvetica', paddingBottom: '12%' }}>*Minimum password length is 8 characters</Text>

                <View style={{ flexDirection: 'row', }}>

                    <TextInput
                        ref="textInputMobile"
                        style={{ fontSize: 15, color: '#FFCA5D', width: '90%' }}
                        placeholder='Old Password'
                        placeholderTextColor='#FFCA5D'
                        autoCapitalize = 'none'
                        secureTextEntry={this.state.showOldPassword}
                        underlineColorAndroid="transparent"
                        onChangeText={(OldPass) => { this.setState({ OldPass }); }}//email set
                    />
                    {this.state.showOldPassword ? <Icon onPress={this.toggleOldSwitch} name="eye-off" style={{ fontSize: 25, color: '#E7B675', paddingRight: "4%", }}></Icon> : <Icon onPress={this.toggleOldSwitch} name="eye" style={{ fontSize: 25, color: '#E7B675', paddingRight: "4%", }}></Icon>}

                </View>
                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '100%', paddingTop: '3%' }}></View>

                <View style={{ height: '10%' }}></View>
                <View style={{ flexDirection: 'row', }}>

                    <TextInput
                        ref="textInputMobile"
                        style={{ fontSize: 15, color: '#FFCA5D', width: '90%' }}
                        placeholder='New Password'
                        placeholderTextColor='#FFCA5D'
                        autoCapitalize = 'none'
                        secureTextEntry={this.state.showNewPassword}
                        underlineColorAndroid="transparent"
                        onChangeText={(password) => { this.setState({ password }); }}//email set
                    />
                    {this.state.showNewPassword ? <Icon onPress={this.toggleNewSwitch} name="eye-off" style={{ fontSize: 25, color: '#E7B675', paddingRight: "4%", }}></Icon> : <Icon onPress={this.toggleNewSwitch} name="eye" style={{ fontSize: 25, color: '#E7B675', paddingRight: "4%", }}></Icon>}

                </View>
                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '100%', paddingTop: '3%' }}></View>


                <View style={{ height: '30%' }}></View>

                <TouchableOpacity style={{ backgroundColor: "#FFCA5D", alignContent: 'center', justifyContent: 'center', height: '15%' }} onPress={this.donehandle}>

                    <Text style={{ color: '#000E1E', fontSize: 15, fontFamily: 'Helvetica', alignSelf: 'center' }}>Done</Text>

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
