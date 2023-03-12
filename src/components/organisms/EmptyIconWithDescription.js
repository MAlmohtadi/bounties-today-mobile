import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

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
    backgroundColor: colors.primaryColorBrighter,
    padding: wp(20),
    borderRadius: wp(35),
  },
  description: {
    fontSize: wp(5),
    fontFamily: fonts.bold,
    color: colors.primaryColor,
    margin: hp(4),
  },
});
export default EmptyIconWithDescription;
