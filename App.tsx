import 'react-native-gesture-handler';
import React, {Component} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import {decode, encode} from 'base-64';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

// ページを追加する
import Login from './screens/Login';
import Signup from './screens/Signup';
import RoomList from './screens/RoomList';
import Room from './screens/Room';


class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="ルーム" component={RoomList} />
          <Stack.Screen name="Room" component={Room} />
          <Stack.Screen name="ログイン" component={Login} />
          <Stack.Screen name="サインアップ" component={Signup} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
export default App;
