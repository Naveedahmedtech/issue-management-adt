import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const commentApi = createApi({
  reducerPath: REDUCER_PATHS.COMMENTS_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Comments"],

  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.COMMENTS.ROOT,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Comments", id: "LIST" }],
    }),
    getAllComments: builder.query({
      query: ({ page, limit, projectId }) => ({
        url: API_ROUTES.COMMENTS.ROOT,
        method: "GET",
        params: { page, limit, projectId },
      }),
      providesTags: [{ type: "Comments", id: "LIST" }],
    }),
    getLatestComment: builder.query({
      query: ({ projectId }) => ({
        url: `${API_ROUTES.COMMENTS.LATEST}/${projectId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Comments", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetLatestCommentQuery,
  useGetAllCommentsQuery,
} = commentApi;
