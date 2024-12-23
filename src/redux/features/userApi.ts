import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const userApi = createApi({
  reducerPath: REDUCER_PATHS.USER_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: API_ROUTES.USER.GET_USER,
        method: "GET",
      }),
    }),
    getDashboardCount: builder.query({
      query: () => ({
        url: API_ROUTES.USER.GET_DASHBOARD_COUNT,
        method: "GET",
      }),
    }),
    getAllUser: builder.query({
      query: ({ page, limit, role }) => ({
        url: `${API_ROUTES.USER.ROOT}?page=${page}&limit=${limit}&role=${role}`,
        method: "GET",
      }),
    }),
    assignManager: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.USER.ASSIGN_MANAGER,
        method: "POST",
        body,
      }),
    }),
    getManagerTasks: builder.query({
      query: ({ managerId, page, limit }) => ({
        url: `${API_ROUTES.USER.GET_ASSIGN_TASK}/${managerId}/tasks?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetAllUserQuery,
  useAssignManagerMutation,
  useGetManagerTasksQuery,
  useGetDashboardCountQuery
} = userApi;
