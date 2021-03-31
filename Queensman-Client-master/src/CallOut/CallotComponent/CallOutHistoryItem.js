import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { Content, List, ListItem, Row, Icon, Col, Left, Right, Button } from 'native-base';
import Modal from "react-native-modal";
import StarRating from 'react-native-star-rating';
import axios from 'axios';
import Toast from 'react-native-whc-toast'



export default class CallOutHistoryItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({
      isRateModalVisible: false,
      RateingDone: false,
      Id: '',
      FeedBack: '',
      status_update_list: [],
      WorkRate: null,
      HistoryCallOutData: this.props.navigation.getParam('it', 'Something'),
      link: "photos/0690da3e-9c38-4a3f-ba45-8971697bd925.jpg",
      selectedPic: "",
      isPicvisible: false, //veiw image app kay lia
      workerList: [],
      prepics: [],
      postpic: [],
    })

  }

  async componentDidMount() {
    var prepictures = []
    var postpictures = []
    var workers = []
    var status_update = []

    link = "https://www.queensman.com/queens_client_Apis/fetchServicePrePictures.php?callout_id=" + this.state.HistoryCallOutData.Client_property.id
    console.log(link)
    axios.get(link).then(result => {
      var length = result.data.server_response.length
      console.log(length)
      for (i = 0; i < length; i++) {
        prepictures.push(result.data.server_response[i].services)
      }
      this.setState({ prepics: prepictures })
      console.log(prepictures)
    })
      .catch(error => console.log(error));
    link = "https://www.queensman.com/queens_client_Apis/fetchServicePostPictures.php?callout_id=" + this.state.HistoryCallOutData.Client_property.id
    console.log(link)
    axios.get(link).then(result => {
      var length = result.data.server_response.length
      console.log(length)
      for (i = 0; i < length; i++) {
        postpictures.push(result.data.server_response[i].services)
      }
      this.setState({ postpic: postpictures })
      console.log(postpictures)

    })
      .catch(error => console.log(error));
    link = "https://www.queensman.com/queens_client_Apis/fetchServiceWorkers.php?callout_id=" + this.state.HistoryCallOutData.Client_property.id
    console.log(link)
    axios.get(link).then(result => {
      var length = result.data.server_response.length
      console.log(length)
      for (i = 0; i < length; i++) {
        workers.push(result.data.server_response[i].services)
      }
      this.setState({ workerList: workers })
      console.log(workers)
    })
      .catch(error => console.log(error));
    link = "http://13.250.20.151/queens_client_Apis/fetchSingleJobHistory.php?callout_id=" + this.state.HistoryCallOutData.Client_property.id
    console.log(link)
    axios.get(link).then(result => {
      var length = result.data.server_response.length
      console.log(length)
      for (i = 0; i < length; i++) {
        status_update.push(result.data.server_response[i].job_history)
      }
      this.setState({ status_update_list: status_update })
      console.log(status_update)
    })
      .catch(error => console.log(error));

  }

  toggleRateModal = () => {
    this.setState({ isRateModalVisible: !this.state.isRateModalVisible });
  };

  toggleGalleryEventModal = (value) => {
    this.setState({ isPicvisible: !this.state.isPicvisible, selectedPic: value });
  };




  onWorkStarRatingPress(rating) {

    this.setState({
      WorkRate: rating
    });
  }
  SaveResponcePress = () => {
    link = "https://www.queensman.com/queens_client_Apis/setFeedback.php?callout_id=" + this.state.HistoryCallOutData.Client_property.id + "&rating=" + this.state.WorkRate + "&feedback=" + this.state.FeedBack
    console.log(link);
    axios.get(link).then(result => console.log(result.data.server_responce))
      .catch(error => console.log(error));
    this.setState({ isRateModalVisible: !this.state.isRateModalVisible });

    this.refs.customToast.show('Thanks for your response');
    setTimeout(() => {
      this.props.navigation.navigate('HomeNaviagtor')
    }, 800);
  }

  render() {
    return (
      <View style={styles.container}>
        {/* background gradinet   */}
        <Toast ref='customToast'
          textStyle={{
            color: '#fff',
          }}
          style={{
            backgroundColor: '#FFCA5D',
          }} />
        <LinearGradient
          colors={['#000E1E', '#001E2B', '#000E1E']}
          style={styles.gradiantStyle}
        ></LinearGradient>
        <View style={styles.Card}>

          <Content contentContainerStyle={{ paddingTop: '6%' }}>

            <List>
              <View style={{ alignSelf: 'center', }}>
                <Text style={[styles.TextFam, { fontSize: 17, fontWeight: 'bold' }]}>{this.state.HistoryCallOutData.Client_property.address}</Text>
                <Text style={[styles.TextFam, { fontSize: 10, color: '#aaa' }]}>{this.state.HistoryCallOutData.Client_property.community},{this.state.HistoryCallOutData.Client_property.city},{this.state.HistoryCallOutData.Client_property.country}</Text>
              </View>
              <ListItem>
              </ListItem>
              <ListItem>
                <Row>
                  <Left><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Callout ID</Text></Left>
                  <Right><Text style={styles.TextFam}>{this.state.HistoryCallOutData.Client_property.id}</Text></Right>
                </Row>
              </ListItem>

              <ListItem>
                <Row>
                  <Left><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Status</Text></Left>
                  <Text style={[styles.TextFam, { alignSelf: 'flex-end' }]}>{this.state.HistoryCallOutData.Client_property.status}</Text>
                </Row>
              </ListItem>
              <ListItem>
                <Row>
                  <Left><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Urgency Level</Text></Left>

                  <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
                    <Text style={styles.TextFam}>{this.state.HistoryCallOutData.Client_property.urgency_level} </Text>
                    <Icon name='flag' style={{ fontSize: 24, color: this.state.HistoryCallOutData.Client_property.urgency_level == 'High' ? 'red' : this.state.HistoryCallOutData.Client_property.urgency_level == 'Scheduled' ? "#aaa" : '#FFCA5D', }}></Icon>
                  </View>

                </Row>
              </ListItem>
              <ListItem>
                <Row>
                  <Left><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Request Time</Text></Left>
                  <Text style={[styles.TextFam, { alignSelf: 'flex-end' }]}>{this.state.HistoryCallOutData.Client_property.request_time}</Text>
                </Row>
              </ListItem>

              <ListItem>
                <Row>
                  <Left><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Resolved Time</Text></Left>
                  <Text style={[styles.TextFam, { alignSelf: 'flex-end' }]}>{this.state.HistoryCallOutData.Client_property.resolved_time}</Text>
                </Row>
              </ListItem>
              <ListItem>
                <Row>
                  <Left><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Planned Time</Text></Left>
                  <Text style={[styles.TextFam, { alignSelf: 'flex-end' }]}>{this.state.HistoryCallOutData.Client_property.planned_time == null ? "N/A" : this.state.HistoryCallOutData.Client_property.planned_time}</Text>
                </Row>
              </ListItem>
              <ListItem>
                <Col><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Description</Text>
                  <Text style={styles.TextFam}>{this.state.HistoryCallOutData.Client_property.description}</Text></Col>
              </ListItem>
              <View style={{ paddingTop: '3%', alignSelf: 'center', }}>
                <Text style={[styles.TextFam, { fontSize: 17, fontWeight: 'bold' }]}>Status Update</Text>
              </View>
              <ListItem>
                <Col>
                  <Row><Text style={[styles.TextFam, { fontWeight: 'bold' }]}>Status</Text></Row>
                  <Row><Text style={[styles.TextFam]}>Job Assigned</Text></Row>
                  <Row><Text style={[styles.TextFam]}>In Progress</Text></Row>
                  <Row><Text style={[styles.TextFam]}>Closed</Text></Row>
                </Col>

                <Col>
                  <Row><Text style={[styles.TextFam, { fontWeight: 'bold' }]}>  Time of Update</Text></Row>
                  <Row><Text style={[styles.TextFam]}>  {this.state.status_update_list.length > 0 ? this.state.status_update_list[0].time : "N/A"}</Text></Row>
                  <Row><Text style={[styles.TextFam]}>  {this.state.status_update_list.length > 1 ? this.state.status_update_list[1].time : "N/A"}</Text></Row>
                  <Row><Text style={[styles.TextFam]}>  {this.state.status_update_list.length > 2 ? this.state.status_update_list[2].time : "N/A"}</Text></Row>
                </Col>

                <Col>
                  <Row><Text style={[styles.TextFam, { fontWeight: 'bold' }]}>          Updated by</Text></Row>
                  <Row><Text style={[styles.TextFam]}>         {this.state.status_update_list.length > 0 ? this.state.status_update_list[0].updated_by : "N/A"}</Text></Row>
                  <Row><Text style={[styles.TextFam]}>         {this.state.status_update_list.length > 0 ? this.state.status_update_list[1].updated_by : "N/A"}</Text></Row>
                  <Row><Text style={[styles.TextFam]}>         {this.state.status_update_list.length > 0 ? this.state.status_update_list[2].updated_by : "N/A"}</Text></Row>
                </Col>

              </ListItem>
              <ListItem>
                <Col><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Callout Pictures</Text>
                  <Text> </Text>
                  <Row>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.HistoryCallOutData.Client_property.picture1)}>
                      <Image
                        style={styles.ImageStyle}
                        source={{ uri: this.state.HistoryCallOutData.Client_property.picture1 }} resizeMode='contain' />
                    </TouchableOpacity>
                    <Text> </Text>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.HistoryCallOutData.Client_property.picture2)}>
                      <Image
                        style={styles.ImageStyle}
                        source={{ uri: this.state.HistoryCallOutData.Client_property.picture2 }} resizeMode='contain' />
                    </TouchableOpacity>
                    <Text> </Text>
                  </Row>
                  <View style={{ height: '1%' }}></View>
                  <Row>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.HistoryCallOutData.Client_property.picture3)}>
                      <Image
                        style={styles.ImageStyle}
                        source={{ uri: this.state.HistoryCallOutData.Client_property.picture3 }} resizeMode='contain' />
                    </TouchableOpacity>
                    <Text> </Text>
                    <TouchableOpacity onPress={() => this.toggleGalleryEventModal(this.state.HistoryCallOutData.Client_property.picture4)}>
                      <Image
                        style={styles.ImageStyle}
                        source={{ uri: this.state.HistoryCallOutData.Client_property.picture4 }} resizeMode='contain' />
                    </TouchableOpacity>
                    <Text> </Text>
                  </Row>

                </Col>
              </ListItem>

              <ListItem>
                <Col><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Assigned Ops Team</Text>
                  <FlatList
                    data={this.state.workerList}
                    renderItem={({ item }) => <Row>
                      <Left><Text style={[styles.TextFam, { color: '#000' }]}>{item.worker_name}</Text></Left>
                      <Text style={[styles.TextFam, { alignSelf: 'flex-end' }]}>{item.worker_phone}</Text>
                    </Row>}
                    keyExtractor={(item, index) => index}
                  /></Col>
              </ListItem>
              <ListItem>
                <Col><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Pre Job Pictures</Text>
                  <FlatList
                    data={this.state.prepics}
                    renderItem={({ item }) => <View style={{ flex: 1, flexDirection: 'column', margin: 1, }}>
                      <TouchableOpacity onPress={() => this.toggleGalleryEventModal(item.picture_location)}>
                        <Image style={styles.ImageStyle} source={{ uri: item.picture_location }} resizeMode='contain' />
                      </TouchableOpacity>
                    </View>}

                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                  /></Col>
              </ListItem>
              <ListItem>
                <Col><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Post Job Pictures</Text>
                  <FlatList
                    data={this.state.postpic}
                    renderItem={({ item }) => <View style={{ flex: 1, flexDirection: 'column', margin: 1, }}>
                      <TouchableOpacity onPress={() => this.toggleGalleryEventModal(item.picture_location)}>
                        <Image style={styles.ImageStyle} source={{ uri: item.picture_location }} resizeMode='contain' />
                      </TouchableOpacity>
                    </View>}

                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                  /></Col>
              </ListItem>

              <ListItem>
                <Col><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Action</Text>
                  <Text style={styles.TextFam}>{this.state.HistoryCallOutData.Client_property.action}</Text></Col>
              </ListItem>
              <ListItem>
                <Col><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Solution</Text>
                  <Text style={styles.TextFam}>{this.state.HistoryCallOutData.Client_property.solution}</Text></Col>
              </ListItem>
              <ListItem>
                <Col><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Instructions from Admin</Text>
                  <Text style={styles.TextFam}>{this.state.HistoryCallOutData.Client_property.instructions}</Text></Col>
              </ListItem>
              <ListItem>
                <Col><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Feedback</Text>
                  <Text style={styles.TextFam}>{this.state.HistoryCallOutData.Client_property.feedback}</Text></Col>
              </ListItem>
              <ListItem>
                <Row>
                  <Left><Text style={[styles.TextFam, { color: '#8c8c8c' }]}>Work Rating</Text></Left>
                  <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
                    <Text style={styles.TextFam}>{this.state.HistoryCallOutData.Client_property.rating}</Text>
                    <StarRating
                      disabled={true}
                      maxStars={1}
                      rating={3}
                      fullStarColor='#000'
                      starSize={17}
                    />

                  </View>
                </Row>
              </ListItem>
            </List>
          </Content>
        </View>
        <Modal isVisible={this.state.isRateModalVisible}
          onBackdropPress={() => this.setState({ isRateModalVisible: false })}>
          <View style={styles.rateModel} >

            <Text style={[styles.TextFam, { fontSize: 24, color: 'gray', }]} >
              Rate the Job
            </Text>
            <Text style={[styles.TextFam, { fontSize: 15, color: 'gray', paddingTop: '5%', paddingBottom: '2%' }]}>
              Feedback
            </Text>

            <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
              <Icon name='contacts' style={{ fontSize: 40, paddingRight: 20, }}></Icon>
              <TextInput
                ref="textInputMobile"
                style={[styles.TextFam, { flex: 1, fontSize: 20 }]}
                placeholder='Type here'
                underlineColorAndroid="transparent"
                multiline={true}
                numberOfLines={2}
                onChangeText={(FeedBack) => { this.setState({ FeedBack }); }}
              />
            </View>



            <View style={{ marginHorizontal: '5%', paddingVertical: '5%' }}>
              <StarRating

                disabled={false}
                maxStars={5}
                rating={this.state.WorkRate}
                fullStarColor='#FFCA5D'
                selectedStar={(rating) => this.onWorkStarRatingPress(rating)}
              />
            </View>

            <Button block warning style={{}} onPress={this.SaveResponcePress}>
              <Text style={[styles.TextFam, { color: "#fff" }]}>Submit Response</Text>
            </Button>


          </View>
        </Modal>


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
            <TouchableOpacity onPress={() => this.setState({ isPicvisible: false })}>
              <View style={styles.ButtonSty}><Text style={{ fontWeight: 'bold', color: '#ffff', fontSize: 15 }}>Close</Text></View>
            </TouchableOpacity>

          </View>
        </Modal>
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
  gradiantStyle: {
    width: '100%',
    height: "100%",
    position: 'absolute',
    alignSelf: 'center',
  },
  Card: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS 
    elevation: 1, // Android
    width: '85%',
    height: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    marginTop: '10%',
    borderRadius: 5,
  },
  ImageStyle: {
    height: 100,
    width: 100,

  },
  rateModel: {
    backgroundColor: 'white',
    padding: 22,

    justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',

  },
  TextFam: {
    fontFamily: 'Helvetica'
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

  },
});
