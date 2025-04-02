"use client";

import { createSlice } from '@reduxjs/toolkit';

type UserState = {
  value: {
    otherCourse: any;
    role: string;
    fullName: String
    id: string;
    email: string;
    assignedCourse: string;
    organizationName?: string;    
    profilePicture: string;
    accessToken?: string;
    privileges?: any;
    mainUser?: any;
  };
};

const initialState = {
  value: [],
} as unknown as UserState

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload
    },

    clearUser: (state, action) => {
      state.value = action.payload
    },
  }
})

export const { setUser } = userSlice.actions;

export const { clearUser } = userSlice.actions
// export const selectUser = (state: { cart: { value: any; }; }) => state.cart.value;
export default userSlice.reducer;