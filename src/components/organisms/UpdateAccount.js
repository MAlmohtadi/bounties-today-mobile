import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Button, Icon, Input } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import AlertMessage from '_organisms/AlertMessage';

import {
  logoutUser,
  setUserUpdated,
  updateUser,
  deleteUser,
} from '_actions/authActions';
import { validateEmail, validatePhoneNumber } from '_utils/validation';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';

const initialValidation = {
  name: {
    isError: false,
    errorMessage: 'الاسم يجب ان يكون اكثر من حرف',
  },
  phone: {
    isError: false,
    errorMessage: 'الهاتف يجب أن يكون من عشر خانات ويبدأ بـ 07',
  },
  secondaryPhone: {
    isError: false,
    errorMessage: 'الهاتف يجب أن يكون من عشر خانات ويبدأ بـ 07',
  },

  email: {
    isError: false,
    errorMessage: 'البريد الالكتروني غير صحيح',
  },
};
const UpdateAccount = ({
  setViewType,
  authReducer: {
    facebookId,
    appleId,
    id,
    isUserUpdated,
    name: nameOriginal,
    email: emailOriginal,
    phone: phoneOriginal,
    secondaryPhone: secondaryPhoneOriginal,
  },
  logoutUser,
  setUserUpdated,
  updateUser,
  deleteUser,
}) => {
  const [name, setName] = useState(nameOriginal);
  const [email, setEmail] = useState(emailOriginal);
  const [phone, setPhone] = useState(phoneOriginal);
  const [secondaryPhone, setSecondaryPhone] = useState(secondaryPhoneOriginal);
  const [validtion, setValidation] = useState({ ...initialValidation });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);

  const onSubmit = () => {
    const validationCheck = { ...validtion };
    setValidation({ ...initialValidation });
    validationCheck.name.isError = !name || (name && !(name.trim().length > 0));
    validationCheck.phone.isError =
      !phone || (phone && !validatePhoneNumber(phone));
    validationCheck.secondaryPhone.isError =
      secondaryPhone && !validatePhoneNumber(secondaryPhone);
    validationCheck.email.isError = email && !validateEmail(email);

    setValidation({ ...validationCheck });
    if (
      !validationCheck.name.isError &&
      !validationCheck.phone.isError &&
      !validationCheck.secondaryPhone.isError &&
      !validationCheck.email.isError
    ) {
      setIsLoading(true);
      updateUser({
        name,
        email,
        phone,
        secondaryPhone,
        id,
        facebookId,
      });
    }
  };
  useEffect(() => {
    if (isUserUpdated) {
      setTimeout(() => {
        setIsLoading(false);
        setUserUpdated(false);
      }, 1000);
    }
  }, [
    nameOriginal,
    emailOriginal,
    phoneOriginal,
    secondaryPhoneOriginal,
    isUserUpdated,
    setUserUpdated,
  ]);
 
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1 }}
      contentContainerStyle={styles.mainContainer}>
      <View>
        <Input
          placeholder="الإسم *"
          textContentType="name"
          inputStyle={styles.inputTextStyle}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          errorMessage={
            validtion.name.isError ? validtion.name.errorMessage : ''
          }
          errorStyle={{ textAlign: 'right' }}
          renderErrorMessage={validtion.name.isError}
          value={name}
          onChangeText={setName}
          textAlign="right"
        />
        <Input
          placeholder="رقم الهاتف *"
          inputStyle={styles.inputTextStyle}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          errorMessage={
            validtion.phone.isError ? validtion.phone.errorMessage : ''
          }
          errorStyle={{ textAlign: 'right' }}
          renderErrorMessage={validtion.phone.isError}
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
          returnKeyType="done"
          textContentType="telephoneNumber"
          textAlign="right"
        />
        <Input
          placeholder="رقم الهاتف الثاني (إختياري)"
          textContentType="telephoneNumber"
          inputStyle={styles.inputTextStyle}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          errorMessage={
            validtion.secondaryPhone.isError
              ? validtion.secondaryPhone.errorMessage
              : ''
          }
          errorStyle={{ textAlign: 'right' }}
          renderErrorMessage={validtion.secondaryPhone.isError}
          value={secondaryPhone}
          keyboardType="numeric"
          returnKeyType="done"
          onChangeText={setSecondaryPhone}
          textAlign="right"
        />
        <Input
          placeholder="الإيميل (إختياري)"
          textContentType="emailAddress"
          keyboardType="email-address"
          inputStyle={styles.inputTextStyle}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          value={email}
          onChangeText={setEmail}
          errorMessage={
            validtion.email.isError ? validtion.email.errorMessage : ''
          }
          errorStyle={{ textAlign: 'right' }}
          renderErrorMessage={validtion.email.isError}
          textAlign="right"
        />
        <Button
          raised
          onPress={() => {
            if (!isLoading) {
              onSubmit();
            }
          }}
          loading={isLoading}
          type="solid"
          title="تعديل المعلومات"
          titleStyle={[styles.buttonTitleStyle, { color: '#fff' }]}
          buttonStyle={[styles.buttonStyle, { backgroundColor: colors.primaryColor }]}
          containerStyle={{ marginTop: 10, borderRadius: wp(2) }}
        />
      </View>
      <View style={styles.subContainer2}>
        <TouchableOpacity
          onPress={() => {
            setDeleteModel(true);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Text style={styles.customText}>إلغاء الحساب</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            logoutUser();
            setViewType('main');
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Text style={styles.customText}>تسجيل الخروج</Text>
          <Icon
            type="ionicon"
            name="log-out-outline"
            size={35}
            color={colors.primaryColor}
          />
        </TouchableOpacity>
      </View>
      {deleteModel && (
        <AlertMessage
          visible={deleteModel}
          message={'هل أنت متآكد من إلغاء حسابك'}
          buttonText={'إلغاء'}
          buttonAction={() =>
            setDeleteModel(false)
          }
          buttonText2={'نعم'}
          buttonAction2={() => { deleteUser({ id }); setViewType('login');}
          }
        />
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  subContainer: { marginVertical: hp(3), alignItems: 'flex-end' },
  subContainer2: {
    flexDirection: 'row',
    marginVertical: hp(3),
    justifyContent: 'space-between',
  },
  titleStyle: { fontFamily: fonts.bold, fontSize: hp(2) },
  buttonStyle: {
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: colors.primaryColor,
    backgroundColor: '#fff',
  },
  containerStyle: { paddingHorizontal: 0, marginBottom: 10 },
  inputContainerStyle: {
    borderColor: colors.primaryColor,
    borderWidth: 1,
    borderRadius: wp(2),
  },
  inputTextStyle: {
    fontFamily: fonts.regular,
    color: colors.primaryColor,
    marginHorizontal: wp(2),
    fontSize: hp(2.2),
  },
  customText: { fontFamily: fonts.bold, color: colors.primaryColor, fontSize: hp(2) },
  buttonTitleStyle: {
    color: '#415F9B',
    fontSize: hp(2),
    fontFamily: fonts.bold,
  },
});
const mapStateToProps = (state) => {
  return {
    authReducer: state.authReducer,
  };
};

export default connect(mapStateToProps, {
  logoutUser,
  updateUser,
  setUserUpdated,
  deleteUser,
})(UpdateAccount);
