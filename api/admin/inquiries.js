import { requireAdminAuth } from "../_lib/auth.js";
import { readJsonBody, sendJson, sendMethodNotAllowed } from "../_lib/http.js";
import { deleteInquiryRecord, getStorageMeta, purgeExpiredInquiries, updateInquiryRecord } from "../_lib/storage.js";

const STATUSES = new Set(["new", "progress", "done"]);

// GET   : 문의 목록 (최신순). ?since=ISO 날짜를 주면 그 이후 문의만 돌려줍니다. (알림 앱용)
//         목록을 읽을 때 보관 기간(1년)이 지난 문의는 자동으로 지웁니다.
// PATCH : { id, status?, memo? } 로 상태·메모를 바꿉니다.
// DELETE: ?id=문의ID 로 문의 한 건을 지웁니다.
export default async function handler(req, res) {
  if (!["GET", "PATCH", "DELETE"].includes(req.method)) {
    return sendMethodNotAllowed(res, ["GET", "PATCH", "DELETE"]);
  }

  const session = requireAdminAuth(req, res);
  if (!session) {
    return undefined;
  }

  if (req.method === "PATCH") {
    try {
      const body = await readJsonBody(req);
      const id = String(body?.id ?? "");
      const patch = {};
      if (body?.status !== undefined) {
        if (!STATUSES.has(body.status)) return sendJson(res, 400, { message: "알 수 없는 상태입니다." });
        patch.status = body.status;
      }
      if (body?.memo !== undefined) patch.memo = String(body.memo).slice(0, 2000);
      if (!id || !Object.keys(patch).length) return sendJson(res, 400, { message: "바꿀 내용이 없습니다." });
      const updated = await updateInquiryRecord(id, patch);
      if (!updated) return sendJson(res, 404, { message: "문의를 찾을 수 없습니다." });
      return sendJson(res, 200, { inquiry: updated });
    } catch {
      return sendJson(res, 500, { message: "문의를 수정하지 못했습니다." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const id = new URL(req.url, "http://localhost").searchParams.get("id") ?? "";
      if (!id) return sendJson(res, 400, { message: "지울 문의를 알려 주세요." });
      const deleted = await deleteInquiryRecord(id);
      if (!deleted) return sendJson(res, 404, { message: "문의를 찾을 수 없습니다." });
      return sendJson(res, 200, { ok: true, id });
    } catch {
      return sendJson(res, 500, { message: "문의를 지우지 못했습니다." });
    }
  }

  try {
    const url = new URL(req.url, "http://localhost");
    const since = Date.parse(url.searchParams.get("since") ?? "");
    const all = (await purgeExpiredInquiries()).map((record) => ({ status: "new", memo: "", ...record }));
    const inquiries = Number.isFinite(since) ? all.filter((record) => Date.parse(record.createdAt) > since) : all;

    return sendJson(res, 200, {
      inquiries,
      counts: {
        total: all.length,
        new: all.filter((record) => record.status === "new").length,
        progress: all.filter((record) => record.status === "progress").length,
        done: all.filter((record) => record.status === "done").length,
      },
      storage: getStorageMeta(),
      admin: { username: session.sub },
    });
  } catch {
    return sendJson(res, 500, { message: "문의 내역을 불러오지 못했습니다." });
  }
}
