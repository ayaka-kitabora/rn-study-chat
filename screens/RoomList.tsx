import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { roomState, Room } from '../atoms/Room';
import { userState, User } from '../atoms/User';
import Modal from 'react-native-modal'
import firebase from '../Firebase'

type NavigationProp = StackNavigationProp<MainStackParamList, 'Room'>;
interface Props {
  navigation: NavigationProp;
}

export default function(props: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const setStateRoom = useSetRecoilState(roomState);
  const [showModal, setShowModal] = useState(false);
  const user = useRecoilValue(userState)

  const [inputRoomName, setInputRoomName] = useState('');
  const [inputTopic, setInputTopic] = useState('');

  const getData = async () => {
    const roomRef = db.collection('rooms')
    await roomRef.onSnapshot(querySnapshot => {
      let rooms: Room[] = []
      querySnapshot.forEach(doc => {
        const data = doc.data()
        if (data) {
          rooms.push({
            id: doc.id,
            author: data.author.name,
            created_at: data.created_at,
            name: data.name,
            topic: data.topic,
          })
        }
      })
    })
    await setRooms(rooms)
  }

  useEffect(() => {
    getData()
    //collectionの更新を監視
    // this.unsubscribe = db.collection("members").onSnapshot(this.onCollectionUpdate)
  }, [])

  /*
  //更新時のcalback
  onCollectionUpdate = (querySnapshot: any) => {
    //変更の発生源を特定 local:自分, server:他人
    // const source = querySnapshot.metadata.hasPendingWrites ? "local" : "server";
    // if (source === 'local')  this.getData(); //期待した動きをしない
    this.getData();
  }


  //監視解除
  componentWillUnmount = () => {
    this.unsubscribe();
  }
  */
 
  const onClickRoom = (id: string) => {
    const clickRoom = rooms.find(item => item && item?.id === id)
    setStateRoom(clickRoom as Room)
    props.navigation.navigate('Room',{
      id: id,
    })
  }

  const handleModal = () => {
    setShowModal(!showModal);
  }

  const handleInputRoomName = (inputRoomName: string) => {
    setInputRoomName(inputRoomName)
  }

  const handleInputTopic = (inputTopic: string) => {
    setInputTopic(inputTopic)
  }

  const submitRoomName = () => {
    firebase.firestore().collection('rooms').add({
      author: db.doc('users/' + user.id),
      name: inputRoomName,
      topic: inputTopic,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(()=> {
      // テキストエリアのクリア
      setInputRoomName('')
      setInputTopic('')
      console.log("Success to send")
    }).catch((e) => {
      console.error("Error writing document: ", e)
    })
  }

  return (
    <View style={styles.roomList}>
      <View style={styles.roomList}>
        {
          rooms.map((item: any, i: number) => (
            <ListItem key={i} bottomDivider onPress={() => onClickRoom(item.id)}>
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <View style={styles.subtitleView}>
                  <ListItem.Subtitle style={styles.ratingText}>{item.topic}</ListItem.Subtitle>
                </View>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))
        }
        <TouchableOpacity
          style={styles.addRoom}
          onPress={() => handleModal()}
        >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={showModal}>
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => handleModal()}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalHead}>新しいルームを作ります</Text>
            <TextInput
              style={styles.input}
              placeholder="ルーム名"
              value={inputRoomName}
              onChangeText={handleInputRoomName}
            />
            <TextInput
              style={styles.input}
              placeholder="トピック"
              value={inputTopic}
              onChangeText={handleInputTopic}
            />
            <TouchableOpacity
              style={styles.submit}
              onPress={() => submitRoomName()}
            >
              <Text>ログイン</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  ratingText: {
    color: 'grey'
  },
  addRoom: {
    borderRadius: 50,
    backgroundColor: 'blue',
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  roomList: {
    flex: 1,
  },
  modalWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: 'white',
    width: 200,
    height: 200,
    zIndex: 2,
    padding: 20,
    justifyContent: 'center',
  },
  modalHead: {
    marginBottom: 10,
    fontWeight: 'bold'
  },
  input: {
    width: 150,
    borderColor: '#333',
    borderWidth: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 5,
    marginBottom: 10,
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
  },
  closeModal: {
    borderRadius: 50,
    backgroundColor: 'gray',
    position: 'absolute',
    right: -15,
    top: -15,
    width: 30,
    height: 30,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  }
})
