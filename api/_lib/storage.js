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
    const next = [record, ...current];
    await writeFileInquiryRecords(next);
    return next;
  }

  for (let attempt = 0; attempt < BLOB_WRITE_RETRIES; attempt += 1) {
    const { records, etag } = await readBlobInquiryState();
    const next = [record, ...records];

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
