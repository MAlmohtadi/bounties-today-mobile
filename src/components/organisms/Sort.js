import React from 'react';
import {StyleSheet, View, Text, Modal, Dimensions} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {setSortTypeConfig} from '_actions/configActions';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const Sort = ({
  configReducer: {sortType},
  setSortTypeConfig,
  visible,
  toggleOverlay,
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
            <Button
              title="إلغاء الترتيب"
              buttonStyle={styles.cancelButtonStyle}
              titleStyle={styles.cancelTextStyle}
              onPress={() => {
                toggleOverlay();
                setSortTypeConfig();
              }}
            />
            <Text style={styles.modalTitle}>الترتيب</Text>
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
          <View style={{alignItems: 'flex-end', marginVertical: hp(3)}}>
            <Text style={{fontFamily: fonts.bold, fontSize: wp(4)}}>
              ترتيب حسب :
            </Text>
          </View>
          <View style={{alignItems: 'center', marginVertical: hp(3)}}>
            <Button
              key="DESC"
              title={'السعر الأعلى للأقل'}
              type="clear"
              raised
              onPress={() => {
                setSortTypeConfig('DESC');
                toggleOverlay();
              }}
              useForeground
              titleStyle={[
                styles.buttonTitleStyle,
                sortType === 'DESC' ? styles.buttonTitleStyleActive : null,
              ]}
              containerStyle={[
                styles.buttonStyle,
                sortType === 'DESC' ? styles.buttonStyleActive : null,
              ]}
              // containerStyle={{marginVertical: 5, borderRadius: 9}}
            />
            <Button
              key="ASC"
              title={'السعر الأقل للأعلى'}
              type="clear"
              raised={sortType === 'ASC'}
              onPress={() => {
                setSortTypeConfig('ASC');
                toggleOverlay();
              }}
              titleStyle={[
                styles.buttonTitleStyle,
                sortType === 'ASC' ? styles.buttonTitleStyleActive : null,
              ]}
              containerStyle={[
                styles.buttonStyle,
                sortType === 'ASC' ? styles.buttonStyleActive : null,
              ]}
              // containerStyle={{marginVertical: 5, borderRadius: 9}}
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
    backgroundColor: 'rgba(0, 0, 0, .2)',
    justifyContent: 'flex-end',
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
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  cancelTextStyle: {
    color: '#FD0D1B',
    fontSize: Dimensions.get('screen').width < 350 ? wp(4) : wp(3),
  },
  closeContainerStyle: {
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 2,
  },
  buttonTitleStyle: {
    fontFamily: fonts.regular,
    color: colors.primaryColor,
    fontSize: Dimensions.get('screen').width < 350 ? hp(4) : hp(2),
  },
  buttonTitleStyleActive: {
    color: 'white',
  },
  buttonStyle: {
    borderRadius: 9,
    backgroundColor: 'transparent',
    borderColor: colors.primaryColor,
    // paddingHorizontal: wp(10),
    padding: wp(4),
    borderWidth: 1,
    marginVertical: 5,
  },
  buttonStyleActive: {
    backgroundColor: colors.primaryColor,
  },
  buttonContainerStyle: {
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
});
const mapStateToProps = (state) => {
  return {
    configReducer: state.configReducer,
  };
};

export default connect(mapStateToProps, {
  setSortTypeConfig,
})(Sort);
