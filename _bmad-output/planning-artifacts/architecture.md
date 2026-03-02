---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - prd.md
workflowType: 'architecture'
project_name: 'polyv-skills'
user_name: 'Nick'
date: '2026-03-02'
status: 'revised'
completedAt: '2026-03-03'
revisionNote: '重构目录结构，支持多种安装方式（Claude Code 插件市场、npx skills、git submodule）'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- 配置管理（FR1-FR4）：环境变量、配置文件、参数传入三种配置方式，优先级为调用参数 > 环境变量 > 配置文件
- Skill 调用（FR5-FR8）：自然语言意图识别、参数解析、缺失参数询问
- API 集成（FR9-FR12）：MD5 签名生成、polyv API 调用、响应解析
- 错误处理（FR13-FR16）：中文友好错误、配置指引、API 错误解析
- 结果反馈（FR17-FR19）：频道信息展示、Debug 模式

**Non-Functional Requirements:**
- 安全性（NFR1-NFR4）：凭据保护、HTTPS、时间戳防重放
- 性能（NFR5-NFR6）：API < 5s，Skill 响应 < 100ms
- 集成（NFR7-NFR9）：polyv API v4 兼容、Claude Code CLI 兼容
- 可靠性（NFR10-NFR11）：网络错误处理、限流提示

**Scale & Complexity:**

- Primary domain: Developer Tool / API Toolkit
- Complexity level: Medium
- Estimated architectural components: 3-4 core components

### Technical Constraints & Dependencies

- **签名算法：** MD5 签名，参数按字典序排序，与 polyv API v4 完全兼容
- **参考实现：** polyv-cli 的 signature.ts 和 ChannelService
- **API 基础路径：** `https://api.polyv.net`
- **时间戳要求：** 毫秒级，5 分钟有效期
- **Skill 格式：** Claude Code CLI Markdown Skill 标准

### Cross-Cutting Concerns Identified

- **安全：** 签名生成逻辑、凭据安全管理、日志敏感信息过滤
- **配置：** 多源配置加载、优先级处理、配置诊断
- **错误处理：** 统一错误格式、中文本地化、用户友好的错误提示
- **日志：** Debug 模式支持、请求详情输出、敏感信息脱敏

## Starter Template Evaluation

### Primary Technology Domain

**Claude Skill 工具包** - 基于 Markdown 的 AI Agent 技能定义，使用纯 JavaScript（Node.js 18+）实现跨平台脚本，无需编译步骤

### 项目结构（参考 marketingskills 方案）

```
polyv-skills/
├── .claude-plugin/                    # Claude Code 插件配置
│   ├── marketplace.json               # 市场定义
│   └── plugin.json                    # 插件定义
│
├── skills/                            # Skills 目录（顶层）
│   └── polyv-create-channel/          # MVP: 创建频道 Skill
│       ├── SKILL.md                   # Skill 定义文件
│       └── references/                # 参考文档
│           └── api-spec.md            # API 规范
│
├── tools/                             # CLI 工具
│   ├── clis/
│   │   └── polyv.js                   # polyv CLI（纯 JS，含签名逻辑）
│   ├── integrations/
│   │   └── polyv.md                   # 集成参考文档
│   └── REGISTRY.md                    # 工具注册表
│
├── AGENTS.md                          # Agent 使用说明
├── README.md                          # 安装与使用文档
├── LICENSE                            # MIT License
├── package.json                       # npm 配置（可选）
└── config.example.json                # 配置模板
```

### Selected Approach: 纯 JavaScript（Node.js 18+）

**Rationale for Selection:**
- **零构建步骤** - 直接运行，无需 TypeScript 编译
- **跨平台兼容** - Windows/macOS/Linux 原生支持
- **多种安装方式** - 支持插件市场、npx skills、git submodule 等
- **原生 crypto** - Node.js 内置 MD5 支持
- **原生 fetch** - Node.js 18+ 内置 fetch API
- **符合规范** - 遵循 [Agent Skills spec](https://agentskills.io)

**Architectural Decisions Provided:**

**Language & Runtime:**
- JavaScript (ES2022+) + Node.js 18+
- 无需编译，直接通过 node 执行

**Build Tooling:**
- 无构建步骤
- 可选：ESLint 代码检查

**Testing Framework:**
- Node.js 内置 test runner（或 Vitest）

**Code Organization:**
- `skills/` - Skill 定义（顶层目录）
- `tools/clis/` - CLI 工具脚本
- `tools/integrations/` - 集成参考文档

**Development Experience:**
- 编辑 `.js` 文件直接生效
- `node tools/clis/polyv.js` 测试
- 多种安装方式支持

**安装方式支持:**
1. **Claude Code 插件市场**（推荐）
   ```bash
   /plugin marketplace add terryso/polyv-skills
   /plugin install polyv-skills
   ```
2. **npx skills**
   ```bash
   npx skills add terryso/polyv-skills
   ```
3. **Git Submodule**
   ```bash
   git submodule add https://github.com/terryso/polyv-skills.git .agents/polyv-skills
   ```
4. **Clone & Copy**
   ```bash
   git clone https://github.com/terryso/polyv-skills.git
   cp -r polyv-skills/skills/* .agents/skills/
   ```

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- 签名认证算法（MD5，字典序排序）
- 配置优先级策略
- API 调用方式
- 跨平台运行时选择

**Important Decisions (Shape Architecture):**
- 错误处理格式
- Debug 模式设计
- Skill 文件结构

**Deferred Decisions (Post-MVP):**
- npm 包分发
- 批量操作支持
- 更多 API 覆盖

### Data Architecture

**配置存储:**
- 格式：JSON
- 位置：`~/.polyv-skills/config.json`
- 内容：`{ "appId": "...", "appSecret": "..." }`

**无数据库需求：** Skill 文件为静态 Markdown，运行时状态由 Agent 管理

### Authentication & Security

**polyv API 签名认证:**
| 属性 | 决策 |
|------|------|
| 算法 | MD5 |
| 参数排序 | 字典序（按 key 名称排序） |
| 时间戳 | 毫秒级（13 位） |
| 有效期 | 5 分钟 |
| 传输 | HTTPS |

**签名生成流程:**
1. 收集所有请求参数
2. 按 key 字典序排序
3. 拼接为 `key1value1key2value2...` 格式
4. 追加 appSecret
5. 计算 MD5 值

**凭据管理:**
- 环境变量：`POLYV_APP_ID`, `POLYV_APP_SECRET`
- 配置文件：`~/.polyv-skills/config.json`
- 不在日志中输出 appSecret

### API & Communication Patterns

**polyv REST API:**
| 属性 | 值 |
|------|-----|
| 基础路径 | `https://api.polyv.net` |
| 请求格式 | JSON (Content-Type: application/json) |
| 响应格式 | JSON `{ code, data, error, msg }` |
| HTTP 客户端 | Node.js fetch (原生) |

**MVP API 端点:**
- `POST /live/v4/channel/create` - 创建直播频道

**请求参数（创建频道）:**
```json
{
  "appId": "xxx",
  "timestamp": 1709347200000,
  "sign": "md5_signature",
  "name": "频道名称",
  "scene": "topclass",
  "template": "ppt"
}
```

**响应格式:**
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "channelId": 3151318,
    "userId": "xxx"
  }
}
```

### Frontend Architecture

**N/A** - CLI/Skill 工具，无前端界面

### Infrastructure & Deployment

**分发方式:**

| 方式 | 命令 | 说明 |
|------|------|------|
| **Claude Code 插件市场** | `/plugin marketplace add terryso/polyv-skills`<br>`/plugin install polyv-skills` | 最便捷，自动安装 |
| **npx skills** | `npx skills add terryso/polyv-skills` | 跨 Agent 兼容 |
| **Git Submodule** | `git submodule add ... .agents/polyv-skills` | 易于更新 |
| **Clone & Copy** | `cp -r skills/* .agents/skills/` | 手动控制 |
| **SkillKit** | `npx skillkit install terryso/polyv-skills` | 多 Agent 支持 |

**安装步骤（Claude Code 插件市场）:**
1. 在 Claude Code 中执行：`/plugin marketplace add terryso/polyv-skills`
2. 执行：`/plugin install polyv-skills`
3. 配置凭据（环境变量或配置文件）

**安装步骤（Clone & Copy）:**
1. 克隆仓库：`git clone https://github.com/terryso/polyv-skills.git`
2. 复制 Skills：`cp -r polyv-skills/skills/* .agents/skills/`
3. 配置凭据

**部署要求:**
- 无服务端部署
- 用户本地环境需要：Node.js 18+（原生 fetch 支持）
- 无需 npm install（可选）

### Decision Impact Analysis

**Implementation Sequence:**
1. 创建项目结构和 `.claude-plugin/` 配置
2. 实现 `tools/clis/polyv.js` - CLI 入口（含签名、配置、API 调用）
3. 创建 `skills/polyv-create-channel/SKILL.md` - Skill 定义
4. 创建 `skills/polyv-create-channel/references/api-spec.md` - API 规范
5. 创建 `tools/integrations/polyv.md` - 集成文档
6. 创建 `tools/REGISTRY.md` - 工具注册表
7. 编写 `README.md` - 安装和使用文档
8. 编写 `AGENTS.md` - Agent 使用说明

**Cross-Component Dependencies:**
- SKILL.md 调用 `tools/clis/polyv.js`
- CLI 包含所有逻辑（签名、配置、API 调用）
- 无外部模块依赖

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 6 个 AI Agent 可能做出不同选择的区域

### Naming Patterns

**Skill 命名规范:**
| 元素 | 格式 | 示例 |
|------|------|------|
| Skill 目录 | `polyv-{action}-{resource}` | `polyv-create-channel` |
| Skill 文件 | `SKILL.md` | 固定名称 |

**JavaScript 命名规范:**
| 元素 | 格式 | 示例 |
|------|------|------|
| 文件 | `kebab-case.js` | `polyv.js` |
| 函数 | `camelCase` | `generateSignature()` |
| 常量 | `SCREAMING_SNAKE_CASE` | `API_BASE_URL` |
| 变量 | `camelCase` | `appId` |

### Structure Patterns

**项目组织:**
```
polyv-skills/
├── .claude-plugin/              # Claude Code 插件配置
│   ├── marketplace.json
│   └── plugin.json
├── skills/                      # Skill 定义（顶层目录）
│   └── polyv-{action}-{resource}/
│       ├── SKILL.md
│       └── references/
├── tools/                       # CLI 工具
│   ├── clis/
│   ├── integrations/
│   └── REGISTRY.md
└── config/                      # 配置模板（可选）
```

### Format Patterns

**错误消息格式:**
```
❌ [POLYV-{CODE}] {中文错误描述}
   提示：{解决方案}
```

**成功消息格式:**
```
✅ {操作}成功！
   {字段1}: {值1}
   {字段2}: {值2}
```

**Debug 输出格式:**
```
[DEBUG] {timestamp} {functionName}: {message}
```

**API 响应解析:**
- 成功：`code === 200`
- 失败：`code !== 200`，读取 `msg` 或 `error`

### Process Patterns

**错误处理模式:**
```javascript
function formatError(code, message, hint) {
  let output = `❌ [POLYV-${code}] ${message}`;
  if (hint) {
    output += `\n   提示：${hint}`;
  }
  return output;
}

// 使用示例
console.error(formatError('CONFIG_MISSING', '缺少 appId 配置', '请设置 POLYV_APP_ID 环境变量'));
```

**配置加载模式:**
```javascript
// 优先级：参数 > 环境变量 > 配置文件
function loadConfig(overrides = {}) {
  const config = {
    appId: overrides.appId || process.env.POLYV_APP_ID || readConfigFile()?.appId,
    appSecret: overrides.appSecret || process.env.POLYV_APP_SECRET || readConfigFile()?.appSecret,
  };
  return config;
}
```

**Debug 模式:**
```javascript
function debug(...args) {
  if (process.env.POLYV_DEBUG === 'true') {
    console.error('[DEBUG]', new Date().toISOString(), ...args);
  }
}
```

### Enforcement Guidelines

**所有 AI Agent 必须遵循:**
1. 使用纯 JavaScript（ES2022+），无需 TypeScript 编译
2. 错误消息使用中文，包含错误码和提示
3. 敏感信息（appSecret）不输出到日志
4. Debug 输出通过 `POLYV_DEBUG` 环境变量控制
5. CLI 输出使用 JSON 格式，便于 Skill 解析

**模式验证:**
- Node.js 运行时检查
- 可选：ESLint 静态分析

## Project Structure & Boundaries

### Complete Project Directory Structure

```
polyv-skills/
├── README.md                          # 安装与使用文档
├── LICENSE                            # MIT License
├── .gitignore                         # Git 忽略规则
├── package.json                       # npm 配置（可选）
│
├── .claude-plugin/                    # Claude Code 插件配置
│   ├── marketplace.json               # 市场定义
│   └── plugin.json                    # 插件定义
│
├── skills/                            # Skills 目录（顶层）
│   └── polyv-create-channel/          # MVP: 创建频道 Skill
│       ├── SKILL.md                   # Skill 定义文件
│       └── references/
│           └── api-spec.md            # API 规范
│
├── tools/
│   ├── clis/
│   │   └── polyv.js                   # polyv CLI（纯 JS）
│   ├── integrations/
│   │   └── polyv.md                   # 集成参考文档
│   └── REGISTRY.md                    # 工具注册表
│
├── AGENTS.md                          # Agent 使用说明
│
└── config/
    └── config.example.json            # 配置文件模板
```

### 插件配置文件

**`.claude-plugin/marketplace.json`:**
```json
{
  "name": "polyv-skills",
  "owner": {
    "name": "Nick"
  },
  "metadata": {
    "description": "polyv直播平台 API Skills 集合"
  },
  "plugins": [
    {
      "name": "polyv-skills",
      "source": "./",
      "description": "polyv直播平台 API 工具包 - 创建频道、管理等",
      "homepage": "https://github.com/terryso/polyv-skills",
      "license": "MIT",
      "keywords": ["polyv", "live-streaming", "api", "skills"]
    }
  ]
}
```

**`.claude-plugin/plugin.json`:**
```json
{
  "name": "polyv-skills",
  "version": "1.0.0",
  "description": "polyv直播平台 API Skills 集合",
  "skills": ["./skills/"],
  "keywords": ["polyv", "live-streaming", "api"]
}
```

### Architectural Boundaries

**API Boundaries:**
| 边界 | 说明 |
|------|------|
| External API | polyv REST API (`https://api.polyv.net`) |
| Skill Interface | Agent 通过 SKILL.md 调用 CLI |
| Script Interface | 通过 node 执行 tools/clis/polyv.js |

**Component Boundaries:**
```
┌─────────────────────────────────────────────────────────┐
│  Claude Code / Agent                                    │
│    └── 调用 SKILL.md                                    │
│          └── 执行 node tools/clis/polyv.js channel create │
│                └── polyv.js 包含所有逻辑                 │
│                      ├── 配置加载 (环境变量/文件)        │
│                      ├── MD5 签名生成                    │
│                      └── HTTP API 调用                   │
│                                                         │
│    └── 参考 references/ 文档 (按需加载)                  │
│          └── api-spec.md                                │
└─────────────────────────────────────────────────────────┘
```

**Data Boundaries:**
- 无数据库边界
- 配置数据存储在 `~/.polyv-skills/config.json`
- 运行时数据在模块间传递

### Requirements to Structure Mapping

**Feature Mapping (MVP):**
| 功能需求 | 实现位置 |
|----------|----------|
| FR1-FR4 配置管理 | `tools/clis/polyv.js` - loadConfig() |
| FR5-FR8 Skill 调用 | `skills/polyv-create-channel/SKILL.md` |
| FR9-FR12 API 集成 | `tools/clis/polyv.js` - generateSignature() + api() |
| FR13-FR16 错误处理 | `tools/clis/polyv.js` - formatError() |
| FR17-FR19 结果反馈 | `SKILL.md` 输出格式 + CLI JSON 输出 |

**Cross-Cutting Concerns:**
| 关注点 | 实现位置 |
|--------|----------|
| 安全 | `tools/clis/polyv.js`（签名 + 凭据保护）|
| 日志 | `tools/clis/polyv.js`（Debug 模式）|
| 错误 | `tools/clis/polyv.js`（统一错误格式）|

### Integration Points

**Internal Communication:**
```
SKILL.md
  │
  └── node tools/clis/polyv.js create-channel --name "xxx" --scene "topclass"
        │
        ├─ loadConfig()           # 从环境变量/配置文件加载
        │     └─ POLYV_APP_ID / POLYV_APP_SECRET
        │
        ├─ generateSignature()    # MD5 签名
        │     └─ 参数字典序排序 + 拼接 + MD5
        │
        └─ api()                  # HTTP POST 请求
              └─ fetch() + JSON 解析
```

**External Integrations:**
- polyv Live API v4 (`https://api.polyv.net/live/v4/`)

**Data Flow:**
```
用户输入 (自然语言)
    ↓
Agent 解析意图
    ↓
Skill 提取参数
    ↓
node tools/clis/polyv.js create-channel
    ↓
配置加载 → 签名生成 → API 调用
    ↓
响应解析 → JSON 输出
    ↓
Agent 格式化展示给用户
```

### File Organization Patterns

**Configuration Files:**
- `.claude-plugin/marketplace.json` - Claude Code 市场配置
- `.claude-plugin/plugin.json` - Claude Code 插件配置
- `package.json` - npm 配置（可选）
- `~/.polyv-skills/config.json` - 用户配置（运行时）

**Source Organization:**
- `skills/*/SKILL.md` - Skill 定义
- `tools/clis/*.js` - CLI 工具脚本
- 每个脚本独立，包含所需的所有逻辑

**Test Organization:**
- `tests/*.test.js` - Node.js 内置测试

### Development Workflow Integration

**Development:**
1. 编辑 `tools/clis/polyv.js`
2. 编辑 `skills/*/SKILL.md`
3. `node tools/clis/polyv.js` - 直接测试
4. `POLYV_DEBUG=true node tools/clis/polyv.js` - Debug 模式

**Build Process:**
- 无构建步骤
- 可选：`npm test` 运行测试

**Deployment:**
- **Claude Code 插件市场**: `/plugin install polyv-skills`
- **npx skills**: `npx skills add terryso/polyv-skills`
- **手动**: 复制 `skills/` 到 `.agents/skills/`

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- 纯 JavaScript + Node.js 18+ 组合无冲突
- Node.js 内置 crypto 模块支持 MD5
- Node.js 18+ 原生支持 fetch API
- JSON 配置与 JavaScript 完全兼容

**Pattern Consistency:**
- 所有命名使用统一的命名规范
- 错误格式统一（JSON 输出）
- 日志格式统一（Debug 模式）

**Structure Alignment:**
- 目录结构符合 Agent Skills 规范
- 单一 CLI 文件包含所有逻辑
- 支持多种安装方式

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
| FR | 状态 | 实现位置 |
|----|------|----------|
| FR1-FR4 | ✅ | `tools/clis/polyv.js` - loadConfig() |
| FR5-FR8 | ✅ | `skills/polyv-create-channel/SKILL.md` |
| FR9-FR12 | ✅ | `tools/clis/polyv.js` - generateSignature() + api() |
| FR13-FR16 | ✅ | `tools/clis/polyv.js` - formatError() |
| FR17-FR19 | ✅ | `SKILL.md` 输出格式 + CLI JSON 输出 |

**Non-Functional Requirements Coverage:**
| NFR | 状态 | 实现方式 |
|-----|------|----------|
| NFR1-NFR4 | ✅ | 签名 + 凭据保护 + HTTPS |
| NFR5-NFR6 | ✅ | 纯 JS 无编译，快速启动 |
| NFR7-NFR9 | ✅ | polyv API v4 兼容设计 |
| NFR10-NFR11 | ✅ | 错误处理 + 重试逻辑 |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- ✅ CLI 文件结构已定义
- ✅ 所有函数已规划
- ✅ 数据流已明确
- ✅ 错误格式已定义

**Structure Completeness:**
- ✅ 完整目录结构
- ✅ 插件配置文件已规划
- ✅ 集成点已定义

**Pattern Completeness:**
- ✅ 命名规范完整
- ✅ 错误处理模式完整
- ✅ Debug 模式完整
- ✅ 安装方式已定义

### Gap Analysis Results

**Critical Gaps:** 无

**Important Gaps:** 无

**Nice-to-Have:**
- 自动化测试覆盖 (Post-MVP)
- npm 包分发 (Post-MVP)

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
- 架构极简，无需编译步骤
- 纯 JavaScript，跨平台兼容
- 支持多种安装方式（插件市场、npx skills、submodule）
- 命名规范清晰，符合 Agent Skills 规范
- 错误处理完善，JSON 输出便于解析
- 数据流清晰，单一 CLI 文件

**Areas for Future Enhancement:**
- 添加更多 Skills (Post-MVP)
- 自动化测试覆盖 (Post-MVP)
- npm 包分发 (Post-MVP)

### Implementation Handoff

**AI Agent Guidelines:**
1. 使用纯 JavaScript（ES2022+），无需 TypeScript
2. 错误消息使用中文，JSON 输出格式
3. 不在日志中输出 appSecret
4. 所有 CLI 输出使用 JSON 格式
5. 支持 `POLYV_DEBUG` 环境变量启用调试

**First Implementation Priority:**
1. 创建项目结构和 `.gitignore`
2. `.claude-plugin/marketplace.json` - 市场定义
3. `.claude-plugin/plugin.json` - 插件定义
4. `tools/clis/polyv.js` - CLI 实现（含签名、配置、API）
5. `skills/polyv-create-channel/SKILL.md` - Skill 定义
6. `skills/polyv-create-channel/references/api-spec.md` - API 规范
7. `tools/integrations/polyv.md` - 集成文档
8. `tools/REGISTRY.md` - 工具注册表
9. `README.md` - 安装和使用文档
10. `AGENTS.md` - Agent 使用说明
11. `config.example.json` - 配置模板
