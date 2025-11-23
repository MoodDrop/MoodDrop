// client/src/lib/community/storage.ts

const VIBE_ID_KEY = "mooddrop_vibe_id";

// Some soft default Vibe IDs, used when we need to generate one
const FALLBACK_VIBES = [
  "SoftGlow12",
  "CalmDusk43",
  "GentleBreeze19",
  "QuietBloom07",
  "StillWaters28",
  "SunsetWhisper33",

  "BlushPetal14",
  "HoneyMist82",
  "WarmEmber61",
  "VelvetDawn24",
  "MutedRose17",
  "CalmCascade51",
  "HazelHush09",
  "AmberShade72",
  "SereneWaves44",
  "PinkAura30",
  "CocoaDrift16",
  "DuskPetal05",
  "BerryWhisper18",
  "DaydreamDrift92",

  "SoftMoss22",
  "MoonlitMurmur08",
  "PastelSigh34",
  "ButterflyHush57",
  "PebbleQuiet13",
  "MorningLilt20",
  "SootheFlow98",
  "SandyBloom86",
  "LavenderCoast71",
  "MarshmallowSky55",

  "AutumnBreeze63",
  "CottonGlow04",
  "RosewoodRipple11",
  "GoldenDew95",
  "EveningPetal47",
  "CrescentEase02",
  "WarmFog62",
  "GentleHorizon83",
  "SilentPetal39",
  "CloudyWish58",

  "SoftSprout29",
  "MutedMoon23",
  "SootheWhisper94",
  "CalmingDust06",
  "WarmLullaby59",
  "CocoaSolace74",
  "PaleHarmony52",
  "FaintDusk36",
  "DewyShade41",
  "StillPetal69",

  "PeacefulDrift25",
  "GlowHaven77",
  "PetalEase46",
  "MoonDrop03",
  "DreamSigh12",
  "PastelDrift84",
  "TenderBreeze69",
  "WarmHaze40",
  "MutedSerenity53",
  "CalmWish10"
];


function isBrowser() {
  return typeof window !== "undefined";
}

function generateRandomVibeId(): string {
  const pick =
    FALLBACK_VIBES[Math.floor(Math.random() * FALLBACK_VIBES.length)];
  return pick;
}

// Clean up what the user typed (no empty strings, trim spaces)
function normalizeVibeId(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return trimmed;
}

/**
 * Get whatever Vibe ID is stored in localStorage,
 * or null if there isn't one yet.
 */
export function readStoredVibeId(): string | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(VIBE_ID_KEY);
  return normalizeVibeId(raw);
}

/**
 * Save a Vibe ID to localStorage (used by both random + custom flows).
 */
export function saveVibeId(raw: string): string {
  const norm = normalizeVibeId(raw);
  const finalValue = norm ?? generateRandomVibeId();

  if (isBrowser()) {
    window.localStorage.setItem(VIBE_ID_KEY, finalValue);
  }
  return finalValue;
}

/**
 * Main entry: get a Vibe ID for this browser.
 * If none exists, we generate one and save it.
 */
export function getVibeId(): string {
  const existing = readStoredVibeId();
  if (existing) return existing;

  const generated = generateRandomVibeId();
  return saveVibeId(generated);
}

/**
 * Used when the user taps "Refresh" / "Randomize".
 */
export function refreshVibeId(): string {
  const next = generateRandomVibeId();
  return saveVibeId(next);
}

/**
 * Used when the user types their own custom Vibe ID.
 */
export function setCustomVibeId(raw: string): string {
  return saveVibeId(raw);
}
