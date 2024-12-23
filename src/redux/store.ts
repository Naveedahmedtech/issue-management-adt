import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { authApi } from "./features/authApi";
import { universalApi } from "./features/universalApi";
import { userApi } from "./features/userApi";
import { tasksApi } from "./features/tasksApi";
import { useDispatch } from "react-redux";


const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [universalApi.reducerPath]: universalApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(universalApi.middleware)
      .concat(userApi.middleware)
      .concat(tasksApi.middleware),
});

// Define RootState and AppDispatch types once
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom useAppDispatch hook to use throughout your app
export const useAppDispatch = () => useDispatch<AppDispatch>();
