import { createAppContainer, createStackNavigator } from 'react-navigation';
import Login from './app/page/Login';
import Group from './app/page/Group';
import Home from './app/page/Home';
import Member from './app/page/Member';

const rootNavigation = createStackNavigator({
  pageLogin: {
    screen: Login,
    navigationOptions: {
      header: null,
    }
  },
  pageHome: {
    screen: Home,
    navigationOptions: {
      header: null,
    }
  },
  pageGroup: {
    screen: Group,
    navigationOptions: {
      header: null,
    }
  },
  pageMember: {
    screen: Member,
    navigationOptions: {
      title: 'All members',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#32a5aa'
      },
    }
  }
}, {

  });

export default createAppContainer(rootNavigation);