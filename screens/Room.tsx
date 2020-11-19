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
    messages: [] as any
  }

  componentDidMount = async () => {
    const { route } = this.props;
    this.getMessages(route.params.id)
  }

  async getMessages (id: string) {
    const roomRef = db.collection('rooms')
    const snapshots = await roomRef.doc(id).collection('messages').get()
    const docs = snapshots.docs.map(doc => {
      console.log(doc.id)
      return { ...doc.data(), id: doc.id}
    })
    await this.setState({
        messages: docs,
    })
  }
  render () {
    return (
      <View>
        {this.state.messages &&
          this.state.messages.map((message: any, i: number) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{message.text}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))
        }
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
