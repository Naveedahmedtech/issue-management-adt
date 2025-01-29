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

    toggleArchive: builder.mutation({
      query: (projectId) => ({
        url: `${API_ROUTES.ORDER.ROOT}/${projectId}/${API_ROUTES.ORDER.TOGGLE_ARCHIVED}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Order", "RecentOrders"],
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
      query: ({ page = 1, limit = 10, search, status, startDate, endDate, sortOrder }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (sortOrder) params.append("sortOrder", sortOrder);
    
        return `${API_ROUTES.ORDER.RECENT}?${params.toString()}`; 
      },
      providesTags: ["RecentOrders"],
    }),
    

    
    getArchivedOrders: builder.query({
      query: ({page, limit}) => `${API_ROUTES.ORDER.ROOT}/${API_ROUTES.ORDER.ARCHIVED}?page=${page}&limit=${limit}`,
      providesTags: ["Order", "RecentOrders"],
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
  useGetRecentOrdersQuery,
  useGetArchivedOrdersQuery, 
  useToggleArchiveMutation
} = orderApi;
