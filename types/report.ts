export type ReportFolder = {
  id: string;
  title: string;
  slug: string;
  parent_id: string | null;
};

export type Report = {
  id: string;
  folder_id: string;
  title: string;
  summary: string;
  category: string;
  report_type: string;
  updated_at: string;
  source_project: string;
  html_content: string;
};
