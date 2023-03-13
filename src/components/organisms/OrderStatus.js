import React from 'react';
import { I18nManager, StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Divider} from 'react-native-elements';
import fonts from '_utils/constants/Fonts';

const statusTypes = {
  1: {
    label: 'تم استلام الطلب',
    firstColor: '#29ABE2',
    secondColor: '#AAAAAA',
    thirdColor: '#AAAAAA',
    fourthColor: '#AAAAAA',
    textAlign: 'right',
    isEditable: true,
  },
  2: {
    label: 'الطلب قيد التجهيز',
    firstColor: '#415F9B',
    secondColor: '#415F9B',
    thirdColor: '#AAAAAA',
    fourthColor: '#AAAAAA',
    textAlign: 'center',
    isEditable: false,
  },
  3: {
    label: 'الطلب قيد التوصيل',
    firstColor: '#F7931E',
    secondColor: '#F7931E',
    thirdColor: '#F7931E',
    fourthColor: '#AAAAAA',
    textAlign: 'center',
    isEditable: false,
  },
  4: {
    label: 'تم توصيل الطلب',
    firstColor: '#5A9948',
    secondColor: '#5A9948',
    thirdColor: '#5A9948',
    fourthColor: '#5A9948',
    textAlign: 'left',
    isEditable: false,
  },
  5: {
    label: 'تم إلغاء الطلب',
    firstColor: '#FF0000',
    secondColor: '#FF0000',
    thirdColor: '#FF0000',
    fourthColor: '#FF0000',
    textAlign: 'left',
    isEditable: false,
  },
};
const OrderStatus = ({statusType = 0}) => {
  const {label, firstColor, secondColor, thirdColor, fourthColor, textAlign} =
    statusTypes[`${statusType}`];
  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.bullet, {color: firstColor}]}>{'\u2B24'}</Text>
        <Divider
          style={[styles.deviderStyle, {backgroundColor: secondColor}]}
        />
        <Text style={[styles.bullet, {color: secondColor}]}>{'\u2B24'}</Text>
        <Divider style={[styles.deviderStyle, {backgroundColor: thirdColor}]} />
        <Text style={[styles.bullet, {color: thirdColor}]}>{'\u2B24'}</Text>
        <Divider
          style={[styles.deviderStyle, {backgroundColor: fourthColor}]}
        />
        <Text style={[styles.bullet, {color: fourthColor}]}>{'\u2B24'}</Text>
      </View>
      <Text
        style={[
          styles.statusLabelStyle,
          {color: firstColor, textAlign: textAlign},
        ]}>
        {label}
      </Text>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection:  !I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
  bullet: {color: '#AAAAAA', paddingHorizontal: 2},
  deviderStyle: {flex: 1, backgroundColor: '#AAAAAA', height: 4},
  statusLabelStyle: {
    fontFamily: fonts.bold,
    fontSize: wp(3.8),
    marginVertical: 5,
  },
});
export default OrderStatus;
