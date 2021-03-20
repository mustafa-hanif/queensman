import React from 'react';
import { StyleSheet, View, ActivityIndicator,Dimensions } from 'react-native';
import  { Auth } from 'aws-amplify';
import { LinearGradient } from 'expo-linear-gradient'


let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

class AuthLoginCheck extends React.Component {

    constructor() {
        super()
   


    }

    async componentDidMount() {
        try {
            const authedUser = await Auth.currentAuthenticatedUser();
            console.log(authedUser) // this means that you've logged in before with valid user/pass. 
            this.props.navigation.navigate('AppDrawer')
          } catch(err) {
            console.log(err) // this means there is no currently authenticated user
            this.props.navigation.navigate('Login')
          }
        //Login  ko hata kar  AppDrawer kardana kud home kulay ga
    }

   

    render() {
        return (
            <View style={styles.container}>
             {/* background gradinet   */}
             <LinearGradient
                    colors={['#000E1E', '#001E2B', '#000E1E']}
                    style={styles.gradiantStyle}
                ></LinearGradient>

             <ActivityIndicator size='large' color="#fff"  />
            </View>
        );
    }
}

export default AuthLoginCheck;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    gradiantStyle: {
        width: deviceWidth,
        height: deviceHeight,
        position: 'absolute',
        alignSelf: 'center',
    },
});
