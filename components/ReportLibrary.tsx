import type { ReportFolder } from "@/types/report";
import { FolderTile } from "./FolderTile";

type ReportLibraryProps = {
  folders: Array<{
    folder: ReportFolder;
    href: string;
  }>;
};

export function ReportLibrary({ folders }: ReportLibraryProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 py-10 sm:py-16">
      <header>
        <h1 className="text-balance text-5xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-7xl">
          Personal HTML Report OS
        </h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {folders.map(({ folder, href }) => (
            <FolderTile key={folder.id} folder={folder} href={href} />
          ))}
      </div>
    </section>
  );
}
