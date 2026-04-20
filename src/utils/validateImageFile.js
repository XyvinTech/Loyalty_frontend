/** Matches backend upload filter (JPEG, PNG, GIF, WebP). */
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const EXT_TO_MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

const DEFAULT_MAX_MB = 10;

export function getMaxImageUploadMb() {
  const raw = import.meta.env.VITE_MAX_IMAGE_UPLOAD_MB;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_MB;
}

export function getMaxImageUploadBytes() {
  return getMaxImageUploadMb() * 1024 * 1024;
}

/** Short copy for labels / helper text under file inputs. */
export function getImageUploadRulesSummary() {
  const mb = getMaxImageUploadMb();
  return `Max ${mb} MB. WebP preferred; JPEG, PNG, or GIF also accepted.`;
}

function formatMb(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function resolveMime(file) {
  const raw = (file.type || "").toLowerCase().trim();
  if (raw && ALLOWED_MIME.has(raw)) return raw;
  if (file instanceof File) {
    const name = file.name || "";
    const ext = name.includes(".") ? name.split(".").pop().toLowerCase() : "";
    return EXT_TO_MIME[ext] || raw;
  }
  // Canvas blobs sometimes omit type in older browsers; cropper uses JPEG.
  if (file instanceof Blob && !raw) {
    return "image/jpeg";
  }
  return raw;
}

/**
 * Client-side check before upload (avoids 413 Request Entity Too Large where possible).
 * @param {File|Blob} file
 * @returns {{ ok: true } | { ok: false, message: string }}
 */
export function validateImageFileForUpload(file) {
  if (!file || typeof file.size !== "number") {
    return { ok: false, message: "No image selected." };
  }

  const maxBytes = getMaxImageUploadBytes();
  const maxMb = getMaxImageUploadMb();

  if (file.size > maxBytes) {
    return {
      ok: false,
      message: `Image is too large (${formatMb(file.size)}). Maximum size is ${maxMb} MB. Compress the file or use WebP for a smaller upload.`,
    };
  }

  const mime = resolveMime(file);
  if (!mime || !ALLOWED_MIME.has(mime)) {
    return {
      ok: false,
      message:
        "Only JPEG, PNG, GIF, or WebP images are allowed. WebP is preferred for smaller files and faster uploads.",
    };
  }

  return { ok: true };
}
