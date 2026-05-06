const RAW_BASE_URL = import.meta.env?.BASE_URL || "/";

export const APP_BASE_PATH = RAW_BASE_URL === "/"
  ? ""
  : `/${RAW_BASE_URL.replace(/^\/+|\/+$/g, "")}`;

export function stripBasePath(pathname = "/") {
  if (!APP_BASE_PATH) {
    return pathname || "/";
  }

  if (pathname === APP_BASE_PATH) {
    return "/";
  }

  return pathname.startsWith(`${APP_BASE_PATH}/`)
    ? pathname.slice(APP_BASE_PATH.length) || "/"
    : pathname || "/";
}

export function withBasePath(path = "/") {
  if (!path) {
    return APP_BASE_PATH || "/";
  }

  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return APP_BASE_PATH ? `${APP_BASE_PATH}${normalizedPath}` : normalizedPath;
}
