import React from 'react';
import {TouchableOpacity} from 'react-native';
import {ImageBackground, View, Text, StyleSheet, Platform} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import defaultImage from '_images/defaultImage.png';

const Category = ({categories = [], onPressCard}) => {
  return (
    <View style={styles.mainContainer}>
      {categories.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => onPressCard(item)}>
          <ImageBackground
            defaultSource={defaultImage}
            source={{uri: item.imageUrl}}
            resizeMode="stretch"
            style={styles.categoryImageContainer}
            imageStyle={styles.categoryImage}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: wp(2),
  },
  categoryImageContainer: {
    flex: 1,
    // marginHorizontal: wp(1),
    marginVertical: wp(1),
    height: hp(30),
    backgroundColor: '#FFFF',
    borderRadius: 10,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    ...Platform.select({
      android: {
        overflow: 'hidden',
      },
      default: {
        overflow: null,
      },
    }),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.3,
    elevation: 2,
  },
  categoryImage: {
    ...Platform.select({
      ios: {
        borderRadius: 10,
      },
      default: {
        borderRadius: null,
      },
    }),
  },

  categoryTitleContainer: {
    backgroundColor: '#FFFFFFBF',
    height: hp(7),
    ...Platform.select({
      ios: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
      },
      default: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      },
    }),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Category;
