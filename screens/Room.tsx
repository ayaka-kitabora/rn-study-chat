import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, FlatList } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../Firebase'
import { StackNavigationProp } from '@react-navigation/stack'
import { useRoute } from '@react-navigation/native'
import { messageListState, Message } from '../atoms/Message'
import { useRecoilValue } from 'recoil'
import { userState } from '../atoms/User'
import firebase from '../Firebase'

import { formatToTimeZone } from 'date-fns-timezone'
const FORMAT = 'YYYY/MM/DD HH:mm'
const TIME_ZONE_TOKYO = 'Asia/Tokyo'

type NavigationProp = StackNavigationProp<MainStackParamList, 'Signup'>
interface Props {
  navigation: NavigationProp;
  id: String
  route: any
}

export default function(props: Props) {
  const route = useRoute()

  return <Room {...props} route={route} />;
}

function Room(props: Props){
  const [messages, setMessages] = useState<Message[]>([])
  const user = useRecoilValue(userState)
  const [inputText, setInputText] = useState('')

  const { route } = props
  const roomId = route?.params?.id ?? 'RtK1pvXjuzYXMrpOCQ5w' // 後でデフォルト値消す

  useEffect(() => {
    getMessages(roomId)
  }, [])

  const getMessages = async(id: string) => {
    const roomRef = db.collection('rooms')
    await roomRef.doc(id).collection('messages').onSnapshot(querySnapshot => {
      let newMessages: Message[] = []
      querySnapshot.forEach(doc => {
        const data = doc.data()
        newMessages.push({
          user: data.user,
          id: doc.id,
          created_at: data.created_at,
          text: data.text,
        })
      })
      setMessages(newMessages)
    })
  }

  const currentUserBool = (message: Message) => {
    return message.user.id === user.id
  }

  const submit = () => {
    const newMessage = {
      user: {
        ...user,
        user_url: db.doc('users/' + user.id),
      },
      text: inputText,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
    }
    firebase.firestore().collection('rooms').doc(roomId).collection('messages').add(newMessage)
      .then(()=> {
        // テキストエリアのクリア
        setInputText('')
        console.log("Success to send")
      }).catch((e) => {
        console.error("Error writing document: ", e)
      })
    
  }

  const handleInputTextChange = (inputValue: string) => {
    setInputText(inputValue)
  }

  return (
    <View style={styles.room}>
      <View style={styles.chats}>
        {messages &&
          messages.map((message: any, i: number) => (
            <View key={i} style={styles.chatWrapper}>
              <Text style={styles.chatName}>{message.user.name}</Text>
              <View style={currentUserBool(message) ? styles.chatCurrent :  styles.chat} >
                <Text style={styles.chatText}>{message.text}</Text>
              </View>
              <Text style={styles.chatDate}>{formatToTimeZone(
                new Date(message.created_at?.seconds * 1000),
                  FORMAT,
                  { timeZone: TIME_ZONE_TOKYO }
                )}
              </Text>
            </View>
          ))
        }
      </View>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleInputTextChange}
          multiline
        />
        <TouchableOpacity
          style={styles.submit}
          onPress={() => submit()}
        >
          <Text style={styles.submitText}>送信</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chats: {
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
  },
  chatWrapper: {
    marginBottom: 10,
  },
  chat: {
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 6,
    padding: 10,
  },
  chatCurrent: {
    backgroundColor: 'pink',
    marginBottom: 5,
    borderRadius: 6,
    padding: 10,
  },
  chatText: {
  },
  chatDate: {
    textAlign: 'right',
    color: 'grey',
    fontSize: 10,
    marginBottom: 5,
  },
  chatName: {
    color: 'grey',
    fontSize: 10,
    marginBottom: 5,
  },
  submit: {
    backgroundColor: '#7f7fff',
    textAlign: 'center',
    marginLeft: 10,
    padding: 10,
  },
  submitText: {
    color: '#fff',
  },
  input: {
    width: 150,
    padding: 8,
    backgroundColor: 'white',
    flex: 1
  },
  inputBox: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#ccccff'
  },
  room: {
    flex: 1,
  },
})
