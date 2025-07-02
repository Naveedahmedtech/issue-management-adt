import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";
import { projectApi } from "./projectsApi";

export const checklistApi = createApi({
  reducerPath: REDUCER_PATHS.CHECKLIST_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Checklist", "ActivityLogs"],

  endpoints: (builder) => ({
    createChecklist: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.CHECKLIST.ROOT,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Checklist", id: "LIST" },
        { type: "ActivityLogs", id: "ActivityLogs" },
      ],
    }),
    appendItemsToProjectChecklist: builder.mutation({
      query: ({ templateId, projectId, body }) => ({
        url: `${API_ROUTES.CHECKLIST.ROOT}/${templateId}/${projectId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Checklist", id: "LIST" },
        { type: "ActivityLogs", id: "ActivityLogs" },
      ],
    }),
    answerToChecklistItems: builder.mutation({
      query: ({ projectId, checklistId, itemId, body }) => ({
        url: `${API_ROUTES.CHECKLIST.ROOT}/${projectId}/projects/${checklistId}/${itemId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Checklist", id: "LIST" },
        { type: "ActivityLogs", id: "ActivityLogs" },
      ],
      // still invalidate your own tags:
      // invalidatesTags: [{ type: "Checklist", id: "LIST" }],
      // **and** on success dispatch into projectApi:
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            projectApi.util.invalidateTags([
              // match what getProjectActiveLogs.providesTags()
              { type: "ActivityLogs" as const, id: "LIST" },
            ])
          );
        } catch {
          // swallow
        }
      },
    }),
    uploadFileToChecklistItems: builder.mutation({
      query: ({ projectId, itemId, body }) => ({
        url: `${API_ROUTES.CHECKLIST.ROOT}/${projectId}/upload/${itemId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Checklist", id: "LIST" },
        { type: "ActivityLogs", id: "ActivityLogs" },
      ],
      // still invalidate your own tags:
      // invalidatesTags: [{ type: "Checklist", id: "LIST" }],
      // **and** on success dispatch into projectApi:
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            projectApi.util.invalidateTags([
              // match what getProjectActiveLogs.providesTags()
              { type: "ActivityLogs" as const, id: "LIST" },
            ])
          );
        } catch {
          // swallow
        }
      },
    }),
    deleteChecklistItems: builder.mutation({
      query: ({ projectId, checklistId, itemId, body }) => ({
        url: `${API_ROUTES.CHECKLIST.ROOT}/${projectId}/projects/${checklistId}/item/${itemId}`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: [
        { type: "Checklist", id: "LIST" },
        { type: "ActivityLogs", id: "ActivityLogs" },
      ],
    }),
    getAllTemplates: builder.query({
      query: ({ page, limit, projectId }) => ({
        url: API_ROUTES.CHECKLIST.ROOT,
        method: "GET",
        params: { page, limit, projectId },
      }),
      providesTags: [{ type: "Checklist", id: "LIST" }],
    }),
    getProjectAllTemplates: builder.query({
      query: ({ projectId }) => ({
        url: `${API_ROUTES.CHECKLIST.ROOT}/${projectId}/projects`,
        method: "GET",
      }),
      providesTags: [{ type: "Checklist", id: "LIST" }],
    }),
    getChecklistLogsByProject: builder.query({
      query: ({ projectId }) => ({
        url: `${API_ROUTES.CHECKLIST.ROOT}/${projectId}/logs`,
        method: "GET",
      }),
      providesTags: [{ type: "Checklist", id: "LIST" }],
    }),
    getProjectChecklists: builder.query({
      query: ({ projectId, checklistId }) => ({
        url: `${API_ROUTES.CHECKLIST.ROOT}/${projectId}/projects/${checklistId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Checklist", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateChecklistMutation,
  useAppendItemsToProjectChecklistMutation,
  useAnswerToChecklistItemsMutation,
  useGetAllTemplatesQuery,
  useGetProjectChecklistsQuery,
  useGetProjectAllTemplatesQuery,
  useUploadFileToChecklistItemsMutation,
  useDeleteChecklistItemsMutation,
  useGetChecklistLogsByProjectQuery,
} = checklistApi;
