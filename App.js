import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { store, persistor } from './src/store/configureStore';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import CustomerDrawer from './src/navigations/CustomDrawer';

import Notificaiton from './src/components/organisms/Notification';
import { isNotificationSupported ,onMessage} from './NotificationManager';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [notificaiton, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const subscribeListeners = [];
    if (isNotificationSupported()) {
      subscribeListeners.push(messaging().onMessage(async remoteMessage => {
        Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      }))

      subscribeListeners.push(messaging().onNotificationOpenedApp(async remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        setNotification({ ...remoteMessage });
        setIsVisible(true);
      }))
      // getMessagingObject().getToken().then(token => console.log("TOKEN:", token))
      messaging().getToken().then(token => console.log("TOKEN:", token))
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
            setNotification({ ...remoteMessage });// e.g. "Settings"
            setIsVisible(true);
          }
        }).catch(e => {
          setIsVisible(false)
        })
    }
    return () => {
      subscribeListeners.forEach(unSub => {
        unSub();
      })
    };

  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <CustomerDrawer />
        <Notificaiton
          visible={isVisible}
          notificationData={notificaiton}
          buttonAction={() => {
            setIsVisible(false);
            setNotification(null);
          }}
        />
      </PersistGate>
    </Provider>
  );
};

export default App;
