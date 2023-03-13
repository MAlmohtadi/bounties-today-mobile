import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useRoute} from '@react-navigation/native';
import {addToCart, removeFromCart} from '_actions/cartActions';
import {addToFavorite, removeFromFavorite} from '_actions/favoriteActions';
import {
  clearOffer,
  getOfferProducts,
  loadMoreOfferProducts,
} from '_actions/offerActions';
import Sort from '_organisms/Sort';
import LoadingSpinner from '_organisms/LoadingSpinner';
import SortAndView from '_organisms/SortAndView';
import GridCard from '_organisms/GridCard';
import Card from '_organisms/Card';
import {Text} from 'react-native';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';

const OffersScreen = ({
  navigation,
  homeReducer: {isWholeSale},
  offerReducer: {
    products = [],
    productsRemainingCount,
    nextPageNumber,
    pageSize,
    isOfferLoading,
  },
  cartReducer,
  cartWholesaleReducer,
  configReducer: {isGridView, sortType},
  getOfferProducts,
  clearOffer,
  addToCart,
  removeFromCart,
  loadMoreOfferProducts,
}) => {
  const [showSort, setShowSort] = useState(false);
  const route = useRoute();
  const {quantities = {}} = isWholeSale ? cartWholesaleReducer : cartReducer;

  const fetchProducts = nextPageNumber => {
    getOfferProducts({
      isWholeSale,
      nextPageNumber,
      pageSize: pageSize,
      sort: sortType,
    });
  };
  const renderFooter = () => {
    if (!(productsRemainingCount > 0)) {
      return null;
    }
    return <LoadingSpinner />;
  };
  const refreshControl = () => (
    <RefreshControl
      refreshing={isOfferLoading}
      onRefresh={() => {
        fetchProducts(0);
      }}
    />
  );
  const onEndReached = () => {
    if (productsRemainingCount > 0) {
      loadMoreOfferProducts({
        isWholeSale,
        nextPageNumber: nextPageNumber,
        pageSize,
        sort: sortType,
      });
    }
  };
  const renderCard = (item, index) =>
    !isGridView ? (
      <Card
        key={`card-${index}`}
        product={item}
        quantity={quantities[`${item.id}`]}
        addToCart={item => addToCart(item, isWholeSale)}
        removeFromCart={item => removeFromCart(item, isWholeSale)}
        showFavoriteIcon={false}
      />
    ) : (
      <GridCard
        key={`grid-${index}`}
        product={item}
        quantity={quantities[`${item.id}`]}
        addToCart={item => addToCart(item, isWholeSale)}
        removeFromCart={item => removeFromCart(item, isWholeSale)}
        showFavoriteIcon={false}
      />
    );

  useEffect(() => {
    const unsubscribe = [
      navigation.addListener('focus', () => {
        fetchProducts(0);
      }),
      navigation.addListener('blur', () => {
        clearOffer();
      }),
    ];
    return () => {
      unsubscribe.forEach(unSub => {
        unSub();
      });
    };
  }, [navigation, isOfferLoading, isGridView]);
  const renderEmpty = () => (
    <View style={{flex: 1, alignItems: 'center', margin: 20}}>
      <Text
        style={{
          fontFamily: fonts.regular,
          color: colors.primaryColor,
          fontSize: wp(4),
        }}>
        لا يوجد عروض
      </Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.marginingContainer}>
        <SortAndView showSort={showSort} setShowSort={setShowSort} />
        <FlatList
          key={!isGridView ? 'single' : 'grid'}
          numColumns={!isGridView ? 1 : 2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {
              alignItems: products.length == 0 ? 'center' : null,
              paddingBottom: wp(28),
              paddingHorizontal: 2,
            },
            !isGridView ? null : styles.gridViewScrollContainer,
          ]}
          keyExtractor={item => `cards-${item.id}`}
          ListEmptyComponent={renderEmpty()}
          data={isOfferLoading ? [] : products}
          onEndReachedThreshold={0.4}
          initialNumToRender={pageSize}
          refreshing={isOfferLoading}
          ListFooterComponent={renderFooter}
          refreshControl={refreshControl()}
          onEndReached={onEndReached}
          renderItem={({item, index}) => renderCard(item, index)}
        />
      </View>
      <Sort visible={showSort} toggleOverlay={() => setShowSort(!showSort)} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F7F7F7',
  },
  marginingContainer: {
    flex: 1,
    margin: 10,
  },
  gridViewScrollContainer: {
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  buttonTitleStyle: {
    fontFamily: fonts.regular,
    color: colors.primaryColor,
    fontSize: hp(2),
  },
  buttonStyle: {
    borderRadius: 9,
    backgroundColor: '#F7F7F7',
    borderColor: colors.primaryColor,
    paddingHorizontal: 13,
    paddingTop: 18,
    paddingBottom: 10,
    borderWidth: 1,
  },
});

const mapStateToProps = state => {
  return {
    offerReducer: state.offerReducer,
    cartReducer: state.cartReducer,
    cartWholesaleReducer: state.cartWholesaleReducer,
    favoriteReducer: state.favoriteReducer,
    authReducer: state.authReducer,
    homeReducer: state.homeReducer,
    configReducer: state.configReducer,
  };
};

export default connect(mapStateToProps, {
  getOfferProducts,
  addToCart,
  removeFromCart,
  addToFavorite,
  removeFromFavorite,
  loadMoreOfferProducts,
  clearOffer,
})(OffersScreen);
