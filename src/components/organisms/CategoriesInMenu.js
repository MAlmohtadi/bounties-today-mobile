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

const CategoriesInMenu = ({ navigation, homeReducer: { categories }, setLoadingProduct, setSelectedCategory }) => {
  const [isExpand, setIsExpand] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null);
  const scrollRef = useRef();
  const renderCategories = () => {
    return categories && categories.length > 0 && categories.map((category, index) => (
      <ListItem key={`${category.name}-${index}`} containerStyle={{ backgroundColor: '#F7F7F7' }} bottomDivider onPress={() => {
        setActiveCategory({ ...category })
        scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
      }}>
        <ListItem.Content>
          <ListItem.Title style={styles.categoryLable}>{category.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    ))
  }

  const renderSubCategories = () => {
    return (<>
      <ListItem.Accordion noIcon
        containerStyle={{ flex: 1, backgroundColor: '#F7F7F7' }}
        content={
          <>
            <Icon
              type="ionicon"
              name="chevron-back-outline"
              size={wp(5)}
              iconStyle={styles.iconStyle}
              color="#61012D"
            />
            <ListItem.Content >
              <ListItem.Title style={styles.categoryLable}>{activeCategory.name}</ListItem.Title>
            </ListItem.Content>
          </>
        }
        isExpanded={isExpand}
        onPress={() => {
          setActiveCategory(null)
        }}
      >
      </ListItem.Accordion>
      {activeCategory.subCategories && activeCategory.subCategories.map((subCategory, i) => (
        <ListItem key={`${subCategory.name}-${i}`} bottomDivider onPress={() => {
          setSelectedCategory({
            ...activeCategory,
            subCategoryId: subCategory.id,
          })
          setLoadingProduct();
          navigation.navigate(Pages.Product.route);
        }}>
          <ListItem.Content>
            <ListItem.Title style={styles.categoryLable}>{subCategory.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>

      ))}
    </>)
  }
  return (<ListItem.Accordion noIcon
    content={
      <>
        <ListItem.Content >
          <ListItem.Title style={styles.lable}>تصنيفات</ListItem.Title>
        </ListItem.Content>
        <Icon
          name={isExpand ? "expand-less" : "expand-more"}
          size={wp(6)}
          iconStyle={styles.iconStyle}
          color="#61012D"
        />
      </>
    }
    isExpanded={isExpand}
    onPress={() => {
      setIsExpand(!isExpand);
    }}
  >
    <ScrollView ref={scrollRef} style={{ maxHeight: hp(30) }} nestedScrollEnabled >
      {activeCategory ? renderSubCategories() : renderCategories()}
    </ScrollView>
  </ListItem.Accordion>
  );
};
const styles = StyleSheet.create({
  lable: {
    fontFamily: 'Tajawal-Bold', color: '#61032D',
    fontSize: hp(2), width: '90%', textAlign: 'right'
  },
  categoryLable: {
    fontFamily: 'Tajawal-Regular', color: '#61032D',
    fontSize: hp(2), width: '90%', textAlign: 'right'
  },
  categoryLable: {
    fontFamily: 'Tajawal-Regular', color: '#61032D',
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
})(CategoriesInMenu);

