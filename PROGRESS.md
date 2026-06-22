# ModelCred 项目进度存档

> 存档时间：2026-06-22  
> 当前分支：`master`  
> 最新提交：`27f8fa5 fix: provider 404 and rating form submission`

---

## 一、项目目标

公开的大模型"信誉分"站点：允许每个人评分、按时间计算可信度、记录典型事故案例、允许吐槽。配套一个 Skill，让用户在日常使用 AI 时就能直接打分。

---

## 二、已完成

### 核心网站
- [x] Next.js 15.5 + React 18 + TypeScript + Tailwind CSS v4 + shadcn/ui
- [x] 双主题：PostHog light / Linear dark
- [x] 厂商榜（独立计算，两层结构）
- [x] Cloud 分级模型榜：Cloud 为一级标题，下挂 Fable / Opus / Sonnet 等模型
- [x] 典型事故案例展示
- [x] 吐槽/评价列表
- [x] 时间衰减信誉分算法（半衰期 138 天）
- [x] 模型详情页：分数、趋势、分布、事故、评价、评分入口
- [x] 评分 API：`POST /api/ratings`

### Skill
- [x] `.agents/skills/model-credibility-rater/` 已创建
- [x] 事后评分 + 事中问责提示两种模式
- [x] 触发机制参考 OpenPUA 扩展：显式触发 + 7 类隐式异常信号
- [x] L1-L3 问责提示升级规则
- [x] 隐私原则：不读取对话内容，只提交用户主动确认的信息
- [x] 提交脚本 `scripts/rate.py`

### 理论依据
- [x] 首页理论依据组件 `components/research-section.tsx`
- [x] 已替换为直接研究 LLM evaluation awareness / test awareness 的论文
  - Abdelnabi & Salem (2025) *The Hawthorne Effect in Reasoning Models*
  - Needham et al. (2025) *Large Language Models Often Know When They Are Being Evaluated*
  - Covas & Hidalgo Toledo (2026) *AI Knows When It's Being Watched*
  - Salecha et al. (2024) *Large Language Models Display Human-like Social Desirability Biases*

### 数据锚定（区块链替代方案）
- [x] 方案 A：GitHub Commit 锚定
- [x] 本地快照脚本 `npm run snapshot` → `scripts/snapshot.ts`
- [x] GitHub Action `.github/workflows/snapshot.yml` 每天自动 seed + snapshot + commit
- [x] 页脚显示当前数据锚定的 commit hash
- [x] 快照目录 `data/snapshots/`

---

## 三、待决策 / 待执行

### 1. 真实评分数据
**状态**：当前 Neon 数据库里仍是 `prisma/seed.ts` 生成的 **Demo 数据**，不是真实用户评分。  
**建议方案**：
- **保留 Demo 数据**：线上展示效果更好，适合参赛 Demo；同时开启真实评分入口，让自然流量逐步替换
- 清空从零开始：数据更干净，但首页会显得空旷
- 手动录入几条真实评分作为起点：需要额外准备真实案例

**当前选择**：保留 Demo 数据，等待真实用户评分自然积累。

### 2. 部署上线
**状态**：✅ 已部署到 Vercel，数据库使用 Neon PostgreSQL。  
**线上地址**：https://model-credibility.vercel.app（主域名）  
**最近一次部署**：commit `27f8fa5`，状态 `success`。

**后续可选**：
- 绑定自定义域名 `assemblyofgodkissimmee.asia` 的二级域名
- 配置 Vercel Analytics / Speed Insights

### 3. 域名绑定
**状态**：待决策。用户持有 `assemblyofgodkissimmee.asia`，可考虑绑定二级域名如 `credibility.assemblyofgodkissimmee.asia`。  
**待确认**：
- 域名 DNS 管理后台是哪家？
- 希望用哪个二级域名？
- 原网页当前托管在哪里，是否需要保留？

### 4. 数据库持久化（长期）
**状态**：✅ 已迁移到 Neon PostgreSQL。  
- 应用连接串使用带连接池的 `DATABASE_URL`
- 迁移/直连使用 `DIRECT_URL`
- 本地开发仍可用 `.env` 指向同一 Neon 数据库，或切换回 SQLite 做独立测试

---

## 四、技术栈

- 框架：Next.js 15.5.19（App Router）
- 语言：TypeScript 5
- 样式：Tailwind CSS v4 + shadcn/ui
- ORM：Prisma 6.19.3
- 数据库：PostgreSQL（Neon）
- 部署：Vercel
- 包管理：npm
- 仓库：https://github.com/Singapo/model-credibility

---

## 五、常用命令

```bash
# 本地开发
cd model-credibility
npm run dev

# 重新生成数据库并填充 seed 数据
npx prisma migrate dev
npx prisma db seed

# 手动生成数据快照
npm run snapshot

# 提交快照锚定
git add data/snapshots/
git commit -m "chore: anchor real rating snapshot"
git push
```

---

## 六、最近提交

```
27f8fa5 fix: provider 404 and rating form submission
d367951 feat: migrate from SQLite to PostgreSQL for Vercel deployment
fe7de96 docs: add PROGRESS.md with current status and pending decisions
c70e99a feat: github commit anchoring for free data snapshots
7b6001d fix: use LLM evaluation-awareness literature as theoretical basis
c1ad7ae fix: replace research citations with accountability/reputation literature; expand skill triggers inspired by OpenPUA
c60b739 feat: add accountability prompt mode and research citations
9eeedb3 feat: add rating API and model-credibility-rater skill
6689b3a feat: initial model credibility site with dual themes
```

---

## 七、注意事项

- 数据库已迁移到 **Neon PostgreSQL**，`prisma/dev.db` 不再使用，但仍在 `.gitignore` 中作为本地备份。
- GitHub Action 每天自动生成的快照基于 **Demo 数据**，不是真实评分。
- 要锚定真实评分，需要：
  1. 线上积累足够真实评分后，本地运行 `npm run snapshot` 生成真实数据快照
  2. `git add data/snapshots/` 并 push
  3. 或把 workflow 改成从线上 `/api/snapshot` 拉取
