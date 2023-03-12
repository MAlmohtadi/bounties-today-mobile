import moment from 'moment';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import OrderStatus from '_organisms/OrderStatus';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';
const OrderCard = ({
  order: {
    id,
    isCancelled,
    cancelledDate,
    orderDate,
    deliveryDate,
    totalPrice,
    statusId,
  },
  editable,
  onPressCancel,
  onPressView,
}) => {
  const date = moment(orderDate);
  return (
    <View style={styles.container}>
      <View style={styles.rowStyle}>
        <View style={[styles.rowStyle, {justifyContent: 'flex-start'}]}>
          <Text style={styles.labelStyle}>تاريخ الطلب :</Text>
          <Text style={styles.detailsTextStyle}>
            {date.format('LT')} {date.format('l')}
          </Text>
        </View>
      </View>
      <OrderStatus statusType={isCancelled ? 5 : statusId} />
      <View style={styles.rowStyle}>
        <View style={[styles.rowStyle, styles.priceContainer]}>
          <Text style={styles.labelStyle}>
            {totalPrice} JD {'المبلغ الإجمالي'}
          </Text>
        </View>
        <View style={styles.rowStyle}>
          {editable && (
            <Button
              onPress={onPressView}
              type="clear"
              title={
                isCancelled || statusId !== 1 ? 'تفاصيل الطلب' : 'تعديل الطلب'
              }
              useForeground
              titleStyle={[styles.buttonTitleStyle, {color: '#fff'}]}
              containerStyle={[styles.buttonStyle]}
            />
          )}
          {!isCancelled && statusId === 1 && (
            <Button
              onPress={onPressCancel}
              type="clear"
              title={'إلغاء الطلب'}
              useForeground
              titleStyle={[styles.buttonTitleStyle, {color: '#fff'}]}
              containerStyle={[styles.buttonStyle, {backgroundColor: '#FF0000'}]}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: wp(2),
    justifyContent: 'flex-start',
    paddingVertical: wp(2),
    paddingHorizontal: hp(2),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.3,
    elevation: 4,
  },
  rowStyle: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  labelStyle: {
    textAlignVertical: 'center',
    fontFamily: fonts.bold,
    fontSize: wp(3.4),
  },
  detailsTextStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(3.6),
  },
  priceContainer: {
    backgroundColor: '#DED6DA',
    borderRadius: 10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  buttonTitleStyle: {
    color: '#415F9B',
    fontSize: wp(3),
    fontFamily: fonts.bold,
  },
  buttonStyle: {
    backgroundColor: colors.primaryColor,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: wp(2), marginHorizontal: wp(1)
  },
});

export default OrderCard;
