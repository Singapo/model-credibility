---
name: model-credibility-rater
description: 在 AI 任务完成后，快速给使用的模型提交信誉分评分。当用户说"给这个模型打分"、"记录评价"、"评分"、"吐槽一下这个模型"，或在一次对话/任务结束后明显适合反馈模型表现时触发。只收集用户主动确认的模型、星级、标签和可选评价，不读取任何对话内容。
---

# ModelCred 模型信誉分评分器

帮助用户在日常使用 AI 的过程中，把模型表现快速记录到 ModelCred（公开的大模型信誉分站点），无需打开网页手动点击。

## 隐私原则（必须遵守）

1. **不读取对话内容**：不要主动读取当前或历史对话的 prompt/response。
2. **不自动抓取数据**：不提取代码片段、文件内容、用户身份等任何隐私信息。
3. **只提交用户主动提供的信息**：模型标识、星级、标签、可选的一句评价。
4. **可选评价默认留空**：如果用户不想写，就不写；如果写，要提醒用户这句话会公开显示。

## 触发时机

- 用户明确说："给这个模型打个分"、"记录一下这次体验"、"我要评分/吐槽"。
- 完成一个较长或关键任务后，用户提到模型表现（好或坏），可以主动提议评分。
- **不要**在每次普通对话后都弹窗打扰。
- **不要**在涉及敏感个人数据（医疗、法律、财务凭证等）的任务后主动询问评分。

## 使用流程

### 1. 确认站点地址

默认使用本地站点 `http://localhost:3000`。如果用户已部署到线上，通过环境变量覆盖：

```bash
export MODEL_CREDIBILITY_API=https://model-cred.example.com
```

### 2. 选择模型

优先读取环境变量 `MODEL_CREDIBILITY_MODEL`（例如 `gpt-4o`、`doubao-pro`）。

如果没有设置，调用站点接口获取模型列表：

```bash
curl -s $MODEL_CREDIBILITY_API/api/models
```

然后让用户选择编号或 slug。

### 3. 收集评分

交互式询问（不可跳过）：
- 星级：1-5，5 为最好
- 标签（多选）：幻觉、引用造假、回答准确、创意好、收费争议、不安全内容、速度慢、客服/退款、其他
- 评价（可选）：一句公开显示的吐槽或称赞，最多 1000 字

### 4. 提交

使用 `scripts/rate.py` 一键提交：

```bash
python /path/to/model-credibility-rater/scripts/rate.py
```

或者直接用 curl：

```bash
curl -X POST $MODEL_CREDIBILITY_API/api/ratings \
  -H "Content-Type: application/json" \
  -d '{
    "modelSlug": "gpt-4o",
    "score": 4,
    "tags": ["回答准确", "幻觉"],
    "comment": "整体不错，但论文引用偶尔造假"
  }'
```

### 5. 反馈结果

提交成功后告诉用户："评分已提交，感谢贡献"，并说明分数会按时间衰减算法计入模型信誉分。

## 给 Kimi Code CLI 用户

把这个 skill 复制到 skills 目录：

```bash
cp -r /path/to/model-credibility/.agents/skills/model-credibility-rater \
  ~/.agents/skills/
```

之后可以通过 `/skill model-credibility-rater` 调用。

## 给其他工具/IDE 用户

直接运行脚本即可，不依赖 Kimi Code CLI：

```bash
cd /path/to/model-credibility/.agents/skills/model-credibility-rater
python scripts/rate.py
```

Windows 终端若出现中文乱码，先设置编码：

```cmd
set PYTHONIOENCODING=utf-8
python scripts\rate.py
```

或 Git Bash：

```bash
export PYTHONIOENCODING=utf-8
python scripts/rate.py
```

也可以在 shell 配置文件里加 alias：

```bash
alias rate-model="PYTHONIOENCODING=utf-8 python /path/to/model-credibility-rater/scripts/rate.py"
```

## 故障排查

- 如果提示无法连接，确认 ModelCred 站点已启动（`npm run dev` 或线上地址）。
- 如果模型 slug 不存在，接口会返回 404，让用户从列表里重新选择。
- 评分数据写入后，首页和模型详情页会自动重新计算分数。
