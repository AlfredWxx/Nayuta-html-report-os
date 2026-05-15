import { AppShell } from "@/components/AppShell";
import { ReportLibrary } from "@/components/ReportLibrary";
import { getFolderHref, listRootFolders } from "@/lib/fileReportRepository";

export default async function Home() {
  const folders = await Promise.all(
    (await listRootFolders()).map(async (folder) => ({
      folder,
      href: await getFolderHref(folder)
    }))
  );

  return (
    <AppShell>
      <ReportLibrary folders={folders} />
    </AppShell>
  );
}
