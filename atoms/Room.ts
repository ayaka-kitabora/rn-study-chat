import { atom } from 'recoil';

export type Room = {
  author: string
  created_at: {
    seconds: number
    nanoseconds: number
  }
  id: string
} | {}

export const roomState = atom({
  key: 'roomState',
  default: {} as Room
})

export const roomListState = atom({
  key: 'roomListState',
  default: [] as Room[]

})