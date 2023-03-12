import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Button, Icon, Input } from 'react-native-elements';
import { loginUser, setUserUpdated } from '_actions/authActions';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';

import {
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
import { connect } from 'react-redux';
import { validatePhoneNumber } from '_utils/validation';
import AlertMessage from '_organisms/AlertMessage';
import fonts from '_utils/constants/Fonts';
import colors from '_utils/constants/Colors';
const initialValidation = {
  phone: {
    isError: false,
    errorMessage: 'الهاتف يجب أن يكون من عشر خانات ويبدأ بـ 07',
  },
};
const Login = ({
  setViewType,
  loginUser,
  authReducer: { id: userId },
  alertReducer: { error },
  setUserUpdated,
}) => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [phone, setPhone] = useState();
  const [validtion, setValidation] = useState({ ...initialValidation });
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessageVisible, setFeedbackMessageVisible] = useState(false);
  const loginCallback = (error, result) => {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
    } else {
      console.log('Success fetching data: ' + result.toString());
      loginUser({ facebookId: result.id });
    }
  };
  useEffect(() => {
    if (userId) {
      setTimeout(() => {
        setIsLoading(false);
        setUserUpdated(false);
        setFeedbackMessageVisible(true);
      }, 1000);
    }
    if (!error) {
      setIsLoading(false);
    }
  }, [userId, error, setUserUpdated]);
  const loginFacebook = (type) => {
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
            .addRequest(infoRequest(loginCallback))
            .start();
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };
  const onAppleButtonPress = async () => {
    // Make a request to apple.
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [
        appleAuth.Scope.EMAIL,
        appleAuth.Scope.FULL_NAME
      ],
    });

    // // Get the credential for the user.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    // // If the Auth is authorized, we call our API and pass the authorization code.
    if (credentialState === appleAuth.State.AUTHORIZED) {
      loginUser({ appleId: appleAuthRequestResponse.user })
    }
  };
  const infoRequest = (callback) =>
    new GraphRequest('/me?fields=email,name', null, callback);
  const onSubmit = () => {
    const validationCheck = { ...validtion };
    setValidation({ ...initialValidation });
    validationCheck.phone.isError =
      !phone || (phone && !validatePhoneNumber(phone));

    setValidation({ ...validationCheck });
    if (!validationCheck.phone.isError) {
      setIsLoading(true);
      loginUser({ phone });
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 0}
      style={{ flex: 1 }}>
      <Button
        raised
        onPress={() => {
          loginFacebook('login');
        }}
        type="clear"
        title="تسجيل الدخول باستخدام"
        icon={
          <Icon
            type="font-awesome"
            name="facebook-official"
            size={wp(4)}
            style={{ aspectRatio: 1, marginHorizontal: wp(2) }}
            color="#415F9B"
          />
        }
        titleStyle={[styles.buttonTitleStyle, { fontSize: hp(1.8) }]}
        useForeground
        containerStyle={[
          styles.buttonStyle,
          {
            borderColor: '#415F9B',
            paddingVertical: 4,
            justifyContent: 'space-around',
          },
        ]}
      />
      {Platform.OS === 'ios' &&
        <AppleButton
          buttonStyle={AppleButton.Style.WHITE_OUTLINE}
          buttonType={AppleButton.Type.SIGN_IN}
          style={{
            marginTop: 10,
            marginBottom: 5,
            width: '100%', // You must specify a width
            height: hp(5), // You must specify a height
          }}
          onPress={() => onAppleButtonPress()}
        />}
      {!isLoginVisible && (
        <Button
          raised
          onPress={() => {
            setIsLoginVisible(true);
          }}
          type="clear"
          title="تسجيل باستخدام رقم الهاتف"
          titleStyle={[styles.buttonTitleStyle, { color: colors.primaryColor }]}
          useForeground
          containerStyle={[
            styles.buttonStyle,
            { marginTop: 5, backgroundColor: '#fff' },
          ]}
        />
      )}

      {isLoginVisible && (
        <Input
          placeholder="رقم الهاتف"
          keyboardType="numeric"
          returnKeyType="done"
          onChangeText={(value) => setPhone(value)}
          inputStyle={styles.inputTextStyle}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          errorMessage={
            validtion.phone.isError ? validtion.phone.errorMessage : ''
          }
          errorStyle={{ textAlign: 'right' }}
          renderErrorMessage={validtion.phone.isError}
          textAlign="right"
        />
      )}
      {isLoginVisible && (
        <Button
          raised
          onPress={() => {
            if (!isLoading) {
              onSubmit({ phone });
            }
          }}
          loading={isLoading}
          type="clear"
          title="تسجيل الدخول"
          titleStyle={[styles.buttonTitleStyle, { color: '#fff' }]}
          useForeground
          containerStyle={[styles.buttonStyle, { backgroundColor: colors.primaryColor, marginTop: 5, borderRadius: wp(2) }]}
        />
      )}
      <View style={{ marginTop: 10, alignItems: 'flex-start' }}>
        <Text
          style={styles.customText}
          onPress={() => {
            setViewType('create');
          }}>
          إنشاء حساب
        </Text>
      </View>
      <AlertMessage
        visible={feedbackMessageVisible}
        message={'تم تسجيل الدخول بنجاح'}
        buttonText="تم"
        buttonAction={() => {
          setFeedbackMessageVisible(false);
        }}
      />
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleStyle: { fontFamily: fonts.bold, fontSize: 15 },
  buttonStyle: {
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: colors.primaryColor,
    backgroundColor: '#fff',
  },
  customText: {
    fontFamily: fonts.regular,
    color: '#FF0000',
    fontSize: hp(2),
  },
  containerStyle: { paddingHorizontal: 0, marginVertical: 10 },
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
  buttonTitleStyle: {
    color: '#415F9B',
    fontSize: hp(2),
    fontFamily: fonts.bold,
  },
});
const mapStateToProps = (state) => {
  return {
    authReducer: state.authReducer,

    alertReducer: state.alertReducer,
  };
};

export default connect(mapStateToProps, {
  loginUser,
  setUserUpdated,
})(Login);
