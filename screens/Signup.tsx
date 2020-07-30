import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import firebase from '../Firebase';


class Signup extends Component {
  state = {
    user: null as any,
    email: '' as string,
    password: '' as string,
    name: '' as string,
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
        //　上手くとれていない
        console.log(user.uid)
        /*
          const uid = user.uid
          firebase.firestore().collection('users').doc(uid).set({name})
            .then(()=> {
              console.log(uid)
            }).catch((e) => {
              console.error("Error writing document: ", e);
            })
          */
          console.log("Success to Signup")
      }
    })
    .catch(error => {
        console.log(error);
    })
  }

  handleEmailChange = (inputValue: string) => {
    this.setState({ email: inputValue })
  }

  handlePasswordChange = (inputValue: string) => {
    this.setState({ password: inputValue })
  }

  handleNameChange = (inputName: string) => {
    this.setState({ name: inputName })
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text>アカウント名: </Text>
          <TextInput
            style={styles.input}
            value={this.state.name}
            onChangeText={this.handleNameChange}
          />
        </View>
        <View style={styles.row}>
          <Text>メールアドレス: </Text>
          <TextInput
            style={styles.input}
            value={this.state.email}
            onChangeText={this.handleEmailChange}
          />
        </View>
        <View style={styles.row}>
          <Text>パスワード: </Text>
          <TextInput
            style={styles.input}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
          />
        </View>
        <TouchableOpacity
          style={styles.submit}
          onPress={() => this.signup()}
        >
          <Text>サインアップ</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default Signup;

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
