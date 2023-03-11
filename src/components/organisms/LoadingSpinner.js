import React from 'react';
import {View, ActivityIndicator} from 'react-native';

const LoadingSpinner = ({style}) => {
  return (
    <View style={[{flex: 1, justifyContent: 'center'}, style]}>
      <ActivityIndicator size="large" color="#61012D" />
    </View>
  );
};

export default LoadingSpinner;
