# ModelCred · 模型可信度指数

公开、社区共治的大模型信誉分站点。

- **首页**：厂商榜 + 按 Cloud 分组的模型榜 + 重大事故 + 最新吐槽
- **模型详情页**：信誉分、30 天趋势、评分分布、相关事故、评价
- **评分 API**：无需打开网页即可通过 CLI / Skill 提交评分
- **双主题**：Light（PostHog 风格）/ Dark（Linear 风格）

## 本地启动

```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

打开 http://localhost:3000。

## 评分 API

启动站点后，可通过 HTTP 提交评分：

```bash
curl -X POST http://localhost:3000/api/ratings \
  -H "Content-Type: application/json" \
  -d '{
    "modelSlug": "gpt-4o",
    "score": 4,
    "tags": ["回答准确", "幻觉"],
    "comment": "整体不错，但引用偶尔造假"
  }'
```

字段说明：
- `modelSlug`：模型 slug（必填）
- `score`：1-5 整数（必填）
- `tags`：标签数组（可选），可选值见 `app/api/ratings/route.ts`
- `comment`：公开显示的评价（可选，最多 1000 字）

查询可用模型：

```bash
curl -s http://localhost:3000/api/models
```

## 配套 Skill：model-credibility-rater

让其他人在日常使用 AI 时无需打开网站就能快速评分。

### 隐私原则

- **不读取任何对话内容**：只提交用户主动确认的模型、星级、标签和可选评价。
- **不自动抓取数据**：不提取 prompt/response、代码、个人信息。
- **评价默认留空**：用户自己决定是否写公开评价。

### 安装到 Kimi Code CLI

```bash
cp -r .agents/skills/model-credibility-rater ~/.agents/skills/
```

然后在任务完成后调用：

```
/skill model-credibility-rater
```

### 独立 CLI 使用

```bash
cd .agents/skills/model-credibility-rater

# 先设置默认模型和站点（可选）
export MODEL_CREDIBILITY_MODEL=gpt-4o
export MODEL_CREDIBILITY_API=http://localhost:3000
export PYTHONIOENCODING=utf-8

python scripts/rate.py
```

Windows CMD：

```cmd
set MODEL_CREDIBILITY_MODEL=gpt-4o
set MODEL_CREDIBILITY_API=http://localhost:3000
set PYTHONIOENCODING=utf-8
python scripts\rate.py
```

## 技术栈

- Next.js 15 + React 18 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Prisma 6 + SQLite
- next-themes（双主题）

## 数据与算法

- 评分按时间衰减加权，半衰期 138 天。
- 厂商榜与模型榜独立计分。
- 事故、评价分别展示，不混入评分计算。
