import Link from "next/link";
import type { ReportFolder } from "@/types/report";

type FolderTileProps = {
  folder: ReportFolder;
  href: string;
};

export function FolderTile({ folder, href }: FolderTileProps) {
  return (
    <article>
      <Link
        href={href}
        className="group flex min-h-44 items-end rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_48px_rgba(15,23,42,0.07)]"
      >
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
          {folder.title}
        </h2>
      </Link>
    </article>
  );
}
