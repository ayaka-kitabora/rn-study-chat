# セットアップ
https://reactnative.dev/docs/environment-setup

```
npm install -g expo-cli
yarn
yarn ios
```

# Expo pasted from CoreSimulator bugfix
https://github.com/expo/expo/issues/9089
`expo client:install:ios` で
`SDK 37.0.0. -> 38.0.0. `に更新する

# envファイルを作成する
firebaseのAPIKEY等を入れる必要がある

```
apiKey: process.env.apiKey
authDomain: process.env.authDomain
databaseURL: process.env.databaseURL
projectId: process.env.projectId
storageBucket: process.env.storageBucket,
messagingSenderId: process.env.messagingSenderId,
appId: process.env.appId,
```


