import React, {useEffect} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import ImageSlider from '_organisms/ImageSlider';
import Category from '_organisms/Category';
import {ScrollView} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {getHomeInfo, setSelectedCategory} from '_actions/homeActions';
import {updateSearchCriteria} from '_actions/productActions';
import LoadingSpinner from '_organisms/LoadingSpinner';
import Pages from '../navigations/Pages';

const Home = ({
  navigation,
  getHomeInfo,
  homeReducer: {isWholeSale, banners, categories, appIsLoading},
  setSelectedCategory,
  updateSearchCriteria,
}) => {
  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      getHomeInfo(isWholeSale);
    });
    return subscribe;
  }, [isWholeSale, appIsLoading]);
  return appIsLoading ? (
    <LoadingSpinner />
  ) : (
    <View style={styles.mainContainer}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        enabled
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={{paddingBottom: wp(30)}}
        onScrollBeginDrag={() => Keyboard.dismiss()}>
        {banners && banners.length > 0 && (
          <ImageSlider
            banners={banners}
            onPressImage={info => {
              const category = categories.find(
                item => item.id === info.categoryId,
              );
              setSelectedCategory({
                ...category,
                subCategoryId: info.subCategoryId,
              });
              updateSearchCriteria({
                textToSearch: null,
                maxPrice: null,
                minPrice: null,
                isFilterEnabled: false,
              });
              navigation.navigate(
                info.isOfferTab ? Pages.Offer.route : Pages.Product.route,
                {info: info},
              );
            }}
          />
        )}
        <Category
          categories={categories || []}
          onPressCard={info => {
            setSelectedCategory({...info, subCategoryId: null});
            updateSearchCriteria({
              textToSearch: null,
              maxPrice: null,
              minPrice: null,
              isFilterEnabled: false,
            });
            navigation.navigate(Pages.Product.route);
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {flex: 12},
  scrollContainer: {flex: 1},
});

const mapStateToProps = state => {
  return {
    homeReducer: state.homeReducer,
  };
};

export default connect(mapStateToProps, {
  getHomeInfo,
  setSelectedCategory,
  updateSearchCriteria,
})(Home);
