/* ─────────────────────────────────────────────────────────────
  07: KYC Document Upload
  - NID / Driver → Front → Back → Selfie (3 steps)
  - Passport → Photo page → Selfie (2 steps)
  - Each upload: "Gallery" OR "Take Photo" buttons
  - Large image auto-compressed (≤1200px, ≤500KB)
  - Mobile-first UI
───────────────────────────────────────────────────────────── */
"use client";

import { useSubmitKycDocumentsMutation } from "@/redux/features/auth/authApi";
import {
  doneUploadBack,
  doneUploadFront,
  go,
  removeBack,
  removeFront,
  startUploadBack,
  startUploadFront,
} from "@/redux/features/kyc/kycSlice";
import { RootState } from "@/redux/store";
import {
  Camera,
  CheckCircle,
  CreditCard,
  FileText,
  ImageIcon,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import KycSelfieAutoCapture from "./KycSelfieAutoCapture";

/* ── image compressor ─────────────────────────────────────── */
async function compressImage(
  file: File,
  maxPx = 1200,
  maxKb = 500,
): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width > maxPx || height > maxPx) {
        if (width > height) {
          height = Math.round((height * maxPx) / width);
          width = maxPx;
        } else {
          width = Math.round((width * maxPx) / height);
          height = maxPx;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);

      let quality = 0.88;
      const tryEncode = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            if (blob.size > maxKb * 1024 && quality > 0.4) {
              quality -= 0.1;
              tryEncode();
            } else resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality,
        );
      };
      tryEncode();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

/* ── doc meta ─────────────────────────────────────────────── */
const DOC_ICONS: Record<string, React.ReactNode> = {
  passport: <FileText className="h-4 w-4" />,
  driver: <CreditCard className="h-4 w-4" />,
  id: <CreditCard className="h-4 w-4" />,
  residence: <CreditCard className="h-4 w-4" />,
  oldid: <CreditCard className="h-4 w-4" />,
};
const DOC_LABELS: Record<string, string> = {
  passport: "Passport",
  driver: "Driver's License",
  id: "NID Card",
  residence: "Residence Permit",
  oldid: "Old NID Card",
};

/* ─────────────────────────────────────────────────────────── */
export default function KycUpload() {
  const router = useRouter();
  const d = useDispatch();

  const {
    frontFile,
    backFile,
    selfieFile,
    uploadingFront,
    uploadingBack,
    docType,
    issuingCountry,
  } = useSelector((s: RootState) => s.kyc);

  const [submitKycDocuments, { isLoading }] = useSubmitKycDocumentsMutation();

  const isPassport = docType === "passport";
  const needsBack = !isPassport;

  const frontUrl = frontFile ? URL.createObjectURL(frontFile) : null;
  const backUrl = backFile ? URL.createObjectURL(backFile) : null;

  const pick = async (
    f: File | undefined,
    onStart: () => void,
    onDone: (f: File) => void,
  ) => {
    if (!f) return;
    if (!f.type.startsWith("image/"))
      return toast.error("Please select an image file");
    onStart();
    const compressed = await compressImage(f);
    setTimeout(() => onDone(compressed), 200);
  };

  const step1Done = !!frontFile;
  const step2Done = isPassport ? true : !!backFile;
  const step3Done = !!selfieFile;
  const allDone = step1Done && step2Done && step3Done;
  const totalSteps = needsBack ? 3 : 2;

  const submit = async () => {
    if (!frontFile)
      return toast.error("Please upload the front of your document");
    if (needsBack && !backFile)
      return toast.error("Please upload the back of your document");
    if (!selfieFile) return toast.error("Please take your selfie");

    try {
      const fd = new FormData();
      fd.append("docType", docType!);
      fd.append("issuingCountry", issuingCountry);
      fd.append("frontImage", frontFile);
      fd.append("selfieImage", selfieFile);
      if (backFile) fd.append("backImage", backFile);

      await submitKycDocuments(fd).unwrap();
      toast.success("KYC submitted!");
      d(go("underReview"));
      router.push("/settings/profile");
    } catch (e: any) {
      toast.error(
        e?.data?.message || e?.data?.error || e?.message || "Submission failed",
      );
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* ── doc type + progress ──────────────────────────────── */}
      <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
          {DOC_ICONS[docType ?? "id"]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500">
            Document
          </div>
          <div className="font-semibold text-white text-sm leading-tight">
            {DOC_LABELS[docType ?? "id"]}
          </div>
        </div>
        {/* step progress pills */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepDones = [
              step1Done,
              ...(needsBack ? [step2Done] : []),
              step3Done,
            ];
            return (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${stepDones[i] ? "w-5 bg-emerald-400" : "w-2 bg-neutral-700"}`}
              />
            );
          })}
        </div>
      </div>

      {/* ── STEP 1: Front / Passport page ────────────────────── */}
      <UploadCard
        step={1}
        label={isPassport ? "Photo page" : "Front side"}
        hint={
          isPassport
            ? "Open to the photo / info page"
            : "Front of your document"
        }
        done={step1Done}
        loading={uploadingFront}
        previewUrl={frontUrl}
        onPickFile={(f) =>
          pick(
            f,
            () => d(startUploadFront()),
            (c) => d(doneUploadFront(c)),
          )
        }
        onRemove={() => d(removeFront())}
      />

      {/* ── STEP 2: Back ─────────────────────────────────────── */}
      {needsBack && (
        <UploadCard
          step={2}
          label="Back side"
          hint="Back of your document"
          done={step2Done}
          loading={uploadingBack}
          previewUrl={backUrl}
          onPickFile={(f) =>
            pick(
              f,
              () => d(startUploadBack()),
              (c) => d(doneUploadBack(c)),
            )
          }
          onRemove={() => d(removeBack())}
          locked={!step1Done}
        />
      )}

      {/* ── STEP 3: Selfie ───────────────────────────────────── */}
      <div
        className={`transition-all duration-300 ${!step1Done || (needsBack && !step2Done) ? "pointer-events-none opacity-35" : ""}`}
      >
        <KycSelfieAutoCapture stepNumber={needsBack ? 3 : 2} />
      </div>

      {/* ── Submit ──────────────────────────────────────────── */}
      <button
        disabled={!allDone || isLoading}
        onClick={submit}
        className="w-full rounded-2xl bg-yellow-400 px-4 py-4 text-base font-bold text-neutral-900 transition-all hover:bg-yellow-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
            Submitting…
          </span>
        ) : allDone ? (
          "Submit for Verification ✓"
        ) : (
          `Complete all ${totalSteps} steps to submit`
        )}
      </button>
    </div>
  );
}

/* ── UploadCard component ─────────────────────────────────── */
function UploadCard({
  step,
  label,
  hint,
  done,
  loading,
  previewUrl,
  onPickFile,
  onRemove,
  locked = false,
}: {
  step: number;
  label: string;
  hint: string;
  done: boolean;
  loading: boolean;
  previewUrl: string | null;
  onPickFile: (f?: File) => void;
  onRemove: () => void;
  locked?: boolean;
}) {
  const galleryId = `kyc-gallery-${step}`;
  const cameraId = `kyc-camera-${step}`;

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all duration-200 ${done ? "border-emerald-700/50 bg-neutral-900" : locked ? "border-neutral-800 bg-neutral-900/40 opacity-50" : "border-neutral-700 bg-neutral-900"}`}
    >
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800/60">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-emerald-500 text-white" : "bg-neutral-800 text-neutral-400"}`}
        >
          {done ? <CheckCircle className="h-4 w-4" /> : step}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-sm leading-tight">
            {label}
          </div>
          <div className="text-[11px] text-neutral-500">{hint}</div>
        </div>
        {done && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Redo
          </button>
        )}
      </div>

      {/* body */}
      <div className="p-4">
        {loading ? (
          /* processing */
          <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl bg-neutral-800/50">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
            <span className="text-xs text-neutral-400">Processing image…</span>
          </div>
        ) : previewUrl ? (
          /* preview */
          <div className="relative overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={label}
              className="h-44 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-emerald-600/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              <CheckCircle className="h-3.5 w-3.5" />
              Looks good
            </div>
          </div>
        ) : locked ? (
          /* locked */
          <div className="flex h-28 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-800">
            <span className="text-2xl opacity-20">🔒</span>
            <span className="text-xs text-neutral-600">
              Complete previous step first
            </span>
          </div>
        ) : (
          /* upload options */
          <div className="space-y-2.5">
            {/* instruction */}
            <p className="text-center text-xs text-neutral-500">
              Choose how to add your photo
            </p>

            {/* two buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Gallery / File */}
              <label
                htmlFor={galleryId}
                className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-4 text-neutral-300 transition-all hover:border-yellow-500/40 hover:bg-neutral-700 active:scale-[0.97]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-700">
                  <ImageIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <span className="text-center text-xs font-semibold leading-tight">
                  Choose from
                  <br />
                  Gallery
                </span>
                <input
                  id={galleryId}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickFile(e.target.files?.[0])}
                />
              </label>

              {/* Camera */}
              <label
                htmlFor={cameraId}
                className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-4 text-neutral-300 transition-all hover:border-yellow-500/40 hover:bg-neutral-700 active:scale-[0.97]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-700">
                  <Camera className="h-5 w-5 text-yellow-400" />
                </div>
                <span className="text-center text-xs font-semibold leading-tight">
                  Take Photo
                  <br />
                  Now
                </span>
                <input
                  id={cameraId}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => onPickFile(e.target.files?.[0])}
                />
              </label>
            </div>

            {/* small tip */}
            <p className="text-center text-[10px] text-neutral-600">
              All 4 corners visible · Clear &amp; sharp · No glare
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
