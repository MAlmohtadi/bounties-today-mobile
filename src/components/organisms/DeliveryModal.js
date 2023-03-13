import React, {useState} from 'react';
import {StyleSheet, View, Text, Modal, ScrollView} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import HorizontalButtons from '_organisms/HorizontalButtons';
import {setSelectedCategory} from '_actions/homeActions';
import {updateCheckoutDetails} from '_actions/checkoutActions';
import {TouchableOpacity} from 'react-native';
import AlertMessage from '_organisms/AlertMessage';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';

const DeliveryModal = ({
  visible,
  toggleOverlay,
  updateCheckoutDetails,
  homeReducer: {
    adminSettingsResponse: {
      choose_delivery_period_enabled,
      chooseDeliveryEnabled,
    },
  },
  checkoutReducer: {deliveryInfo = []},
}) => {
  const confirm = () => {
    let message = 'يجب اختيار التالي:';
    if (selectedPeriod && selectedPeriod) {
      updateCheckoutDetails({
        deliveryDate: getSelectedDateInfo(selectedDate).displayName,
        deliveryPeriod: selectedPeriod ? selectedPeriod.name : null,
        deliveryPrice: selectedPeriod
          ? selectedLocation
            ? selectedPeriod.othersPrice
            : selectedPeriod.price
          : null,
      });
      toggleOverlay();
    } else {
      if (chooseDeliveryEnabled != false) {
        message = !selectedDate ? message + '\n\n - يوم التوصيل' : message;
        message =
          choose_delivery_period_enabled !== false && !selectedPeriod
            ? message + '\n\n - وقت التوصيل'
            : message;
        setValidationMessage(message);
        setVisibleValidationAlert(true);
      }
    }
  };

  const [selectedLocation, setSelectedLocation] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [visibleValidationAlert, setVisibleValidationAlert] = useState(false);
  const [validationMessage, setValidationMessage] = useState();

  const getSelectedDateInfo = id => {
    return deliveryInfo.find(value => value.id === id);
  };
  const getDatePeriods = () => {
    return selectedDate && deliveryInfo.length
      ? deliveryInfo.find(value => value.id === selectedDate).periods
      : [];
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        toggleOverlay();
      }}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>تحديد موعد التوصيل</Text>
            <Icon
              name="close"
              size={wp(4)}
              style={{aspectRatio: 1}}
              containerStyle={styles.closeContainerStyle}
              onPress={() => {
                toggleOverlay();
              }}
            />
          </View>
          <View style={[styles.rowContainer, {alignItems: 'center'}]}>
            <Text style={styles.informationText}>
              أسعار التوصيل أدناه تختلف حسب المحافظة
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Button
              key={'other'}
              title="محافظات أخرى"
              type="clear"
              useForeground
              raised={selectedLocation === 1}
              onPress={() => setSelectedLocation(1)}
              titleStyle={[
                styles.buttonTitleStyle,
                selectedLocation === 1 ? styles.buttonTitleStyleActive : null,
              ]}
              containerStyle={[
                styles.buttonStyle,
                selectedLocation === 1 ? styles.buttonStyleActive : null,
              ]}
              // containerStyle={{marginHorizontal: 5, borderRadius: 9}}
            />
            <Button
              key={'capital'}
              title="عمان"
              type="clear"
              raised={selectedLocation === 0}
              onPress={() => setSelectedLocation(0)}
              titleStyle={[
                styles.buttonTitleStyle,
                selectedLocation === 0 ? styles.buttonTitleStyleActive : null,
              ]}
              containerStyle={[
                styles.buttonStyle,
                selectedLocation === 0 ? styles.buttonStyleActive : null,
              ]}
              // containerStyle={{marginHorizontal: 5, borderRadius: 9}}
            />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.subTitle}>يوم التوصيل</Text>
          </View>
          <HorizontalButtons
            data={deliveryInfo}
            onSelect={value => {
              setSelectedDate(value);
            }}
            selected={selectedDate}
            displayField="displayName"
          />

          {choose_delivery_period_enabled != false && (
            <>
              <View style={styles.rowContainer}>
                <Text style={styles.subTitle}>وقت التوصيل</Text>
              </View>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{height: hp(25), margin: 10}}>
                {getDatePeriods().map((item, index) => (
                  <TouchableOpacity
                    key={`periods-${item.id}`}
                    style={styles.periodsRowContainer}
                    onPress={() => setSelectedPeriod(item)}>
                    <Text style={styles.priceText}>
                      {item.price > 0
                        ? `${
                            selectedLocation ? item.othersPrice : item.price
                          } JD`
                        : 'مجاناً'}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: wp(4.5),
                        }}>
                        {item.name}
                      </Text>
                      <Icon
                        type="ionicon"
                        size={wp(4)}
                        style={{aspectRatio: 1}}
                        color={
                          selectedPeriod && selectedPeriod.id === item.id
                            ? colors.primaryColor
                            : '#000'
                        }
                        containerStyle={{marginLeft: 5}}
                        name={
                          selectedPeriod && selectedPeriod.id === item.id
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
          <Button
            key="submit-sort"
            title={'تأكيد'}
            type="clear"
            raised
            useForeground
            onPress={() => confirm()}
            titleStyle={[
              styles.buttonTitleStyle,
              styles.buttonTitleStyleActive,
            ]}
            containerStyle={[styles.buttonStyle, styles.buttonStyleActive]}
            // containerStyle={styles.buttonContainerStyle}
          />
        </View>
      </View>
      <AlertMessage
        visible={visibleValidationAlert}
        message={validationMessage}
        buttonText="تم"
        buttonAction={() => setVisibleValidationAlert(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
  modalView: {
    flex: 1,
    marginTop: hp(6),
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    // paddingHorizontal: 20,
    paddingVertical: hp(5),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonStyle: {
    paddingVertical: 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FD0D1B',
    borderRadius: 5,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: wp(4.5),
    fontFamily: fonts.bold,
  },
  cancelTextStyle: {color: '#FD0D1B', fontSize: wp(3)},
  closeContainerStyle: {
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 2,
  },
  buttonTitleStyle: {
    fontFamily: fonts.regular,
    color: colors.primaryColor,
    fontSize: wp(5),
  },
  buttonTitleStyleActive: {
    color: 'white',
  },
  buttonStyle: {
    borderRadius: 9,
    backgroundColor: 'transparent',
    borderColor: colors.primaryColor,
    // paddingHorizontal: wp(10),
    // paddingVertical: hp(2),
    borderWidth: 1,
    marginHorizontal: 5,
  },
  buttonStyleActive: {
    backgroundColor: colors.primaryColor,
  },
  buttonContainerStyle: {
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 9,
    shadowColor: '#00000042',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8.3,
    elevation: 5,
  },
  rowContainer: {
    alignItems: 'flex-end',
    marginTop: hp(3),
    marginHorizontal: 20,
  },
  subTitle: {
    fontFamily: fonts.bold,
    textAlign: 'right',
    color: colors.primaryColor,
    fontSize: wp(5),
  },
  informationText: {
    fontFamily: fonts.medium,
    textAlign: 'center',
    color: '#FF0000',
    marginBottom: 20,
    fontSize: wp(3.5),
  },
  priceText: {
    fontFamily: fonts.bold,
    color: colors.primaryColor,
    fontSize: wp(4.5),
  },
  periodsRowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: hp(1),
  },
});

const mapStateToProps = state => {
  return {
    checkoutReducer: state.checkoutReducer,
    homeReducer: state.homeReducer,
  };
};

export default connect(mapStateToProps, {
  updateCheckoutDetails,
  setSelectedCategory,
})(DeliveryModal);
