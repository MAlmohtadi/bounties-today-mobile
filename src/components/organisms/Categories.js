import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import { ListItem, Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  setSelectedCategory
} from '_actions/homeActions';
import {
  setLoadingProduct,
} from '_actions/productActions';
import Pages from '../../navigations/Pages';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';

const Categories = ({ navigation, homeReducer: { categories }, setLoadingProduct, setSelectedCategory }) => {
  const [activeCategory, setActiveCategory] = useState({});

  const renderSubCategories = () => {
    return (<>
      {activeCategory && activeCategory.subCategories && activeCategory.subCategories.map((subCategory, i) => (
        <ListItem  key={`${subCategory.name}-${i}`} style={{ backgroundColor: '#F7F7F7' }} bottomDivider onPress={() => {
          setSelectedCategory({
            ...activeCategory,
            subCategoryId: subCategory.id,
          })
          setLoadingProduct();
          navigation.navigate(Pages.Product.route);
        }}>
          <ListItem.Content >
            <ListItem.Title style={styles.categoryLable}>{subCategory.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>

      ))}
    </>)
  }
  const isCategoryExpanded = (categoryId) => {
    if (activeCategory.id == categoryId)
      return activeCategory.isExpanded ? true : false
    else return false;
  }
  return (<>{categories && categories.length > 0 && categories.map((category, index) => (<ListItem.Accordion noIcon
    key={`${category.name}-${index}`}
    content={
      <>
        <Icon
          name={isCategoryExpanded(category.id) ? "expand-less" : "expand-more"}
          size={wp(6)}
          iconStyle={styles.iconStyle}
          color={colors.primaryColor}
        />
        <ListItem.Content>
          <ListItem.Title style={styles.lable}>{category.name}</ListItem.Title>
        </ListItem.Content>
      </>
    }
    isExpanded={isCategoryExpanded(category.id)}
    onPress={() => {
      setActiveCategory({ ...category, isExpanded: !isCategoryExpanded(category.id) })
    }}
  >
    {isCategoryExpanded(category.id) && renderSubCategories()}

  </ListItem.Accordion>))}
  </>
  );
};
const styles = StyleSheet.create({
  lable: {
    fontFamily: fonts.bold, color: colors.primaryColor,
    fontSize: hp(2), width: '90%', textAlign: 'right'
  },
  categoryLable: {
    fontFamily: fonts.regular, color: colors.primaryColor,
    fontSize: hp(1.8), width: '90%', textAlign: 'right'
  },
  iconStyle: { marginHorizontal: 5, aspectRatio: 1 },
});
const mapStateToProps = (state) => {
  return {
    homeReducer: state.homeReducer,
  };
};

export default connect(mapStateToProps, {
  setSelectedCategory,
  setLoadingProduct
})(Categories);

