import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRecoilState } from 'recoil';
import { roomListState, roomState } from '../atoms/Room';

type NavigationProp = StackNavigationProp<MainStackParamList, 'Room'>;
interface Props {
  navigation: NavigationProp;
}

function RoomList(props: Props) {
  const [rooms, setRooms] = useRecoilState(roomListState)
  const [room, setRoom] = useRecoilState(roomState)

  const getData = async () => {
    const roomRef = db.collection('rooms')
    const snapshots = await roomRef.get()
    let docs = []
    docs = snapshots.docs.map(doc => {
      if (doc.data) {
        return { ...doc.data(), id: doc.id }
      } else {
        return {}
      }
    })
    
    if (docs.length > 0) {
      await setRooms(docs)
    }
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
    const room = rooms.find(room => room && room.id === id)
    setRoom(room)
    props.navigation.navigate('Room',{
      id: id,
    })
  }

  return (
    <View>
      {
        rooms.map((room: any, i: number) => (
          <ListItem key={i} bottomDivider onPress={() => onClickRoom(room.id)}>
            <ListItem.Content>
              <ListItem.Title>{room.name}</ListItem.Title>
              <View style={styles.subtitleView}>
                <ListItem.Subtitle style={styles.ratingText}>{room.topic}</ListItem.Subtitle>
              </View>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))
      }
    </View>
  )
}
export default RoomList;

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  ratingText: {
    color: 'grey'
  }
})
