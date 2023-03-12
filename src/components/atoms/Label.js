import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import fonts from '_utils/constants/Fonts';

const Label = ({text, ...restProps}) => {
  return (
    <View {...restProps}>
      <Text style={styles.text}>{text} JD</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  text: {
    margin: 5,
    fontSize: 11,
    fontFamily: fonts.regular,
    color: '#000',
  },
});

export default memo(Label);
