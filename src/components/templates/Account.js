import React, {Fragment, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';
import Login from '_organisms/Login';
import CreateAccount from '_organisms/CreateAccount';
import {
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
} from '_actions/authActions';
import UpdateAccount from '_organisms/UpdateAccount';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';

const Account = ({authReducer, showUpdateAccount = true}) => {
  const [viewType, setViewType] = useState(authReducer.id ? null : 'main');

  return (
    <Fragment>
      {viewType === 'main' && (
        <>
          <View style={styles.subContainer}>
            <Text style={styles.titleStyle}>تسجيل دخول أو إنشاء حساب</Text>
          </View>
          <Button
            onPress={() => {
              setViewType('login');
            }}
            raised
            type="clear"
            title="تسجيل دخول"
            titleStyle={{
              color: colors.primaryColor,
              fontSize: hp(2),
              fontFamily: fonts.bold,
            }}
            useForeground
            containerStyle={[styles.buttonStyle, {marginTop: 10}]}
          />
          <Button
            onPress={() => {
              setViewType('create');
            }}
            raised
            type="clear"
            title="إنشاء حساب"
            titleStyle={{
              color: colors.primaryColor,
              fontSize: hp(2),
              fontFamily: fonts.bold,
            }}
            useForeground
            containerStyle={[styles.buttonStyle, {marginTop: 10}]}
          />
        </>
      )}
      {viewType === 'login' && !authReducer.id && (
        <Login setViewType={setViewType} />
      )}
      {viewType === 'create' && !authReducer.id && (
        <CreateAccount setViewType={setViewType} />
      )}
      {authReducer.id && showUpdateAccount && (
        <UpdateAccount setViewType={setViewType} />
      )}
    </Fragment>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: wp(2),
    borderRadius: 20,
    padding: wp(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.3,
    elevation: 4,
  },
  subContainer: {marginTop: hp(4), alignItems: 'center'},
  titleStyle: {fontFamily: fonts.bold, fontSize: hp(2)},
  buttonStyle: {
    // paddingVertical: hp(2),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: colors.primaryColor,
    backgroundColor: '#fff',
  },
});

const mapStateToProps = state => {
  return {
    authReducer: state.authReducer,
  };
};

export default connect(mapStateToProps, {
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
})(Account);
