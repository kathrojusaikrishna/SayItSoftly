const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

const fromBase64 = (value) =>
  Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

async function deriveKey(secret, salt) {
  const material = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 300000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptCard(card, secret) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(secret, salt);
  const plaintext = encoder.encode(JSON.stringify(card));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  return { v: 1, salt: toBase64(salt), iv: toBase64(iv), ct: toBase64(ciphertext) };
}

export async function decryptCard(payload, secret) {
  const key = await deriveKey(secret, fromBase64(payload.salt));
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(payload.iv) },
    key,
    fromBase64(payload.ct)
  );
  return JSON.parse(decoder.decode(plaintext));
}

export function createCardId() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(12)),
    (value) => alphabet[value % alphabet.length]).join("");
}