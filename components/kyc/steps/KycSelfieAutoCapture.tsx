/* ─────────────────────────────────────────────────────────────
  KycSelfieAutoCapture
  - face-api.js → works on ALL browsers (iOS Safari, Firefox, Chrome)
  - Oval guide frame, animated border color (yellow→green on align)
  - Auto capture when face is stable in frame for 3 ticks
  - Auto compress selfie before saving (camera + upload both paths)
  - Manual capture button as fallback / override
  - Upload from device: fallback when camera cannot be opened
  - Large uploaded files are compressed automatically before saving
─────────────────────────────────────────────────────────────── */
"use client";

import {
  Camera,
  CheckCircle,
  RefreshCw,
  Trash2,
  Upload,
  UserCircle2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import Webcam from "react-webcam";

/* ── Constants ────────────────────────────────────────────── */

/** Max file size before compression is applied to uploaded images.
 *  Camera screenshots are always compressed via compressSelfie(). */
const UPLOAD_MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB

/** Max pixel dimension when compressing an oversized upload file. */
const UPLOAD_MAX_DIM = 1280;

/** JPEG quality for compressing oversized upload files. */
const UPLOAD_COMPRESS_QUALITY = 0.82;

/* ── compress selfie (camera path) ───────────────────────── */

/**
 * compressSelfie
 * Resizes the base64 screenshot from the webcam to maxPx and
 * exports as JPEG. Used for every camera capture to keep files small.
 */
async function compressSelfie(dataUrl: string, maxPx = 800): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      /* Scale down while preserving aspect ratio */
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

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            /* Fallback: convert dataUrl bytes directly if blob fails */
            const [, b64] = dataUrl.split(",");
            const bytes = atob(b64);
            const arr = new Uint8Array(bytes.length);
            for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
            resolve(
              new File([arr], `selfie-${Date.now()}.jpg`, {
                type: "image/jpeg",
              }),
            );
            return;
          }
          resolve(
            new File([blob], `selfie-${Date.now()}.jpg`, {
              type: "image/jpeg",
            }),
          );
        },
        "image/jpeg",
        0.82,
      );
    };
    img.src = dataUrl;
  });
}

/* ── compress uploaded file (upload path) ─────────────────── */

/**
 * compressUploadFile
 * Only called when an uploaded file exceeds UPLOAD_MAX_SIZE_BYTES.
 * Draws the image on a canvas scaled to UPLOAD_MAX_DIM and exports
 * as JPEG at UPLOAD_COMPRESS_QUALITY.
 */
const compressUploadFile = (file: File): Promise<File> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      /* Calculate dimensions keeping aspect ratio */
      let { naturalWidth: w, naturalHeight: h } = img;
      if (w > UPLOAD_MAX_DIM || h > UPLOAD_MAX_DIM) {
        if (w >= h) {
          h = Math.round((h / w) * UPLOAD_MAX_DIM);
          w = UPLOAD_MAX_DIM;
        } else {
          w = Math.round((w / h) * UPLOAD_MAX_DIM);
          h = UPLOAD_MAX_DIM;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Compression blob failed"));
            return;
          }
          /* Normalise extension to .jpg */
          const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
          resolve(new File([blob], name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        UPLOAD_COMPRESS_QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load failed"));
    };

    img.src = objectUrl;
  });

/* ─────────────────────────────────────────────────────────── */
export default function KycSelfieAutoCapture({
  stepNumber = 3,
  selfieFile,
  onSelfieChange,
}: {
  stepNumber?: number;
  selfieFile: File | null;
  onSelfieChange: (file: File | null) => void;
}) {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stableRef = useRef(0);
  const capturingRef = useRef(false);

  /* Hidden file input ref for the upload-from-device flow */
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  /* ── Camera / face-detection state ──────────────────────── */
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false); // true when camera access is denied/unavailable
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [detecting, setDetecting] = useState(true);
  const [faceAligned, setFaceAligned] = useState(false);
  const [stableCount, setStableCount] = useState(0);
  const [statusMsg, setStatusMsg] = useState("Initializing camera...");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  /* Upload processing indicator (shown while compressing large files) */
  const [isCompressing, setIsCompressing] = useState(false);

  /* ── local upload state ─────────────────────────────────────
     File object Redux-এ না রেখে parent local state-এ রাখা হয়েছে।
     এতে Redux non-serializable warning বন্ধ হবে।
  ──────────────────────────────────────────────────────────── */
  const [uploadingSelfie, setUploadingSelfie] = useState(false);

  /* ── Sync preview URL with Redux selfie file ─────────────── */
  useEffect(() => {
    if (!selfieFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selfieFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selfieFile]);

  /* ── Load face-api.js models lazily from CDN ─────────────── */
  useEffect(() => {
    let cancelled = false;

    const loadModels = async () => {
      try {
        /* Dynamic import keeps the initial bundle small */
        const faceapi = await import("@vladmandic/face-api");

        /* Tiny model weights served from jsdelivr — no local hosting needed */
        const MODEL_URL =
          "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        ]);

        if (!cancelled) {
          setModelLoaded(true);
          setStatusMsg("Position your face in the oval");
        }
      } catch (err) {
        console.warn("face-api load failed:", err);
        if (!cancelled) {
          setModelError(true);
          setStatusMsg("Position your face and tap capture");
        }
      }
    };

    loadModels();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Camera constraints — front-facing, square */
  const videoConstraints = useMemo(
    () => ({ facingMode: "user", width: 640, height: 640 }),
    [],
  );

  /* ── Helper: check whether detected face sits inside the oval ── */
  const isFaceInOval = (
    box: { x: number; y: number; width: number; height: number },
    vw: number,
    vh: number,
  ): boolean => {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const dx = Math.abs(cx - vw / 2);
    const dy = Math.abs(cy - vh / 2);
    const minW = vw * 0.18;
    const maxW = vw * 0.62;
    return (
      dx < vw * 0.16 && dy < vh * 0.2 && box.width >= minW && box.width <= maxW
    );
  };

  /* ── Camera capture: screenshot → compress → Redux ──────── */
  const captureSelfie = async () => {
    if (capturingRef.current) return;
    capturingRef.current = true;
    setCapturing(true);
    setStatusMsg("Capturing...");

    /* Stop the detection loop while capturing */
    if (timerRef.current) clearInterval(timerRef.current);

    const shot = webcamRef.current?.getScreenshot();
    if (!shot) {
      toast.error("Could not capture — try again");
      capturingRef.current = false;
      setCapturing(false);
      return;
    }

    setUploadingSelfie(true);

    /* compressSelfie handles resize + JPEG export for camera screenshots */
    const file = await compressSelfie(shot);

    setTimeout(() => {
      onSelfieChange(file);
      setUploadingSelfie(false);
      setCapturing(false);
      setDetecting(false);
      toast.success("Selfie captured ✓");
    }, 250);
  };

  /* ── Auto face-detection polling loop ───────────────────── */
  useEffect(() => {
    if (
      !cameraReady ||
      !modelLoaded ||
      selfieFile ||
      !detecting ||
      modelError
    ) {
      if (cameraReady && !modelError && !modelLoaded)
        setStatusMsg("Loading face model...");
      if (cameraReady && (modelLoaded || modelError) && !selfieFile)
        setStatusMsg(
          modelError
            ? "Position your face and tap capture"
            : "Position your face in the oval",
        );
      return;
    }

    const run = async () => {
      try {
        const faceapi = await import("@vladmandic/face-api");
        const video = webcamRef.current?.video as HTMLVideoElement | undefined;
        if (!video || video.readyState < 2) return;

        const detection = await faceapi.detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.4,
          }),
        );

        if (!detection) {
          stableRef.current = 0;
          setStableCount(0);
          setFaceAligned(false);
          setStatusMsg("No face detected — look at camera");
          return;
        }

        const { x, y, width, height } = detection.box;
        const ok = isFaceInOval(
          { x, y, width, height },
          video.videoWidth,
          video.videoHeight,
        );

        if (!ok) {
          stableRef.current = 0;
          setStableCount(0);
          setFaceAligned(false);
          setStatusMsg("Move face to center of oval");
          return;
        }

        stableRef.current += 1;
        const n = stableRef.current;
        setStableCount(n);
        setFaceAligned(true);
        setStatusMsg(n >= 3 ? "Capturing..." : `Hold still… ${n}/3`);

        if (n >= 3 && !capturingRef.current) {
          captureSelfie();
        }
      } catch {
        /* Silent — model may still be initializing on first tick */
      }
    };

    timerRef.current = setInterval(run, 700);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cameraReady, modelLoaded, selfieFile, detecting, modelError]);

  /* ── Retake: reset all state and return to camera view ───── */
  const retake = () => {
    onSelfieChange(null);
    stableRef.current = 0;
    capturingRef.current = false;
    setStableCount(0);
    setFaceAligned(false);
    setDetecting(true);
    setCapturing(false);
    setCameraError(false); // allow camera to retry after retake
    setStatusMsg("Position your face in the oval");
  };

  /* ── Upload flow: open the hidden file picker ────────────── */
  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  /**
   * handleFileChange
   * Fires when the user selects a file via the hidden <input>.
   * Validates MIME type, compresses if the file exceeds the size
   * limit, then dispatches to Redux.
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    /* Reset input value so re-selecting the same file still fires onChange */
    if (uploadInputRef.current) uploadInputRef.current.value = "";

    if (!file) return;

    /* Only accept image MIME types */
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, HEIC, etc.)");
      return;
    }

    setUploadingSelfie(true);

    let finalFile = file;

    /* Compress only when the file is too large */
    if (file.size > UPLOAD_MAX_SIZE_BYTES) {
      try {
        setIsCompressing(true);
        finalFile = await compressUploadFile(file);
        toast.success(
          `Image compressed: ${(file.size / 1024).toFixed(0)} KB → ${(finalFile.size / 1024).toFixed(0)} KB`,
        );
      } catch {
        /* Graceful fallback: save the original if compression fails */
        toast.error("Compression failed — using original file");
        finalFile = file;
      } finally {
        setIsCompressing(false);
      }
    }

    onSelfieChange(finalFile);
    setUploadingSelfie(false);
    toast.success("Photo uploaded successfully");
  };

  /* ── Camera error handler ─────────────────────────────────── */
  const handleCameraError = () => {
    setCameraError(true);
    setCameraReady(false);
  };

  /* Derived style values for the oval guide frame */
  const ovalBorderColor = faceAligned ? "#22c55e" : "#facc15";
  const ovalShadow = faceAligned
    ? "0 0 0 4px rgba(34,197,94,0.2), 0 0 24px rgba(34,197,94,0.15)"
    : "0 0 0 4px rgba(250,204,21,0.12)";

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="rounded-2xl border border-neutral-700 bg-neutral-900 overflow-hidden">
      {/* ── Section header ─────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-neutral-800">
        {/* Step indicator — turns green with checkmark once selfie is done */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${selfieFile ? "bg-emerald-500 text-white" : "bg-neutral-800 text-neutral-400"}`}
        >
          {selfieFile ? <CheckCircle className="h-4 w-4" /> : stepNumber}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm">
            Selfie verification
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            {selfieFile
              ? "Captured successfully"
              : cameraError
                ? "Upload mode — camera unavailable"
                : modelError
                  ? "Manual capture mode"
                  : "Auto face detection"}
          </div>
        </div>

        {/* AI model loading / ready badge — only while camera is active */}
        {!cameraError && !modelLoaded && !modelError && (
          <div className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2.5 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />
            <span className="text-[10px] text-yellow-400">Loading AI</span>
          </div>
        )}
        {!cameraError && modelLoaded && !selfieFile && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-400">AI Ready</span>
          </div>
        )}
      </div>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="p-4">
        {/* Hidden file input — no capture= attr so gallery opens on mobile */}
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Upload selfie from device"
        />

        {!previewUrl ? (
          /* ── No selfie yet: camera view + upload fallback ── */
          <div className="space-y-3">
            {/* Camera view — hidden when access is denied */}
            {!cameraError && (
              <div
                className="relative overflow-hidden rounded-2xl bg-black"
                style={{ aspectRatio: "1 / 1" }}
              >
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  mirrored
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  onUserMedia={() => {
                    setCameraReady(true);
                    setStatusMsg(
                      modelLoaded
                        ? "Position your face in the oval"
                        : "Loading face model...",
                    );
                  }}
                  onUserMediaError={handleCameraError}
                  className="h-full w-full object-cover"
                />

                {/* Dark radial vignette to focus attention on the oval */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 54% 62% at 50% 47%, transparent 55%, rgba(0,0,0,0.72) 100%)",
                  }}
                />

                {/* Oval face guide — border color reflects alignment state */}
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  style={{ paddingTop: "4%" }}
                >
                  <div
                    style={{
                      width: "54%",
                      aspectRatio: "3 / 4",
                      borderRadius: "50%",
                      border: `2.5px solid ${ovalBorderColor}`,
                      boxShadow: ovalShadow,
                      transition:
                        "border-color 0.3s ease, box-shadow 0.3s ease",
                    }}
                  />
                </div>

                {/* Pulse ring when capture is about to trigger */}
                {faceAligned && stableCount >= 3 && (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-ping opacity-30" />
                )}

                {/* Placeholder shown while camera stream loads */}
                {!cameraReady && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950">
                    <UserCircle2 className="h-14 w-14 text-neutral-700" />
                    <span className="text-sm text-neutral-500">
                      Starting camera…
                    </span>
                  </div>
                )}

                {/* Status pill overlaid at the top of the camera frame */}
                {cameraReady && (
                  <div
                    className={`absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors ${faceAligned ? "bg-emerald-600/80 text-white" : "bg-black/60 text-neutral-200"}`}
                  >
                    {statusMsg}
                  </div>
                )}

                {/* Progress bar at the bottom — fills as stable frames accumulate */}
                {faceAligned && stableCount > 0 && stableCount < 3 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${(stableCount / 3) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Error banner when camera permission was denied or unavailable */}
            {cameraError && (
              <div className="rounded-xl border border-red-800/40 bg-red-500/10 p-4 text-sm text-red-300">
                Camera is unavailable or access was denied. Please upload a
                photo from your device instead.
              </div>
            )}

            {/* Manual capture button — only shown when camera is working */}
            {!cameraError && (
              <button
                type="button"
                onClick={captureSelfie}
                disabled={!cameraReady || capturing || isCompressing}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3.5 font-bold text-neutral-900 transition-all hover:bg-yellow-300 active:scale-[0.97] disabled:opacity-50"
              >
                {capturing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
                    Capturing…
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5" />
                    Capture Selfie
                  </>
                )}
              </button>
            )}

            {/* Divider between camera capture and upload sections */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-800" />
              <span className="text-xs text-neutral-500">or</span>
              <div className="h-px flex-1 bg-neutral-800" />
            </div>

            {/* Upload from device — always visible as a fallback */}
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploadingSelfie || isCompressing || capturing}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3.5 font-bold text-neutral-200 transition-all hover:bg-neutral-700 active:scale-[0.97] disabled:opacity-50"
            >
              <Upload className="h-5 w-5" />
              {isCompressing ? "Compressing image..." : "Upload from device"}
            </button>

            {/* Helper text below upload button */}
            <p className="text-center text-xs text-neutral-500">
              JPG, PNG, HEIC accepted &mdash; large files are compressed
              automatically
            </p>
          </div>
        ) : (
          /* ── Selfie captured / uploaded: show preview eee ─────── */
          <div className="space-y-3">
            {/* Preview image */}
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{ aspectRatio: "1 / 1" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selfie"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Success badge overlaid at the bottom of the preview */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur whitespace-nowrap">
                <CheckCircle className="h-3.5 w-3.5" />
                Selfie captured
              </div>
            </div>

            {/* Retake / Remove action buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Retake: resets state and returns to camera + upload screen */}
              <button
                type="button"
                onClick={retake}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm font-medium text-neutral-200 hover:bg-neutral-700 active:scale-[0.97]"
              >
                <RefreshCw className="h-4 w-4" />
                Retake
              </button>

              {/* Remove: clears the selfie from Redux */}
              <button
                type="button"
                onClick={() => onSelfieChange(null)}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 active:scale-[0.97]"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
