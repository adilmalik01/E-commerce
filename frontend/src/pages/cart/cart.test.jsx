import '../../../jest.setup'; // Ensure path is correct
import React, { useContext } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Cart from './cart';
import {jest} from "@jest/globals"
import Swal from 'sweetalert2';
import { useMutation } from 'react-query';
// Mock useContext to provide a mock context value
const mockDispatch = jest.fn();
const mockState = {
  cart: [
    {
      _id: '1',
      productName: 'Product 1',
      productPrice: '10.00',
      CandinateAvatar: 'image1.jpg',
    },
    {
      _id: '2',
      productName: 'Product 2',
      productPrice: '20.00',
      CandinateAvatar: 'image2.jpg',
    },
  ],
};
useContext.mockImplementation(() => ({
  state: mockState,
  dispatch: mockDispatch,
}));
const renderWithContext = (ui) => {
  return render(ui);
};
describe('Cart Component', () => {
  beforeEach(() => {
    localStorage.setItem('cart', JSON.stringify(mockState.cart));
    useMutation.mockImplementation(() => ({
      mutateAsync: jest.fn(),
    }));
  });
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
  it('renders cart items and calculates total price correctly', () => {
    renderWithContext(<Cart />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('$30.00')).toBeInTheDocument();
  });
  it('removes an item from the cart', () => {
    renderWithContext(<Cart />);
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    waitFor(() => {
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CART',
        payload: [mockState.cart[1]],
      });
    });
  });
  it('handles order submission successfully', async () => {
    const mockMutateAsync = jest.fn();
    useMutation.mockImplementation(() => ({
      mutateAsync: mockMutateAsync,
    }));
    renderWithContext(<Cart />);
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: '123 Street' },
    });
    fireEvent.click(screen.getByText('Check Out'));
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        cart: mockState.cart,
        userInfo: {
          Name: 'John Doe',
          Email: 'john@example.com',
          Phonenumber: '1234567890',
          Address: '123 Street',
        },
      });
    });
  });
  it('handles order submission error', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue({
      response: {
        data: {
          message: 'Error message',
        },
      },
    });
    useMutation.mockImplementation(() => ({
      mutateAsync: mockMutateAsync,
    }));
    renderWithContext(<Cart />);
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: '123 Street' },
    });
    fireEvent.click(screen.getByText('Check Out'));
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Oops...',
        text: 'Error message',
        footer: '<a href="/login">Go to Login Page ?</a>',
      });
    });
  });
});




