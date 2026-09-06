// lib/notifySound.ts
/* ──────────────────────────────────────────────────────────────
 * কোনো external mp3/audio ফাইল ছাড়াই Web Audio API দিয়ে একটা
 * ছোট্ট, মিষ্টি "ding" সাউন্ড বাজানো হয় — নতুন নোটিফিকেশন এলে।
 *
 * ব্রাউজার নীতি অনুযায়ী পেজে ইউজার অন্তত একবার ক্লিক/কী-প্রেস/টাচ
 * না করলে AudioContext "suspended" থেকে যায় এবং সাউন্ড বাজে না।
 * তাই root-এ (SocketContext মাউন্ট হওয়ার সময়) একবার
 * unlockNotifySoundOnUserGesture() কল করে রাখা হয়েছে, যাতে প্রথম
 * ক্লিকেই AudioContext আনলক হয়ে যায়।
 * ────────────────────────────────────────────────────────────── */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

/** প্রথম ইউজার-জেসচারে AudioContext রিজিউম করে (autoplay policy বাইপাস) */
export function unlockNotifySoundOnUserGesture() {
  if (typeof window === "undefined") return;
  const unlock = () => {
    const c = getCtx();
    if (c && c.state === "suspended") c.resume().catch(() => {});
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

/** দুই-টোনের একটা ছোট, সুন্দর "ding" বাজায় */
export function playNotificationSound(volume = 0.35) {
  try {
    const c = getCtx();
    if (!c) return;
    if (c.state === "suspended") c.resume().catch(() => {});

    const now = c.currentTime;
    const tones: Array<{ freq: number; start: number; dur: number }> = [
      { freq: 880, start: 0, dur: 0.14 }, // A5
      { freq: 1318.5, start: 0.12, dur: 0.22 }, // E6
    ];

    for (const t of tones) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(t.freq, now + t.start);

      gain.gain.setValueAtTime(0, now + t.start);
      gain.gain.linearRampToValueAtTime(volume, now + t.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t.start + t.dur);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(now + t.start);
      osc.stop(now + t.start + t.dur + 0.02);
    }
  } catch {
    /* সাউন্ড না বাজলেও নোটিফিকেশন ফ্লো ভাঙবে না */
  }
}
