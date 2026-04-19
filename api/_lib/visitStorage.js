import { get, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_LOCAL_STORAGE_FILE = path.join(process.cwd(), "data", "webforge-site-visits.json");
const DEFAULT_TEMP_STORAGE_FILE = "/tmp/webforge-site-visits.json";
const DEFAULT_BLOB_PATHNAME = "webforge/site-visits.json";
const BLOB_ACCESS = "private";
const BLOB_CONTENT_TYPE = "application/json; charset=utf-8";
const BLOB_CACHE_MAX_AGE = 60;
const BLOB_WRITE_RETRIES = 4;

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function getStorageMode() {
  if (hasBlobStorage()) {
    return "vercel-blob";
  }

  if (process.env.VISIT_STORAGE_FILE) {
    return "persistent-server-file";
  }

  if (process.env.VERCEL) {
    return "temporary-server-file";
  }

  return "persistent-server-file";
}

function getStorageFilePath() {
  if (process.env.VISIT_STORAGE_FILE) {
    return process.env.VISIT_STORAGE_FILE;
  }

  if (process.env.VERCEL) {
    return DEFAULT_TEMP_STORAGE_FILE;
  }

  return DEFAULT_LOCAL_STORAGE_FILE;
}

function getBlobPathname() {
  return process.env.VISIT_BLOB_PATH || DEFAULT_BLOB_PATHNAME;
}

export function getVisitStorageMeta() {
  const mode = getStorageMode();

  if (mode === "vercel-blob") {
    return {
      mode,
      pathname: getBlobPathname(),
      note: "사이트 접속 기록은 Vercel Blob의 비공개 JSON 파일에 저장됩니다.",
    };
  }

  const filePath = getStorageFilePath();

  if (mode === "temporary-server-file") {
    return {
      mode,
      filePath,
      note: "사이트 접속 기록은 서버 임시 파일에 저장됩니다. 인스턴스 교체나 재배포 시 초기화될 수 있습니다.",
    };
  }

  return {
    mode,
    filePath,
    note: "사이트 접속 기록은 서버 JSON 파일에 저장됩니다.",
  };
}

async function ensureStorageDir() {
  const filePath = getStorageFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  return filePath;
}

async function readFileVisitRecords() {
  try {
    const raw = await readFile(getStorageFilePath(), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeFileVisitRecords(records) {
  const filePath = await ensureStorageDir();
  await writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}

async function readBlobVisitState() {
  const result = await get(getBlobPathname(), { access: BLOB_ACCESS });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return { records: [], etag: null };
  }

  const raw = await new Response(result.stream).text();
  const parsed = JSON.parse(raw);

  return {
    records: Array.isArray(parsed) ? parsed : [],
    etag: result.blob.etag ?? null,
  };
}

async function writeBlobVisitRecords(records, ifMatch) {
  const options = {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: BLOB_CACHE_MAX_AGE,
    contentType: BLOB_CONTENT_TYPE,
  };

  if (ifMatch) {
    options.ifMatch = ifMatch;
  }

  await put(getBlobPathname(), JSON.stringify(records, null, 2), options);
}

function isBlobWriteConflict(error) {
  return error?.name === "BlobPreconditionFailedError";
}

export async function readVisitRecords() {
  if (getStorageMode() === "vercel-blob") {
    const { records } = await readBlobVisitState();
    return records;
  }

  return readFileVisitRecords();
}

export async function appendVisitRecord(record) {
  if (getStorageMode() !== "vercel-blob") {
    const current = await readFileVisitRecords();
    const next = [record, ...current];
    await writeFileVisitRecords(next);
    return next;
  }

  for (let attempt = 0; attempt < BLOB_WRITE_RETRIES; attempt += 1) {
    const { records, etag } = await readBlobVisitState();
    const next = [record, ...records];

    try {
      await writeBlobVisitRecords(next, etag);
      return next;
    } catch (error) {
      if (isBlobWriteConflict(error)) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("사이트 접속 기록 저장이 동시에 충돌해서 다시 시도해 주세요.");
}
