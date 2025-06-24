import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import store from '../redux/store';
import { THEMES } from '@/constants/colors';
import { Button, TextInput } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { setTheme } from '../redux/Slices/themeSlice';

const signIn = () => {


  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];

  const [emailAddress, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordShow, setIsPasswordShow] = useState(false)
  const [PendingVerification, setPendingVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = React.useState('')
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Email validation function
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Password validation function (at least 8 chars)
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleEmailBlur = () => {
    if (!validateEmail(emailAddress)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordBlur = () => {
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters.');
    } else {
      setPasswordError('');
    }
  };

  const canSignUp = emailAddress && password && validateEmail(emailAddress) && validatePassword(password);

  const onSignUpPress = async () => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    let valid = true;
    if (!validateEmail(emailAddress)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters.');
      valid = false;
    }
    if (!valid) {
      setGeneralError('Please fix the errors above to continue.');
      return;
    }
    if (!isLoaded) return
    setIsLoading(true)
    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })
      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err: any) {
      // Try to parse Clerk error for already used email
      if (err && err.errors && Array.isArray(err.errors)) {
        const emailExistsError = err.errors.find((e: any) => e.code === 'form_identifier_exists');
        if (emailExistsError) {
          setEmailError(emailExistsError.message || 'That email address is taken. Please try another.');
          setGeneralError('');
          return;
        }
        // Show first error if exists
        if (err.errors[0]?.message) {
          setGeneralError(err.errors[0].message);
          return;
        }
      }
      setGeneralError('An error occurred. Please try again.');
      console.error(JSON.stringify(err, null, 2))
    } finally{
      setIsLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return
    setIsLoading(true)
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally{
      setIsLoading(false)
    }
  }

  // Handler for social sign up
  // const handleSocialSignUp = async (provider: 'oauth_google' | 'oauth_facebook' | 'oauth_apple') => {
  //   if (!signUp) return;
  //   try {
  //     // TODO: Set your app's deep link redirect URLs below
  //     await signUp.authenticateWithRedirect({
  //       strategy: provider,
  //       redirectUrl: 'mytasks://redirect', // <-- Set this to your app's deep link
  //       redirectUrlComplete: 'mytasks://redirect-complete', // <-- Set this to your app's deep link for completion
  //     });
  //     // Clerk will handle the redirect and session
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={[styles.mainContainer]}>
        <View style={[styles.innerContainer]}>
          <Image source={require("../../assets/images/i2.png")} style={[styles.image,]} />
          <Text style={[styles.welcome, { color: theme.textLight }]}>Create new Account</Text>
        </View>
        <View style={[styles.inputContainer]}>
          {generalError ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{generalError}</Text> : null}
          <TextInput
            label='Email'
            mode='outlined'
            keyboardType='email-address'
            selectionColor={theme.border}
            style={[styles.inputBox, { backgroundColor: theme.secBackGround, borderColor: emailError ? 'red' : theme.border }]}
            value={emailAddress}
            onChangeText={text => {
              setEmail(text);
              if (emailError) setEmailError('');
              if (generalError) setGeneralError('');
            }}
            onBlur={handleEmailBlur}
          />
          {emailError ? <Text style={{ color: 'red', marginLeft: 5 }}>{emailError}</Text> : null}
          <TextInput
            label='Password'
            mode='outlined'
            secureTextEntry={!isPasswordShow}
            right={
              <TextInput.Icon
                icon={isPasswordShow ? "eye" : "eye-off"}
                onPress={() => setIsPasswordShow(!isPasswordShow)}
              />
            }
            onChangeText={text => {
              setPassword(text);
              if (passwordError) setPasswordError('');
              if (generalError) setGeneralError('');
            }}
            onBlur={handlePasswordBlur}
            value={password}
            selectionColor={theme.border}
            style={[styles.inputBox, { backgroundColor: theme.secBackGround, borderColor: passwordError ? 'red' : theme.border }]}
          />
          {passwordError ? <Text style={{ color: 'red', marginLeft: 5 }}>{passwordError}</Text> : null}
          {PendingVerification &&
            <TextInput
              label='Verification Code'
              mode='outlined'
              value={code}
              onChangeText={setCode}
              selectionColor={theme.border}
              style={[styles.inputBox, { backgroundColor: theme.secBackGround }]}
            />
          }

          <Button
            mode="elevated"
            style={[styles.btn, { backgroundColor: theme.card, borderColor: theme.border }]}
            icon={
              isLoading
                ? undefined
                : ({ size, color }) => (
                  <AntDesign name="forward" size={size} color={theme.textLight} />
                )
            }
            contentStyle={{ flexDirection: 'row-reverse', alignItems: 'center' }}
            labelStyle={[styles.txtBtn, { color: theme.textLight }]}
            onPress={PendingVerification ? onVerifyPress : onSignUpPress}
            disabled={!PendingVerification && (isLoading || !canSignUp)}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.textLight} />
            ) : (
              emailAddress ? "Verify" : "Sign Up"
            )}
          </Button>

          {/* Social sign up buttons */}
          {/* <View style={{ marginVertical: 20 }}>
            <Button
              icon="google"
              mode="outlined"
              onPress={() => handleSocialSignUp('oauth_google')}
              style={{ marginBottom: 10 }}
            >
              Sign up with Google
            </Button>
            <Button
              icon="facebook"
              mode="outlined"
              onPress={() => handleSocialSignUp('oauth_facebook')}
              style={{ marginBottom: 10 }}
            >
              Sign up with Facebook
            </Button>
            <Button
              icon="apple"
              mode="outlined"
              onPress={() => handleSocialSignUp('oauth_apple')}
            >
              Sign up with Apple
            </Button>
          </View> */}

          <View style={[styles.belowTxtBox, {}]}>
            <Text style={[{ color: theme.textLight }]}>Already have an account ? </Text>
            <TouchableOpacity onPress={() => { router.navigate("/sign-in") }}>
              <Text style={[{ color: theme.cardLight }, styles.signupTxt]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default signIn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10
  },
  image: {
    width: 320,
    height: 320,
  },
  mainContainer: {
    flex: 1,
  },
  welcome: {
    fontSize: 40
  },
  innerContainer: {
    alignItems: 'center'
  },
  inputContainer: {
    marginHorizontal: 15,
    marginTop: 40

  },
  inputBox: {
    marginVertical: 10
  },
  btn: {
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    marginTop: 10,
    fontSize: 30,
  },
  btnIcon: {
    marginLeft: 20
  },
  txtBtn: {
    fontSize: 18,
  },
  belowTxtBox: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  signupTxt: {
    textDecorationLine: 'underline',
    fontSize: 15
  }
})