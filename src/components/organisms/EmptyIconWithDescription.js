import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const EmptyIconWithDescription = ({iconComponent, description}) => {
  return (
    <>
      <View style={styles.iconContainer}>{iconComponent}</View>
      <Text style={styles.description}>{description}</Text>
    </>
  );
};
const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#e9dfe4',
    padding: wp(20),
    borderRadius: wp(35),
  },
  description: {
    fontSize: wp(5),
    fontFamily: 'Tajawal-Bold',
    color: '#61012D',
    margin: hp(4),
  },
});
export default EmptyIconWithDescription;
