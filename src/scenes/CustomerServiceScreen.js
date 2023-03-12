import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import fonts from '_utils/constants/Fonts';

const CustomerServiceScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.textStyle}>لاي ملاحظات او اقتراحات يرجى التواصل معنا عن طريق الايميل:</Text>
        <Text style={styles.textStyle}>info@bountiestodayjo.com</Text>
        <Text style={styles.textStyle}>0781000035</Text>
      </View>

    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: wp(4),
    borderRadius: 20,
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.3,
    elevation: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: heightPercentageToDP(2),
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(5),
    textAlign: 'center',
    margin: heightPercentageToDP(2)
  },

});
export default CustomerServiceScreen;
