import crypto from "node:crypto";
import { sendJson } from "./http.js";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "sinnaruggggg";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ljw8533!";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "sinnaruggggg_admin_session_v1";
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

function signTokenPayload(encodedPayload) {
  return crypto
    .createHmac("sha256", ADMIN_SESSION_SECRET)
    .update(encodedPayload)
    .digest("base64url");
}

export function createAdminToken() {
  const payload = {
    sub: ADMIN_USERNAME,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signTokenPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== "string") {
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
