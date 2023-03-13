import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import Categories from '_organisms/Categories';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const CategoryScreen = ({navigation}) => {
  return (
    <ScrollView
      style={styles.mainContainer}
      style={{maxHeight: hp(78)}}
      showsVerticalScrollIndicator={false}>
      <Categories navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default CategoryScreen;
