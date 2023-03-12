import { Platform } from 'react-native';


let messaging = null;
export const isNotificationSupported = () => {
  if (Platform.OS == 'android' && Platform.Version < 21) {
    return false
  }
  return true
}

export const getMessagingObject = () => {
  if (messaging != null) {
    return messaging;
  }
  messaging = require('@react-native-firebase/messaging').default();
  return messaging;
}