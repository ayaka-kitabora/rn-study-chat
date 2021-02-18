import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
import firebase from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSetRecoilState } from 'recoil';
import { userState } from '../atoms/User';
import { db } from '../Firebase';

type NavigationProp = StackNavigationProp<MainStackParamList, 'Signup'>;
interface Props {
  navigation: NavigationProp;
}


function Login(props: Props) {

  const [user, setUser] = useSetRecoilState(userState)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect (() =>{
    firebase.auth().onAuthStateChanged(async (userData: any) => {
      const usersRef = db.collection('users')
      const doc = await usersRef.doc(userData.id).get()
      if (doc.exists) {
        const data = doc.data()
        setUser({
          id: userData.id,
          name: data?.name,
        })
        console.log(user)
      }
    })
  })
  const login = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(_response => {
      props.navigation.navigate('RoomList')
    })
    .catch(error => {
        alert(error.message);
    });
  }
  const logout = () => {
    firebase.auth().signOut()
  }

  const handleEmailChange = (inputValue: string) => {
    setEmail(inputValue)
  }

  const handlePasswordChange = (inputValue: string) => {
    setPassword(inputValue)
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>メールアドレス: </Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={handleEmailChange}
        />
      </View>
      <View style={styles.row}>
        <Text>パスワード: </Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={handlePasswordChange}
        />
      </View>
      <TouchableOpacity
        style={styles.submit}
        onPress={() => login()}
      >
        <Text>ログイン</Text>
      </TouchableOpacity>
      <Button
        title="アカウント作成"
        onPress={() => {
          props.navigation.navigate('Signup')
        }}
      />
    </View>
  );
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
