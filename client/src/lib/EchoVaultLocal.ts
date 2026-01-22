// client/src/lib/EchoVaultLocal.ts

export type EchoType = "text" | "voice";

export type EchoItem = {
  id: string;
  type: EchoType;

  mood?: string;

  // Text echo
  content?: string;

  // Voice echo
  audioBase64?: string; // ✅ persisted audio
  audioUrl?: string; // legacy (blob:) kept for backward compatibility
  audioMime?: string;
  audioDurationMs?: number;

  // NEW: Archive + delete lifecycle
  tuckedAt?: number; // if set, echo is "Tucked Away"
  deletedAt?: number; // if set, echo is "soft deleted" (hidden)

  createdAt: number; // epoch ms
};

const STORAGE_KEY = "mooddrop_echo_vault_v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readEchoesLocal(): EchoItem[] {
  const parsed = safeParse<EchoItem[]>(localStorage.getItem(STORAGE_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

// Backwards compatible alias
export function getEchoesLocal(): EchoItem[] {
  return readEchoesLocal();
}

/**
 * Convert Blob -> base64 (without the data: prefix)
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read audio blob"));
    reader.onload = () => {
      const result = reader.result as string; // data:audio/webm;...;base64,XXXX
      const base64 = result.split(",")[1] || "";
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert base64 -> Blob
 */
export function base64ToBlob(base64: string, mime: string) {
  const byteString = atob(base64);
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) bytes[i] = byteString.charCodeAt(i);
  return new Blob([bytes], { type: mime || "audio/webm" });
}

export function saveEchoLocal(
  input: Omit<EchoItem, "id" | "createdAt"> &
    Partial<Pick<EchoItem, "id" | "createdAt">>
): EchoItem {
  const existing = readEchoesLocal();

  const full: EchoItem = {
    id: input.id ?? crypto.randomUUID(),
    createdAt: input.createdAt ?? Date.now(),
    type: input.type,
    mood: input.mood,
    content: input.content,

    // voice
    audioBase64: input.audioBase64,
    audioUrl: input.audioUrl,
    audioMime: input.audioMime,
    audioDurationMs: input.audioDurationMs,

    // lifecycle
    tuckedAt: input.tuckedAt,
    deletedAt: input.deletedAt,
  };

  const updated = [full, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return full;
}

/**
 * ✅ Compatibility helpers
 */
export function saveTextEchoLocal(params: { mood?: string; content: string }) {
  return saveEchoLocal({
    type: "text",
    mood: params.mood,
    content: params.content,
  });
}

/**
 * ✅ Persist voice audio as base64 (survives refresh/navigation)
 */
export async function saveVoiceEchoLocal(params: {
  mood?: string;
  content?: string; // optional note/title
  audioBlob: Blob;
  audioMime?: string;
  audioDurationMs?: number;
}) {
  const audioMime = params.audioMime || params.audioBlob.type || "audio/webm";
  const audioBase64 = await blobToBase64(params.audioBlob);

  return saveEchoLocal({
    type: "voice",
    mood: params.mood,
    content: params.content,
    audioBase64,
    audioMime,
    audioDurationMs: params.audioDurationMs,
  });
}

/**
 * Update a single echo by id (patch fields)
 */
export function patchEchoLocal(id: string, patch: Partial<EchoItem>) {
  const arr = readEchoesLocal();
  const next = arr.map((e) => (e.id === id ? { ...e, ...patch } : e));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

/**
 * Tuck away / return
 */
export function tuckEchoLocal(id: string) {
  patchEchoLocal(id, { tuckedAt: Date.now() });
}

export function returnEchoLocal(id: string) {
  patchEchoLocal(id, { tuckedAt: undefined });
}

/**
 * Soft delete (hidden everywhere) + finalize delete
 */
export function softDeleteEchoLocal(id: string) {
  patchEchoLocal(id, { deletedAt: Date.now() });
}

export function finalizeDeleteEchoLocal(id: string) {
  const updated = readEchoesLocal().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * If user refreshes during the Undo window, finalize deletes that are older than the grace period.
 */
export function purgeExpiredDeletesLocal(graceMs = 6000) {
  const now = Date.now();
  const arr = readEchoesLocal();
  const next = arr.filter((e) => !(e.deletedAt && now - e.deletedAt > graceMs));
  if (next.length !== arr.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}

/**
 * Legacy hard delete (still used in some places)
 */
export function deleteEchoLocal(id: string) {
  finalizeDeleteEchoLocal(id);
}

export function clearEchoesLocal() {
  localStorage.removeItem(STORAGE_KEY);
}
