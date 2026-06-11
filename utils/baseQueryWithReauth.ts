/* ── file: utils/baseQueryWithReauth.ts ─────────────────────────────────────── */
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type {
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export function baseQueryWithReauth(
  baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  return async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (
      result.error &&
      (result.error.status === 401 || result.error.status === 403)
    ) {
      const refreshToken = (api.getState() as any)?.auth?.refreshToken as
        | string
        | undefined;
      if (!refreshToken) return result;

      const refresh = await baseQuery(
        { url: "/auth/refresh", method: "POST", body: { refreshToken } },
        api,
        extraOptions
      );
      if (refresh.data && (refresh.data as any).accessToken) {
        api.dispatch({ type: "auth/setCredentials", payload: refresh.data });
        result = await baseQuery(args, api, extraOptions);
      }
    }

    return result;
  };
}
