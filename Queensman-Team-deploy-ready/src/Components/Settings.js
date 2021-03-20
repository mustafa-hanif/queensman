import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage, Button } from 'react-native';





export default class Settings extends React.Component {

    constructor() {
        super()


    }
   orderPress=()=>{
    this.props.navigation.navigate('BrandList')

   }

    render() {
        return (
            <View style={styles.container}>
                <Text>Settings</Text>
                <Button
                    onPress={this.orderPress}
                    title="Next"
                    color="#2BB8F4"
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
});