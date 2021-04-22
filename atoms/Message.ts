import { atom } from 'recoil';

export type Message = {
  user: {
    id: string
    name: string
    user_url: string
  }
  created_at: {
    seconds: number
    nanoseconds: number
  }
  id: string
  text: string
}

export const messageState = atom({
  key: 'messageState',
  default: {} as Message
})

export const messageListState = atom({
  key: 'messageListState',
  default: [] as Message[]
})