import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import Dots from './Dots';
import defaultImage from '_images/defaultImage.png';
import colors from '_utils/constants/Colors';

const renderImage = (item, onPressImage) => {
  if (item.isClickable) {
    return (
      <TouchableHighlight
        underlayColor={'#fff'}
        onPress={() => onPressImage(item)}>
        <ImageBackground
          key={item.id}
          defaultSource={defaultImage}
          source={{uri: item.imageUrl}}
          resizeMode="cover"
          style={styles.child}
        />
      </TouchableHighlight>
    );
  }
  return (
    <ImageBackground
      key={item.id}
      defaultSource={defaultImage}
      source={{uri: item.imageUrl}}
      resizeMode="cover"
      style={styles.child}
    />
  );
};
const ImageSlider = ({banners = [], onPressImage}) => {
  const [active, setActive] = useState(0);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.containerStyle}>
        <SwiperFlatList
          autoplay
          autoplayDelay={3}
          autoplayLoop
          onChangeIndex={item => setActive(item.index)}
          renderAll
          data={banners}
          renderItem={({item}) => renderImage(item, onPressImage)}
        />
      </View>
      <Dots
        dotStyle={styles.shadow}
        activeBorder
        activeBorderColor={colors.primaryColor}
        passiveDotWidth={8}
        activeDotWidth={8}
        activeDotHeight={8}
        passiveDotHeight={8}
        length={banners.length}
        active={active}
        activeColor={colors.primaryColor}
        passiveColor="#FFFFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    // marginBottom: hp(1),
  },
  containerStyle: {
    width: wp(100),
    aspectRatio: 2 / 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  child: {
    flex: 1,
    width: wp(100),
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    elevation: 5,
  },
});
export default ImageSlider;
