import type { BreadcrumbItem } from "./Breadcrumbs";
import { Breadcrumbs } from "./Breadcrumbs";

type AppShellProps = {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  topRight?: React.ReactNode;
};

export function AppShell({ children, breadcrumbs, topRight }: AppShellProps) {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-10">
      {breadcrumbs ? (
        <div className="fixed left-5 top-5 z-50 max-w-[calc(100vw-2.5rem)] sm:left-8 lg:left-10">
          <Breadcrumbs items={breadcrumbs} fixed />
        </div>
      ) : null}
      {topRight ? (
        <div className="fixed right-5 top-5 z-50 sm:right-8 lg:right-10">{topRight}</div>
      ) : null}
      <div className={breadcrumbs ? "pt-12" : undefined}>{children}</div>
    </main>
  );
}
