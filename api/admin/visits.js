import { requireAdminAuth } from "../_lib/auth.js";
import { sendJson, sendMethodNotAllowed } from "../_lib/http.js";
import { getVisitStorageMeta, readVisitRecords } from "../_lib/visitStorage.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendMethodNotAllowed(res, ["GET"]);
  }

  const session = requireAdminAuth(req, res);
  if (!session) {
    return undefined;
  }

  try {
    const visits = await readVisitRecords();

    return sendJson(res, 200, {
      visits,
      storage: getVisitStorageMeta(),
      admin: {
        username: session.sub,
      },
    });
  } catch {
    return sendJson(res, 500, { message: "접속 기록을 불러오지 못했습니다." });
  }
}
