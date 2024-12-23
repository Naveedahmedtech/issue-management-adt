import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const authApi = createApi({
  reducerPath: REDUCER_PATHS.AUTH_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.REGISTER,
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.LOGIN,
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_ROUTES.AUTH.LOGOUT,
        method: "POST",
      }),
    }),
    sendCodeOnEmail: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.SEND_CODE,
        method: "POST",
        body,
      }),
    }),
    verifyCode: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.VERIFY_CODE,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.RESET_PASSWORD,
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.CHANGE_PASSWORD,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useSendCodeOnEmailMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
