import { atom } from 'recoil';

export interface User {
  id: string
  name: string
}


export const userState = atom({
    key: 'userState',
    default: null as User | null,
})