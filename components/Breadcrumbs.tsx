import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  fixed?: boolean;
};

export function Breadcrumbs({ items, fixed = false }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={[
        "flex flex-wrap items-center gap-2 text-sm",
        fixed
          ? "rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur"
          : "mb-6"
      ].join(" ")}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span className="text-slate-300">/</span> : null}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-medium text-slate-500 transition hover:text-slate-950"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-slate-950">{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
