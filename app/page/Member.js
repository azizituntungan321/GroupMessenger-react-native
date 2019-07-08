import React, { Component } from 'react';
import { AsyncStorage, FlatList } from 'react-native'
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Thumbnail
} from 'native-base';
import axios from 'axios'

global.uriImageUser = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXpzxQHiZuJqWbNBHTQ4d0xg_mCZfWvPP4m2e9R0DhpWUFmP7'
export default class Member extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      id: null
    };
  }

  componentDidMount() {
    const { navigation } = this.props
    const id = navigation.getParam('id')
    this.setState({ id })
    this.getAllData()
  }

  getAllData() {
    AsyncStorage.getItem('token')
      .then(res => {
        axios.get(`${global.url}/paticipant/${this.state.id}`, {
          headers: {
            authorization: `Bearer ${res}`
          }
        }).then(res => {
          this.setState({ list: res.data.data })
        })
      })
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#CAEEFD' }}>
        <Content>
          <List>
            <FlatList inverted
              ref={(ref) => { this.myFlatListRef = ref }}
              data={this.state.list}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                return (
                  <ListItem style={{ flexDirection: 'row' }}>
                    <Thumbnail style={{ marginRight: 15 }}
                      source={{ uri: global.uriImageUser }} />
                    <Text numberOfLines={1}>{item.username}</Text>
                  </ListItem>
                )
              }}
            />
          </List>
        </Content>
      </Container>
    );
  }
}