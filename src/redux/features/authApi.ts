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
  tagTypes: ['UserList'],
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
        url: API_ROUTES.USER.LOGOUT,
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
    createAzureUser: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.USER.AZURE_CREATE_USER,
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserList"],
    }),
    updateAzureUser: builder.mutation({
      query: ({ body, userId }) => ({
        url: `${API_ROUTES.USER.AZURE_CREATE_USER}/${userId}`,
        method: "PUT",
        body,
      }),
    }),
    deleteAzureUser: builder.mutation({
      query: (userId) => ({
        url: `${API_ROUTES.USER.AZURE_CREATE_USER}/${userId}`,
        method: "DELETE",
      }),
    }),
    azureLogin: builder.query({
      query: () => API_ROUTES.USER.AZURE_LOGIN,
    }),
    getAllUsers: builder.query({
      query: ({ page, limit, roleName }: { page: number; limit: number; roleName?: string }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (roleName) params.append("roleName", roleName);
    
        // Ensure proper template string syntax with backticks
        return `${API_ROUTES.USER.ROOT}?${params.toString()}`;
      },
       providesTags: ['UserList'],
    }),    
    roles: builder.query({
      query: () => API_ROUTES.ROLES.ROOT,
    }),
    permissions: builder.query({
      query: () => API_ROUTES.PERMISSIONS.ROOT,
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
  useAzureLoginQuery,
  useGetAllUsersQuery,
  useRolesQuery,
  usePermissionsQuery,
  useCreateAzureUserMutation,
  useUpdateAzureUserMutation,
  useDeleteAzureUserMutation,
  useLazyGetAllUsersQuery
} = authApi;
