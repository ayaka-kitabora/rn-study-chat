import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../Firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';


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




class Room extends Component<Props> {
  state = {
    room: {
      messages: []
    },
  }

  /*
  componentDidMount = async () => {
    await this.getData()
    //collectionの更新を監視
    // this.unsubscribe = db.collection("members").onSnapshot(this.onCollectionUpdate)
  }
  */

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

  render () {
    const { route } = this.props;
    console.log("route.id")
    console.log(route)
    console.log(route.params.id)
    async () => {
      const roomRef = db.collection('rooms')
      const doc = await roomRef.doc(route.params.id).get()
      console.log(doc)
      if (doc.exists) {
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      
      await this.setState({
          rooms: doc,
      })
    }
    return (
      <View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  ratingText: {
    color: 'grey'
  }
})
