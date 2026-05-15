import type { Report } from "@/types/report";

type ReportMetadataProps = {
  report: Report;
};

export function ReportMetadata({ report }: ReportMetadataProps) {
  const metadata = [
    ["Category", report.category],
    ["Report Type", report.report_type],
    ["Updated", report.updated_at],
    ["Source", report.source_project]
  ];

  return (
    <dl className="report-meta">
      {metadata.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
