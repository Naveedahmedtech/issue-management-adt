import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const companyApi = createApi({
  reducerPath: REDUCER_PATHS.COMPANY_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Issue", "Stats"],

  endpoints: (builder) => ({
    createCompany: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.COMPANY.ROOT,
        method: "POST",
        body,
      }),
    }),
    updateCompany: builder.mutation({
      query: ({id, name}) => ({
        url: `${API_ROUTES.COMPANY.ROOT}/${id}`,
        method: "PUT",
        body: {name}
      }),
    }),
    getCompanyById: builder.query({
      query: (id) => ({
        url: `${API_ROUTES.COMPANY.ROOT}/${id}`,
        method: "GET",
      }),
    }),
    getAllCompanies: builder.query({
      query: ({page, limit}) => ({
        url: API_ROUTES.COMPANY.ROOT,
        method: "GET",
        params: {page, limit}
      }),
    }),
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `${API_ROUTES.COMPANY.ROOT}/${id}`,
        method: "DELETE",
      }),
    }), 
  }),
});

export const { useCreateCompanyMutation, useUpdateCompanyMutation, useGetCompanyByIdQuery, useGetAllCompaniesQuery, useDeleteCompanyMutation, useLazyGetAllCompaniesQuery } = companyApi;
