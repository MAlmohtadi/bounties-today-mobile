import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Button, Icon, Input} from 'react-native-elements';
import {registerUser, setUserUpdated} from '_actions/authActions';
import {connect} from 'react-redux';
import {validateEmail, validatePhoneNumber} from '_utils/validation';
import {ScrollView} from 'react-native';
import AlertMessage from '_organisms/AlertMessage';
import {
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
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
const CreateAccount = ({
  authReducer: {
    facebookId: facebookIdOriginal,
    appleId: appleIdOriginal,
    id,
    isUserUpdated,
    name: nameOriginal,
    email: emailOriginal,
    phone: phoneOriginal,
    secondaryPhone: secondaryPhoneOriginal,
  },
  alertReducer: {error},
  setViewType,
  registerUser,
}) => {
  const [name, setName] = useState(nameOriginal);
  const [email, setEmail] = useState(emailOriginal);
  const [phone, setPhone] = useState(phoneOriginal);
  const [facebookId, setFacebookId] = useState(facebookIdOriginal);
  const [appleId, setAppleId] = useState(facebookIdOriginal);
  const [secondaryPhone, setSecondaryPhone] = useState(secondaryPhoneOriginal);
  const [validtion, setValidation] = useState({...initialValidation});
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessageVisible, setFeedbackMessageVisible] = useState(false);
  const [appleSignupCompletionVisiblity, setAppleSignupCompletionVisiblity] =
    useState(false);

  const onSubmit = () => {
    const validationCheck = {...validtion};
    setValidation({...initialValidation});
    validationCheck.name.isError = !name || (name && !(name.trim().length > 0));
    validationCheck.phone.isError =
      !phone || (phone && !validatePhoneNumber(phone));
    validationCheck.secondaryPhone.isError =
      secondaryPhone && !validatePhoneNumber(secondaryPhone);
    validationCheck.email.isError = email && !validateEmail(email);

    setValidation({...validationCheck});
    if (
      !validationCheck.name.isError &&
      !validationCheck.phone.isError &&
      !validationCheck.secondaryPhone.isError &&
      !validationCheck.email.isError
    ) {
      setIsLoading(true);
      registerUser({facebookId, name, email, phone, secondaryPhone, appleId});
    }
  };
  useEffect(() => {
    if (isUserUpdated) {
      setTimeout(() => {
        setIsLoading(false);
        setUserUpdated(false);
        setFeedbackMessageVisible(true);
      }, 1000);
    }
    if (!error) {
      setIsLoading(false);
    }
  }, [
    id,
    nameOriginal,
    emailOriginal,
    phoneOriginal,
    secondaryPhoneOriginal,
    isUserUpdated,
    error,
  ]);
  //Create response callback.

  const loginFacebook = type => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );

          new GraphRequestManager()
            .addRequest(infoRequest(createAccountCallback))
            .start();
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };
  const infoRequest = callback =>
    new GraphRequest('/me?fields=email,name', null, callback);
  const createAccountCallback = (error, result) => {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
    } else {
      console.log('Success fetching data: ' + result.toString());
      setName(result.name);
      setEmail(result.email);
      setFacebookId(result.id);
    }
  };

  const onAppleButtonPress = () => {
    // Make a request to apple.
    appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      .then(res => {
        console.log('dedeede', {res});
        setAppleId(res.user);
        const {
          familyName,
          givenName,
          middleName,
          namePrefix,
          nameSuffix,
          nickname,
        } = res.fullName || {};
        let name = '';
        if (nickname) {
          name = nickname;
        } else {
          if (namePrefix) {
            name = namePrefix;
          }
          if (givenName) {
            name = name + ' ' + givenName;
          }
          if (middleName) {
            name = name + ' ' + middleName;
          }
          if (familyName) {
            name = name + ' ' + familyName;
          }
          if (nameSuffix) {
            name = name + ' ' + nameSuffix;
          }
        }
        setName(name.length > 0 ? name : null);
        if (res.email) {
          setEmail(res.email);
        }
        setAppleSignupCompletionVisiblity(true);
      });

    // Get the credential for the user.
    // const credentialState =  appleAuth.getCredentialStateForUser(
    //   appleAuthRequestResponse.user,
    // );
    // console.log('credentialState', credentialState)
    // console.log('appleAuthRequestResponse', appleAuthRequestResponse)

    // If the Auth is authorized, we call our API and pass the authorization code.
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.mainContainer}>
      <Button
        raised
        onPress={() => {
          loginFacebook();
        }}
        type="clear"
        title="إنشاء حساب باستخدام"
        icon={
          <Icon
            type="font-awesome"
            name="facebook-official"
            size={wp(5)}
            style={{aspectRatio: 1, marginHorizontal: wp(2)}}
            color="#415F9B"
          />
        }
        useForeground
        titleStyle={[styles.buttonTitleStyle, {fontSize: hp(1.8)}]}
        containerStyle={[
          styles.buttonStyle,
          {
            borderColor: '#415F9B',
            paddingVertical: hp(1, 5),
          },
        ]}
      />
      {Platform.OS === 'ios' && (
        <AppleButton
          buttonStyle={AppleButton.Style.WHITE_OUTLINE}
          buttonType={AppleButton.Type.SIGN_UP}
          style={{
            flex: 1,
            marginTop: 10,
            width: '100%', // You must specify a width
            height: hp(5), // You must specify a height
          }}
          onPress={() => onAppleButtonPress()}
        />
      )}
      <View style={styles.subContainer}>
        <Text style={styles.titleStyle}>يرجى تسجيل المعلومات التالية :</Text>
      </View>
      <Input
        placeholder="الإسم *"
        textContentType="name"
        inputStyle={styles.inputTextStyle}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        errorMessage={validtion.name.isError ? validtion.name.errorMessage : ''}
        errorStyle={{textAlign: 'right'}}
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
        errorStyle={{textAlign: 'right'}}
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
        errorStyle={{textAlign: 'right'}}
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
        errorStyle={{textAlign: 'right'}}
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
        title="تأكيد المعلومات"
        titleStyle={[styles.buttonTitleStyle, {color: '#fff'}]}
        buttonStyle={[
          styles.buttonStyle,
          {backgroundColor: colors.primaryColor},
        ]}
        containerStyle={{
          marginTop: 10,
          borderRadius: wp(2),
          backgroundColor: 'red',
        }}
      />

      <View style={{marginTop: 10, alignItems: 'flex-start'}}>
        <Text
          style={styles.customText}
          onPress={() => {
            setViewType('login');
          }}>
          تسجيل الدخول
        </Text>
      </View>
      <AlertMessage
        visible={feedbackMessageVisible}
        message={'تم انشاء حسابك بنجاح'}
        buttonText="تم"
        buttonAction={() => {
          setFeedbackMessageVisible(false);
        }}
      />
      <AlertMessage
        visible={appleSignupCompletionVisiblity}
        message={'لاكمال التسجيل يرجى ادخال رقم الهاتف و الاسم'}
        buttonText="موافق"
        buttonAction={() => {
          setAppleSignupCompletionVisiblity(false);
        }}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subContainer: {marginVertical: hp(3), alignItems: 'flex-end'},
  titleStyle: {fontFamily: fonts.bold, fontSize: hp(2)},
  buttonStyle: {
    // paddingVertical: hp(2),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: colors.primaryColor,
    backgroundColor: '#fff',
  },
  containerStyle: {paddingHorizontal: 0, marginBottom: 10},
  inputContainerStyle: {
    borderColor: colors.primaryColor,
    borderWidth: 1,
    borderRadius: wp(2),
  },
  inputTextStyle: {
    fontFamily: fonts.regular,
    color: colors.primaryColor,
    marginHorizontal: 20,
    fontSize: hp(2.2),
  },
  customText: {
    fontFamily: fonts.regular,
    color: '#FF0000',
    fontSize: hp(2),
  },
  buttonTitleStyle: {
    color: '#415F9B',
    fontSize: hp(2),
    fontFamily: fonts.bold,
  },
});

const mapStateToProps = state => {
  return {
    authReducer: state.authReducer,
    alertReducer: state.alertReducer,
  };
};

export default connect(mapStateToProps, {
  registerUser,
})(CreateAccount);
