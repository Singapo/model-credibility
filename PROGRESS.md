# ModelCred 项目进度存档

> 存档时间：2026-06-15  
> 当前分支：`master`  
> 最新提交：`c70e99a feat: github commit anchoring for free data snapshots`

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
**状态**：当前数据库里仍是 `prisma/seed.ts` 生成的测试评分，不是真实用户评分。  
**可选方案**：
- A. 保留测试数据，等部署上线后自然积累真实评分
- B. 清掉测试评分/吐槽，从零开始
- C. 用户手动录入几条真实评分作为起点

### 2. 部署上线
**状态**：Vercel 账号申诉中，需等待 24 小时，暂时无法使用。  
**可选替代方案**：
- A. **Netlify**（最像 Vercel，免费，今天可用）+ SQLite 提交到仓库
  - 问题：serverless 容器不持久，线上评分可能在重新部署后丢失
- B. **GitHub Pages**（纯静态导出）
  - 问题：评分功能失效，只能展示
- C. **Render / Railway / Fly.io**
  - 问题：免费额度有限，长期可能收费，配置更麻烦

**用户决策记录**：用户表示"先这样"，下次再说。

### 3. 域名绑定
**状态**：用户持有 `assemblyofgodkissimmee.asia`，希望 AI 信誉榜能放到该域名下并保留原网页。  
**待确认**：
- 域名注册商/ DNS 管理后台是哪家？
- 希望用哪个二级域名？（如 `credibility.assemblyofgodkissimmee.asia`）
- 原网页当前托管在哪里？

### 4. 数据库持久化（长期）
**状态**：目前 SQLite 文件 `.gitignore` 排除，真实数据只存在本地。  
**长期建议**：
- 如果继续用 serverless 部署，建议迁移到 PostgreSQL（如 Neon 免费版）
- 如果用 Fly.io / Railway，可保留 SQLite 并加持久化卷

---

## 四、技术栈

- 框架：Next.js 15.5.19（App Router）
- 语言：TypeScript 5
- 样式：Tailwind CSS v4 + shadcn/ui
- ORM：Prisma 6.19.3
- 数据库：SQLite（本地）
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
c70e99a feat: github commit anchoring for free data snapshots
7b6001d fix: use LLM evaluation-awareness literature as theoretical basis
c1ad7ae fix: replace research citations with accountability/reputation literature; expand skill triggers inspired by OpenPUA
c60b739 feat: add accountability prompt mode and research citations
9eeedb3 feat: add rating API and model-credibility-rater skill
6689b3a feat: initial model credibility site with dual themes
```

---

## 七、注意事项

- 当前 `prisma/dev.db` 仍在 `.gitignore` 中，未提交到 GitHub。
- GitHub Action 每天自动生成的快照基于 **seed 测试数据**，不是真实评分。
- 要锚定真实评分，需要：
  1. 本地运行 `npm run snapshot` 生成真实数据快照
  2. `git add data/snapshots/` 并 push
  3. 或部署上线后把 workflow 改成从线上 `/api/snapshot` 拉取
