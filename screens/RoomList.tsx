import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
import firebase from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<MainStackParamList, 'Signup'>;
interface Props {
  navigation: NavigationProp;
}


class RoomList extends Component<Props> {
  state = {
    rooms: []
  }
  componentDidMount() {
    firebase.firestore().collection('room').doc()
      .get()
      .then((querySnapshot: any)=> { //TODO any
        querySnapshot.forEach((doc: any) => { //TODO any
          console.log(doc.id, " => ", doc.data());
        })
      }).catch((e) => {
        console.error("Error writing document: ", e)
      })
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
        </View>
      </View>
    );
  }
}
export default RoomList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    width: 200,
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    width: 150,
    borderColor: '#333',
    borderWidth: 1,
    padding: 5
  },
  submit: {
    width: 100,
    borderColor: '#333',
    borderWidth: 1,
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 5,
    marginTop: 10,
  }
});
