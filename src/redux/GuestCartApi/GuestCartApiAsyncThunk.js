import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
export const guestCartData = createAsyncThunk(
  'guestCartData',
  async ({endpoint, data}) => {
    try {
      const response = await axios.get(endpoint, {headers: data});
      return response.data; // Return the response data explicitly
    } catch (error) {
      throw error; // Rethrow the error to be caught by the rejected state in the slice
    }
  },
);
