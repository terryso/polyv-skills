---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments: []
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
workflowType: 'prd'
classification:
  projectType: developer_tool
  domain: media_streaming
  complexity: medium
  projectContext: greenfield
  productName: polyv-skills
  apiStrategy: selective
---

# Product Requirements Document - polyv-skills

**Author:** Nick
**Date:** 2026-03-02

## Executive Summary

**polyv-skills** 是一套 Claude Skill 工具包，让 AI Agent 能够通过自然语言直接调用 polyv 直播云 API。用户无需编写代码或记忆 CLI 命令，只需用自然语言描述需求（如"帮我创建一个直播频道"），Agent 即可自动完成 API 调用。

**目标用户：** polyv 客户（拥有 appId/appSecret 的用户）

**解决的核心问题：** 降低 polyv API 的使用门槛。现有方案（手动编码或 CLI）需要技术背景，而 polyv-skills 让非技术用户也能通过 AI Agent 操作直播服务。

### What Makes This Special

| 维度 | 传统方式 | polyv-skills |
|------|----------|--------------|
| **交互方式** | 命令行/代码 | 自然语言 |
| **学习成本** | 需要阅读 API 文档 | 无需文档，描述需求即可 |
| **适用平台** | 单一 CLI | 任何支持 Skill 的 Agent（Claude Code、openclaw 等） |
| **配置方式** | 每次手动设置 | 环境变量/配置文件，一次配置到处使用 |

**核心洞察：** AI Agent 技术的成熟使得"用自然语言操作 API"成为可能。polyv 客户已有 API 凭据，缺的是更低门槛的操作方式。

## Project Classification

| 属性 | 值 | 说明 |
|------|-----|------|
| **项目类型** | developer_tool | SDK/工具包 |
| **领域** | media_streaming | 直播云服务 |
| **复杂度** | medium | 需理解签名认证、Skill 规范 |
| **项目背景** | greenfield | 全新项目，参考 polyv-cli |
| **API 策略** | selective | 按业务需求挑选，非全覆盖 |
| **MVP 范围** | 创建频道 | 验证流程可行性 |

## Success Criteria

### User Success

| 成功时刻 | 描述 |
|----------|------|
| **首次调用成功** | 用户配置好凭据后，第一次用自然语言创建频道成功 |
| **零文档使用** | 用户无需阅读 API 文档即可完成操作 |
| **跨平台体验** | 用户在 Claude Code 或 openclaw 上获得一致体验 |

**用户的 "Aha!" 时刻：** 说一句话，直播频道就创建好了。

### Business Success

| 指标 | MVP 目标 | 增长期目标 |
|------|----------|-----------|
| **可用 Skills 数量** | 1（创建频道） | 10+ |
| **用户采用率** | 自己能用 | polyv 客户主动使用 |
| **API 覆盖率** | <1% | 按需逐步扩展 |

### Technical Success

| 要求 | 标准 |
|------|------|
| **认证正确性** | MD5 签名与 polyv API 完全兼容 |
| **错误处理** | 清晰的错误信息，用户能理解问题所在 |
| **配置灵活** | 环境变量/配置文件/参数传入三种方式都支持 |
| **跨平台兼容** | 至少支持 Claude Code CLI 和 openclaw |

### Measurable Outcomes

**MVP 验证标准：**
- [ ] 用户能通过自然语言成功创建一个 polyv 直播频道
- [ ] 创建的频道能在 polyv 控制台正确显示
- [ ] 错误情况下返回可理解的错误信息

## Product Scope

### MVP - Minimum Viable Product

**目标：** 验证"自然语言 → API 调用"流程可行性

| 功能 | 描述 |
|------|------|
| 单一 Skill | 创建直播频道 |
| 认证支持 | appId/appSecret 签名认证 |
| 配置管理 | 环境变量 + 配置文件 |
| 错误处理 | 基础错误信息返回 |

### Growth Features (Post-MVP)

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 频道管理 Skills | P1 | 列表、详情、更新、删除 |
| 流控制 Skills | P1 | 开始/停止直播、推流密钥 |
| 批量操作 | P2 | 批量创建、批量删除 |
| 更多 API 覆盖 | P3 | 按用户需求逐步添加 |

### Vision (Future)

- **完整 API 覆盖：** 覆盖 polyv 所有适合 Skill 化的 API
- **智能推荐：** Agent 根据上下文主动推荐使用哪个 Skill
- **工作流编排：** 多个 Skill 组合完成复杂业务流程

## User Journeys

### Journey 1: 直播运营人员 - 首次使用

**主角：** 小李，某教育公司的直播运营，负责每周创建多场直播课程。

**背景故事：**
小李每天都要在 polyv 控制台手动创建直播频道。她知道有 API 可以自动化，但不会写代码。公司也没有开发资源帮她做这个。

**旅程开始：**
> 周一早上，小李又要创建这周的5场直播。她叹了口气，打开浏览器，登录 polyv 控制台...

**转折点：**
> 同事告诉她："你试试 Claude Code，装个 polyv-skills，直接跟它说就行了。"

**使用 polyv-skills：**
```
小李: "帮我创建一个直播频道，叫'Python入门第3课'，场景是三分屏"
Agent: "好的，正在创建... 频道创建成功！频道ID: 3151318"
小李: "太神奇了！"
```

**旅程结束：**
> 小李5分钟完成了原本需要30分钟的工作。她开始思考还能用 Agent 帮她做什么...

**揭示的能力需求：** 自然语言解析、参数映射、API 调用、结果反馈

---

### Journey 2: 开发者 - 调试配置问题

**主角：** 阿明，某创业公司的全栈开发，需要集成 polyv 直播功能。

**背景故事：**
阿明正在开发一个在线教育平台，需要调用 polyv API。他写了个脚本但总是报签名错误，已经调试了2小时。

**旅程开始：**
> 阿明看着控制台的"签名验证失败"错误，决定试试 polyv-skills 看看正确的调用是什么样的。

**使用 polyv-skills：**
```
阿明: "创建一个测试频道"
Agent: "配置错误：未找到 POLYV_APP_ID 环境变量。请设置环境变量或创建配置文件 ~/.polyv-skills/config.json"
阿明: "哦，原来我环境变量名写错了"
```

**解决问题：**
> 阿明修正了环境变量配置，再次尝试，频道创建成功。他对比了自己的签名代码，找到了问题所在。

**揭示的能力需求：** 清晰的错误信息、配置诊断、多配置源支持

---

### Journey 3: 产品经理 - 快速验证想法

**主角：** Sarah，某 SaaS 公司的产品经理，想快速验证直播功能。

**背景故事：**
Sarah 想在产品里加入直播功能，但不确定 polyv 是否满足需求。她不想等开发排期，想自己先试试。

**旅程开始：**
> Sarah 打开 Claude Code，用自然语言探索 polyv 的能力。

**使用 polyv-skills：**
```
Sarah: "polyv 能创建什么类型的直播频道？"
Agent: [解释场景类型: topclass, cloudclass, telecast, akt]
Sarah: "创建一个 cloudclass 类型的频道试试"
Agent: "创建成功！频道ID: 3151320"
```

**旅程结束：**
> Sarah 10分钟内完成了功能验证，决定在产品路线图中加入直播功能。

**揭示的能力需求：** 能力查询、快速验证、低门槛试用

---

### Journey Requirements Summary

| 用户类型 | 核心需求 | 关键能力 |
|----------|----------|----------|
| **直播运营** | 快速创建频道、批量操作 | 自然语言解析、参数映射 |
| **开发者** | 调试、配置管理 | 清晰错误信息、配置诊断 |
| **产品经理** | 快速验证、能力探索 | 能力查询、低门槛使用 |

**共同需求：**
1. 灵活的配置方式（环境变量/配置文件）
2. 清晰的错误信息
3. 自然的交互方式
4. 快速反馈

## Domain-Specific Requirements

**领域：** Media/Streaming API 工具

**复杂度评估：** Medium（API 签名认证需要精确实现）

### API 兼容性

| 要求 | 说明 |
|------|------|
| **签名算法** | 必须与 polyv API 的 MD5 签名完全兼容 |
| **参数顺序** | 签名计算时参数按字典序排序 |
| **时间戳** | 毫秒级时间戳，5分钟内有效 |
| **错误码** | 需正确解析 polyv API 返回的错误码 |

### 安全考虑

| 风险 | 缓解措施 |
|------|----------|
| **凭据泄露** | 不在日志中输出 appSecret |
| **签名重放** | 使用时间戳防止重放攻击 |
| **配置安全** | 配置文件权限建议设为 600 |

### 技术约束

- **参考实现：** polyv-cli 的 ChannelService 和签名工具
- **API 基础路径：** `https://api.polyv.net`
- **请求格式：** JSON
- **响应格式：** JSON（含 code, data, error 字段）

## Developer Tool Specific Requirements

### 项目类型概述

**类型：** Developer Tool (SDK/库/工具包)

**核心交付物：** Claude Skill 定义文件，让 AI Agent 能够调用 polyv API

### Language & Runtime Support

| 方面 | 决策 |
|------|------|
| **Skill 定义语言** | Markdown（Claude Skill 标准） |
| **运行环境** | Claude Code CLI / openclaw / 任何支持 Skill 的 Agent |
| **依赖** | 无额外依赖（Skill 自描述） |

### Installation Methods

```
优先级：
1. 复制到项目的 .claude/skills/ 目录（Claude Code）
2. 配置 Agent 的 skills 路径（其他 Agent）
```

**安装步骤：**
1. 克隆或下载 polyv-skills 仓库
2. 将所需 skill 文件复制到 Agent 的 skills 目录
3. 配置 polyv 凭据（环境变量或配置文件）

### API Surface

**MVP Skill 列表：**

| Skill 名称 | 描述 | polyv API |
|-----------|------|-----------|
| `polyv-create-channel` | 创建直播频道 | POST /live/v4/channel/create |

**Skill 接口设计：**

```yaml
# polyv-create-channel skill
name: polyv-create-channel
description: 创建 polyv 直播频道
parameters:
  - name: 频道名称
    description: 直播频道的名称
    required: true
  - name: 场景类型
    description: topclass | cloudclass | telecast | akt
    required: true
  - name: 模板类型
    description: ppt | video
    required: true
```

### Code Examples

**使用示例（Claude Code）：**

```
用户: 帮我创建一个直播频道叫"产品发布会"，用三分屏场景

Agent: [调用 polyv-create-channel skill]
→ 频道创建成功！
  - 频道ID: 3151318
  - 频道名称: 产品发布会
  - 场景: topclass
```

**配置示例：**

```bash
# 环境变量方式
export POLYV_APP_ID="your_app_id"
export POLYV_APP_SECRET="your_app_secret"

# 或配置文件 ~/.polyv-skills/config.json
{
  "appId": "your_app_id",
  "appSecret": "your_app_secret"
}
```

### Documentation Requirements

| 文档类型 | 内容 |
|----------|------|
| **README** | 安装、配置、快速开始 |
| **Skill 参考** | 每个 skill 的参数说明 |
| **故障排除** | 常见错误及解决方案 |

### Implementation Considerations

| 方面 | 建议 |
|------|------|
| **签名实现** | 参考 polyv-cli 的 signature.ts |
| **错误处理** | 返回用户友好的中文错误信息 |
| **日志** | 支持 debug 模式输出详细请求信息 |
| **测试** | 使用 polyv 的测试账号进行集成测试 |

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP 类型：** 问题解决型 MVP（验证核心假设）

**核心假设：** 用户愿意用自然语言而非 CLI/API 来操作 polyv 服务

**资源需求：** 1 人，约 1-2 周完成 MVP

**验证标准：**
- 用户能成功通过自然语言创建频道
- 创建的频道在 polyv 控制台正确显示

### MVP Feature Set (Phase 1)

**核心用户旅程支持：** Journey 1（直播运营首次使用）

**Must-Have 功能：**

| 功能 | 优先级 | 说明 |
|------|--------|------|
| `polyv-create-channel` skill | P0 | 单一 skill，验证流程 |
| 环境变量配置 | P0 | POLYV_APP_ID, POLYV_APP_SECRET |
| 配置文件支持 | P1 | ~/.polyv-skills/config.json |
| 错误信息 | P0 | 中文友好错误 |
| 基础文档 | P1 | README + 使用示例 |

**明确排除（MVP 不做）：**
- ❌ 多 skill 支持
- ❌ 批量操作
- ❌ Web 界面
- ❌ 自动化测试框架

### Post-MVP Features

**Phase 2 (验证后扩展)：**

| 功能 | 优先级 | 依赖 |
|------|--------|------|
| 频道列表 skill | P1 | MVP 验证 |
| 频道详情 skill | P1 | MVP 验证 |
| 更新频道 skill | P1 | MVP 验证 |
| 删除频道 skill | P1 | MVP 验证 |
| 流控制 skills | P2 | 频道 skills 完成 |

**Phase 3 (规模化)：**

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 批量操作 skills | P3 | 高级用户需求 |
| 更多 API 覆盖 | P3 | 按用户反馈添加 |
| 其他 Agent 兼容性测试 | P2 | openclaw 等 |

### Risk Mitigation Strategy

| 风险类型 | 风险 | 缓解措施 |
|----------|------|----------|
| **技术** | 签名算法不兼容 | 直接复用 polyv-cli 的 signature.ts |
| **技术** | Agent 兼容性问题 | 优先支持 Claude Code，逐步扩展 |
| **资源** | 时间超出预期 | MVP 只做 1 个 skill，范围最小化 |
| **市场** | 用户不需要 | 快速验证，2周内出结果 |

## Functional Requirements

### 配置管理

- **FR1:** 用户可以通过环境变量配置 polyv 凭据（POLYV_APP_ID, POLYV_APP_SECRET）
- **FR2:** 用户可以通过配置文件配置 polyv 凭据（~/.polyv-skills/config.json）
- **FR3:** 用户可以在调用 skill 时通过参数传入凭据
- **FR4:** 系统按优先级加载配置：调用参数 > 环境变量 > 配置文件

### Skill 调用

- **FR5:** 用户可以通过自然语言描述创建直播频道的需求
- **FR6:** Agent 可以识别用户意图并调用正确的 polyv skill
- **FR7:** Skill 可以解析用户提供的频道参数（名称、场景类型、模板类型）
- **FR8:** Skill 可以对缺失的必填参数向用户询问

### API 集成

- **FR9:** Skill 可以使用配置的凭据生成有效的 polyv API 签名
- **FR10:** Skill 可以调用 polyv 创建频道 API（POST /live/v4/channel/create）
- **FR11:** Skill 可以正确解析 polyv API 的成功响应
- **FR12:** Skill 可以正确解析 polyv API 的错误响应

### 错误处理

- **FR13:** 用户可以收到清晰的中文错误信息
- **FR14:** 用户在凭据缺失时收到配置指引
- **FR15:** 用户在 API 调用失败时收到可理解的错误原因
- **FR16:** 用户在参数错误时收到参数修正建议

### 结果反馈

- **FR17:** 用户可以在频道创建成功后看到频道 ID
- **FR18:** 用户可以在频道创建成功后看到频道基本信息
- **FR19:** 用户可以选择在 debug 模式下查看详细的 API 请求信息

## Non-Functional Requirements

### Security

| NFR | 描述 |
|-----|------|
| **NFR1** | appSecret 不在任何日志或输出中明文显示 |
| **NFR2** | 配置文件建议设置 600 权限（仅所有者可读写） |
| **NFR3** | 签名使用 HTTPS 传输 |
| **NFR4** | 时间戳有效期 5 分钟，防止重放攻击 |

### Performance

| NFR | 描述 |
|-----|------|
| **NFR5** | API 调用响应时间 < 5 秒（正常网络条件下） |
| **NFR6** | Skill 响应时间 < 100ms（不含 API 调用） |

### Integration

| NFR | 描述 |
|-----|------|
| **NFR7** | 兼容 polyv Live API v4 签名规范 |
| **NFR8** | 兼容 Claude Code CLI skill 格式 |
| **NFR9** | 支持任意支持 markdown skill 格式的 Agent |

### Reliability

| NFR | 描述 |
|-----|------|
| **NFR10** | 网络错误时返回清晰的错误信息，不崩溃 |
| **NFR11** | API 限流时返回友好的等待提示 |
