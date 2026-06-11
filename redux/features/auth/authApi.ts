import { apiSlice } from "../api/apiSlice";
import { loadUser, logoutUser, setUser } from "./authSlice";
export interface IUser {
  user: any;
  token: string;
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get users from api with typescript
    getUsers: builder.query<any, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // get verify code for register
    getVerifyCodeForRegister: builder.mutation<any, any>({
      query: (body) => ({
        url: "/get-verify-code-for-register",
        method: "POST",
        body,
      }),
    }),

    // verify code for registration
    verifyCodeForRegister: builder.mutation<any, any>({
      query: (body) => ({
        url: "/verify-code-for-register",
        method: "POST",
        body,
      }),
    }),

    // register user
    registerUser: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    // verify email
    // ── authApi: verify email mutation ────────────────────────────
    verifyEmail: builder.mutation<
      { success: boolean; message: string },
      { email: string; code: string }
    >({
      query: (body) => ({
        url: "/verify-email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // login user
    loginUser: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(setUser(result.data));
        } catch (error) {
          error as any;
        }
      },
    }),

    /* ────────── Load User ────────── */
    loadUser: builder.query<any, void>({
      query: () => ({ url: "/load-user", method: "GET" }),
      providesTags: (result) => [{ type: "User" as const, id: "ME" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(loadUser(result.data));
        } catch (error) {
          // diclear error type
          error as any;
        }
      },
    }),

    /* ────────── logout user ────────── */
    logoutUser: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(logoutUser());
        } catch (error) {
          console.log(error);
        }
      },
    }),

    // resend verification email
    resendVerificationEmail: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/resend-verification-email",
        method: "POST",
        body,
      }),
    }),

    // check if user is exist by email
    checkUserByEmail: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/check-user-by-email",
        method: "POST",
        body,
      }),
    }),

    // verify code for change email
    verifyCodeForChangeEmail: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/verify-code-for-change-email",
        method: "POST",
        body,
      }),
    }),

    // find user by email or username
    findUserByEmailOrUsername: builder.mutation<any, any>({
      query: (emailOrUserName) => ({
        url: `/find-user-by-email-username?emailOrUsername=${emailOrUserName}`,
        method: "PUT",
      }),
    }),

    // check email exist or not post request
    checkEmailExistOrNot: builder.mutation<any, any>({
      query: (body) => ({
        url: `/check-email-exist`,
        method: "POST",
        body,
      }),
    }),

    // my address
    myAddress: builder.query<any, any>({
      query: () => ({
        url: `/my-address`,
        method: "GET",
      }),
    }),

    // security verify
    securityVerify: builder.mutation<any, any>({
      query: (body) => ({
        url: `/security-verify`,
        method: "POST",
        body,
      }),
    }),

    // reset password
    resetPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: `/reset-password`,
        method: "POST",
        body,
      }),
    }),

    // my wallet
    myWallet: builder.query<any, any>({
      query: () => ({
        url: `/my-wallet`,
        method: "GET",
      }),
    }),

    /* ────────── Get dashboard data ────────── */
    getDashboard: builder.query<any, any>({
      query: () => ({
        url: `/dashboard-data`,
        method: "GET",
      }),
    }),

    // security verify
    securityVerify2: builder.mutation<any, any>({
      query: (body) => ({
        url: `/security-verification`,
        method: "POST",
        body,
      }),
    }),

    // update mobile number
    updateMobileNumber: builder.mutation<any, any>({
      query: (body) => ({
        url: `/update-mobile`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // update address
    updateAddress: builder.mutation<any, any>({
      query: (body) => ({
        url: `/update-address`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // check old password
    checkOldPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: `/check-old-password`,
        method: "POST",
        body,
      }),
    }),

    // check old pin
    checkOldPin: builder.mutation<any, any>({
      query: (body) => ({
        url: `/check-old-pass-code`,
        method: "POST",
        body,
      }),
    }),

    // update pin
    updatePin: builder.mutation<any, any>({
      query: (body) => ({
        url: `/update-pass-code`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // send new pin email
    sendNewPinEmail: builder.mutation<any, any>({
      query: (body) => ({
        url: `/send-pass-code`,
        method: "POST",
        body,
      }),
    }),

    // check user by custom id
    checkUserByCustomId: builder.query<any, any>({
      query: (id) => ({
        url: `/check-user-by-customer-id/${id}`,
        method: "GET",
      }),
    }),
    /* ────────── add user payment method ────────── */
    addUserPaymentMethod: builder.mutation<any, any>({
      query: (body) => ({
        url: `/add-user-payment-method`,
        method: "POST",
        body,
      }),

      invalidatesTags: ["User"],
    }),

    /* ────────── get user payment methods ────────── */
    getUserPaymentMethods: builder.query<any, any>({
      query: () => ({
        url: `/get-user-payment-methods`,
        method: "GET",
      }),
    }),

    // verify otp for forgot password
    verifyOtpForForgotPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/get-verify-otp-for-forgot-password",
        method: "POST",
        body,
      }),
    }),

    /* ────────── Set/Change security pin mutation ────────── */
    setSecurityPin: builder.mutation<any, { newPin: string; oldPin?: string }>({
      query: (body) => ({
        url: "/security-pin",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ── email change ───────────────────────────────────────── */
    changeEmail: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/account/email",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // ── phone change ─────────────────────────────────────────
    changePhone: builder.mutation<{ message: string }, { phone: string }>({
      query: (body) => ({
        url: "/account/phone",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── password change mutation ────────── */
    changePassword: builder.mutation<
      any,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/change-password",
        method: "PUT",
        body,
      }),
    }),

    /* ────────── send reset code by email (uses resendVerificationEmail controller) ────────── */
    sendResetCode: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/resend-verification-email",
        method: "POST",
        body,
      }),
    }),

    /* ────────── verify code (uses verifyOtpForForgotPassword controller) ────────── */

    verifyResetCode: builder.mutation<
      { message: string },
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "/verify-otp-for-password",
        method: "POST",
        body,
      }),
    }),

    /* ────────── reset password (uses resetForgotPassword controller) ────────── */

    resetForgotPassword: builder.mutation<
      { message: string },
      { email: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/reset-forgot-password",
        method: "POST",
        body,
      }),
    }),

    /* ────────── get my team ────────── */
    // get my team
    getMyTeam: builder.query<any, any>({
      query: () => ({
        url: `/get-my-team-summary`,
        method: "GET",
      }),
    }),

    /* ────────── find user by email OR id ────────── */
    findUserByQuery: builder.mutation<
      any,
      { query: string; via?: "email" | "customerId" }
    >({
      query: (body) => ({
        url: `/user-lookup`,
        method: "POST",
        body, // { query, via? }
      }),
    }),

    /* ────────── Send otp to user email ────────── */
    sendOtpToUserEmail: builder.mutation<any, any>({
      query: (body) => ({
        url: "/send-otp-to-email",
        method: "POST",
        body,
      }),
    }),

    /* ────────── Verify otp────────── */
    verifyOtp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/verify-otp",
        method: "POST",
        body,
      }),
    }),

    getTeamUsersByLevel: builder.query<{ users: any[] }, { level: number }>({
      query: ({ level }) => `/team/levels/${level}/users`,
    }),

    /* ────────── get my kyc ────────── */
    getMyKyc: builder.query<any, void>({
      query: () => ({
        url: "/kyc/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    /* ────────── save kyc profile ────────── */
    saveKycProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/kyc/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── submit kyc documents ────────── */
    submitKycDocuments: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/kyc/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── End────────── */
  }),
});

export const {
  useGetVerifyCodeForRegisterMutation,
  useVerifyCodeForRegisterMutation,
  useGetUsersQuery,
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useLoginUserMutation,
  useLogoutUserMutation,

  useResendVerificationEmailMutation,

  useCheckUserByEmailMutation,
  useLoadUserQuery,
  useChangeEmailMutation,
  useVerifyCodeForChangeEmailMutation,

  useFindUserByEmailOrUsernameMutation,

  useCheckEmailExistOrNotMutation,
  useMyAddressQuery,
  useSecurityVerifyMutation,
  useResetPasswordMutation,
  useMyWalletQuery,

  useGetDashboardQuery,
  useSecurityVerify2Mutation,

  useUpdateMobileNumberMutation,
  useUpdateAddressMutation,
  useCheckOldPasswordMutation,
  useCheckOldPinMutation,
  useUpdatePinMutation,

  useSendNewPinEmailMutation,

  useLazyCheckUserByCustomIdQuery,
  useAddUserPaymentMethodMutation,
  useGetUserPaymentMethodsQuery,

  useVerifyOtpForForgotPasswordMutation,

  useSetSecurityPinMutation,
  useChangePhoneMutation,
  useChangePasswordMutation,

  useSendResetCodeMutation,
  useVerifyResetCodeMutation,
  useResetForgotPasswordMutation,

  useGetMyTeamQuery,

  useFindUserByQueryMutation,

  useSendOtpToUserEmailMutation,
  useVerifyOtpMutation,

  useGetTeamUsersByLevelQuery,

  useGetMyKycQuery,
  useSaveKycProfileMutation,
  useSubmitKycDocumentsMutation,
} = authApi;
