import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  getProducts,
  loadMoreProducts,
  loadMoreSearchProducts,
  getSearchProducts,
  setLoadingProduct,
  clearProduct
} from '_actions/productActions';
import {
  setSelectedCategory,
} from '_actions/homeActions';
import { addToCart, removeFromCart } from '_actions/cartActions';
import {
  addToFavorite,
  removeFromFavorite,
  toggleFavoriteFlag,
} from '_actions/favoriteActions';
import HorizontalButtons from '_organisms/HorizontalButtons';
import GridCard from '_organisms/GridCard';
import Card from '_organisms/Card';
import Sort from '_organisms/Sort';
import SortAndView from '_organisms/SortAndView';

const ProductScreen = ({
  navigation,
  homeReducer: {
    isWholeSale,
    selectedCategory: { id: categoryId, subCategories = [], subCategoryId },
  },
  authReducer: { id: userId },
  favoriteReducer: { isUpdated },
  configReducer: { isGridView, sortType },
  productReducer: {
    products = [],
    productsRemainingCount,
    nextPageNumber,
    pageSize,
    searchedCategory,
    textToSearch,
    maxPrice,
    minPrice,
    isFilterEnabled,
    isProductLoading,
  },
  cartReducer,
  cartWholesaleReducer,
  addToFavorite,
  removeFromFavorite,
  toggleFavoriteFlag,
  loadMoreSearchProducts,
  getSearchProducts,
  getProducts,
  addToCart,
  loadMoreProducts,
  removeFromCart,
  setLoadingProduct,
  setSelectedCategory
}) => {
  const [showSort, setShowSort] = useState(false);
  const { quantities = {} } = isWholeSale ? cartWholesaleReducer : cartReducer;

  const toggleOverlay = () => {
    setShowSort(!showSort);
  };
  const isSearchMode = () => {
    return isFilterEnabled || (textToSearch && textToSearch.length > 0);
  };
  const fetchProducts = (nextPageNumber) => {
    if (textToSearch || isFilterEnabled) {
      getSearchProducts({
        categoryId: searchedCategory ? searchedCategory.id : null,
        isWholeSale,
        maxPrice,
        minPrice,
        nextPageNumber,
        pageSize,
        sort: sortType,
        textToSearch,
        userId: userId ? userId : 0,
      });
    } else {
      getProducts({
        categoryId,
        isWholeSale,
        nextPageNumber,
        pageSize,
        sort: sortType,
        subCategoryId: subCategoryId || subCategories[0].id,
        userId: userId ? userId : 0,
      });
    }
  };
  const renderFooter = () => {
    if (!(productsRemainingCount > 0)) {
      return null;
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#61012D" />
      </View>
    );
  };
  const refreshControl = (
    <RefreshControl
      refreshing={isProductLoading}
      onRefresh={() => {
        fetchProducts(0);
      }}
    />
  );
  const onEndReached = () => {
    if (productsRemainingCount > 0) {
      if (textToSearch || isFilterEnabled) {
        loadMoreSearchProducts({
          categoryId: searchedCategory ? searchedCategory.id : null,
          isWholeSale,
          maxPrice,
          minPrice,
          nextPageNumber,
          pageSize,
          sort: sortType,
          textToSearch,
          userId: userId ? userId : 0,
        });
      } else {
        loadMoreProducts({
          categoryId: categoryId,
          isWholeSale,
          nextPageNumber: nextPageNumber,
          pageSize,
          sort: sortType,
          subCategoryId:subCategoryId || subCategories[0].id,
          userId: userId ? userId : 0,
        });
      }
    }
  };
  const renderCards = (item) =>
    !isGridView ? (
      <Card
        key={`card-${item.id}`}
        product={item}
        quantity={quantities[`${item.id}`]}
        addToCart={(item) => addToCart(item, isWholeSale)}
        removeFromCart={(item) => removeFromCart(item, isWholeSale)}
        showFavoriteIcon={userId !== null}
        onClickFavoriteIcon={(productId) => {
          item.isFavorite
            ? removeFromFavorite({ productId, userId, isWholeSale })
            : addToFavorite({ productId, userId, isWholeSale });
          toggleFavoriteFlag();
        }}
      />
    ) : (
      <GridCard
        key={`grid-${item.id}`}
        product={item}
        quantity={quantities[`${item.id}`]}
        addToCart={(item) => addToCart(item, isWholeSale)}
        removeFromCart={(item) => removeFromCart(item, isWholeSale)}
        showFavoriteIcon={userId !== null}
        onClickFavoriteIcon={(productId) => {
          item.isFavorite
            ? removeFromFavorite({ productId, userId, isWholeSale })
            : addToFavorite({ productId, userId, isWholeSale });
          toggleFavoriteFlag();
        }}
      />
    );

  useEffect(() => {
    if (isProductLoading) {
      fetchProducts(0);
    }
  }, [
    categoryId,
    textToSearch,
    maxPrice,
    minPrice,
    isFilterEnabled,
    searchedCategory,
    subCategoryId,
    userId,
    navigation,
    isProductLoading,
    isGridView,
    sortType
    
  ]);
  const renderEmpty = () => (
    <View style={{ flex: 1, alignItems: 'center', margin: 20 }}>
      <Text
        style={{
          fontFamily: 'Tajawal-Regular',
          color: '#61012D',
          fontSize: wp(4),
        }}>
        لا يوجد منتجات
      </Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.marginingContainer}>
        {subCategories.length > 0 && !isSearchMode() && (
          <HorizontalButtons
            data={subCategories}
            selected={subCategoryId || subCategories[0].id}
            onSelect={(value) => {
              setSelectedCategory({
                id: categoryId,
                subCategoryId: value,
              });
              setLoadingProduct();
            }}
          />
        )}
        <SortAndView
          showSort={showSort}
          sortType={sortType}
          setShowSort={setShowSort}
        />
        <FlatList
          onScrollBeginDrag={() => Keyboard.dismiss()}
          key={!isGridView ? 'grid': 'single'}
          numColumns={!isGridView ? 1 : 2}
          showsVerticalScrollIndicator={false}
          refreshing={isProductLoading}
          keyExtractor={(item) => `${item.id}`}
          ListEmptyComponent={renderEmpty()}
          contentContainerStyle={[
            {
              paddingTop: hp(1),
              alignItems: products.length == 0 ? 'center' : null,
              paddingBottom: wp(28),
              paddingHorizontal: 2,
            },
            !isGridView ? null : styles.gridViewScrollContainer,
          ]}
          data={isProductLoading ? [] : products}
          onEndReachedThreshold={0.4}
          initialNumToRender={pageSize}
          ListFooterComponent={renderFooter}
          refreshControl={refreshControl}
          onEndReached={onEndReached}
          renderItem={({ item, index }) => renderCards(item, index)}
        />
      </View>
      <Sort visible={showSort} toggleOverlay={toggleOverlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFF',
  },
  marginingContainer: {
    flex: 1,
    margin: 10,
  },
  gridViewScrollContainer: {
    alignContent: 'center',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = (state) => {
  return {
    productReducer: state.productReducer,
    cartReducer: state.cartReducer,
    cartWholesaleReducer: state.cartWholesaleReducer,
    favoriteReducer: state.favoriteReducer,
    authReducer: state.authReducer,
    homeReducer: state.homeReducer,
    configReducer: state.configReducer,
  };
};

export default connect(mapStateToProps, {
  getProducts,
  addToCart,
  removeFromCart,
  addToFavorite,
  removeFromFavorite,
  loadMoreProducts,
  toggleFavoriteFlag,
  loadMoreSearchProducts,
  getSearchProducts,
  setLoadingProduct,
  clearProduct,
  setSelectedCategory
})(ProductScreen);
