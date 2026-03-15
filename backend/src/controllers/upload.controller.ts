import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { Request, Response } from "express";

const uploadRoot = "/tmp/droom-admin-uploads";
const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png"]);
const REPORT_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_COUNT = 20;

type ParsedMultipartFile = {
  fieldName: string;
  fileName: string;
  contentType: string;
  buffer: Buffer;
};

const parseMultipartFiles = async (req: Request): Promise<ParsedMultipartFile[]> => {
  const contentType = req.headers["content-type"];

  if (!contentType?.includes("multipart/form-data")) {
    return [];
  }

  const boundaryMatch = contentType.match(/boundary=([^;]+)/);
  if (!boundaryMatch) {
    throw new Error("Missing multipart boundary");
  }

  const boundary = `--${boundaryMatch[1]}`;
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const body = Buffer.concat(chunks).toString("latin1");
  const parts = body.split(boundary).slice(1, -1);

  const parsedFiles: ParsedMultipartFile[] = [];

  for (const rawPart of parts) {
    const part = rawPart.replace(/^\r\n/, "").replace(/\r\n$/, "");
      const [rawHeaders, rawContent] = part.split("\r\n\r\n");
      if (!rawHeaders || rawContent === undefined) {
        continue;
      }

      const disposition = rawHeaders
        .split("\r\n")
        .find((header) => header.toLowerCase().startsWith("content-disposition:"));
      const mimeHeader = rawHeaders
        .split("\r\n")
        .find((header) => header.toLowerCase().startsWith("content-type:"));

      if (!disposition) {
        continue;
      }

      const nameMatch = disposition.match(/name="([^"]+)"/);
      const fileNameMatch = disposition.match(/filename="([^"]*)"/);
      if (!nameMatch || !fileNameMatch || !fileNameMatch[1]) {
        continue;
      }

      parsedFiles.push({
        fieldName: nameMatch[1],
        fileName: path.basename(fileNameMatch[1]),
        contentType: mimeHeader?.split(":")[1]?.trim() ?? "application/octet-stream",
        buffer: Buffer.from(rawContent.replace(/\r\n$/, ""), "latin1"),
      });
  }

  return parsedFiles;
};

const ensureDirectory = async (directoryPath: string) => {
  await fs.mkdir(directoryPath, { recursive: true });
};

const getBaseUrl = (req: Request) => `${req.protocol}://${req.get("host")}`;

const persistFile = async (
  req: Request,
  file: ParsedMultipartFile,
  kind: "images" | "reports",
) => {
  const extension = path.extname(file.fileName) || (file.contentType === "application/pdf" ? ".pdf" : ".bin");
  const storageKey = `${kind}/${Date.now()}-${randomUUID()}${extension.toLowerCase()}`;
  const absolutePath = path.join(uploadRoot, storageKey);

  await ensureDirectory(path.dirname(absolutePath));
  await fs.writeFile(absolutePath, file.buffer);

  return {
    url: `${getBaseUrl(req)}/uploads/${storageKey}`,
    storageKey,
  };
};

export const uploadImages = async (req: Request, res: Response) => {
  const files = await parseMultipartFiles(req);
  const imageFiles = files.filter((file) => file.fieldName === "files");

  if (!imageFiles.length) {
    return res.status(400).json({
      message: "Validation failed",
      errors: { files: "No image files were uploaded" },
    });
  }

  if (imageFiles.length > MAX_IMAGE_COUNT) {
    return res.status(400).json({
      message: "Validation failed",
      errors: { files: `A maximum of ${MAX_IMAGE_COUNT} files is allowed` },
    });
  }

  for (const file of imageFiles) {
    if (!IMAGE_MIME_TYPES.has(file.contentType)) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { files: "Only JPEG and PNG images are allowed" },
      });
    }
    if (file.buffer.length > MAX_IMAGE_SIZE_BYTES) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { files: "Each image must be 10 MB or smaller" },
      });
    }
  }

  const uploaded = await Promise.all(
    imageFiles.map(async (file) => {
      const persisted = await persistFile(req, file, "images");
      return {
        url: persisted.url,
        thumbnailUrl: persisted.url,
        storageKey: persisted.storageKey,
      };
    }),
  );

  return res.status(201).json({ data: uploaded });
};

export const uploadReport = async (req: Request, res: Response) => {
  const files = await parseMultipartFiles(req);
  const report = files.find((file) => file.fieldName === "files");

  if (!report) {
    return res.status(400).json({
      message: "Validation failed",
      errors: { files: "A report file is required" },
    });
  }

  if (!REPORT_MIME_TYPES.has(report.contentType)) {
    return res.status(400).json({
      message: "Validation failed",
      errors: { files: "Only PDF, JPEG, and PNG files are allowed" },
    });
  }

  const persisted = await persistFile(req, report, "reports");
  return res.status(201).json({
    data: {
      url: persisted.url,
      storageKey: persisted.storageKey,
    },
  });
};
