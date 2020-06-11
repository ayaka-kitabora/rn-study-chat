import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from './Firebase'

class App extends Component {
  state = {
    user: null
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user: any) => {
      this.setState({ user })
    })
  }
  login() {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }
  logout() {
    firebase.auth().signOut()
  }
  render () {
    return (
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View>
    );
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
