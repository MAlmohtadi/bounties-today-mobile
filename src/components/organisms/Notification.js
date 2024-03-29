import React from 'react';
import {StyleSheet, View, Text, Modal, Image} from 'react-native';
import {Button} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const Notification = ({visible, notificationData, buttonAction}) => {
  const notificaitonDefaultData = {
    notification: {title: '', body: ''},
    data: {imageUrl: ''},
  };
  const {
    data: {imageUrl},
    notification: {title = '', body = ''},
  } = notificationData != null ? notificationData : notificaitonDefaultData;

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
          <Text style={styles.title}>{title}</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.subTitle}>{body}</Text>
            {imageUrl && imageUrl.length > 0 && (
              <Image
                source={{uri: imageUrl}}
                style={{
                  width: hp(30),
                  aspectRatio: 1,
                }}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={styles.buttonsRowContainer}>
            <Button
              key="submit-notification"
              title={'تم'}
              type="clear"
              onPress={buttonAction}
              titleStyle={[
                styles.buttonTitleStyle,
                styles.buttonTitleStyleActive,
              ]}
              useForeground
              containerStyle={[styles.buttonStyle]}
              // containerStyle={styles.buttonContainerStyle}
            />
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
    padding: 10,
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
    flex: 1,
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
    borderRadius: 9,
  },
  rowContainer: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: wp(4),
    textAlign: 'right',
    color: colors.primaryColor,
  },

  subTitle: {
    fontFamily: fonts.regular,
    fontSize: wp(3),
    textAlign: 'right',
    color: colors.textColor,
  },
  buttonsRowContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: colors.primaryColor,
    borderTopWidth: 1,
  },
});

export default Notification;
