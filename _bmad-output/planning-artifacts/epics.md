---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - prd.md
  - architecture.md
status: complete
completedAt: '2026-03-03'
---

# polyv-skills - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for polyv-skills, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**配置管理 (FR1-FR4):**
- FR1: 用户可以通过环境变量配置 polyv 凭据（POLYV_APP_ID, POLYV_APP_SECRET）
- FR2: 用户可以通过配置文件配置 polyv 凭据（~/.polyv-skills/config.json）
- FR3: 用户可以在调用 skill 时通过参数传入凭据
- FR4: 系统按优先级加载配置：调用参数 > 环境变量 > 配置文件

**Skill 调用 (FR5-FR8):**
- FR5: 用户可以通过自然语言描述创建直播频道的需求
- FR6: Agent 可以识别用户意图并调用正确的 polyv skill
- FR7: Skill 可以解析用户提供的频道参数（名称、场景类型、模板类型）
- FR8: Skill 可以对缺失的必填参数向用户询问

**API 集成 (FR9-FR12):**
- FR9: Skill 可以使用配置的凭据生成有效的 polyv API 签名
- FR10: Skill 可以调用 polyv 创建频道 API（POST /live/v4/channel/create）
- FR11: Skill 可以正确解析 polyv API 的成功响应
- FR12: Skill 可以正确解析 polyv API 的错误响应

**错误处理 (FR13-FR16):**
- FR13: 用户可以收到清晰的中文错误信息
- FR14: 用户在凭据缺失时收到配置指引
- FR15: 用户在 API 调用失败时收到可理解的错误原因
- FR16: 用户在参数错误时收到参数修正建议

**结果反馈 (FR17-FR19):**
- FR17: 用户可以在频道创建成功后看到频道 ID
- FR18: 用户可以在频道创建成功后看到频道基本信息
- FR19: 用户可以选择在 debug 模式下查看详细的 API 请求信息

### NonFunctional Requirements

**安全性 (NFR1-NFR4):**
- NFR1: appSecret 不在任何日志或输出中明文显示
- NFR2: 配置文件建议设置 600 权限（仅所有者可读写）
- NFR3: 签名使用 HTTPS 传输
- NFR4: 时间戳有效期 5 分钟，防止重放攻击

**性能 (NFR5-NFR6):**
- NFR5: API 调用响应时间 < 5 秒（正常网络条件下）
- NFR6: Skill 响应时间 < 100ms（不含 API 调用）

**集成 (NFR7-NFR9):**
- NFR7: 兼容 polyv Live API v4 签名规范
- NFR8: 兼容 Claude Code CLI skill 格式
- NFR9: 支持任意支持 markdown skill 格式的 Agent

**可靠性 (NFR10-NFR11):**
- NFR10: 网络错误时返回清晰的错误信息，不崩溃
- NFR11: API 限流时返回友好的等待提示

### Additional Requirements

**来自架构文档:**
- 使用纯 JavaScript（ES2022+）+ Node.js 18+，无需编译
- MD5 签名算法，参数按字典序排序，与 polyv API v4 完全兼容
- 支持多种安装方式：Claude Code 插件市场、npx skills、git submodule、Clone & Copy
- CLI 输出使用 JSON 格式，便于 Skill 解析
- 错误消息格式：`❌ [POLYV-{CODE}] {中文错误描述}`
- 项目结构：`skills/` 目录放 Skill 定义，`tools/clis/` 放 CLI 工具
- 配置存储：`~/.polyv-skills/config.json`
- Debug 模式：通过 `POLYV_DEBUG` 环境变量控制

### FR Coverage Map

| FR | Epic | 简要描述 |
|----|------|----------|
| FR1 | Epic 1 | 环境变量配置 |
| FR2 | Epic 1 | 配置文件配置 |
| FR3 | Epic 1 | 参数传入配置 |
| FR4 | Epic 1 | 配置优先级加载 |
| FR5 | Epic 2 | 自然语言描述需求 |
| FR6 | Epic 2 | 意图识别 |
| FR7 | Epic 2 | 参数解析 |
| FR8 | Epic 2 | 缺失参数询问 |
| FR9 | Epic 2 | 签名生成 |
| FR10 | Epic 2 | API 调用 |
| FR11 | Epic 2 | 成功响应解析 |
| FR12 | Epic 2 | 错误响应解析 |
| FR13 | Epic 2 | 中文错误信息 |
| FR14 | Epic 2 | 凭据缺失指引 |
| FR15 | Epic 2 | API 错误解释 |
| FR16 | Epic 2 | 参数错误建议 |
| FR17 | Epic 2 | 显示频道 ID |
| FR18 | Epic 2 | 显示频道信息 |
| FR19 | Epic 2 | Debug 模式 |

## Epic List

### Epic 1: 项目基础与配置

用户可以安装 polyv-skills 并配置 polyv API 凭据，为后续使用 Skill 做好准备。

**FRs covered:** FR1, FR2, FR3, FR4
**NFRs covered:** NFR7, NFR8, NFR9

### Epic 2: 创建频道 Skill

用户可以通过自然语言创建 polyv 直播频道，获得频道 ID 和基本信息，并在出错时收到清晰的中文错误提示。

**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19
**NFRs covered:** NFR1, NFR2, NFR3, NFR4, NFR5, NFR6, NFR10, NFR11

---

## Epic 1: 项目基础与配置

用户可以安装 polyv-skills 并配置 polyv API 凭据，为后续使用 Skill 做好准备。

### Story 1.1: 创建项目结构和插件配置

As a polyv-skills 开发者,
I want 创建标准的项目结构和 Claude Code 插件配置文件,
So that 项目可以通过多种方式安装和使用。

**Acceptance Criteria:**

**Given** 一个空的项目目录
**When** 创建项目结构
**Then** 生成以下目录和文件：
- `.claude-plugin/marketplace.json` - Claude Code 市场定义
- `.claude-plugin/plugin.json` - Claude Code 插件定义
- `skills/` - Skills 目录
- `tools/clis/` - CLI 工具目录
- `tools/integrations/` - 集成文档目录
- `tools/REGISTRY.md` - 工具注册表
- `README.md` - 安装和使用文档
- `AGENTS.md` - Agent 使用说明
- `.gitignore` - Git 忽略规则
- `LICENSE` - MIT License
- `config/config.example.json` - 配置模板

**And** `marketplace.json` 包含正确的插件元数据
**And** `plugin.json` 正确指向 `./skills/` 目录

### Story 1.2: 实现配置加载功能

As a polyv-skills 用户,
I want 通过环境变量或配置文件设置 polyv 凭据,
So that 我可以灵活地配置工具而无需每次输入凭据。

**Acceptance Criteria:**

**Given** 用户需要配置 polyv API 凭据
**When** 使用配置加载功能
**Then** 支持以下配置方式：
- 环境变量：`POLYV_APP_ID`, `POLYV_APP_SECRET`
- 配置文件：`~/.polyv-skills/config.json`
- 参数传入：命令行参数覆盖

**Given** 用户同时设置了多种配置方式
**When** 加载配置
**Then** 按优先级加载：参数 > 环境变量 > 配置文件

**Given** 用户未配置任何凭据
**When** 调用需要凭据的功能
**Then** 返回清晰的中文错误信息，提示如何配置

---

## Epic 2: 创建频道 Skill

用户可以通过自然语言创建 polyv 直播频道，获得频道 ID 和基本信息，并在出错时收到清晰的中文错误提示。

### Story 2.1: 实现 polyv CLI 核心（签名和 API 调用）

As a polyv-skills 开发者,
I want 实现签名生成和 API 调用的核心逻辑,
So that 可以与 polyv API 进行安全通信。

**Acceptance Criteria:**

**Given** 有效的 appId 和 appSecret
**When** 调用签名生成函数
**Then** 生成与 polyv API v4 兼容的 MD5 签名
- 参数按字典序排序
- 拼接格式：`key1value1key2value2...`
- 追加 appSecret 后计算 MD5

**Given** 有效的签名和参数
**When** 调用 polyv 创建频道 API
**Then** 发送 POST 请求到 `https://api.polyv.net/live/v4/channel/create`
- Content-Type: application/json
- 请求体包含 appId, timestamp, sign, name, scene, template

**Given** API 返回成功响应
**When** 解析响应
**Then** 提取 channelId 和 userId

**Given** API 返回错误响应
**When** 解析响应
**Then** 提取错误码和错误信息

**And** appSecret 不在任何日志中明文显示 (NFR1)
**And** 使用 HTTPS 传输 (NFR3)
**And** 时间戳为毫秒级，5 分钟有效期 (NFR4)

### Story 2.2: 创建 polyv-create-channel Skill 定义

As a polyv-skills 用户,
I want 通过自然语言创建直播频道,
So that 无需记忆复杂的 CLI 命令即可完成操作。

**Acceptance Criteria:**

**Given** 已安装 polyv-skills 并配置凭据
**When** 用户说"帮我创建一个直播频道叫'产品发布会'"
**Then** Agent 调用 `polyv-create-channel` Skill
- 自动解析频道名称
- 使用默认场景类型（topclass）
- 使用默认模板类型（ppt）

**Given** 用户提供了完整的参数
**When** Agent 调用 Skill
**Then** Skill 解析以下参数：
- name: 频道名称
- scene: 场景类型（topclass | cloudclass | telecast | akt）
- template: 模板类型（ppt | video）

**Given** 用户未提供必填参数
**When** Agent 调用 Skill
**Then** Agent 向用户询问缺失的参数

**Given** Skill 调用成功
**When** 返回结果
**Then** 显示频道 ID 和基本信息

### Story 2.3: 实现错误处理和 Debug 模式

As a polyv-skills 用户,
I want 在出错时收到清晰的中文错误提示,
So that 我可以快速定位和解决问题。

**Acceptance Criteria:**

**Given** 用户凭据缺失
**When** 调用 Skill
**Then** 返回错误信息：
```
❌ [POLYV-CONFIG_MISSING] 缺少 appId 配置
   提示：请设置 POLYV_APP_ID 环境变量，或创建配置文件 ~/.polyv-skills/config.json
```

**Given** API 调用失败
**When** 收到错误响应
**Then** 返回中文错误信息和解决建议

**Given** 网络错误
**When** 请求超时或失败
**Then** 返回清晰的错误信息，程序不崩溃 (NFR10)

**Given** 用户设置了 `POLYV_DEBUG=true`
**When** 执行任何操作
**Then** 输出详细的调试信息：
- 请求 URL
- 请求参数（脱敏 appSecret）
- 响应内容

**Given** API 限流
**When** 收到限流响应
**Then** 返回友好的等待提示 (NFR11)
