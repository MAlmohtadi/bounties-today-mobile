import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, Dimensions } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import Notch from '_atoms/Notch';
import Rail from '_atoms/Rail';
import Thumb from '_atoms/Thumb';
import Label from '_atoms/Label';
import RailSelected from '_atoms/RailSelected';
import HorizontalButtons from '_organisms/HorizontalButtons';
import SliderPrice from '_organisms/SliderPrice';
import { updateSearchCriteria } from '_actions/productActions';
import { setSelectedCategory } from '_actions/homeActions';
import { useRoute } from '@react-navigation/core';
import Pages from '../../navigations/Pages';

const Filter = ({
  navigation,
  visible,
  toggleOverlay,
  productReducer: { minPrice: selectedMinPrice, maxPrice: selectedMaxPrice },
  homeReducer: { selectedCategory, categories = [] },
  updateSearchCriteria,
  textToSearch,
  setSelectedCategory,
}) => {
  const [categoryId, setCategoryId] = useState(selectedCategory.id);
  const [minPrice, setMinPrice] = useState(selectedMinPrice);
  const [maxPrice, setMaxPrice] = useState(selectedMaxPrice);
  const renderThumb = () => <Thumb />;
  const renderRail = () => <Rail />;
  const renderRailSelected = () => <RailSelected />;
  const renderNotch = () => <Notch />;
  const route = useRoute();
  const handleValueChange = (low, high) => {
    setMinPrice(low);
    setMaxPrice(high);
  };

  const getSelectedCategoryData = (id) => {
    return categories.find((item) => item.id === id);
  };
  const confirm = () => {
    updateSearchCriteria({
      minPrice,
      maxPrice,
      textToSearch,
      searchedCategory: setSelectedCategory(
        getSelectedCategoryData(categoryId),
      ),
      isFilterEnabled: true,
    });
    if (route.name != Pages.Product.route) {
      navigation.navigate(Pages.Product.route);
    }
    toggleOverlay();
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
            <Button
              title="إلغاء الفلتر"
              buttonStyle={styles.cancelButtonStyle}
              titleStyle={styles.cancelTextStyle}
              onPress={() => {
                updateSearchCriteria({
                  categoryId: null,
                  textToSearch: null,
                  maxPrice: null,
                  minPrice: null,
                  isFilterEnabled: false,
                });

                toggleOverlay()
              }}
            />
            <Text style={styles.modalTitle}>فلتر</Text>
            <Icon
              name="close"
              size={wp(4)}
              style={{ aspectRatio: 1 }}
              containerStyle={styles.closeContainerStyle}
              onPress={() => {
                toggleOverlay();
              }}
            />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.subTitle}>فرز حسب :</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.subTitle2}>الصنف</Text>
          </View>
          <HorizontalButtons
            data={categories}
            selected={categoryId}
            onSelect={setCategoryId}
          />
          <View style={styles.rowContainer}>
            <Text style={styles.subTitle2}>نطاق السعر</Text>
          </View>
          <SliderPrice
            style={{ margin: hp(2) }}
            min={0}
            max={100}
            step={1}
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            renderLabel={null}
            renderNotch={renderNotch}
            onValueChanged={handleValueChange}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: wp(2),
              marginBottom: hp(1),
            }}>
            <Text>{minPrice} JD</Text>
            <Text>{maxPrice} JD</Text>
          </View>
          <Button
            key="submit-sort"
            title={'تأكيد'}
            type="clear"
            raised={true}
            onPress={() => confirm()}
            titleStyle={[
              styles.buttonTitleStyle,
              styles.buttonTitleStyleActive,
            ]}
            useForeground
            containerStyle={[styles.buttonStyle, styles.buttonStyleActive]}
            // containerStyle={styles.buttonContainerStyle}
          />
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
    // flex:1,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    // paddingHorizontal: 20,
    paddingVertical: hp(5),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    fontFamily: 'Tajawal-Bold',
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
    fontFamily: 'Tajawal-Regular',
    color: '#61012D',
    fontSize: Dimensions.get('screen').width < 350 ? wp(5) : wp(4),
  },
  buttonTitleStyleActive: {
    color: 'white',
  },
  buttonStyle: {
    borderRadius: 9,
    backgroundColor: 'transparent',
    borderColor: '#61012D',
    marginHorizontal: wp(2),
    borderWidth: 1,
  },
  buttonStyleActive: {
    backgroundColor: '#61012D',
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
  subTitle: { fontFamily: 'Tajawal-Bold', fontSize: wp(4) },
  subTitle2: { fontFamily: 'Tajawal-Bold', fontSize: wp(3.5) },
});

const mapStateToProps = (state) => {
  return {
    homeReducer: state.homeReducer,
    productReducer: state.productReducer,
  };
};

export default connect(mapStateToProps, {
  updateSearchCriteria,
  setSelectedCategory,
})(Filter);
