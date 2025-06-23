import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import store from '../redux/store';
import { THEMES } from '@/constants/colors';
import { Button, TextInput } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const signIn = () => {
  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordShow, setIsPasswordShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')

  const handleSignIn = async() => {
    setIsLoading(true)
    if(!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      let msg = "An error occurred. Please try again.";
      if (err && err.errors && Array.isArray(err.errors) && err.errors[0]?.message) {
        msg = err.errors[0].message;
      } else if (err?.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
      console.error(err);
    }finally{
      setIsLoading(false)
    }
  }


  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={[styles.mainContainer]}>
        <View style={[styles.innerContainer]}>
          <Image source={require("../../assets/images/i1.png")} style={[styles.image,]} />
          <Text style={[styles.welcome, { color: theme.textLight }]}>Welcome</Text>
        </View>
        <View style={[styles.inputContainer]}>
          <TextInput
            label='Email'
            mode='outlined'
            selectionColor={theme.border}
            style={[styles.inputBox, { backgroundColor: theme.primary }]}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            label='Password'
            mode='outlined'
            secureTextEntry={!isPasswordShow}
            value={password}
            onChangeText={setPassword}
            right={
              <TextInput.Icon
                icon={isPasswordShow ? "eye" : "eye-off"}
                onPress={() => setIsPasswordShow(!isPasswordShow)}
              />
            }
            selectionColor={theme.border}
            style={[styles.inputBox, { backgroundColor: theme.primary }]}
          />
          {errorMessage ? (
            <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
          ) : null}
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
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.textLight} />
            ) : (
              "Sign In"
            )}
          </Button>
          <View style={[styles.belowTxtBox, {}]}>
            <Text style={[{ color: theme.textLight }]}>Don't have an account ? </Text>
            <TouchableOpacity onPress={() => {router.navigate("/sign-up") }}>
              <Text style={[{ color: theme.cardLight }, styles.signupTxt]}>Sign Up</Text>
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
    fontSize: 70
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
    alignContent:'center',
    alignItems:'center'
  },
  signupTxt:{
    textDecorationLine:'underline',
    fontSize:15
  }
})