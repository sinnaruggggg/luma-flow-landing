import { requireAdminAuth } from "../_lib/auth.js";
import { sendJson, sendMethodNotAllowed } from "../_lib/http.js";
import { getStorageMeta, readInquiryRecords } from "../_lib/storage.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendMethodNotAllowed(res, ["GET"]);
  }

  const session = requireAdminAuth(req, res);
  if (!session) {
    return undefined;
  }

  try {
    const inquiries = await readInquiryRecords();

    return sendJson(res, 200, {
      inquiries,
      storage: getStorageMeta(),
      admin: {
        username: session.sub,
      },
    });
  } catch {
    return sendJson(res, 500, { message: "문의 내역을 불러오지 못했습니다." });
  }
}
