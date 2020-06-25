import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import firebase from './Firebase';


class App extends Component {
  state = {
    user: null as any,
    email: '' as string,
    password: '' as string,
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user: any) => {
      this.setState({ user })
    })
  }
  signup () {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((user: any) => {
        if (user) {
            console.log("Success to Signup")
        }
    })
    .catch(error => {
        console.log(error);
    })
  }
  login() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(response => {
        alert("Login Success!");
    })
    .catch(error => {
        alert(error.message);
    });
  }
  logout() {
    firebase.auth().signOut()
  }
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text>メールアドレス: </Text>
          <TextInput
            style={styles.input}
            value={this.state.email}
          />
        </View>
        <View style={styles.row}>
          <Text>パスワード: </Text>
          <TextInput
            style={styles.input}
            value={this.state.password}
          />
        </View>
        <TouchableOpacity
          style={styles.submit}
          onPress={() => this.login()}
          >
            <Text>ログイン</Text>
          </TouchableOpacity>
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
