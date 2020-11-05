import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<MainStackParamList, 'Room'>;
interface Props {
  navigation: NavigationProp;
}


class RoomList extends Component<Props> {
  state = {
    rooms: [] as any 
  }

  getData = async () => {
    const roomRef = db.collection('rooms')
    const snapshots = await roomRef.get()
    const docs = snapshots.docs.map(doc => {
      console.log(doc.data())
      return { ...doc.data(), id: doc.id}
    })
    
    await this.setState({
        rooms: docs,
    })
  }

  componentDidMount = async () => {
    await this.getData()
    //collectionの更新を監視
    // this.unsubscribe = db.collection("members").onSnapshot(this.onCollectionUpdate)
  }

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
 
  onClickRoom = (id: string) => {
    this.props.navigation.navigate('Room',{
      id: id,
    })
  }

  render () {
    return (
      <View>
        {
          this.state.rooms.map((room: any, i: number) => (
            <ListItem key={i} bottomDivider onPress={() => this.onClickRoom(room.id)}>
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
