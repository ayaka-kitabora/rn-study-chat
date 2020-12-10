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
    messages: [] as any,
    loginedUser: 'テスト名前',
  }

  componentDidMount = async () => {
    const { route } = this.props;
    //this.getMessages(route.params.id)
    this.getMessages('RtK1pvXjuzYXMrpOCQ5w')
  }

  async getMessages (id: string) {
    const roomRef = db.collection('rooms')
    const snapshots = await roomRef.doc(id).collection('messages').get()
    const docs = snapshots.docs.map(doc => {
      return { ...doc.data(), id: doc.id}
    })
    await this.setState({
        messages: docs,
    })
  }
  render () {
    return (
      <View style={styles.chats}>
        {this.state.messages &&
          this.state.messages.map((message: any, i: number) => (
            <View key={i} style={styles.chatWrapper} >
              <Text style={styles.chatName}>{message.user.name}</Text>
              <View style={styles.chat} >
                <Text style={styles.chatText}>{message.text}</Text>
              </View>
            </View>
          ))
        }
      </View>
    )
  }
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
  chatText: {
  },
  chatName: {
    color: 'grey',
    fontSize: 10,
    marginBottom: 5,
  },
})
