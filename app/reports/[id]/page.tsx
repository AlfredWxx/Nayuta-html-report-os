import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DownloadButtons } from "@/components/DownloadButtons";
import { ReportReader } from "@/components/ReportReader";
import {
  getFolderAncestors,
  getFolderHref,
  getReportById,
  listStaticReportParams
} from "@/lib/fileReportRepository";

type ReportPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return listStaticReportParams();
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const result = await getReportById(id);

  if (!result) {
    notFound();
  }

  const { report, folder } = result;
  const folderPath = await getFolderAncestors(folder);
  const breadcrumbs = [
    { label: "Library", href: "/" },
    ...(await Promise.all(
      folderPath.map(async (ancestor) => ({
        label: ancestor.title,
        href: await getFolderHref(ancestor)
      }))
    )),
    { label: report.title }
  ];

  return (
    <AppShell breadcrumbs={breadcrumbs} topRight={<DownloadButtons />}>
      <ReportReader report={report} />
    </AppShell>
  );
}
