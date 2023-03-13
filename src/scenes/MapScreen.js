import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MapView, { MarkerAnimated } from 'react-native-maps';
import { updateCheckoutDetails,getDeliveryInfo} from '_actions/checkoutActions';
import { Button } from 'react-native-elements';
import Geolocation from '@react-native-community/geolocation';
import colors from '_utils/constants/Colors';
import fonts from '_utils/constants/Fonts';

const MapScreen = ({ navigation, updateCheckoutDetails,getDeliveryInfo }) => {
  const initialRegion = {
    latitude: 31.963086,
    longitude: 35.920176,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const [region, setRegion] = useState(null);
  const errorMessage = 'لم يتم السماح بتحديد الموقع الحالي';
  const [selectedLocation, setSelectedLocation] = useState(null);
  useEffect(() => {
    
    Geolocation.getCurrentPosition(
      (position) => {
        setRegion({
          ...initialRegion,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setSelectedLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log( error);
        Alert.alert('الموقع الحالي', errorMessage);
      },
      { enableHighAccuracy: false, timeout: 3000 },
    );
  }, []);
  // Alert.alert('Info 2', JSON.stringify(selectedLocation))
  return (
    <View style={styles.mainContainer}>
      <MapView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        initialRegion={initialRegion}
        region={region}
        onTouchEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
        onPress={(event) => {
          setSelectedLocation(event.nativeEvent.coordinate);
        }}>
        {selectedLocation && (
          <MarkerAnimated
            draggable
            coordinate={{ ...selectedLocation }}
            title={'title'}
            onDragEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
            description={'description'}
          />
        )}
      </MapView>
      {selectedLocation && (
        <Button
          onPress={() => {
            getDeliveryInfo({
              lat:selectedLocation.latitude,
              lng: selectedLocation.longitude,
            });
            
            navigation.goBack();
          }}
          raised
          useForeground
          type="clear"
          title="تأكيد عنوان التوصيل"
          titleStyle={{ color: '#fff', fontFamily: fonts.bold }}
          containerStyle={[styles.buttonContainerStyle, styles.buttonStyle,
          {
            backgroundColor: colors.primaryColor,
            marginHorizontal: wp(2),
            marginBottom: hp(2),
          }]}

        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  buttonContainerStyle: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  buttonStyle: {
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: colors.primaryColor,
  },
});

const mapStateToProps = (state) => {
  return {
    offerReducer: state.offerReducer,
  };
};

export default connect(mapStateToProps, { updateCheckoutDetails, getDeliveryInfo })(MapScreen);
