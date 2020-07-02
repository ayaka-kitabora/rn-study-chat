import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import firebase from './Firebase';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// ページを追加する
import Login from './screens/Login';
import Signup from './screens/Signup';


// setting main nav
const MainStack = createStackNavigator(
  {
    Login,
    Signup,
  }
)

const AppContainer = createAppContainer(MainStack)

class App extends Component {
  render() {
    return (
      <AppContainer />
    )
  }
}
export default App;
