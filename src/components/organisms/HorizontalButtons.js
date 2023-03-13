import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList,I18nManager } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Button } from 'react-native-elements';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const HorizontalButtons = ({
  data = [],
  onSelect,
  selected,
  displayField = 'name',
}) => {
  const scrollRef = useRef();
  const [initialScrollIndex, setInitialScrollIndex] = useState(data.findIndex((item) => item.id === selected));
  useEffect(() => {
    scrollToSelectedItem()
  }, [selected, initialScrollIndex, scrollRef])
  const scrollToSelectedItem = () => {
    if (!initialScrollIndex || !data[initialScrollIndex] || data[initialScrollIndex].id !== selected) {
      setInitialScrollIndex(data.findIndex((item) => item.id === selected));
    } else if (scrollRef && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollToIndex({
          animated: true,
          index: initialScrollIndex
        })
      }, 100)
    }
  }
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
      }}>
      <FlatList
        ref={scrollRef}
        inverted
        horizontal
        showsHorizontalScrollIndicator={false}
        // initialScrollIndex={initialScrollIndex}
        centerContent
        onScrollToIndexFailed={() => setInitialScrollIndex()}
        data={data}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <Button
            key={item.id}
            title={item[`${displayField}`]}
            type="clear"
            useForeground
            raised={selected === item.id}
            onPress={() => onSelect(item.id)}
            titleStyle={[
              styles.buttonTitleStyle,
              selected === item.id ? styles.buttonTitleStyleActive : null,
            ]}
            containerStyle={[
              styles.buttonStyle,
              selected === item.id ? styles.buttonStyleActive : null,
            ]}
          />
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  innerScrollContent: {
    flexDirection:  !I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  buttonTitleStyle: {
    fontFamily: fonts.regular,
    color: colors.primaryColor,
    fontSize: wp(4),
  },
  buttonTitleStyleActive: {
    color: 'white',
  },
  buttonStyle: {
    borderRadius: 9,
    backgroundColor: 'transparent',
    borderColor: colors.primaryColor,
    borderWidth: 1,
    marginHorizontal: 5
  },
  buttonStyleActive: {
    backgroundColor: colors.primaryColor,
  },
});
export default HorizontalButtons;
