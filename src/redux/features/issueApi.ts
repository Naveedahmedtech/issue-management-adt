import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const issueApi = createApi({
  reducerPath: REDUCER_PATHS.ISSUE_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ['Issue', 'Stats'],

  endpoints: (builder) => ({
    updateIssue: builder.mutation({
        query: ({ issueId, formData }) => ({
          url: `${API_ROUTES.ISSUE.ROOT}/${issueId}`,
          method: "PUT",
          body: formData,
        }),
        invalidatesTags: ['Stats']
      }),


    deleteIssue: builder.mutation({
        query: (issueId) => ({
          url: `${API_ROUTES.ISSUE.ROOT}/${issueId}`,
          method: "DELETE",
        }),
      }),

  }),
});

export const {
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = issueApi;
