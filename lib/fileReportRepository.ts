import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Report, ReportFolder } from "@/types/report";

type ReportMetadata = Omit<Report, "html_content">;

const contentRoot = join(process.cwd(), "content");
const reportsRoot = join(contentRoot, "reports");

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, "")) as T;
}

export async function listFolders() {
  return readJson<ReportFolder[]>(join(contentRoot, "folders.json"));
}

export async function listRootFolders() {
  return (await listFolders()).filter((folder) => folder.parent_id === null);
}

export async function getFolderById(id: string) {
  return (await listFolders()).find((folder) => folder.id === id);
}

export async function listChildFolders(parentId: string) {
  return (await listFolders()).filter((folder) => folder.parent_id === parentId);
}

export async function getFolderAncestors(folder: ReportFolder) {
  const folders = await listFolders();
  const ancestors: ReportFolder[] = [];
  let current: ReportFolder | undefined = folder;

  while (current) {
    ancestors.unshift(current);
    current = current.parent_id
      ? folders.find((candidate) => candidate.id === current?.parent_id)
      : undefined;
  }

  return ancestors;
}

export async function getFolderHref(folder: ReportFolder) {
  const ancestors = await getFolderAncestors(folder);

  return `/folders/${ancestors.map((ancestor) => ancestor.slug).join("/")}`;
}

export async function getFolderByPath(slugs: string[]) {
  const folders = await listFolders();
  let parentId: string | null = null;
  let current: ReportFolder | undefined;

  for (const slug of slugs) {
    current = folders.find(
      (folder) => folder.slug === slug && folder.parent_id === parentId
    );

    if (!current) {
      return undefined;
    }

    parentId = current.id;
  }

  return current;
}

export async function listStaticFolderParams() {
  return Promise.all(
    (await listFolders()).map(async (folder) => ({
      slug: (await getFolderAncestors(folder)).map((ancestor) => ancestor.slug)
    }))
  );
}

async function listReportMetadataFiles(dir = reportsRoot): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        return listReportMetadataFiles(fullPath);
      }

      return entry.isFile() && entry.name.endsWith(".json") ? [fullPath] : [];
    })
  );

  return files.flat();
}

async function listReportMetadata() {
  const files = await listReportMetadataFiles();

  return Promise.all(files.map((file) => readJson<ReportMetadata>(file)));
}

export async function listStaticReportParams() {
  return (await listReportMetadata()).map((report) => ({
    id: report.id
  }));
}

export async function listReportsByFolderId(folderId: string) {
  const reports = await listReportMetadata();

  return reports
    .filter((report) => report.folder_id === folderId)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .map((report) => ({
      ...report,
      html_content: ""
    }));
}

export async function getReportById(id: string) {
  const metadata = (await listReportMetadata()).find((report) => report.id === id);

  if (!metadata) {
    return undefined;
  }

  const folder = await getFolderById(metadata.folder_id);

  if (!folder) {
    return undefined;
  }

  const reportPath = join(
    reportsRoot,
    ...(await getFolderAncestors(folder)).map((ancestor) => ancestor.slug),
    `${metadata.id}.html`
  );
  const htmlContent = await readFile(reportPath, "utf8");

  return {
    report: {
      ...metadata,
      html_content: htmlContent
    },
    folder
  };
}
