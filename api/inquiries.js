import crypto from "node:crypto";
import { readJsonBody, sendJson, sendMethodNotAllowed } from "./_lib/http.js";
import { appendInquiryRecord, getStorageMeta } from "./_lib/storage.js";

function sanitizeText(value, maxLength = 4000) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function validateInquiry(payload) {
  const normalized = {
    sampleId: sanitizeText(payload?.sampleId, 120),
    sampleBrand: sanitizeText(payload?.sampleBrand, 160),
    plan: sanitizeText(payload?.plan, 160),
    customization: sanitizeText(payload?.customization, 240),
    budget: sanitizeText(payload?.budget, 120),
    timeline: sanitizeText(payload?.timeline, 120),
    references: sanitizeText(payload?.references, 3000),
    details: sanitizeText(payload?.details, 4000),
    contactName: sanitizeText(payload?.contactName, 120),
    email: sanitizeText(payload?.email, 200),
    phone: sanitizeText(payload?.phone, 80),
    sourcePath: sanitizeText(payload?.sourcePath, 240),
  };

  if (!normalized.sampleId) {
    return { message: "샘플 정보가 누락되었습니다." };
  }

  if (!normalized.contactName) {
    return { message: "이름을 입력해 주세요." };
  }

  if (!normalized.email && !normalized.phone) {
    return { message: "이메일 또는 연락처를 하나 이상 입력해 주세요." };
  }

  if (!normalized.details) {
    return { message: "문의 내용을 입력해 주세요." };
  }

  return { data: normalized };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  try {
    const body = await readJsonBody(req);
    const validation = validateInquiry(body);

    if (validation.message) {
      return sendJson(res, 400, { message: validation.message });
    }

    const record = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...validation.data,
    };

    await appendInquiryRecord(record);

    return sendJson(res, 200, {
      ok: true,
      inquiry: record,
      storage: getStorageMeta(),
      message: "문의가 서버에 저장되었습니다.",
    });
  } catch {
    return sendJson(res, 500, { message: "문의 저장 중 오류가 발생했습니다." });
  }
}
