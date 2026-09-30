import crypto from "node:crypto";
import { sendJson } from "./http.js";

// 관리자 계정·비밀값은 코드에 두지 않고 Vercel 환경 변수에서만 읽습니다.
// 셋 중 하나라도 없으면 관리자 로그인은 꺼집니다. (세션 비밀값은 32자 이상)
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? "").trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function toBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function timingSafeEqualText(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminConfigured() {
  return Boolean(ADMIN_USERNAME && ADMIN_PASSWORD && ADMIN_SESSION_SECRET.length >= 32);
}

function signTokenPayload(encodedPayload) {
  if (!isAdminConfigured()) {
    throw new Error("Admin auth is not configured");
  }
  return crypto
    .createHmac("sha256", ADMIN_SESSION_SECRET)
    .update(encodedPayload)
    .digest("base64url");
}

// 웹 관리자 7일, 알림 앱은 백그라운드 확인이 끊기지 않도록 90일
export const APP_SESSION_TTL_SECONDS = 60 * 60 * 24 * 90;

export function createAdminToken(ttlSeconds = SESSION_TTL_SECONDS) {
  const payload = {
    sub: ADMIN_USERNAME,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signTokenPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!isAdminConfigured() || !token || typeof token !== "string") {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signTokenPayload(encodedPayload);
  if (!timingSafeEqualText(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (!payload?.sub || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function isValidAdminCredentials(username, password) {
  if (!isAdminConfigured()) {
    return false;
  }
  return timingSafeEqualText(username ?? "", ADMIN_USERNAME) && timingSafeEqualText(password ?? "", ADMIN_PASSWORD);
}

export function getBearerToken(req) {
  const header = req.headers.authorization ?? req.headers.Authorization;
  if (!header || typeof header !== "string") {
    return "";
  }

  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

export function requireAdminAuth(req, res) {
  const token = getBearerToken(req);
  const payload = verifyAdminToken(token);

  if (!payload) {
    sendJson(res, 401, { message: "관리자 로그인이 필요합니다." });
    return null;
  }

  return payload;
}
