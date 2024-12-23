import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const tasksApi = createApi({
  reducerPath: REDUCER_PATHS.TASKS_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    createTasks: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.TASKS.ROOT,
        method: "POST",
        body,
      }),
    }),
    updateTasks: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_ROUTES.TASKS.ROOT}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    getTasks: builder.query({
      query: ({ page, limit, status, priority, search }) => ({
        url: `${API_ROUTES.TASKS.ROOT}?page=${page}&limit=${limit}&status=${status}&priority=${priority}&search=${search}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.result?.tasks
          ? [
              ...result.result.tasks.map(({ id }: any) => ({
                type: "Task",
                id,
              })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
    getUserTaskCounts: builder.query({
      query: () => ({
        url: `${API_ROUTES.TASKS.USER_TASK_COUNT}`,
        method: "GET",
      }),
    }),
    getAllTasks: builder.query({
      query: ({ page, limit, status, priority, search }) => ({
        url: `${API_ROUTES.TASKS.ALL_USER_TASK_COUNT}?page=${page}&limit=${limit}&status=${status}&priority=${priority}&search=${search}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateTasksMutation,
  useGetTasksQuery,
  useUpdateTasksMutation,
  useGetUserTaskCountsQuery,
  useGetAllTasksQuery
} = tasksApi;
