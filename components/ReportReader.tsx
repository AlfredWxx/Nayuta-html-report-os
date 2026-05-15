import type { Report } from "@/types/report";
import { extractReportToc } from "@/lib/reportToc";
import { ReportMetadata } from "./ReportMetadata";
import { ReportTableOfContents } from "./ReportTableOfContents";

type ReportReaderProps = {
  report: Report;
};

export function ReportReader({ report }: ReportReaderProps) {
  const tocItems = extractReportToc(report.html_content);

  return (
    <article className="report-shell">
      <div className="report-reader">
        <div className="report-reader-layout">
          <ReportTableOfContents items={tocItems} />

          <div className="report-reader-main">
            <header className="report-cover">
              <div className="report-cover-top">
                <div>
                  <h1 className="report-title">{report.title}</h1>
                  <p className="report-subtitle">{report.summary}</p>
                </div>
              </div>
              <ReportMetadata report={report} />
            </header>

            <div
              className="report-body"
              dangerouslySetInnerHTML={{ __html: report.html_content }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
