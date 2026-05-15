import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { FolderReports } from "@/components/FolderReports";
import {
  getFolderAncestors,
  getFolderByPath,
  getFolderHref,
  listChildFolders,
  listReportsByFolderId,
  listStaticFolderParams
} from "@/lib/fileReportRepository";

type FolderPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export function generateStaticParams() {
  return listStaticFolderParams();
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { slug } = await params;
  const folder = await getFolderByPath(slug);

  if (!folder) {
    notFound();
  }

  const ancestors = await getFolderAncestors(folder);
  const breadcrumbs = [
    { label: "Library", href: "/" },
    ...(await Promise.all(
      ancestors.map(async (ancestor) => ({
        label: ancestor.title,
        href: ancestor.id === folder.id ? undefined : await getFolderHref(ancestor)
      }))
    ))
  ];
  const childFolders = await Promise.all(
    (await listChildFolders(folder.id)).map(async (childFolder) => ({
      folder: childFolder,
      href: await getFolderHref(childFolder)
    }))
  );

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      <FolderReports
        folder={folder}
        childFolders={childFolders}
        reports={await listReportsByFolderId(folder.id)}
      />
    </AppShell>
  );
}
