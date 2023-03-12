
/**
 * @format
 */
import React from 'react';
import { AppRegistry, LogBox } from 'react-native';

import App from './App';
import { name as appName } from './app.json';
import { getMessagingObject, isNotificationSupported } from './NotificationManager';

LogBox.ignoreAllLogs();

if (isNotificationSupported()) {
  getMessagingObject().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });
  getMessagingObject()
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

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);
