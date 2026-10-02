import { get, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_LOCAL_STORAGE_FILE = path.join(process.cwd(), "data", "webforge-inquiries.json");
const DEFAULT_TEMP_STORAGE_FILE = "/tmp/webforge-inquiries.json";
const DEFAULT_BLOB_PATHNAME = "webforge/inquiries.json";
const BLOB_ACCESS = "private";
const BLOB_CONTENT_TYPE = "application/json; charset=utf-8";
const BLOB_CACHE_MAX_AGE = 60;
const BLOB_WRITE_RETRIES = 4;
// 문의 보관 기간(일). 개인정보 처리방침(src/editorial/data/privacyPolicy.js)의 "1년"과 맞춰야 합니다.
export const INQUIRY_RETENTION_DAYS = 365;

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function getStorageMode() {
  if (hasBlobStorage()) {
    return "vercel-blob";
  }

  if (process.env.INQUIRY_STORAGE_FILE) {
    return "persistent-server-file";
  }

  if (process.env.VERCEL) {
    return "temporary-server-file";
  }

  return "persistent-server-file";
}

function getStorageFilePath() {
  if (process.env.INQUIRY_STORAGE_FILE) {
    return process.env.INQUIRY_STORAGE_FILE;
  }

  if (process.env.VERCEL) {
    return DEFAULT_TEMP_STORAGE_FILE;
  }

  return DEFAULT_LOCAL_STORAGE_FILE;
}

function getBlobPathname() {
  return process.env.INQUIRY_BLOB_PATH || DEFAULT_BLOB_PATHNAME;
}

export function getStorageMeta() {
  const mode = getStorageMode();

  if (mode === "vercel-blob") {
    return {
      mode,
      pathname: getBlobPathname(),
      note: "문의 데이터는 Vercel Blob의 비공개 JSON 파일에 저장됩니다.",
    };
  }

  const filePath = getStorageFilePath();

  if (mode === "temporary-server-file") {
    return {
      mode,
      filePath,
      note: "문의 데이터는 서버 임시 파일에 저장됩니다. 인스턴스 교체나 재배포 시 초기화될 수 있습니다.",
    };
  }

  return {
    mode,
    filePath,
    note: "문의 데이터는 서버 JSON 파일에 저장됩니다.",
  };
}

async function ensureStorageDir() {
  const filePath = getStorageFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  return filePath;
}

async function readFileInquiryRecords() {
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

async function writeFileInquiryRecords(records) {
  const filePath = await ensureStorageDir();
  await writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}

async function readBlobInquiryState() {
  // 저장 직전에 읽는 값이므로 CDN 캐시를 거치지 않고 최신 내용을 읽습니다.
  const result = await get(getBlobPathname(), { access: BLOB_ACCESS, useCache: false });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return { records: [], etag: null };
  }

  const raw = await new Response(result.stream).text();
  const parsed = JSON.parse(raw);

  return {
    records: Array.isArray(parsed) ? parsed : [],
    // 파일이 1KB를 넘으면 압축 전송되며 ETag가 약한 형태(W/"...")로 오는데,
    // 조건부 저장(ifMatch)은 강한 형태("...")만 받으므로 앞의 W/ 를 떼어 냅니다.
    etag: result.blob.etag ? result.blob.etag.replace(/^W\//, "") : null,
  };
}

async function writeBlobInquiryRecords(records, ifMatch) {
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

export async function readInquiryRecords() {
  if (getStorageMode() === "vercel-blob") {
    const { records } = await readBlobInquiryState();
    return records;
  }

  return readFileInquiryRecords();
}

export async function writeInquiryRecords(records) {
  if (getStorageMode() === "vercel-blob") {
    await writeBlobInquiryRecords(records);
    return;
  }

  await writeFileInquiryRecords(records);
}

export async function appendInquiryRecord(record) {
  if (getStorageMode() !== "vercel-blob") {
    const current = await readFileInquiryRecords();
    const next = [record, ...current.filter(isWithinRetention)];
    await writeFileInquiryRecords(next);
    return next;
  }

  for (let attempt = 0; attempt < BLOB_WRITE_RETRIES; attempt += 1) {
    const { records, etag } = await readBlobInquiryState();
    const next = [record, ...records.filter(isWithinRetention)];

    try {
      await writeBlobInquiryRecords(next, etag);
      return next;
    } catch (error) {
      if (isBlobWriteConflict(error)) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("문의 저장이 동시에 충돌해서 다시 시도해 주세요.");
}

// 문의 한 건의 상태·메모를 바꿉니다. 동시에 저장되면 최신 내용을 다시 읽어 재시도합니다.
export async function updateInquiryRecord(id, patch) {
  const apply = (records) => {
    let updated = null;
    const next = records.map((record) => {
      if (record.id !== id) return record;
      updated = { ...record, ...patch, updatedAt: new Date().toISOString() };
      return updated;
    });
    return { next, updated };
  };

  if (getStorageMode() !== "vercel-blob") {
    const { next, updated } = apply(await readFileInquiryRecords());
    if (updated) await writeFileInquiryRecords(next);
    return updated;
  }

  for (let attempt = 0; attempt < BLOB_WRITE_RETRIES; attempt += 1) {
    const { records, etag } = await readBlobInquiryState();
    const { next, updated } = apply(records);
    if (!updated) return null;
    try {
      await writeBlobInquiryRecords(next, etag);
      return updated;
    } catch (error) {
      if (isBlobWriteConflict(error)) continue;
      throw error;
    }
  }

  throw new Error("문의 수정이 동시에 충돌해서 다시 시도해 주세요.");
}

// 보관 기간 안의 문의인지 (날짜가 이상한 기록은 지우지 않고 남겨 둡니다)
export function isWithinRetention(record, now = Date.now()) {
  const created = Date.parse(record?.createdAt ?? "");
  return !Number.isFinite(created) || now - created < INQUIRY_RETENTION_DAYS * 24 * 60 * 60 * 1000;
}

// 기록 전체를 읽어 change(records) → { next, result } 로 바꾼 뒤 저장합니다.
// next 가 null 이면 저장하지 않습니다. 동시에 저장되면 최신 내용을 다시 읽어 재시도합니다.
async function mutateInquiryRecords(change) {
  if (getStorageMode() !== "vercel-blob") {
    const { next, result } = change(await readFileInquiryRecords());
    if (next) await writeFileInquiryRecords(next);
    return result;
  }

  for (let attempt = 0; attempt < BLOB_WRITE_RETRIES; attempt += 1) {
    const { records, etag } = await readBlobInquiryState();
    const { next, result } = change(records);
    if (!next) return result;
    try {
      await writeBlobInquiryRecords(next, etag);
      return result;
    } catch (error) {
      if (isBlobWriteConflict(error)) continue;
      throw error;
    }
  }

  throw new Error("문의 저장이 동시에 충돌해서 다시 시도해 주세요.");
}

// 문의 한 건을 지웁니다. 지웠으면 true, 없으면 false.
export function deleteInquiryRecord(id) {
  return mutateInquiryRecords((records) => {
    const next = records.filter((record) => record.id !== id);
    return next.length === records.length ? { next: null, result: false } : { next, result: true };
  });
}

// 보관 기간이 지난 문의를 지우고, 남은 문의 목록을 돌려줍니다. (지울 게 없으면 저장하지 않음)
export function purgeExpiredInquiries(now = Date.now()) {
  return mutateInquiryRecords((records) => {
    const kept = records.filter((record) => isWithinRetention(record, now));
    return { next: kept.length === records.length ? null : kept, result: kept };
  });
}
