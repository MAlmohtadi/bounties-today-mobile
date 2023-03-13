import React, {Fragment, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Button} from 'react-native-elements';
import DeliveryModal from '_organisms/DeliveryModal';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const DeliveryDetails = ({
  navigateToMapScreen,
  locationName,
  deliveryPeriod,
  onSelectPeriod,
  onSelectDate,
  deliveryInfo = [],
  chooseDeliveryEnabled,
}) => {
  let addressButtonText = locationName
    ? 'تعديل عنوان التوصيل'
    : 'تحديد عنوان التوصيل';
  let deleviryButtonText = deliveryPeriod
    ? 'تعديل موعد التوصيل'
    : 'تحديد موعد التوصيل';
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <Fragment>
      <View
        style={[
          styles.addressContainer,
          locationName ? styles.activeAddressContainer : null,
        ]}>
        <View style={styles.textContainer}>
          <Text style={styles.textAddress}>
            {locationName ? 'تم الإختيار' : null}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Button
            title={addressButtonText}
            type="clear"
            useForeground
            onPress={navigateToMapScreen}
            containerStyle={[
              styles.buttonStyle,
              locationName ? styles.buttonActiveStyle : null,
            ]}
            titleStyle={[
              styles.buttonTitleStyle,
              locationName ? styles.buttonActiveTitleStyle : null,
            ]}
          />
        </View>
      </View>
      {/* {chooseDeliveryEnabled != false && (
        <View
          style={[
            styles.addressContainer,
            deliveryPeriod ? styles.activeAddressContainer : null,
          ]}>
          <View style={styles.textContainer}>
            <Text style={styles.textAddress}>{deliveryPeriod}</Text>
          </View>
          <View style={{flex: 1}}>
            <Button
              title={deleviryButtonText}
              onPress={() => {
                toggleOverlay();
              }}
              type="clear"
              useForeground
              containerStyle={[
                styles.buttonStyle,
                deliveryPeriod ? styles.buttonActiveStyle : null,
              ]}
              titleStyle={[
                styles.buttonTitleStyle,
                deliveryPeriod ? styles.buttonActiveTitleStyle : null,
              ]}
            />
          </View>
        </View>
      )} */}
      <DeliveryModal visible={visible} toggleOverlay={toggleOverlay} />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 10,
    backgroundColor: '#FFFF',
    borderWidth: 1,
    borderColor: colors.primaryColor,
  },
  buttonActiveStyle: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: colors.primaryColor,
    borderWidth: 1,
  },
  buttonTitleStyle: {
    color: colors.primaryColor,
    fontFamily: fonts.bold,
    fontSize: wp(3.5),
  },
  buttonActiveTitleStyle: {color: '#FFF'},
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
  },
  activeAddressContainer: {
    backgroundColor: colors.primaryColorBrighter,
  },
  textContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  textAddress: {fontSize: wp(3.5), fontFamily: fonts.regular,color:colors.secondryColor},
});

export default DeliveryDetails;
