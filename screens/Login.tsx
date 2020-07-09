import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
import firebase from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<MainStackParamList, 'Signup'>;
interface Props {
  navigation: NavigationProp;
}


class Login extends Component<Props> {
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

  handleEmailChange = (inputValue: string) => {
    this.setState({ email: inputValue })
  }

  handlePasswordChange = (inputValue: string) => {
    this.setState({ password: inputValue })
  }

  render () {
    return (
      <View style={styles.container}>
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
          onPress={() => this.login()}
        >
          <Text>ログイン</Text>
        </TouchableOpacity>
        <Button
          title="アカウント作成"
          onPress={() => {
            this.props.navigation.navigate('Signup')
          }}
        />
      </View>
    );
  }
}
export default Login;

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
