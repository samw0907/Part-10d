import React from 'react'
import { View, StyleSheet, TextInput, Pressable } from 'react-native'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Text from './Text'
import theme from '../theme'
import useSignIn from '../hooks/useSignIn'
import { useNavigate } from 'react-router-native'

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
  button: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: theme.fontWeights.bold,
  },
});

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

export const SignInContainer = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema,
    onSubmit,
  })

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        onBlur={formik.handleBlur('username')}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
      />
      <Pressable style={styles.button} onPress={formik.handleSubmit}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </View>
  )
}

const SignIn = () => {
  const [signIn] = useSignIn()
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    const { username, password } = values

    try {
      await signIn({ username, password })
      navigate('/');
    } catch (e) {
      console.error('Error signing in:', e)
    }
  }

  return <SignInContainer onSubmit={handleSubmit} />
}

export default SignIn
