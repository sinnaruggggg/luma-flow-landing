const ADMIN_TOKEN_KEY = "webforge_admin_token_v1";

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  let payload = null;

  if (contentType.includes("application/json")) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    throw new Error(payload?.message || "요청 처리 중 오류가 발생했습니다.");
  }

  if (!contentType.includes("application/json") || payload === null) {
    throw new Error("서버 응답을 처리할 수 없습니다. 배포 또는 API 설정을 확인해 주세요.");
  }

  return payload;
}

export function getAdminToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
}

export function setAdminToken(token) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function submitInquiry(payload) {
  return requestJson("/api/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function loginAdmin({ username, password }) {
  return requestJson("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
}

export async function fetchAdminInquiries(token) {
  return requestJson("/api/admin/inquiries", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
