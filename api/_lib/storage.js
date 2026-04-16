import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function getStorageFilePath() {
  if (process.env.INQUIRY_STORAGE_FILE) {
    return process.env.INQUIRY_STORAGE_FILE;
  }

  if (process.env.VERCEL) {
    return "/tmp/webforge-inquiries.json";
  }

  return path.join(process.cwd(), "data", "webforge-inquiries.json");
}

export function getStorageMeta() {
  const filePath = getStorageFilePath();

  if (filePath.startsWith("/tmp/")) {
    return {
      mode: "temporary-server-file",
      filePath,
      note: "현재 문의 데이터는 서버 임시 파일에 저장됩니다. Vercel에서는 재배포나 인스턴스 교체 시 초기화될 수 있습니다.",
    };
  }

  return {
    mode: "persistent-server-file",
    filePath,
    note: "현재 문의 데이터는 서버 파일에 저장됩니다.",
  };
}

async function ensureStorageDir() {
  const filePath = getStorageFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  return filePath;
}

export async function readInquiryRecords() {
  try {
    const filePath = getStorageFilePath();
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function writeInquiryRecords(records) {
  const filePath = await ensureStorageDir();
  await writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}

export async function appendInquiryRecord(record) {
  const current = await readInquiryRecords();
  const next = [record, ...current];
  await writeInquiryRecords(next);
  return next;
}
