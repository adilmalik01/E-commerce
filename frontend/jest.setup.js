import '@testing-library/jest-dom';
import React from 'react';
import Swal from 'sweetalert2';
import { useMutation } from 'react-query';
jest.mock('react-query', () => ({
    useMutation: jest.fn(),
}));
jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));
// Mocking useContext to return the desired context value
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useContext: jest.fn(),
}));






