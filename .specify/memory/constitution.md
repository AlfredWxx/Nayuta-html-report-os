# A股小助手 Constitution

## Core Principles

### I. Point-in-Time Data Integrity

所有研究、信号、回测和每日运行必须明确数据可得时间。任何模型、因子、过滤器、调仓规则或指标计算都不得使用决策时点之后才可获得的数据。数据表必须保留可审计的日期字段、主键、覆盖区间、缺失值状态和更新来源。

### II. Layered Data Architecture

数据层必须分层：raw/staging/canonical/derived/output 的职责不能混淆。外部 provider 拉取的数据先进入 staging，经 schema、主键、缺失、断档、跨源一致性和业务规则审计后，才能进入 canonical。模型和回测默认只读取 canonical 或明确版本化的 derived 数据。

### III. Single Backtest Engine

项目必须只有一个 canonical 回测主引擎。新模型应该创建单独的模型定义、参数、信号或回测入口文件，然后调用主引擎执行回测；不得为每个模型复制一套私有回测引擎。引擎负责统一处理成交价格、手续费、滑点、涨跌停、停牌、T+1、持仓、现金、指标和导出。

### IV. Model Isolation and Reproducibility

每个模型必须有独立目录、配置、入口、文档和输出位置。模型代码不得隐式依赖其他模型的临时文件、历史输出或 notebook 状态。任意重要回测结果必须能通过版本化配置、固定数据范围和可记录命令复现。

### V. Audit Before Optimization

迁移阶段优先保证正确性、可解释性、可复现性和可维护性。除非阻塞核心运行，否则不在迁移中引入大规模重构、性能优化或新策略开发。任何架构债、数据债和模型改进都进入 follow-up backlog。

## Quant Correctness Requirements

- 回测信号日、入场日、出场日、成交价格和数据可得时间必须可追踪。
- 因子、过滤器、北向资金、年度止损、排名、标准化和滚动统计必须证明没有 forward looking。
- 训练/验证/回测区间必须明确隔离；不得用全样本统计量污染历史决策。
- 交易约束必须符合 A 股/ETF 语境，包括 T+1、涨跌停、停牌、手续费、滑点、可交易日和无法成交情形。
- 指标计算必须统一，不得在不同模型中各自实现互不一致的收益、回撤、Sharpe 或胜率算法。
- 数据更新必须支持 staging、audit、commit/rollback 或等价安全流程。
- 数据缺失、重复、断档、异常值、跨源冲突必须被分类记录，不得静默填补后直接进入核心回测。

## Architecture Requirements

- `src/data` 是唯一 canonical 数据访问层。
- `src/backtest` 是唯一 canonical 回测引擎层。
- `src/signals` 只产生信号，不负责投资组合记账。
- `src/strategy` 定义模型决策逻辑，不复制回测引擎。
- `models/<model_name>` 只保存模型配置、入口、说明和模型专属适配，不保存重复底层框架。
- `scripts/` 可以提供命令行入口，但不得绕过 canonical 数据层和回测主引擎。
- `app/` 只消费结果和状态，不直接实现研究、信号或回测逻辑。

## Governance

本 constitution 高于本次迁移任务中的便利性选择。若发现现有代码违反原则，迁移阶段必须至少记录、分类并决定：立即修复、迁移后修复、或明确排除。任何立即修复必须服务于核心 Model X、数据层、回测主引擎或新项目独立运行。

**Version**: 1.0.0 | **Ratified**: 2026-05-17 | **Last Amended**: 2026-05-17
