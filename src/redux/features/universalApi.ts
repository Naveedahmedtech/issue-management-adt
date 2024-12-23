import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { API_ROUTES } from "../../constant/API_ROUTES";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";


export const universalApi = createApi({
  reducerPath: REDUCER_PATHS.UNIVERSAL_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    fetchCsrfToken: builder.query<{ csrfToken: string }, void>({
      query: () => ({
        url: API_ROUTES.CSRF.FETCH_TOKEN,
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchCsrfTokenQuery } = universalApi;
