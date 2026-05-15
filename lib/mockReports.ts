import type { Report, ReportFolder } from "@/types/report";

export const mockFolders: ReportFolder[] = [
  {
    id: "pet-health",
    title: "Pet Health",
    slug: "pet-health",
    parent_id: null
  },
  {
    id: "pet-health-jin-zhu",
    title: "金珠",
    slug: "jin-zhu",
    parent_id: "pet-health"
  },
  {
    id: "pet-health-xi-pu",
    title: "唏噗",
    slug: "xi-pu",
    parent_id: "pet-health"
  },
  {
    id: "study-notes",
    title: "Study Notes",
    slug: "study-notes",
    parent_id: null
  },
  {
    id: "market-research",
    title: "Market Research",
    slug: "market-research",
    parent_id: null
  },
  {
    id: "project-ops",
    title: "Project Ops",
    slug: "project-ops",
    parent_id: null
  },
  {
    id: "temp",
    title: "Temp",
    slug: "temp",
    parent_id: null
  }
];

export const mockReports: Report[] = [
  {
    id: "pet-health-observation",
    folder_id: "pet-health",
    title: "Pet Health Observation Report",
    summary:
      "A calm weekly observation report covering appetite, activity, sleep quality, and follow-up care signals.",
    category: "Pet Care",
    report_type: "pet-health-report",
    updated_at: "2026-05-12",
    source_project: "personal-pet-journal",
    html_content: `
<div class="report-page" data-report-type="pet-health-report">
  <section class="report-card" data-section-id="context">
    <h2 class="report-section-title">Context</h2>
    <p>Observation window: May 6 to May 12. This memo records household observations around appetite, activity, sleep, hydration, and visible behavior changes.</p>
  </section>
  <section class="report-card" data-section-id="main-reading">
    <h2 class="report-section-title">Main Reading</h2>
    <p>Overall condition appears stable. Appetite remains predictable, evening energy is slightly higher than baseline, and sleep remained uninterrupted through most nights. No urgent warning pattern is visible from the current notes.</p>
  </section>
  <section class="report-card" data-section-id="interpretation">
    <h2 class="report-section-title">Interpretation</h2>
    <p>The week should be treated as a stable baseline rather than a change event. Mild scratching was observed twice, but the frequency is low enough that the next useful action is continued observation, not immediate routine change.</p>
  </section>
  <section class="report-card" data-section-id="supporting-evidence">
    <h2 class="report-section-title">Supporting Evidence</h2>
    <table class="report-table">
      <thead><tr><th>Signal</th><th>Status</th><th>Note</th></tr></thead>
      <tbody>
        <tr><td>Appetite</td><td>Normal</td><td>Consistent portions</td></tr>
        <tr><td>Hydration</td><td>Normal</td><td>No change required</td></tr>
        <tr><td>Skin</td><td>Watch</td><td>Low-frequency scratching</td></tr>
      </tbody>
    </table>
  </section>
  <section class="report-card" data-section-id="reading-notes">
    <h2 class="report-section-title">Reading Notes</h2>
    <div class="report-grid">
      <div class="report-note"><strong>Care note:</strong> Continue routine brushing and hydration checks.</div>
      <div class="report-note"><strong>Caveat:</strong> Household observations are not medical diagnosis.</div>
    </div>
  </section>
  <section class="report-card" data-section-id="closing">
    <h2 class="report-section-title">Closing</h2>
    <ol class="report-timeline">
      <li><strong>Next 3 days:</strong> record scratching frequency after walks.</li>
      <li><strong>Next week:</strong> compare appetite and stool notes against baseline.</li>
      <li><strong>If frequency rises:</strong> prepare notes for veterinary consultation.</li>
    </ol>
  </section>
</div>`
  },
  {
    id: "cfa-fixed-income-duration",
    folder_id: "study-notes",
    title: "CFA Fixed Income Duration Review",
    summary:
      "A structured study review of duration, convexity, curve exposure, and exam-ready fixed income concepts.",
    category: "Study",
    report_type: "cfa-study-report",
    updated_at: "2026-05-10",
    source_project: "cfa-level-ii-study",
    html_content: `
<div class="report-page" data-report-type="cfa-study-report">
  <section class="report-card" data-section-id="context">
    <h2 class="report-section-title">Context</h2>
    <p>Topic focus: effective duration, key rate duration, convexity, and yield curve scenario interpretation for CFA fixed income review.</p>
  </section>
  <section class="report-card" data-section-id="main-reading">
    <h2 class="report-section-title">Main Reading</h2>
    <p>Duration is the bridge between bond price sensitivity and rate movement. The exam emphasis is less on memorizing isolated formulas and more on selecting the right duration measure for the bond structure and curve scenario.</p>
  </section>
  <section class="report-card" data-section-id="interpretation">
    <h2 class="report-section-title">Interpretation</h2>
    <p>Modified duration is most useful for option-free bonds under small parallel shifts. Effective duration becomes the better answer when cash flows can change with rates. Key rate duration matters when the question isolates non-parallel curve exposure.</p>
  </section>
  <section class="report-card" data-section-id="supporting-evidence">
    <h2 class="report-section-title">Supporting Evidence</h2>
    <table class="report-table">
      <thead><tr><th>Measure</th><th>Use Case</th><th>Limitation</th></tr></thead>
      <tbody>
        <tr><td>Macaulay</td><td>Weighted average timing</td><td>Not direct price sensitivity</td></tr>
        <tr><td>Modified</td><td>Option-free sensitivity</td><td>Parallel shifts only</td></tr>
        <tr><td>Effective</td><td>Embedded options</td><td>Model dependent</td></tr>
      </tbody>
    </table>
  </section>
  <section class="report-card" data-section-id="reading-notes">
    <h2 class="report-section-title">Reading Notes</h2>
    <div class="report-grid">
      <div class="report-note"><strong>Exam warning:</strong> Callable bonds often show negative convexity near the call region.</div>
      <div class="report-note"><strong>Error log:</strong> Keep a separate list of mistakes caused by choosing the wrong duration measure.</div>
    </div>
  </section>
  <section class="report-card" data-section-id="closing">
    <h2 class="report-section-title">Closing</h2>
    <ol class="report-timeline">
      <li><strong>Session 1:</strong> redo duration formula drills.</li>
      <li><strong>Session 2:</strong> solve 25 curve scenario questions.</li>
      <li><strong>Session 3:</strong> review missed callable bond questions.</li>
    </ol>
  </section>
</div>`
  },
  {
    id: "frm-certification-path",
    folder_id: "study-notes",
    title: "FRM Exam and Certification Path",
    summary:
      "A richer Chinese HTML report on how to take the FRM exams and how to become an FRM-certified professional.",
    category: "Study",
    report_type: "frm-study-report",
    updated_at: "2026-05-15",
    source_project: "garp-official-research",
    html_content: `
<div class="report-page" data-report-type="frm-study-report">
  <section class="report-card" data-section-id="context">
    <h2 class="report-section-title">背景</h2>
    <p>FRM 是 GARP 的 Financial Risk Manager 认证，适合希望系统学习金融风险管理、并用国际化证书证明风险知识框架的人。取得认证不是只通过考试，还需要满足工作经验要求。</p>
    <div class="report-stat-row">
      <div class="report-stat"><span>考试部分</span><strong>2</strong></div>
      <div class="report-stat"><span>工作经验</span><strong>2 年</strong></div>
      <div class="report-stat"><span>备考参考</span><strong>240h</strong></div>
    </div>
  </section>
  <section class="report-card" data-section-id="main-reading">
    <h2 class="report-section-title">怎么考</h2>
    <blockquote class="report-quote">更稳妥的 FRM 路径是先用 Part I 建立风险管理语言和工具箱，再用 Part II 训练风险场景中的应用能力。</blockquote>
    <p>FRM 考试分为 Part I 和 Part II。Part I 有 100 道等权重多选题，Part II 有 80 道等权重多选题，每部分考试时长为四小时，并采用计算机化考试形式。GARP 页面说明考试窗口通常在每年 5 月、8 月和 11 月开放，考位先到先得。</p>
  </section>
  <section class="report-card" data-section-id="interpretation">
    <h2 class="report-section-title">路径判断</h2>
    <dl class="report-definition-list">
      <dt>Part I</dt><dd>偏基础框架，覆盖风险管理基础、数量分析、金融市场与产品、估值与风险模型。</dd>
      <dt>Part II</dt><dd>偏应用场景，覆盖市场风险、信用风险、操作风险与韧性、流动性与资金风险、投资管理风险和当前议题。</dd>
      <dt>FRM 持证</dt><dd>通过 Part II 后还需要提交至少两年相关全职工作经验；批准前不能在姓名后使用 FRM designation。</dd>
    </dl>
  </section>
  <section class="report-card" data-section-id="supporting-evidence">
    <h2 class="report-section-title">关键规则表</h2>
    <table class="report-table">
      <thead><tr><th>项目</th><th>当前规则</th><th>对备考的影响</th></tr></thead>
      <tbody>
        <tr><td>考试结构</td><td>Part I 100 题；Part II 80 题；每部分 4 小时</td><td>需要训练速度、准确率和题目耐力</td></tr>
        <tr><td>考试窗口</td><td>GARP 页面说明每年 5 月、8 月、11 月开放</td><td>适合按 4 到 6 个月安排备考周期</td></tr>
        <tr><td>Part II 时限</td><td>通过 Part I 后，需要在第四年 12 月 31 日前通过 Part II</td><td>不宜把 Part II 无限期后延</td></tr>
        <tr><td>持证经验</td><td>提交两年相关全职金融风险管理工作经验</td><td>考试通过不等于立刻成为 FRM 持证人</td></tr>
      </tbody>
    </table>
  </section>
  <section class="report-card" data-section-id="reading-notes">
    <h2 class="report-section-title">阅读笔记</h2>
    <div class="report-progress">
      <div class="report-progress-item">
        <div class="report-progress-label"><span>Part I 框架建立</span><span>第一阶段</span></div>
        <div class="report-progress-track"><span class="report-progress-bar"></span></div>
      </div>
      <div class="report-progress-item">
        <div class="report-progress-label"><span>Part II 应用训练</span><span>第二阶段</span></div>
        <div class="report-progress-track"><span class="report-progress-bar"></span></div>
      </div>
      <div class="report-progress-item">
        <div class="report-progress-label"><span>工作经验提交</span><span>认证阶段</span></div>
        <div class="report-progress-track"><span class="report-progress-bar"></span></div>
      </div>
    </div>
    <ul class="report-source-list">
      <li>GARP FRM overview：说明 FRM 项目定位、考试路径和备考投入参考。</li>
      <li>GARP program exams：说明 Part I、Part II 的题量、考试时长、考试窗口和主题覆盖。</li>
      <li>GARP exam policies：说明 Part II 时限、工作经验提交和 designation 使用限制。</li>
      <li>GARP fees and payments：说明 enrollment fee 和 early / standard registration fee。</li>
    </ul>
  </section>
  <section class="report-card" data-section-id="closing">
    <h2 class="report-section-title">行动安排</h2>
    <div class="report-risk-matrix">
      <div class="report-risk-row"><div>时间风险</div><div>中</div><div>先选目标考试窗口，再反推每周学习节奏。</div></div>
      <div class="report-risk-row"><div>经验风险</div><div>中</div><div>提前记录风险管理相关职责，避免通过考试后无法清楚提交经验。</div></div>
      <div class="report-risk-row"><div>费用风险</div><div>低</div><div>关注官方 registration deadline，尽量使用 early registration。</div></div>
    </div>
    <ol class="report-timeline">
      <li><strong>第一步：</strong>确定目标考试窗口，并以 GARP 官方日期为准。</li>
      <li><strong>第二步：</strong>用 Part I 四大主题建立知识框架。</li>
      <li><strong>第三步：</strong>Part I 通过后尽快规划 Part II，避免四年时限变成被动约束。</li>
      <li><strong>第四步：</strong>如果目标是持证，持续记录风险管理相关工作内容。</li>
    </ol>
  </section>
</div>`
  },
  {
    id: "frm-certification-path-legacy",
    folder_id: "legacy",
    title: "FRM Exam and Certification Path",
    summary:
      "A Chinese quiet memo on how to take the FRM exams and how to become an FRM-certified professional.",
    category: "Study",
    report_type: "frm-study-report",
    updated_at: "2026-05-15",
    source_project: "garp-official-research",
    html_content: `
<div class="report-page" data-report-type="frm-study-report">
  <section class="report-card" data-section-id="context">
    <h2 class="report-section-title">背景</h2>
    <p>FRM 是 GARP 的 Financial Risk Manager 认证，适合希望系统学习金融风险管理、并用一个国际化证书证明风险知识框架的人。按照 GARP 当前说明，取得认证需要通过 FRM Part I 和 Part II 两个多选题考试，并提交至少两年相关全职工作经验。</p>
  </section>
  <section class="report-card" data-section-id="main-reading">
    <h2 class="report-section-title">怎么考</h2>
    <p>FRM 考试分为两个部分。Part I 有 100 道等权重多选题，Part II 有 80 道等权重多选题，每个部分考试时长都是四小时，并通过计算机化考试形式进行。GARP 说明考试窗口通常在每年 5 月、8 月和 11 月开放，考位先到先得。Part I 主要覆盖风险管理基础、数量分析、金融市场与产品、估值与风险模型；Part II 更偏应用，覆盖市场风险、信用风险、操作风险与韧性、流动性与资金风险、投资管理中的风险管理，以及金融市场当前议题。</p>
  </section>
  <section class="report-card" data-section-id="interpretation">
    <h2 class="report-section-title">路径判断</h2>
    <p>更稳妥的路径是先把 Part I 当作风险管理语言和工具箱的建立阶段，再把 Part II 当作应用和案例阶段。GARP 要求考生在通过 Part I 后，于通过 Part I 当年的第四年 12 月 31 日前通过 Part II。通过 Part II 后，还需要在规定窗口内提交相关工作经验；在 GARP 批准之前，不能在姓名后使用 FRM designation。</p>
  </section>
  <section class="report-card" data-section-id="supporting-evidence">
    <h2 class="report-section-title">关键规则表</h2>
    <table class="report-table">
      <thead><tr><th>项目</th><th>当前规则</th><th>对备考的影响</th></tr></thead>
      <tbody>
        <tr><td>考试结构</td><td>Part I 100 题；Part II 80 题；每部分 4 小时</td><td>需要分别训练速度、准确率和题目耐力</td></tr>
        <tr><td>考试窗口</td><td>GARP 页面说明每年 5 月、8 月、11 月开放</td><td>适合按 4 到 6 个月为单位安排备考周期</td></tr>
        <tr><td>Part II 时限</td><td>通过 Part I 后，需要在第四年 12 月 31 日前通过 Part II</td><td>不宜把 Part II 无限期后延</td></tr>
        <tr><td>持证经验</td><td>提交两年相关全职金融风险管理工作经验</td><td>考试通过不等于立刻成为 FRM 持证人</td></tr>
        <tr><td>费用</td><td>新考生注册 Part I 时有一次性 enrollment fee；考试费按 early 或 standard registration 区分</td><td>应优先关注官方截止日期，避免错过早鸟窗口</td></tr>
      </tbody>
    </table>
  </section>
  <section class="report-card" data-section-id="reading-notes">
    <h2 class="report-section-title">阅读笔记</h2>
    <div class="report-grid">
      <div class="report-note"><strong>工作经验：</strong>GARP 政策页说明，经验需要是专业、全职、风险管理相关；学校期间的实习、兼职或 student teaching 不计入。</div>
      <div class="report-note"><strong>提交方式：</strong>通过 Part II 后，候选人会在 GARP 账户中提交工作经验描述；GARP 政策页要求用 4 到 5 句话说明自己在金融风险管理中的专业角色。</div>
      <div class="report-note"><strong>备考时间：</strong>GARP 概览页提到考生通常投入约 240 小时、持续数月备考；这更像最低规划单位，而不是保证通过的充分条件。</div>
      <div class="report-note"><strong>官方来源：</strong>本报告依据 GARP 的 FRM overview、program exams、exam policies、fees and payments、FAQ 页面整理，日期为 2026-05-15。</div>
    </div>
  </section>
  <section class="report-card" data-section-id="closing">
    <h2 class="report-section-title">行动安排</h2>
    <ol class="report-timeline">
      <li><strong>第一步：</strong>确定目标考试窗口，优先使用 GARP 官方 dates 和 registration deadline。</li>
      <li><strong>第二步：</strong>用 Part I 四大主题搭建知识框架，先完成基础概念、公式和产品理解。</li>
      <li><strong>第三步：</strong>Part I 通过后尽快规划 Part II，不要让四年时限变成被动约束。</li>
      <li><strong>第四步：</strong>如果目标是成为持证人，提前记录风险管理相关职责，未来提交工作经验时需要清楚描述角色和风险管理关联。</li>
    </ol>
  </section>
</div>`
  },
  {
    id: "quant-market-regime",
    folder_id: "market-research",
    title: "Quant Market Regime Report",
    summary:
      "A concise regime snapshot covering trend, volatility, breadth, and risk posture for systematic review.",
    category: "Research",
    report_type: "quant-research-report",
    updated_at: "2026-05-09",
    source_project: "market-regime-lab",
    html_content: `
<div class="report-page" data-report-type="quant-research-report">
  <section class="report-card" data-section-id="context">
    <h2 class="report-section-title">Context</h2>
    <p>Regime read: positive trend, moderate volatility compression, uneven breadth, and elevated sensitivity to macro surprises.</p>
  </section>
  <section class="report-card" data-section-id="main-reading">
    <h2 class="report-section-title">Main Reading</h2>
    <p>The current regime remains constructive but narrow. Momentum factors are leading and volatility is contained, while defensive sectors continue to lag. The main constraint is breadth quality rather than headline trend direction.</p>
  </section>
  <section class="report-card" data-section-id="interpretation">
    <h2 class="report-section-title">Interpretation</h2>
    <p>This is a risk-on environment with fragility. Trend exposure can remain in place, but breadth divergence should prevent aggressive leverage expansion until participation becomes more convincing.</p>
  </section>
  <section class="report-card" data-section-id="supporting-evidence">
    <h2 class="report-section-title">Supporting Evidence</h2>
    <table class="report-table">
      <thead><tr><th>Signal</th><th>Reading</th><th>Interpretation</th></tr></thead>
      <tbody>
        <tr><td>Momentum</td><td>Positive</td><td>Supports long bias</td></tr>
        <tr><td>Volatility</td><td>Compressed</td><td>Watch for reversal shocks</td></tr>
        <tr><td>Breadth</td><td>Mixed</td><td>Limit leverage</td></tr>
      </tbody>
    </table>
  </section>
  <section class="report-card" data-section-id="reading-notes">
    <h2 class="report-section-title">Reading Notes</h2>
    <div class="report-grid">
      <div class="report-note"><strong>Portfolio note:</strong> Maintain trend exposure but avoid increasing gross exposure until breadth confirms.</div>
      <div class="report-note"><strong>Caveat:</strong> Mock values are illustrative and not investment advice.</div>
    </div>
  </section>
  <section class="report-card" data-section-id="closing">
    <h2 class="report-section-title">Closing</h2>
    <ol class="report-timeline">
      <li><strong>Daily:</strong> monitor breadth confirmation and volatility expansion.</li>
      <li><strong>Weekly:</strong> rerun regime classifier and compare signal drift.</li>
      <li><strong>Trigger:</strong> reduce exposure if trend score falls below 55.</li>
    </ol>
  </section>
</div>`
  },
  {
    id: "project-weekly-summary",
    folder_id: "project-ops",
    title: "Project Weekly Summary",
    summary:
      "A polished weekly operating summary for priorities, decisions, delivery status, and next actions.",
    category: "Operations",
    report_type: "general-report",
    updated_at: "2026-05-08",
    source_project: "personal-ops",
    html_content: `
<div class="report-page" data-report-type="general-report">
  <section class="report-card" data-section-id="context">
    <h2 class="report-section-title">Context</h2>
    <p>Reporting period: May 1 to May 8. Focus areas include product direction, implementation readiness, documentation quality, and operating cadence.</p>
  </section>
  <section class="report-card" data-section-id="main-reading">
    <h2 class="report-section-title">Main Reading</h2>
    <p>The project advanced from planning into prototype execution. Scope discipline remains strong: the current phase focuses on static visual validation before data integration or publish workflows.</p>
  </section>
  <section class="report-card" data-section-id="interpretation">
    <h2 class="report-section-title">Interpretation</h2>
    <p>The strongest product decision is to protect the read-only experience. Premature dashboard features, search/filter complexity, or frontend editing controls would dilute the report OS before the reading layer is stable.</p>
  </section>
  <section class="report-card" data-section-id="supporting-evidence">
    <h2 class="report-section-title">Supporting Evidence</h2>
    <table class="report-table">
      <thead><tr><th>Area</th><th>Status</th><th>Comment</th></tr></thead>
      <tbody>
        <tr><td>Library</td><td>Prototype</td><td>Report shelf only</td></tr>
        <tr><td>Reader</td><td>Prototype</td><td>Consulting report layout</td></tr>
        <tr><td>Downloads</td><td>Reserved</td><td>Visual buttons only</td></tr>
      </tbody>
    </table>
  </section>
  <section class="report-card" data-section-id="reading-notes">
    <h2 class="report-section-title">Reading Notes</h2>
    <div class="report-grid">
      <div class="report-note"><strong>Operating principle:</strong> Validate the reading experience before adding management workflows.</div>
      <div class="report-note"><strong>Boundary:</strong> No frontend editing surface is included in this phase.</div>
    </div>
  </section>
  <section class="report-card" data-section-id="closing">
    <h2 class="report-section-title">Closing</h2>
    <ol class="report-timeline">
      <li><strong>Phase 1:</strong> confirm visual direction.</li>
      <li><strong>Phase 2:</strong> define data model and storage integration.</li>
      <li><strong>Phase 3:</strong> add publish and download workflows.</li>
    </ol>
  </section>
</div>`
  },
  {
    id: "temp-minimal-research-memo",
    folder_id: "temp",
    title: "Template A - Quiet Memo",
    summary:
      "A quiet memo-first template for long reading, with fewer modules and a stronger prose rhythm.",
    category: "Template",
    report_type: "minimal-research-memo",
    updated_at: "2026-05-15",
    source_project: "temp-template-preview",
    html_content: `
<div class="report-page" data-report-type="minimal-research-memo">
  <section class="report-card" data-section-id="context">
    <h2 class="report-section-title">Context</h2>
    <p>This template is designed for reports that should feel like a private research memo. The structure is intentionally restrained: fewer visual modules, longer paragraphs, and a strong reading sequence from context to interpretation.</p>
  </section>
  <section class="report-card" data-section-id="main-reading">
    <h2 class="report-section-title">Main Reading</h2>
    <p>The memo format works best when the report needs to preserve reasoning, not just conclusions. It gives the reader enough space to understand how the conclusion was reached, without turning the page into a dashboard.</p>
  </section>
  <section class="report-card" data-section-id="interpretation">
    <h2 class="report-section-title">Interpretation</h2>
    <p>The key design choice is that supporting evidence remains secondary. Notes and tables are available, but they do not dominate the screen. This makes the template suitable for saved reports that may be reread months later.</p>
  </section>
  <section class="report-card" data-section-id="supporting-evidence">
    <h2 class="report-section-title">Supporting Evidence</h2>
    <table class="report-table">
      <thead><tr><th>Design Choice</th><th>Effect</th><th>Use Case</th></tr></thead>
      <tbody>
        <tr><td>Longer prose</td><td>Preserves reasoning</td><td>Research notes</td></tr>
        <tr><td>Fewer modules</td><td>Reduces visual noise</td><td>Long reading</td></tr>
        <tr><td>Quiet notes</td><td>Separates caveats</td><td>Personal archive</td></tr>
      </tbody>
    </table>
  </section>
  <section class="report-card" data-section-id="reading-notes">
    <h2 class="report-section-title">Reading Notes</h2>
    <div class="report-grid">
      <div class="report-note"><strong>Best for:</strong> long-form research, pet health observations, study summaries, and reflective weekly reviews.</div>
      <div class="report-note"><strong>Tradeoff:</strong> less immediately scannable than a consulting brief, but calmer for repeated reading.</div>
    </div>
  </section>
  <section class="report-card" data-section-id="closing">
    <h2 class="report-section-title">Closing</h2>
    <ol class="report-timeline">
      <li><strong>Confirm:</strong> Use this direction as the default report style if long reading comfort matters most.</li>
      <li><strong>Decide:</strong> Keep this direction if long reading comfort matters more than instant scanning.</li>
    </ol>
  </section>
</div>`
  }
];

export function getReportById(id: string) {
  return mockReports.find((report) => report.id === id);
}

export function getFolderById(id: string) {
  return mockFolders.find((folder) => folder.id === id);
}

export function getReportsByFolderId(folderId: string) {
  return mockReports.filter((report) => report.folder_id === folderId);
}

export function getRootFolders() {
  return mockFolders.filter((folder) => folder.parent_id === null);
}

export function getChildFolders(parentId: string) {
  return mockFolders.filter((folder) => folder.parent_id === parentId);
}

export function getFolderAncestors(folder: ReportFolder) {
  const ancestors: ReportFolder[] = [];
  let current: ReportFolder | undefined = folder;

  while (current) {
    ancestors.unshift(current);
    current = current.parent_id ? getFolderById(current.parent_id) : undefined;
  }

  return ancestors;
}

export function getFolderPathSegments(folder: ReportFolder) {
  return getFolderAncestors(folder).map((ancestor) => ancestor.slug);
}

export function getFolderHref(folder: ReportFolder) {
  return `/folders/${getFolderPathSegments(folder).join("/")}`;
}

export function getFolderByPath(slugs: string[]) {
  let parentId: string | null = null;
  let current: ReportFolder | undefined;

  for (const slug of slugs) {
    current = mockFolders.find(
      (folder) => folder.slug === slug && folder.parent_id === parentId
    );

    if (!current) {
      return undefined;
    }

    parentId = current.id;
  }

  return current;
}
