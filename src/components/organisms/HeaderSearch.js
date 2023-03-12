import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import SearchIcon from '_icons/Search.svg';
import { Icon, Button } from 'react-native-elements';
import Filter from '_organisms/Filter';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { updateSearchCriteria } from '_actions/productActions';
import { connect } from 'react-redux';
import Pages from '../../navigations/Pages';
import AlertMessage from '_organisms/AlertMessage';

import { useRoute } from '@react-navigation/core';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const HeaderSearch = ({
  navigation,
  // insets,
  productReducer: { textToSearch },
  updateSearchCriteria,
}) => {
  const [showFilterButton, setShowFilterButton] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [textValue, setTextValue] = useState(textToSearch);
  const [feedbackMessageVisible, setFeedbackMessageVisible] = useState(false);

  const route = useRoute();

  const confirm = () => {
    if (!textValue || textValue.length < 2) {
      setFeedbackMessageVisible(true)
    } else {
      if (route.name !== Pages.Product.route) {
        navigation.navigate(Pages.Product.route);
      }
      updateSearchCriteria({ textToSearch: textValue });
    }
  };
  useEffect(() => {
    setTextValue(textToSearch);
  }, [textToSearch]);
  return (
    <View
      style={[
        styles.headerStyle,
        // { paddingTop: insets.top - 10, marginBottom: 5 },
      ]}>
      <View style={styles.searchContainer}>
        {!showFilterButton ? <SearchIcon /> : <Button title='إبحث' raised
          buttonStyle={styles.searchButtonStyle}
          containerStyle={styles.searchContainerStyle} onPress={() => { confirm(); }} />}
        <TextInput
          style={[
            styles.inputContainerStyle,
            { textAlign: 'center', fontSize: 16, fontFamily: fonts.bold },
          ]}
          onChangeText={(value) => setTextValue(value)}
          value={textValue}
          placeholder="ابحث عن المنتج"
          onFocus={() => setShowFilterButton(true)}
          onBlur={() => setShowFilterButton(false)}
          onSubmitEditing={() => confirm()}
          clearButtonMode="always"
          onPressOut={() => setShowFilterButton(false)}
        />
        {showFilterButton && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setFilterVisible(!filterVisible)}>
            <Icon
              type="ionicon"
              name="options-outline"
              style
              containerStyle={styles.iconContainerStyle}
              onPress={() => { }}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>
      <Icon
        type="ionicon"
        name="grid-outline"
        size={30}
        onPress={() => navigation.toggleDrawer()}
        color={colors.primaryColor}
      />
      <Filter
        textToSearch={textValue}
        navigation={navigation}
        visible={filterVisible}
        toggleOverlay={() => setFilterVisible(!filterVisible)}
      />
      <AlertMessage
        visible={feedbackMessageVisible}
        message={'يجب إدخال حرفين على الأقل للبحث'}
        buttonText="تم"
        buttonAction={() => {
          setFeedbackMessageVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flex: 1,
    margin: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
    marginHorizontal: 5,
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSearchContainer: {
    flex: 9,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    margin: 0,
  },
  inputContainerStyle: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10,
    margin: 0,
  },
  iconContainer: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryColor,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    elevation: 7,
  },
  searchButtonStyle: {
    backgroundColor: colors.primaryColor,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  searchContainerStyle: {
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  iconContainerStyle: {
    flex: 1,
    justifyContent: 'center',
  },
});
const mapStateToProps = (state) => {
  return {
    productReducer: state.productReducer,
  };
};

export default connect(mapStateToProps, { updateSearchCriteria })(HeaderSearch);
