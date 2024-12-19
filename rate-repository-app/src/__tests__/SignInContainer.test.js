import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInContainer } from '../components/SignIn';

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      const onSubmit = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <SignInContainer onSubmit={onSubmit} />
      );

      // Fill out the form
      fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

      // Press the submit button
      fireEvent.press(getByText('Sign in'));

      // Wait for the form submission
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);

        // Verify only the first argument
        expect(onSubmit.mock.calls[0][0]).toEqual({
          username: 'testuser',
          password: 'password123',
        });
      });
    });
  });
});
