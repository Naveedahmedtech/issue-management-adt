import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { authApi } from "./features/authApi";
import { useDispatch } from "react-redux";
import { projectApi } from "./features/projectsApi";
import { issueApi } from "./features/issueApi";
import { orderApi } from "./features/orderApi";
import { companyApi } from "./features/companyApi";
import { commentApi } from "./features/commentApi";
import { checklistApi } from "./features/checklistApi";

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [issueApi.reducerPath]: issueApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [companyApi.reducerPath]: companyApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,
  [checklistApi.reducerPath]: checklistApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(projectApi.middleware)
      .concat(issueApi.middleware)
      .concat(orderApi.middleware)
      .concat(companyApi.middleware)
      .concat(commentApi.middleware)
      .concat(checklistApi.middleware),
});

// Define RootState and AppDispatch types once
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom useAppDispatch hook to use throughout your app
export const useAppDispatch = () => useDispatch<AppDispatch>();
