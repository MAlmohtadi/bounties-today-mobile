import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import PercentageIcon from '_icons/percentage.svg';
import FavoriteIcon from '_icons/favorite.svg';
import HeartActive from '_icons/heart-active';
import TrushIcon from '_icons/trush.svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import ImageModal from 'react-native-image-modal';
import defaultImage from '_images/defaultImage.png';

const Card = ({
  product,
  addToCart,
  removeFromCart,
  showFavoriteIcon,
  onClickFavoriteIcon,
  showTrushIcon,
  onClickTrushIcon,
  showStockStatus = true,
  isEditable = true,
  quantity = 0,
}) => {
  const isProductQuantityAvailable = () => {
    return product.quantityMultiplier * (quantity + 1) <= product.maxQuantity;
  };
  const [imageUri, setImageUri] = useState({ uri: product.imageUrl });

  return (
    <View style={styles.cardContainer}>
      <View style={styles.bottomContainer}>
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.paddingButtons}
            onPress={() =>
              isEditable && isProductQuantityAvailable() && addToCart(product)
            }>
            {isProductQuantityAvailable() ? (
              <Icon
                type="material-community"
                name="plus"
                color={isEditable ? '#fff' : '#61012D'}
                size={wp(5)}
                style={{ aspectRatio: 1 }}
              />
            ) : (
              <Icon
                type="font-awesome"
                name="ban"
                color={isEditable ? '#fff' : '#61012D'}
                size={wp(5)}
                style={{ aspectRatio: 1 }}
              />
            )}
          </TouchableOpacity>

          {!!quantity > 0 && (
            <View
              style={[
                { alignItems: 'center', marginTop: wp(1) },
                styles.paddingButtons,
              ]}>
              <Text style={[styles.quantity]}>{quantity}</Text>
            </View>
          )}
          {!!quantity && quantity > 0 && (
            <TouchableOpacity
              style={styles.paddingButtons}
              onPress={() => isEditable && removeFromCart(product)}>
              <Icon
                type="material-community"
                name="minus"
                size={wp(5)}
                color={isEditable ? '#fff' : '#61012D'}
                style={{ aspectRatio: 1 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.titleContainer}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemName}>
            {product.name}
          </Text>
          {product.isOffer && product.offerType === 3 && (
            <Text style={styles.offerQuantity}>
              إشتري {product.offerQuantity} حبات بـ {product.offerPrice} دينار
            </Text>
          )}
        </View>
        <View style={styles.priceContainer}>
          <Text
            style={[
              styles.originalPrice,
              product.isOffer && product.offerType === 2
                ? styles.withOffer
                : null,
            ]}>
            {product.price} JD
          </Text>
          {product.isOffer && product.offerType === 2 && (
            <Text style={styles.originalPrice}>{product.offerPrice} JD</Text>
          )}
        </View>
      </View>
      <View style={styles.imageContainer}>
      <ImageModal
         onError={()=> setImageUri(defaultImage) }
         source={imageUri}
         style={{
           width: '100%',
           aspectRatio: 1,
         }}
         resizeMode="contain"/>
      </View>
      {showStockStatus && !product.isStockAvailable && (
        <View style={styles.overlayShadow}>
          <View style={styles.overlayInnerContainer}>
            <Text style={styles.overlayText}>نفذت الكمية</Text>
          </View>
        </View>
      )}
      {product.isOffer ? (
        <View style={styles.wholesaleIcon}>
          <PercentageIcon height={wp(3)} style={{ aspectRatio: 1 }} />
        </View>
      ) : (
        <View />
      )}
      {showFavoriteIcon && (
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => onClickFavoriteIcon(product.id)}>
          {product.isFavorite ? (
            <HeartActive height={wp(6)} style={{ aspectRatio: 1 }} />
          ) : (
            <FavoriteIcon
              height={wp(6)}
              style={{ aspectRatio: 1 }}
              fill={'black'}
            />
          )}
        </TouchableOpacity>
      )}
      {showTrushIcon && (
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => onClickTrushIcon(product.id)}>
          <TrushIcon height={wp(5)} style={{ aspectRatio: 1 }} />
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    // flex: 1,
    marginBottom: 13,
    // height: hp(14),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.3,
    elevation: 4,
    backgroundColor: 'white',
    position: 'relative',
    flexDirection: 'row',
  },
  wholesaleIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    zIndex: 1,
    backgroundColor: '#61012D',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  favoriteIcon: {
    position: 'absolute',
    top: hp(1.5),
    left: wp(2.5),
    zIndex: 1,
  },
  imageContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: 5,
  },
  middleContainer: {
    flex: 4,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  itemName: {
    textAlign: 'right',
    fontFamily: 'Tajawal-Bold',
    fontSize: wp(3.4),
  },
  bottomContainer: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    flex: 2,
    marginVertical: 10,
    justifyContent: 'center',
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: wp(2.5),
  },
  overlayShadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.5)',
    // opacity:.3,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // zIndex: 2,
  },
  overlayInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    marginHorizontal:wp(1),
    marginVertical:hp(2)
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontFamily: 'Tajawal-Medium',
  },
  addButtonContainer: {
    flexDirection: 'row',
    backgroundColor: '#61012D',
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    alignItems: 'center',
  },
  originalPrice: {
    fontFamily: 'Tajawal-Bold',
    fontSize: wp(3.4),
    textAlignVertical: 'center',
    marginHorizontal: 2,
  },
  withOffer: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#BF0513',
    color: '#00000059',
  },
  quantity: {
    color: '#ffff',
    fontSize: Dimensions.get('screen').width < 350 ? hp(4) : hp(2),
    fontFamily: 'Tajawal-Regular',
  },
  offerQuantity: {
    marginVertical: 2,
    fontSize: wp(3),
    fontFamily: 'Tajawal-Bold',
    textAlign: 'right',
  },
  paddingButtons: {
    padding: wp(2),
  },
});

export default Card;
