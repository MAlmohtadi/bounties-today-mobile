import React from 'react';
import {StyleSheet, View, Text, Modal} from 'react-native';
import {Button} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const AlertMessage = ({
  visible,
  message,
  buttonText,
  buttonAction,
  buttonText2,
  buttonAction2,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        buttonAction();
      }}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          <View style={styles.rowContainer}>
            <Text style={styles.subTitle}>{message}</Text>
          </View>
          <View style={styles.buttonsRowContainer}>
            <Button
              key="submit-sort"
              title={buttonText}
              type="clear"
              onPress={buttonAction}
              titleStyle={[
                styles.buttonTitleStyle,
                styles.buttonTitleStyleActive,
              ]}
              useForeground
              buttonStyle={[styles.buttonStyle]}
              containerStyle={styles.buttonContainerStyle}
            />
            {buttonAction2 && (
              <Button
                key="submit-sort2"
                title={buttonText2}
                type="clear"
                onPress={buttonAction2}
                titleStyle={[
                  styles.buttonTitleStyle,
                  styles.buttonTitleStyleActive,
                ]}
                useForeground
                buttonStyle={[styles.buttonStyle]}
                containerStyle={styles.buttonContainerStyle}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
  modalView: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderRadius: 20,
    margin: 20,
    overflow:'hidden'
    // paddingVertical: hp(2),
  },
  buttonTitleStyle: {
    fontFamily: fonts.regular,
    color: colors.primaryColor,
    fontSize: hp(2.2),
  },
  buttonTitleStyleActive: {
    color: colors.primaryColor,
  },
  buttonStyle: {
    borderRadius: 9,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 1,
  },
  buttonStyleActive: {
    backgroundColor: colors.primaryColor,
  },
  buttonContainerStyle: {
    flex: 1,
  },
  rowContainer: {
    alignItems: 'center',
    padding: 20,
  },
  subTitle: {fontFamily: fonts.bold, fontSize: wp(4), textAlign: 'center',color:colors.textColor},
  buttonsRowContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: colors.primaryColor,
    borderTopWidth: 1,
  },
});

export default AlertMessage;
