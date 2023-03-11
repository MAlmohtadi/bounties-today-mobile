import React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {setActiveView} from '_actions/configActions';
import SortIcon from '_icons/sort';
import SortActiveIcon from '_icons/sortActive';
import MenuIcon from '_icons/menu';
import MenuActiveIcon from '_icons/menuActive';
import GridViewInactive from '_icons/gridView';
import GridViewActive from '_icons/GridViewActive';
import {Button} from 'react-native-elements';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const SortAndView = ({
  configReducer: {isGridView, sortType},
  setActiveView,
  setShowSort,
}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.viewButtonContainer}>
        <View style={styles.viewButtonContainer}>
          <Button
            onPress={() => setActiveView(true)}
            icon={
              isGridView ? (
                <GridViewActive width={wp(5)} style={{aspectRatio: 1}} />
              ) : (
                <GridViewInactive width={wp(5)} style={{aspectRatio: 1}} />
              )
            }
            type="clear"
            useForeground
            containerStyle={[
              styles.viewButtonStyleRight,
              isGridView ? styles.viewButtonStyleActive : null,
            ]}
          />
          <Button
            icon={
              !isGridView ? (
                <MenuIcon width={wp(5)} style={{aspectRatio: 1}} />
              ) : (
                <MenuActiveIcon width={wp(5)} style={{aspectRatio: 1}} />
              )
            }
            onPress={() => setActiveView(false)}
            type="clear"
            useForeground
            containerStyle={[
              styles.viewButtonStyleLeft,
              !isGridView ? styles.viewButtonStyleActive : null,
            ]}
          />
        </View>
        <Button
          icon={
            !sortType ? (
              <SortIcon width={wp(5)} style={{aspectRatio: 1}} />
            ) : (
              <SortActiveIcon width={wp(5)} style={{aspectRatio: 1}} />
            )
          }
          onPress={() => setShowSort(true)}
          type="clear"
          useForeground
          containerStyle={[
            styles.viewButtonStyle,
            sortType ? styles.viewButtonStyleActive : null,
          ]}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {justifyContent: 'center', marginVertical: 4},
  viewButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewButtonStyleLeft: {
    backgroundColor: '#FFFFFF',
    borderColor: '#61012D',
    borderWidth: wp(0.5),
    borderTopRightRadius: wp(3),
    borderBottomRightRadius: wp(3),
    paddingHorizontal: wp(1.5),
    margin: 2,
  },
  viewButtonStyle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#61012D',
    borderWidth: wp(0.5),
    borderRadius: wp(3),
    paddingHorizontal: wp(1.5),
    margin: 2,
  },
  viewButtonStyleActive: {
    backgroundColor: '#61012D',
    paddingHorizontal: wp(1.5),
    borderWidth: 0,
  },
  viewButtonStyleRight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#61012D',
    borderWidth: wp(0.5),
    borderTopLeftRadius: wp(3),
    borderBottomLeftRadius: wp(3),
    margin: 2,
    paddingHorizontal: wp(1.5),
  },
});
const mapStateToProps = (state) => {
  return {
    configReducer: state.configReducer,
  };
};

export default connect(mapStateToProps, {
  setActiveView,
})(SortAndView);
