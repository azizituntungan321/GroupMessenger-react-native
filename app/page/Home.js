import React, { Component } from 'react'
import { AsyncStorage, FlatList, StyleSheet, TextInput, TouchableOpacity, TouchableHighlight } from 'react-native'
import {
  Container,
  Header,
  Fab,
  Title,
  Content,
  ListItem,
  List,
  Left,
  Right,
  Body,
  Button,
  Text,
  Thumbnail,
  View,
} from 'native-base';
import axios from 'axios'
import Icon from 'react-native-vector-icons/FontAwesome5'

global.uriImage = 'https://img.icons8.com/color/420/user-group-skin-type-7.png'
export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      message: '',
      time: '',
      active: 'true'
    };
  }

  componentDidMount() {
    const { navigation } = this.props
    const id = navigation.getParam('id')
    const username = navigation.getParam('username')
    this.setState({ id, username })
    this.getAllData()
  }
  getAllData() {
    AsyncStorage.getItem('token')
      .then(res => {
        axios.get(`${global.url}/room/${this.state.id}`, {
          headers: {
            authorization: `Bearer ${res}`
          }
        }).then(res => {
          this.setState({ list: res.data.data })
        })
      })
  }

  getLastMessageData(userId, roomId) {
    AsyncStorage.getItem('token')
      .then(res => {
        axios.get(`${global.url}/room/${userId}/${roomId}`, {
          headers: {
            authorization: `Bearer ${res}`
          }
        }).then(res => {
          // return res.data.data[0].chat
          this.setState({
            message: res.data.data[0].chat,
            time: res.data.data[0].created_at
          })
        })
      })
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: '#32a5aa' }}>
          <Body style={{ flexDirection: 'row' }}>
            <Icon name='comment-dots' theme='filled' style={styles.iconHeaderBody} />
            <Title>{this.state.username}</Title>
          </Body>
          <Right>
            <TouchableHighlight>
              <Icon name='sign-out-alt' style={styles.iconHeaderRight}
                onPress={() => {
                  AsyncStorage.removeItem('token')
                  this.props.navigation.navigate('pageLogin')
                }} />
            </TouchableHighlight>
          </Right>
        </Header>
        <Content>
          <List>
            <FlatList inverted
              ref={(ref) => { this.myFlatListRef = ref }}
              data={this.state.list}
              keyExtractor={item => item.room_id}
              renderItem={({ item }) => {
                return (
                  <ListItem avatar onPress={() => {
                    this.props.navigation.navigate('pageGroup', {
                      roomId: item.room_id,
                      userId: item.user_id,
                      nameRoom: item.name
                    })
                  }}>
                    <Left>
                      <Thumbnail source={{ uri: global.uriImage }} />
                    </Left>
                    <Body>
                      <Text numberOfLines={1}>{item.name}</Text>
                      <Text numberOfLines={1} note>{item.chat}</Text>
                    </Body>
                    <Right>
                      <Text numberOfLines={1} note>{item.name}</Text>
                    </Right>
                  </ListItem>
                )
              }}
            />
          </List>
        </Content>
        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: '#32a5aa' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="plus" />
          </Fab>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  iconHeaderBody: {
    fontSize: 25,
    color: 'white',
    marginRight: 15,
    marginLeft: 10
  },
  iconHeaderRight: {
    fontSize: 25,
    color: 'white',
    marginRight: 15,
    marginLeft: 10
  }
})
