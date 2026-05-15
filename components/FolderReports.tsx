import Link from "next/link";
import type { Report, ReportFolder } from "@/types/report";
import { FolderTile } from "./FolderTile";

type FolderReportsProps = {
  folder: ReportFolder;
  childFolders: Array<{
    folder: ReportFolder;
    href: string;
  }>;
  reports: Report[];
};

export function FolderReports({
  folder,
  childFolders,
  reports
}: FolderReportsProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-8 sm:py-14">
      <header>
        <h1 className="text-balance text-5xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-7xl">
          {folder.title}
        </h1>
      </header>

      {childFolders.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {childFolders.map(({ folder: childFolder, href }) => (
            <FolderTile
              key={childFolder.id}
              folder={childFolder}
              href={href}
            />
          ))}
        </div>
      ) : null}

      <div className="grid gap-3">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={`/reports/${report.id}`}
            className="group rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_48px_rgba(15,23,42,0.065)] sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {report.category}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
                  {report.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  {report.summary}
                </p>
              </div>
              <time className="shrink-0 text-sm text-slate-400">{report.updated_at}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
