import React from 'react';
import {View, StyleSheet} from 'react-native';
import Account from '_organisms/AccountModal';

const AccountScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <Account />
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.3,
    elevation: 4,
  },
});

export default AccountScreen;
