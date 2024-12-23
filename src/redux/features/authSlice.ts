import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICES_PATH } from "../../constant/REDUCER_PATH";

interface AuthState {
  isLoggedIn: boolean;
  userData: { isLoggedIn: boolean };
}

const initialState: AuthState = {
  isLoggedIn: false,
  userData: { isLoggedIn: false },
};

const authSlice = createSlice({
  name: SLICES_PATH.AUTH_SLICE,
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<any>) {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    logoutSuccess(state) {
      state.isLoggedIn = false;
      state.userData = { isLoggedIn: false };
    },
    // Reducer to update user token or any part of user data
    updateUserData(state, action: PayloadAction<any>) {
      state.userData = action.payload;
    },
  },
});

export const { loginSuccess, logoutSuccess, updateUserData } =
  authSlice.actions;

export default authSlice.reducer;
