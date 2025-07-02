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
  tagTypes: [
    "Project",
    "RecentProjects",
    "ActivityLogs",
    "Stats",
    "IssueFiles",
    "Issues",
    "ArchivedProjects"
  ],

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
      invalidatesTags: ["Project", "RecentProjects", "Stats"],
    }),

    uploadFilesToProject: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${projectId}/${API_ROUTES.PROJECT.FILES}`,
        method: "POST",
        body: formData,
      }),
    }),

    updateFile: builder.mutation({
      query: ({ fileId, formData }) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${fileId}/${API_ROUTES.PROJECT.UPDATE_FILE}`,
        method: "PUT",
        body: formData,
      }),
    }),

    toggleArchive: builder.mutation({
      query: (projectId) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${projectId}/${API_ROUTES.PROJECT.TOGGLE_ARCHIVED}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Project", "RecentProjects", "Stats", "ArchivedProjects"],
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

    getAllProjectIssues: builder.query({
      query: ({ userId }) => {
        const params = new URLSearchParams();
        if (userId) params.append("userId", userId);
        return `${API_ROUTES.PROJECT.ROOT}/${
          API_ROUTES.PROJECT.ALL_ISSUES
        }?${params.toString()}`;
      },
      providesTags: ["Project"],
    }),

    getProjectStats: builder.query({
      query: () => `${API_ROUTES.PROJECT.STATS}`,
      providesTags: ["Stats"],
    }),

    getRecentProjects: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search,
        status,
        startDate,
        endDate,
        sortOrder,
      }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (sortOrder) params.append("sortOrder", sortOrder);

        return `${API_ROUTES.PROJECT.RECENT}?${params.toString()}`;
      },
      providesTags: ["RecentProjects"],
    }),

    generateProjectReport: builder.query({
      query: (projectId) =>
        `${API_ROUTES.PROJECT.ROOT}/${projectId}/${API_ROUTES.PROJECT.GENERATE_REPORT}`,
      transformResponse: async (response: Response) => {
        const blob = await response.blob();
        return blob;
      },
    }),

    getArchivedProjects: builder.query({
      query: ({ page, limit }) =>
        `${API_ROUTES.PROJECT.ROOT}/${API_ROUTES.PROJECT.ARCHIVED}?page=${page}&limit=${limit}`,
      providesTags: ["ArchivedProjects"],
    }),

    updateIssueLogHistory: builder.mutation({
      query: ({ issueId, body }) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${API_ROUTES.PROJECT.ISSUES}/${issueId}/${API_ROUTES.PROJECT.ISSUE_LOG_HISTORY}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ActivityLogs"],
    }),

    getProjectActiveLogs: builder.query({
      query: ({ projectId, page, limit, type }) => {
        const params = new URLSearchParams();
        if (type) params.append("type", type);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);

        return `${API_ROUTES.PROJECT.ROOT}/${projectId}/${
          API_ROUTES.PROJECT.ACTIVITY_LOGS
        }?${params.toString()}`;
      },
      // providesTags: ["ActivityLogs"],
       providesTags: [{ type: "ActivityLogs", id: "LIST" }],
    }),

    assignProject: builder.mutation({
      query: (body) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${API_ROUTES.PROJECT.ASSIGN_TO_USERS}`,
        method: "POST",
        body,
      })
    }),
    UnassignProject: builder.mutation({
      query: (body) => ({
        url: `${API_ROUTES.PROJECT.ROOT}/${API_ROUTES.PROJECT.UNASSIGN_TO_USERS}`,
        method: "POST",
        body,
      })
    })
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
  useLazyGenerateProjectReportQuery,
  useUpdateFileMutation,
  useGetArchivedProjectsQuery,
  useToggleArchiveMutation,
  useUpdateIssueLogHistoryMutation,
  useGetProjectActiveLogsQuery,
  useGetAllProjectIssuesQuery,
  useAssignProjectMutation,
  useUnassignProjectMutation
} = projectApi;
