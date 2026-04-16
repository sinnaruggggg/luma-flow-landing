import { createAdminToken, isValidAdminCredentials } from "../_lib/auth.js";
import { readJsonBody, sendJson, sendMethodNotAllowed } from "../_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  try {
    const body = await readJsonBody(req);
    const username = String(body?.username ?? "").trim();
    const password = String(body?.password ?? "");

    if (!isValidAdminCredentials(username, password)) {
      return sendJson(res, 401, { message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }

    return sendJson(res, 200, {
      token: createAdminToken(),
      username,
    });
  } catch {
    return sendJson(res, 400, { message: "로그인 요청 형식이 올바르지 않습니다." });
  }
}
