import React, {useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import PercentageIcon from '_icons/percentage.svg';
import FavoriteIcon from '_icons/favorite.svg';
import HeartActive from '_icons/heart-active';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImageModal from 'react-native-image-modal';
import { Icon } from 'react-native-elements';
import defaultImage from '_images/defaultImage.png';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const GridCard = ({
  product,
  addToCart,
  removeFromCart,
  showFavoriteIcon,
  onClickFavoriteIcon,
  showTrushIcon,
  isEditable = true,
  quantity = 0,
}) => {
  const [imageUri, setImageUri] = useState({ uri: product.imageUrl });

  const isProductQuantityAvailable = () => {
    return product.quantityMultiplier * (quantity + 1) <= product.maxQuantity;
  };
  return (
    <View style={styles.cardContainer}>
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
      <View style={styles.titleContainer}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemName}>
          {product.name}
        </Text>
        <Text style={styles.offerQuantity}>
          {product.isOffer && product.offerType === 3
            ? `إشتري ${product.offerQuantity} حبات بـ ${product.offerPrice} دينار`
            : ''}
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.addButtonContainer}>
          {!!quantity && quantity > 0 && (
            <TouchableOpacity
              style={styles.paddingButtons}
              onPress={() => isEditable && removeFromCart(product)}>
              <Icon
                type="material-community"
                name="minus"
                color={isEditable ? '#fff' : colors.primaryColor}
                size={wp(5)}
                style={{ aspectRatio: 1 }}
              />
            </TouchableOpacity>
          )}
          {!!quantity > 0 && <Text style={[styles.quantity]}>{quantity}</Text>}
          <TouchableOpacity
            style={styles.paddingButtons}
            onPress={() =>
              isEditable && isProductQuantityAvailable() && addToCart(product)
            }>
            {isProductQuantityAvailable() ? (
              <Icon
                type="material-community"
                name="plus"
                color={isEditable ? '#fff' : colors.primaryColor}
                size={wp(5)}
                style={{ aspectRatio: 1 }}
              />
            ) : (
              <Icon
                type="font-awesome"
                name="ban"
                color={isEditable ? '#fff' : colors.primaryColor}
                size={wp(5)}
                style={{ aspectRatio: 1 }}
              />
            )}
          </TouchableOpacity>
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
      {!product.isStockAvailable && (
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
              fill={'#85a83d'}
              height={wp(6)}
              style={{ aspectRatio: 1 }}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    margin: wp(1),
    flexGrow: 1,
    width: wp(45),
    // height: hp(33),
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
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'absolute',
  },
  wholesaleIcon: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
    backgroundColor: colors.primaryColor,
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
    marginHorizontal: 15,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: { marginHorizontal: 10 },
  itemName: {
    marginTop: Platform.OS === "ios" ? hp(1) : hp(0),
    textAlign: 'right', fontFamily: fonts.bold, fontSize: wp(3.4),
    color:colors.textColor,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  addButtonContainer: {
    backgroundColor: colors.primaryColor,
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  originalPrice: {
    fontFamily: fonts.bold,
    fontSize: wp(3.4),
    textAlignVertical: 'center',
    marginHorizontal: 2,
    color:colors.textColor,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginBottom: 10,
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
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  overlayShadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.5)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  overlayInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderStyle: 'dashed',
    borderWidth: 5,
    borderRadius: 10,
    paddingHorizontal: wp(6),
    paddingVertical: hp(2.2),
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: wp(4.5),
    fontFamily: fonts.medium,
  },

  paddingButtons: {
    padding: 4,
  },
  offerQuantity: {
    marginTop: 2,
    fontSize: wp(3),
    fontFamily: fonts.bold,
    textAlign: 'right',
    color:colors.textColor,
  },
});

export default GridCard;
