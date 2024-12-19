import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client';
import { CREATE_REVIEW } from '../graphql/mutations';
import { GET_REPOSITORY } from '../graphql/queries';
import Text from './Text';
import theme from '../theme';

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
    marginBottom: 10,
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
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

const validationSchema = Yup.object().shape({
  ownerName: Yup.string().required('Repository owner name is required'),
  repositoryName: Yup.string().required('Repository name is required'),
  rating: Yup.number()
    .required('Rating is required')
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100'),
  text: Yup.string().optional(),
});

const ReviewForm = () => {
  const navigate = useNavigate();
  const [createReview] = useMutation(CREATE_REVIEW);
  const [errorMessage, setErrorMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      ownerName: '',
      repositoryName: '',
      rating: '',
      text: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { ownerName, repositoryName, rating, text } = values;

      try {
        const { data } = await createReview({
          variables: {
            review: {
              ownerName,
              repositoryName,
              rating: Number(rating),
              text,
            },
          },
          // Explicitly refetch repository data
          refetchQueries: [
            {
              query: GET_REPOSITORY,
              variables: { id: `${ownerName}.${repositoryName}` },
            },
          ],
        });

        const repositoryId = data?.createReview?.repositoryId;

        if (repositoryId) {
          // Navigate to repository view with ensured data
          navigate(`/repository/${repositoryId}`);
        }
      } catch (e) {
        console.error('Error creating review:', e.message);
        setErrorMessage('An error occurred while creating the review. Please try again.');
      }
    },
  });

  return (
    <View style={styles.container}>
      {errorMessage && (
        <Text style={{ color: '#d73a4a', marginBottom: 10 }}>{errorMessage}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          formik.touched.ownerName && formik.errors.ownerName && styles.errorInput,
        ]}
        placeholder="Repository owner name"
        value={formik.values.ownerName}
        onChangeText={formik.handleChange('ownerName')}
        onBlur={formik.handleBlur('ownerName')}
      />
      {formik.touched.ownerName && formik.errors.ownerName && (
        <Text style={styles.errorText}>{formik.errors.ownerName}</Text>
      )}

      <TextInput
        style={[
          styles.input,
          formik.touched.repositoryName && formik.errors.repositoryName && styles.errorInput,
        ]}
        placeholder="Repository name"
        value={formik.values.repositoryName}
        onChangeText={formik.handleChange('repositoryName')}
        onBlur={formik.handleBlur('repositoryName')}
      />
      {formik.touched.repositoryName && formik.errors.repositoryName && (
        <Text style={styles.errorText}>{formik.errors.repositoryName}</Text>
      )}

      <TextInput
        style={[
          styles.input,
          formik.touched.rating && formik.errors.rating && styles.errorInput,
        ]}
        placeholder="Rating between 0 and 100"
        keyboardType="numeric"
        value={formik.values.rating}
        onChangeText={formik.handleChange('rating')}
        onBlur={formik.handleBlur('rating')}
      />
      {formik.touched.rating && formik.errors.rating && (
        <Text style={styles.errorText}>{formik.errors.rating}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Review"
        multiline
        value={formik.values.text}
        onChangeText={formik.handleChange('text')}
        onBlur={formik.handleBlur('text')}
      />

      <Pressable style={styles.button} onPress={formik.handleSubmit}>
        <Text style={styles.buttonText}>Create a review</Text>
      </Pressable>
    </View>
  );
};

export default ReviewForm;
