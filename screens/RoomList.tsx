import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { roomState, Room } from '../atoms/Room';
import { userState, User } from '../atoms/User';
import Modal from 'react-native-modal'

type NavigationProp = StackNavigationProp<MainStackParamList, 'Room'>;
interface Props {
  navigation: NavigationProp;
}

export default function(props: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const setStateRoom = useSetRecoilState(roomState);

  const getData = async () => {
    const roomRef = db.collection('rooms')
    const snapshots = await roomRef.get()
    let docs = snapshots.docs.map(doc => {
      if (doc.data) {
        const { author, created_at, name, topic } = doc.data()
        console.log('id', doc.id)
        console.log('author', author.name)
        console.log('created_at', created_at)
        return {
          id: doc.id,
          author: author.name,
          created_at,
          name,
          topic,
        }
      } else {
        return null
      }
    })
    await setRooms(docs as Room[])
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

  const addRoom = () => {

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
          onPress={() => addRoom()}
        >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={true}>
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <Text>新しいルームを作ります</Text>
            <Text>ルーム名: </Text>
            <TextInput
              style={styles.input}
              // value={password}
              // onChangeText={handlePasswordChange}
            />
            <TouchableOpacity
              style={styles.submit}
              // onPress={() => login()}
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
  },
  input: {
    width: 150,
    borderColor: '#333',
    borderWidth: 1,
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

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
})
