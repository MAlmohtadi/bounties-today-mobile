import React from 'react';
import {StyleSheet, View, Text, Modal, Dimensions} from 'react-native';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import {Icon} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const BarCodeModal = ({
  visible,
  toggleOverlay,
  value,
}) => {
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
          <View style={{ height:Dimensions.get('screen').width  , width: Dimensions.get('screen').width * 0.8, transform: [{ rotate: '90deg' }]}}>
            <Barcode value={value}  width={3.2}  style={{marginTop:Dimensions.get('screen').width * 0.25}}  />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    justifyContent: 'flex-end',
    top: 0
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: hp(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '90%'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom:40,
  },
 
  closeContainerStyle: {
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 2,
  },
});

export default BarCodeModal;