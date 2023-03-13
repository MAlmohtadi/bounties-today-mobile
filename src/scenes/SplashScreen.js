import React, {useEffect} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {connect} from 'react-redux';
import appLogo from '../assets/images/logo.png';
import Pages from '../navigations/Pages';
import {getHomeInfo} from '_actions/homeActions';

const SplashScreen = ({
  navigation,
  homeReducer: {isWholeSale, appIsLoading},
}) => {
  useEffect(() => {
    if (appIsLoading) {
      setTimeout(() => {
        navigation.reset({index: 0, routes: [{name: Pages.Home.route}]});
      }, 1000);
    }
  }, [isWholeSale, appIsLoading, navigation]);

  return (
    <View style={styles.fullScreen}>
      <Image style={[styles.maskImageStyle]} source={appLogo} />
    </View>
  );
};
const styles = StyleSheet.create({
  fullScreen: {
    // flex: 1,
    position: 'absolute',
    height: hp(100),
    width: wp(100),
    // backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  maskImageStyle: {
    height: hp(40),
    width: hp(40),
  },
});

const mapStateToProps = state => {
  return {
    homeReducer: state.homeReducer,
  };
};

export default connect(mapStateToProps, {getHomeInfo})(SplashScreen);
