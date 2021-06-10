import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';
import { messageListState, Message } from '../atoms/Message';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/User';

import { formatToTimeZone } from 'date-fns-timezone';
const FORMAT = 'YYYY/MM/DD HH:mm';
const TIME_ZONE_TOKYO = 'Asia/Tokyo';

type NavigationProp = StackNavigationProp<MainStackParamList, 'Signup'>;
interface Props {
  navigation: NavigationProp;
  id: String;
  route: any;
}

export default function(props: Props) {
  const route = useRoute();

  return <Room {...props} route={route} />;
}

function Room(props: Props){
  const [messages, setMessages] = useState<Message[]>([])
  const user = useRecoilValue(userState)
  const [inputText, setinputText] = useState('')

  useEffect(() => {
    const { route } = props
    getMessages(route?.params?.id ?? 'RtK1pvXjuzYXMrpOCQ5w') // 後でデフォルト値消す
  }, [])

  const getMessages = async(id: string) => {
    const roomRef = db.collection('rooms')
    const snapshots = await roomRef.doc(id).collection('messages').get()
    const docs = snapshots.docs.map(doc => {
      const data = doc.data()
      return {
        user: data.user,
        id: doc.id,
        created_at: data.createdAt,
        text: data.text,
       }
    })
    await setMessages(docs)
  }

  const currentUserBool = (message: Message) => {
    return message.user.id === user.id
  }

  const submit = () => {
    
  }

  const handleInputTextChange = (inputValue: string) => {
    setinputText(inputValue)
  }

  return (
    <View style={styles.room}>
      <View style={styles.chats}>
        {messages &&
          messages.map((message: any, i: number) => (
            <View key={i} style={styles.chatWrapper} >
              <Text style={styles.chatName}>{message.user.name}</Text>
              <View style={currentUserBool(message) ? styles.chatCurrent :  styles.chat} >
                <Text style={styles.chatText}>{message.text}</Text>
              </View>
              <Text style={styles.chatDate}>{formatToTimeZone(
                new Date(message.created_at.seconds * 1000),
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
  }
})
