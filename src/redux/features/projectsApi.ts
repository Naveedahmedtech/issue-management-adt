import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const projectApi = createApi({
  reducerPath: REDUCER_PATHS.PROJECT_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  // ✅ Enable tagTypes
  tagTypes: ["Project"],

  endpoints: (builder) => ({
    // ✅ Assign tag to getProjectList query
    getProjectList: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `${API_ROUTES.PROJECT.LIST}?page=${page}&limit=${limit}`,
      providesTags: ["Project"],
    }),

    // ✅ Invalidate the tag after creating a project
    createProject: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.PROJECT.ROOT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project"],
    }),

    updateProject: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${projectId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Project"],
    }),


    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    uploadFilesToProject: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${projectId}/${API_ROUTES.PROJECT.FILES}`,
        method: "POST",
        body: formData,
      }),
    }),

    getProjectById: builder.query({
      query: (projectId) => `${API_ROUTES.PROJECT.ROOT}/${projectId}`,
      providesTags: ["Project"],
    }),

    getProjectFiles: builder.query({
      query: (projectId) =>
        `${API_ROUTES.PROJECT.ROOT}/${projectId}/${API_ROUTES.PROJECT.FILES}`,
      providesTags: ["Project"],
    }),

    getProjectIssues: builder.query({
        query: (projectId) =>
          `${API_ROUTES.PROJECT.ROOT}/${projectId}/${API_ROUTES.PROJECT.ISSUES}`,
        providesTags: ["Project"],
      }),

  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectListQuery,
  useGetProjectByIdQuery,
  useGetProjectFilesQuery,
  useUploadFilesToProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectIssuesQuery
} = projectApi;
