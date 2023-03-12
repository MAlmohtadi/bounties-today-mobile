import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import NetworkIssue from '_icons/networkIssue';
import {errorMessage} from '_utils/errorMessages';
import RNRestart from 'react-native-restart';
import {connect} from 'react-redux';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';

const NoConnection = ({alertReducer: {error}}) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (error !== null && error.status === 0) {
      setIsVisible(true);
    }
  }, [error]);

  return (
    isVisible && (
      <View style={styles.mainContainer}>
        <View />
        <View style={styles.center}>
          <NetworkIssue fill={'#000'} />
          <Text
            style={{fontFamily: fonts.bold, marginTop: 10, fontSize: 20}}>
            لا يوجد اتصال بالإنترنت
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              marginTop: 10,
              fontSize: 16,
            }}>
            {errorMessage.networkError}
          </Text>
        </View>
        <Button
          onPress={() => {
            RNRestart.Restart();
          }}
          type="clear"
          title="إعادة المحاولة"
          titleStyle={{color: '#fff', fontFamily: fonts.bold}}
          useForeground
          containerStyle={[
            {
              backgroundColor: colors.primaryColor,
              marginHorizontal: wp(2),
              marginBottom: 15,
              borderRadius: 10,
              borderRadius: wp(2)
            },
          ]}
        />
      </View>
    )
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    height: hp(100),
    width: wp(100),
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    // backgroundColor: '#e9dfe4',
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
const mapStateToProps = (state) => {
  return {
    alertReducer: state.alertReducer,
  };
};

export default connect(mapStateToProps, {})(NoConnection);
