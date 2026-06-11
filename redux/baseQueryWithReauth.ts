// ✅ baseQueryWithReauth.ts – RTK Query Auto-Refresh Access Token Middleware

import baseUrl from "@/config/baseUrl";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import {
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

// const url = `${baseUrl}/api/v1`;

// ⚙️ Normal baseQuery with credentials (cookie auth)
const baseQuery = fetchBaseQuery({
  baseUrl, // ✅ Use baseUrl from config
  credentials: "include", // ✅ send cookies automatically
});

// 🔁 Middleware-enhanced baseQuery with refresh retry logic
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // 🔄 try to get new access token
    console.warn("🔁 Access token expired. Trying refresh...");
    const refreshResult = await baseQuery("/refresh-token", api, extraOptions);

    if (refreshResult.data) {
      console.info("✅ Token refreshed. Retrying original request...");
      // ✅ retry original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // ❌ Refresh failed, log user out (optional)
      console.warn("Refresh token failed, forcing logout");
      // e.g., api.dispatch(logout())
    }
  }

  return result;
};
