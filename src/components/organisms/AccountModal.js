import React from 'react';
import {StyleSheet, View, Text, Modal} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Account from '_templates/Account';

const AccountModal = ({visible, toggleOverlay}) => {
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
            <Text style={styles.modalTitle}>معلومات المستلم</Text>
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
          <View style={styles.rowContainer}>
            <Account showUpdateAccount={false} />
          </View>
        </View>
      </View>
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
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: hp(5),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: wp(4.5),
    fontFamily: 'Tajawal-Bold',
  },
  closeContainerStyle: {
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 2,
  },
  rowContainer: {height: '80%', marginTop: 20, marginHorizontal: 20},
});

export default AccountModal;
