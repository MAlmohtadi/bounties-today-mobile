import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import colors from '_utils/constants/Colors';

const LoadingSpinner = ({style}) => {
  return (
    <View style={[{flex: 1, justifyContent: 'center'}, style]}>
      <ActivityIndicator size="large" color={colors.primaryColor }/>
    </View>
  );
};

export default LoadingSpinner;
