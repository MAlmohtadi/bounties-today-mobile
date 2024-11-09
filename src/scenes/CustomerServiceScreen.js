import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const CustomerServiceScreen = ({
  homeReducer: {
    contactInfo
  }
}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.textStyle}>
         {contactInfo.description}
        </Text>
        <Text style={styles.textStyle}>{contactInfo.email}</Text>
        <Text style={styles.textStyle}>{contactInfo.phone}</Text>
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
    color: colors.textColor,
    fontSize: wp(5),
    textAlign: 'center',
    margin: heightPercentageToDP(2),
  },
});
//export default CustomerServiceScreen;
const mapStateToProps = state => {
  return {
    homeReducer: state.homeReducer,
  };
};

export default connect(mapStateToProps)(CustomerServiceScreen);
