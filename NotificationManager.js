import { Platform,Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const isNotificationSupported = () => {
  if (Platform.OS == 'android' && Platform.Version < 21) {
    return false
  }
  return true
}


export const onMessage =()=>{
  messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  })
}
export const setBackgroundHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });
}

export const requestPermission = () => {
  messaging()
    .requestPermission()
    .then((authorizationStatus) => {
      if (authorizationStatus) {
        console.log('Permission status:', authorizationStatus);
      }
    })
    .catch((e) => {
      console.log('Permission status error:', JSON.stringify(e));
    });
}