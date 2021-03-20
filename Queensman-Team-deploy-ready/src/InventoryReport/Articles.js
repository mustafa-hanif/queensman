import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, Button, AsyncStorage, TextInput, ScrollView } from 'react-native';

import { Container, Header, Content, List, ListItem, Row, Icon, Col, Left, Right, Picker } from 'native-base';
import axios from 'axios';


export default class Articles extends React.Component {

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
            Discription1: this.props.navigation.getParam('it', '').description,
            Inspection1: this.props.navigation.getParam('it', '').inspection,
            WorkDescription1: this.props.navigation.getParam('it', '').work_description,
            Remarks1: this.props.navigation.getParam('it', '').remarks,
            JobType: this.props.navigation.getParam('it', '').type,
            articleId: this.props.navigation.getParam('it', '').article_id,
            Discription: this.props.navigation.getParam('it', '').description,
            Inspection: this.props.navigation.getParam('it', '').inspection,
            WorkDescription: this.props.navigation.getParam('it', '').work_description,
            Remarks: this.props.navigation.getParam('it', '').remarks,
            RoomID: this.props.navigation.getParam('room_id', 'Something'),

        })

    }

    componentDidMount = () => {
        console.log("Article id is: "+this.state.articleId)
    }
    onValueChange(value) {
        this.setState({
            JobType: value
        });
    }
    saveArticles = () => {

        if(this.state.articleId == undefined)
        {
            var type = this.state.JobType + " " + this.state.ArticleType
            link = "https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryArticle.php?inventory_room_id=" + this.state.RoomID + "&type=" + type + "&description=" + this.state.Discription1 + "&inspection=" + this.state.Inspection1 + "&work_description=" + this.state.WorkDescription1 + "&remarks=" + this.state.Remarks1
            console.log(link)
            axios.get(link).then((result) => {
                console.log(result.data)
                if (result.data.server_response == "Successfully Submitted Inventory Article Details.")
                    alert("Successfully Submitted Inventory Article Details.");
                else
                    alert("Failed To Submitted Inventory Article Details..");

                setTimeout(() => {
                    this.props.navigation.goBack();
                }, 1000);
            })
        }
        else
        {
            console.log("Article already exists");
            if(this.state.Discription1 != this.state.Discription)
            {
                link = "https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryArticleDescription.php?Description="+this.state.Discription1+"&inventory_article_id="+this.state.articleId
                console.log(link)
                axios.get(link).then((result) => {
                    console.log(result.data)
                    setTimeout(() => {
                        this.props.navigation.goBack();
                    }, 1000);
                })
            }
            if(this.state.WorkDescription1 != this.state.WorkDescription)
            {
                link = "https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryArticleWorkDescription.php?work_description="+this.state.WorkDescription1+"&inventory_article_id="+this.state.articleId
                console.log(link)
                axios.get(link).then((result) => {
                    console.log(result.data)
                    setTimeout(() => {
                        this.props.navigation.goBack();
                    }, 1000);
                })
            }
            if(this.state.Inspection1 != this.state.Inspection)
            {
                link = "https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryArticleInspection.php?inspection="+this.state.Inspection1+"&inventory_article_id="+this.state.articleId
                console.log(link)
                axios.get(link).then((result) => {
                    console.log(result.data)
                    setTimeout(() => {
                        this.props.navigation.goBack();
                    }, 1000);
                })
            }
            if(this.state.Remarks1 != this.state.Remarks)
            {
                link = "https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryArticleRemarks.php?remarks="+this.state.Remarks1+"&inventory_article_id="+this.state.articleId
                console.log(link)
                axios.get(link).then((result) => {
                    console.log(result.data)
                    setTimeout(() => {
                        this.props.navigation.goBack();
                    }, 1000);
                })
            }
            alert("Successfully updated article!");
        }
        

    }

    render() {
        return (
            <ScrollView style={styles.container}>

                <Text style={{
                    alignSelf: 'center',
                    fontSize: 15,
                    margin: "2%",
                    color: '#000E1E',
                    fontWeight: '500'
                }}>Room Name : </Text>

                <Text style={[styles.TextFam, { color: '#000E1E', fontSize: 16, paddingHorizontal: "6%", marginBottom: "1%" }]}>Article Type</Text>

                <View style={styles.PickerStyle}>
                    <Picker
                        note
                        mode="dialog"
                        onValueChange={this.onValueChange.bind(this)}
                        selectedValue={this.state.JobType}
                        itemStyle={{ fontSize: 30, }}
                        style={{}}

                    >
                        <Picker.Item label="Select" value="none" />
                        <Picker.Item label=" ELECTRICAL Services (repair and replace warranty cover)" value=" ELECTRICAL Services (repair and replace warranty cover)" />
                        <Picker.Item label="CARPENTRY, PAINT & TILING Services (repair and replace warranty cover)" value="CARPENTRY, PAINT & TILING Services (repair and replace warranty cover)" />
                        <Picker.Item label="AC (HVAC) Services (repair and replace warranty cover)" value="AC (HVAC) Services (repair and replace warranty cover)" />
                        <Picker.Item label="WATER SYSTEM & PLUMIBING Services (repair and replace warranty cover)" value="WATER SYSTEM & PLUMIBING Services (repair and replace warranty cover)" />
                        <Picker.Item label="General Services" value="General Services" />

                    </Picker>

                </View>

                {this.state.JobType == 'General Services' ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '6%', }}>
                        <Icon name="hammer" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                        <TextInput
                            defaultValue={this.state.ArticleType}
                            style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}
                            placeholder='Other Article type'
                            placeholderTextColor='#000E1E'
                            underlineColorAndroid="transparent"
                            onChangeText={(ArticleType) => { this.setState({ ArticleType }); }}
                        />
                    </View> : null}

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '6%', }}>
                    <Icon name="today" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        defaultValue={this.state.Discription}
                        style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}
                        placeholder='Description'
                        multiline={true}
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={(Discription1) => { this.setState({ Discription1 }); }}
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '6%', }}>
                    <Icon name="today" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        defaultValue={this.state.Inspection}
                        style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}
                        placeholder='Inspection'
                        multiline={true}
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={(Inspection1) => { this.setState({ Inspection1 }); }}
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '6%', }}>
                    <Icon name="clipboard" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        defaultValue={this.state.WorkDescription}
                        style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}
                        placeholder='Work Description'
                        multiline={true}
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={(WorkDescription1) => { this.setState({ WorkDescription1 }); }}
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '6%', }}>
                    <Icon name="document" style={{ fontSize: 25, color: '#000E1E', paddingRight: "4%" }}></Icon>
                    <TextInput
                        defaultValue={this.state.Remarks}
                        style={{ fontSize: 15, color: '#000E1E', width: '90%', paddingStart: '1%' }}
                        placeholder='Remarks'
                        multiline={true}
                        placeholderTextColor='#000E1E'
                        underlineColorAndroid="transparent"
                        onChangeText={(Remarks1) => { this.setState({ Remarks1 }); }}
                    />
                </View>

                <View style={{ borderBottomColor: '#FFCA5D', borderBottomWidth: 2, width: '94%', paddingTop: '3%', marginBottom: '4%', alignSelf: 'center' }}></View>


                <View style={{ paddingHorizontal: '6%', }}>
                    <Button
                        style={{ width: '100%', }}
                        onPress={() => this.saveArticles()}
                        title="Save Details"
                        color="#FFCA5D"
                    />
                </View>
                <View style={{ height: 30 }}></View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: '5%',

    },
    PickerStyle: {
        width: '90%',
        height: 28,
        backgroundColor: "#FFCA5D",
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS 
        elevation: 1, // Android
        borderRadius: 5,
        justifyContent: 'center',
        marginBottom: "3%",
        alignSelf: "center"

    },
});