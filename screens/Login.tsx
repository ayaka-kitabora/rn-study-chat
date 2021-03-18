import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
import firebase from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRecoilState } from 'recoil';
import { userState } from '../atoms/User';
import { db } from '../Firebase';

type NavigationProp = StackNavigationProp<MainStackParamList, 'Signup'>;
interface Props {
  navigation: NavigationProp;
}


function Login(props: Props) {

  const [user, setUser] = useRecoilState(userState)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const firebaseLogin = async (id: string) => {
    console.log('id', id)
    if (!id) return
    const usersRef = db.collection('users')
    const doc = await usersRef.doc(id).get()
    if (doc.exists) {
      const data = doc.data()
      setUser({
        id: id,
        name: data?.name,
      })
      console.log(user)
    }
    props.navigation.navigate('RoomList')
  }
  useEffect(() =>{
    firebase.auth().onAuthStateChanged(async (user: any) => {
      if (user) firebaseLogin(user.id)
    })
  },[])
  const login = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(data => {
      console.log(data?.user?.uid)
      if (data.user) firebaseLogin(data?.user?.uid)
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
