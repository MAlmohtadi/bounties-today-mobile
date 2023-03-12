import {Settings} from 'react-native-fbsdk-next';

// Ask for consent first if necessary
// Possibly only do this for iOS if no need to handle a GDPR-type flow
Settings.initializeSDK();
