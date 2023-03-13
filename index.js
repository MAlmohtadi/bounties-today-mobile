/**
 * @format
 */
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';

import App from './App';
import {name as appName} from './app.json';
import {
  isNotificationSupported,
  setBackgroundHandler,
  requestPermission,
} from './NotificationManager';

LogBox.ignoreAllLogs();

if (isNotificationSupported()) {
  setBackgroundHandler();
  requestPermission();
}

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);
