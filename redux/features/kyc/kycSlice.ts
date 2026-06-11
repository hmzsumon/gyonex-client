/* ─────────────────────────────────────────────────────────────
  KYC SLICE
  - Single source of truth for the whole KYC flow
  - step: which screen to show
  - profile & document data live here so any screen can read/write
─────────────────────────────────────────────────────────────── */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type KycStep =
  | "entry" // red box CTA চাপলে এখান থেকে শুরু
  | "start" // Document verification intro (২ নং ছবি)
  | "editName" // Edit name (৩ নং ছবি)
  | "agreement" // Data use agreement (৪ নং ছবি)
  | "identity" // Verify identity (country + doc type)
  | "guidelines" // Dos & Don’ts card
  | "upload" // Upload front/back with loader & delete
  | "underReview"; // Final screen

export type DocType = "passport" | "driver" | "id" | "residence" | "oldid";

export interface KycState {
  step: KycStep;
  firstName: string;
  lastName: string;
  residenceCountry: string; // e.g. Bangladesh
  issuingCountry: string; // selected on identity step
  docType: DocType | null;
  agreeDataUse: boolean;
  // uploads
  frontFile?: File | null;
  backFile?: File | null;
  uploadingFront: boolean;
  uploadingBack: boolean;

  selfieFile?: File | null;
  uploadingSelfie: boolean;
}

const initialState: KycState = {
  step: "entry",
  firstName: "",
  lastName: "",
  residenceCountry: "Bangladesh",
  issuingCountry: "Bangladesh",
  docType: "id",
  agreeDataUse: false,
  uploadingFront: false,
  uploadingBack: false,

  selfieFile: null as File | null,
  uploadingSelfie: false,
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    go: (s, a: PayloadAction<KycStep>) => {
      s.step = a.payload;
    },
    setName: (s, a: PayloadAction<{ first: string; last: string }>) => {
      s.firstName = a.payload.first;
      s.lastName = a.payload.last;
    },
    setAgree: (s, a: PayloadAction<boolean>) => {
      s.agreeDataUse = a.payload;
    },
    setIssuingCountry: (s, a: PayloadAction<string>) => {
      s.issuingCountry = a.payload;
    },
    setDocType: (s, a: PayloadAction<DocType>) => {
      s.docType = a.payload;
    },
    // uploads
    startUploadFront: (s) => {
      s.uploadingFront = true;
    },
    doneUploadFront: (s, a: PayloadAction<File | null>) => {
      s.uploadingFront = false;
      s.frontFile = a.payload;
    },
    removeFront: (s) => {
      s.frontFile = null;
    },
    startUploadBack: (s) => {
      s.uploadingBack = true;
    },
    doneUploadBack: (s, a: PayloadAction<File | null>) => {
      s.uploadingBack = false;
      s.backFile = a.payload;
    },

    startUploadSelfie(state) {
      state.uploadingSelfie = true;
    },

    doneUploadSelfie(state, action) {
      state.uploadingSelfie = false;
      state.selfieFile = action.payload;
    },

    removeSelfie(state) {
      state.selfieFile = null;
      state.uploadingSelfie = false;
    },
    removeBack: (s) => {
      s.backFile = null;
    },
    resetKyc: () => initialState,
  },
});

export const {
  go,
  setName,
  setAgree,
  setIssuingCountry,
  setDocType,
  startUploadFront,
  doneUploadFront,
  removeFront,
  startUploadBack,
  doneUploadBack,
  removeBack,
  resetKyc,

  startUploadSelfie,
  doneUploadSelfie,
  removeSelfie,
} = kycSlice.actions;

export default kycSlice.reducer;
