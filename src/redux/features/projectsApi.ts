import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const projectApi = createApi({
  reducerPath: REDUCER_PATHS.PROJECT_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/pdf");
      return headers;
    },
  }),
  // ✅ Enable tagTypes
  tagTypes: ["Project", "RecentProjects"],

  endpoints: (builder) => ({
    // ✅ Assign tag to getProjectList query
    getProjectList: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `${API_ROUTES.PROJECT.LIST}?page=${page}&limit=${limit}`,
      providesTags: ["Project", "RecentProjects"],
    }),

    // ✅ Invalidate the tag after creating a project
    createProject: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.PROJECT.ROOT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project", "RecentProjects"],
    }),

    updateProject: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${projectId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Project", "RecentProjects"],
    }),

    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project", "RecentProjects"],
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

    getProjectStats: builder.query({
      query: () => `${API_ROUTES.PROJECT.STATS}`,
    }),

    getRecentProjects: builder.query({
      query: () => `${API_ROUTES.PROJECT.RECENT}`,
      providesTags: ["RecentProjects"],
    }),


    generateProjectReport: builder.query({
      query: (projectId) => `${API_ROUTES.PROJECT.ROOT}/${projectId}/${API_ROUTES.PROJECT.GENERATE_REPORT}`,
      transformResponse: async (response: Response) => {
        const blob = await response.blob();
        return blob;
      },
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
  useGetProjectIssuesQuery,
  useGetProjectStatsQuery,
  useGetRecentProjectsQuery,
  useLazyGenerateProjectReportQuery 
} = projectApi;
