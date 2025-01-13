import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const orderApi = createApi({
  reducerPath: REDUCER_PATHS.ORDER_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  // ✅ Enable tagTypes
  tagTypes: ["Order", "RecentOrders"],

  endpoints: (builder) => ({
    // ✅ Assign tag to getOrderList query
    getOrderList: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `${API_ROUTES.ORDER.LIST}?page=${page}&limit=${limit}`,
      providesTags: ["Order"],
    }),

    // ✅ Invalidate the tag after creating a Order
    createOrder: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.ORDER.ROOT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "RecentOrders"],
    }),

    updateOrder: builder.mutation({
      query: ({ orderId, formData }) => ({
        url: `${API_ROUTES.ORDER.ROOT}/${orderId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Order", "RecentOrders"],
    }),

    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${API_ROUTES.ORDER.ROOT}/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order", "RecentOrders"],
    }),

    uploadFilesToOrder: builder.mutation({
      query: ({ orderId, formData }) => ({
        url: `${API_ROUTES.ORDER.ROOT}/${orderId}/${API_ROUTES.ORDER.FILES}`,
        method: "POST",
        body: formData,
      }),
    }),

    getOrderById: builder.query({
      query: (orderId) => `${API_ROUTES.ORDER.ROOT}/${orderId}`,
      providesTags: ["Order"],
    }),

    getOrderFiles: builder.query({
      query: (orderId) =>
        `${API_ROUTES.ORDER.ROOT}/${orderId}/${API_ROUTES.ORDER.FILES}`,
      providesTags: ["Order"],
    }),

    getOrderStats: builder.query({
      query: () => `${API_ROUTES.ORDER.STATS}`,
    }),

    getRecentOrders: builder.query({
      query: () => `${API_ROUTES.ORDER.RECENT}`,
      providesTags: ["RecentOrders"],
    }),
  }),
});

export const {
  useGetOrderListQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUploadFilesToOrderMutation,
  useDeleteOrderMutation,
  useGetOrderStatsQuery,
  useGetRecentOrdersQuery
} = orderApi;
