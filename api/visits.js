import crypto from "node:crypto";
import { readJsonBody, sendJson, sendMethodNotAllowed } from "./_lib/http.js";
import { appendVisitRecord } from "./_lib/visitStorage.js";

function sanitizeText(value, maxLength = 400) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function validateVisit(payload) {
  const normalized = {
    siteId: sanitizeText(payload?.siteId, 120),
    routeSlug: sanitizeText(payload?.routeSlug, 120),
    routeLabel: sanitizeText(payload?.routeLabel, 160),
    sourcePath: sanitizeText(payload?.sourcePath, 240),
  };

  if (!normalized.siteId) {
    return { message: "사이트 정보가 누락되었습니다." };
  }

  return { data: normalized };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  try {
    const body = await readJsonBody(req);
    const validation = validateVisit(body);

    if (validation.message) {
      return sendJson(res, 400, { message: validation.message });
    }

    const record = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      userAgent: sanitizeText(req.headers["user-agent"], 320),
      ...validation.data,
    };

    try {
      await appendVisitRecord(record);
      return sendJson(res, 200, { ok: true, stored: true });
    } catch (error) {
      console.warn("Visit storage failed", {
        name: error?.name,
        message: error?.message,
      });
      return sendJson(res, 200, { ok: true, stored: false });
    }
  } catch (error) {
    console.warn("Visit tracking failed", {
      name: error?.name,
      message: error?.message,
    });
    return sendJson(res, 200, { ok: true, stored: false });
  }
}
