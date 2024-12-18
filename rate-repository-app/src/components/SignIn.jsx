import React from 'react'
import { View, StyleSheet, TextInput, Pressable } from 'react-native'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-native'
import Text from './Text'
import theme from '../theme'
import useSignIn from '../hooks/useSignIn'

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5da',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  errorInput: {
    borderColor: '#d73a4a',
  },
  errorText: {
    color: '#d73a4a',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: theme.fontWeights.bold,
  },
})

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

const SignIn = () => {
  const [signIn] = useSignIn()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      const { username, password } = values;

      try {
        await signIn({ username, password })
        navigate('/')
      } catch (e) {
        console.error('Error signing in:', e)
      }
    },
  })

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          formik.touched.username && formik.errors.username && styles.errorInput,
        ]}
        placeholder="Username"
        placeholderTextColor="#d1d5da"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        onBlur={formik.handleBlur('username')}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}

      <TextInput
        style={[
          styles.input,
          formik.touched.password && formik.errors.password && styles.errorInput,
        ]}
        placeholder="Password"
        placeholderTextColor="#d1d5da"
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}

      <Pressable style={styles.button} onPress={formik.handleSubmit}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </View>
  )
}

export default SignIn
