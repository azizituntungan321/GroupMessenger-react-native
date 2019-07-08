import React, { Component } from 'react';
import { AsyncStorage, FlatList, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native'
import {
  Button,
  Body,
  Container,
  Footer,
  Header,
  Left,
  Text,
  Thumbnail,
  Right,
  View,
} from 'native-base';
import axios from 'axios'
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal'

export default class Group extends Component {
  state = {
    userId: null,
    roomId: null,
    chat: '',
    curTime: null,
    id: null,
    id_user: null,
    list: [],
    visibleModalId: null,
  }

  componentDidMount() {
    const { navigation } = this.props
    const roomId = navigation.getParam('roomId')
    const userId = navigation.getParam('userId')
    const nameRoom = navigation.getParam('nameRoom')
    this.setState({
      roomId,
      userId,
      nameRoom
    })
    setInterval(() => {
      this.setState({
        curTime: new Date().toLocaleTimeString()
      })
      this.getAllData()
    }, 1000)
  }

  getAllData() {
    AsyncStorage.getItem('token')
      .then(res => {
        axios.get(`${global.url}/chat/${this.state.roomId}`, {
          headers: {
            authorization: `Bearer ${res}`
          }
        }).then(res => {
          this.setState({ list: res.data.data })
        }).catch(err => console.log(err))
      })
  }

  postData() {
    AsyncStorage.getItem('token')
      .then(res => {
        axios.post(`${global.url}/chat`,
          {
            chat: this.state.chat,
            userId: this.state.userId,
            roomId: this.state.roomId
          },
          {
            headers: {
              authorization: `Bearer ${res}`
            }
          }).then(res => {
            this.setState({
              chat: '',
            })
          }).catch(err => {
            console.log(err)
          })
      })
  }

  handleTextInput = (chat) => {
    this.setState({ chat })
  }

  handleSubmit = () => {
    this.postData()
  }

  handleDelete = (id, id_user) => {
    this.setState({ visibleModal: null })
    if (id_user == this.state.userId) {
      AsyncStorage.getItem('token')
        .then(res => {
          axios.delete(`${global.url}/chat/${id}`,
            {
              headers: {
                authorization: `Bearer ${res}`
              }
            }).then(res => {
            })
            .catch(err => {
            })
        })
    } else {
      alert('Cannot delete, Access denied!')
    }
    this.setState({
      id_user: null,
      id: null,
      chat: '',
    })
  }

  renderModalContent = (id, id_user) => (
    <View style={styles.content}>
      <Button block transparent style={styles.modelButton}
        onPress={() => this.handleDelete(id, id_user)}>
        <Icon name="delete" style={[styles.modelIcon, { color: 'red' }]} />
        <Text style={[styles.contentText, { color: 'black' }]}>
          Delete
        </Text>
      </Button>
      <Button block transparent style={styles.modelButton}
        onPress={() => this.setState({
          visibleModal: null,
        })}>
        <Icon name="left" style={[styles.modelIcon, { color: 'blue' }]} />
        <Text style={[styles.contentText, { color: 'black' }]}>
          Cancel
        </Text>
      </Button>
    </View>
  );

  render() {
    return (
      <Container style={styles.container} >
        <Header style={styles.header}>
          <Left>
            <Thumbnail source={{ uri: global.uriImage }} />
          </Left>
          <Body>
            <Text numberOfLines={1} style={{ color: 'white' }}>
              {this.state.nameRoom}
            </Text>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate('pageMember', {
              id: this.state.roomId
            })}>
              <Text style={{ fontSize: 12 }}>
                See all
              </Text>
            </Button>
          </Right>
        </Header>
        <View padder style={{ flex: 5 }}>
          <FlatList inverted
            ref={(ref) => { this.myFlatListRef = ref }}
            data={this.state.list}
            renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback onLongPress={() => this.setState({
                  visibleModal: 'default',
                  id_user: item.user_id,
                  id: item.id
                })}
                  title="Default"
                  style={this.state.userId == item.user_id ? styles.contentUserMapListItem : {}}>
                  <View style={this.state.userId == item.user_id ? styles.contentUserMapView : {}}>
                    <Text style={this.state.userId == item.user_id ?
                      styles.contentUserMapTextUser :
                      styles.contentGuestMapTextUser}>
                      {item.username}
                    </Text>
                    <Text style={this.state.userId == item.user_id ?
                      styles.contentUserMapTextChat :
                      styles.contentGuestMapTextChat}>
                      {item.chat}
                    </Text>
                    <Text style={this.state.userId == item.user_id ?
                      styles.contentUserMapTextTime :
                      styles.contentGuestMapTextTime}>
                      {item.created_at}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )
            }}
            keyExtractor={item => item.id}
          />
          <Modal isVisible={this.state.visibleModal === 'default'}>
            {this.renderModalContent(this.state.id, this.state.id_user)}
          </Modal>
        </View>
        <Footer style={styles.footer}>
          <View style={styles.footerView}>
            <TextInput onChangeText={this.handleTextInput}
              style={styles.footerTextInput} placeholder='Chat me about something!'
              value={this.state.chat} />
            <Button onPress={this.handleSubmit} style={styles.footerButton}>
              <Text>
                Submit
              </Text>
            </Button>
          </View>
        </Footer>
      </Container >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CAEEFD'
  },
  header: {
    backgroundColor: '#32a5aa'
  },
  headerIcon: {
    color: 'white',
    fontSize: 25
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentGuestMapTextUser: {
    color: '#32a5aa',
    fontWeight: 'bold',
  },
  contentGuestMapTextChat: {
    backgroundColor: '#4fc287',
    padding: 10,
    borderRadius: 18,
    borderTopLeftRadius: 0,
    marginTop: 5,
    color: 'white',
  },
  contentGuestMapTextTime: {
    marginLeft: 3,
    marginTop: 3,
    color: 'grey'
  },
  contentUserMapListItem: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  contentUserMapView: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  contentUserMapTextUser: {
    color: '#32a5aa',
    fontWeight: 'bold',
  },
  contentUserMapTextChat: {
    backgroundColor: '#32a5aa',
    padding: 10,
    borderRadius: 18,
    borderTopRightRadius: 0,
    marginTop: 5,
    color: 'white',
    textAlign: 'right'
  },
  contentUserMapTextTime: {
    marginLeft: 3,
    marginTop: 3,
    color: 'grey'
  },
  modelButton: {
    flexDirection: 'row'
  },
  modelIcon: {
    fontSize: 25,
    marginRight: 5
  },
  footer: {
    backgroundColor: 'white'
  },
  footerView: {
    flexDirection: 'row',
    flex: 1,
    margin: 5
  },
  footerTextInput: {
    flex: 9
  },
  footerButton: {
    backgroundColor: '#32a5aa',
    width: null
  }
})