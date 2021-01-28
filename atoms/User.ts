import { atom } from 'recoil';

export interface User {
  id: string
  name: string
}


export const userState = atom({
    key: 'user',
    default: null as User | null,
})