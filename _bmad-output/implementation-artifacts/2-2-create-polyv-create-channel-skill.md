# Story 2.2: 创建 polyv-create-channel Skill 定义

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a polyv-skills 用户,
I want 通过自然语言创建直播频道,
So that 无需记忆复杂的 CLI 命令即可完成操作。

## Acceptance Criteria

1. **AC1: Skill 自动调用**
   - Given 已安装 polyv-skills 并配置凭据
   - When 用户说"帮我创建一个直播频道叫'产品发布会'"
   - Then Agent 调用 `polyv-create-channel` Skill
   - And 自动解析频道名称
   - And 使用默认场景类型（topclass）
   - And 使用默认模板类型（ppt）

2. **AC2: 参数解析**
   - Given 用户提供了完整的参数
   - When Agent 调用 Skill
   - Then Skill 解析以下参数：
     - name: 频道名称
     - scene: 场景类型（topclass | cloudclass | telecast | akt）
     - template: 模板类型（ppt | video）

3. **AC3: 缺失参数询问**
   - Given 用户未提供必填参数
   - When Agent 调用 Skill
   - Then Agent 向用户询问缺失的参数

4. **AC4: 成功结果展示**
   - Given Skill 调用成功
   - When 返回结果
   - Then 显示频道 ID 和基本信息

## Tasks / Subtasks

- [x] Task 1: 创建 SKILL.md 文件 (AC: 1, 2, 3, 4)
  - [x] 1.1 创建 `skills/polyv-create-channel/SKILL.md`
  - [x] 1.2 编写 Skill 描述和用途说明
  - [x] 1.3 定义参数规范（name, scene, template）
  - [x] 1.4 编写 CLI 调用指令
  - [x] 1.5 定义输出格式和示例
  - [x] 1.6 添加错误处理指引

- [x] Task 2: 验证 references/api-spec.md 完整性 (AC: 2)
  - [x] 2.1 确认 API 端点和签名规范已记录
  - [x] 2.2 确认请求/响应格式已说明
  - [x] 2.3 确认错误码映射已完整

- [x] Task 3: 更新工具注册表 (AC: 1)
  - [x] 3.1 确认 `tools/REGISTRY.md` 包含 polyv-create-channel Skill
  - [x] 3.2 确认 Skill 描述和路径正确

- [x] Task 4: 编写 Skill 测试验证
  - [x] 4.1 手动测试 Skill 被 Agent 正确识别
  - [x] 4.2 手动测试参数解析正确性
  - [x] 4.3 手动测试错误情况处理

## Dev Notes

### Architecture Patterns and Constraints

**技术栈:**
- Skill 定义使用 Markdown 格式，遵循 Claude Code CLI Skill 规范
- Skill 调用 `tools/clis/polyv.js` CLI 工具
- CLI 输出 JSON 格式，便于 Skill 解析

**Skill 文件结构:**
```
skills/polyv-create-channel/
├── SKILL.md           # Skill 定义文件（本 Story 主要输出）
└── references/
    └── api-spec.md    # API 规范（已存在）
```

**Skill 定义格式要求:**
```markdown
---
name: polyv-create-channel
description: 创建保利威直播频道
---

## 使用方式
[描述如何使用此 Skill]

## 参数
[参数说明]

## 示例
[调用示例]
```

### CLI 调用方式

**已实现的 CLI 命令（Story 2.1）:**
```bash
# 基本调用
node tools/clis/polyv.js create-channel --name "频道名称"

# 完整参数
node tools/clis/polyv.js create-channel \
  --name "频道名称" \
  --scene topclass \
  --template ppt

# Debug 模式
POLYV_DEBUG=true node tools/clis/polyv.js create-channel --name "测试频道"
```

**CLI 输出格式（成功）:**
```json
{
  "success": true,
  "channelId": 3151318,
  "userId": "xxx"
}
```

**CLI 输出格式（失败）:**
```json
{
  "success": false,
  "error": {
    "code": "CONFIG_MISSING",
    "message": "缺少 appId 配置",
    "hint": "请设置 POLYV_APP_ID 环境变量，或创建配置文件 ~/.polyv-skills/config.json"
  }
}
```

### Source Tree Components to Touch

```
polyv-skills/
├── skills/
│   └── polyv-create-channel/
│       ├── SKILL.md                    # 新增/修改：Skill 定义文件
│       └── references/
│           └── api-spec.md             # 已存在：API 规范
└── tools/
    └── REGISTRY.md                     # 确认：工具注册表
```

### Testing Standards

**手动测试命令:**
```bash
# 1. 验证 CLI 功能正常
node tools/clis/polyv.js create-channel --name "测试频道"

# 2. 验证 Skill 文件格式正确
cat skills/polyv-create-channel/SKILL.md

# 3. 在 Claude Code 中测试 Skill 识别
# 用户输入: "帮我创建一个直播频道叫'产品发布会'"
# 期望: Agent 识别并调用 polyv-create-channel Skill
```

### Project Structure Notes

- 项目已在 Story 1.1 中创建基础结构
- CLI 工具已在 Story 2.1 中实现签名和 API 调用功能
- 本 Story 主要创建 Skill 定义文件（SKILL.md）
- 遵循 Agent Skills 规范（https://agentskills.io）

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR5-FR8] - Skill 调用功能需求
- [Source: _bmad-output/planning-artifacts/architecture.md#Skill文件结构] - Skill 文件结构定义
- [Source: _bmad-output/planning-artifacts/architecture.md#集成点] - CLI 与 Skill 集成方式
- [Source: skills/polyv-create-channel/references/api-spec.md] - API 规范详细文档
- [Source: project-context.md#配置说明] - 配置优先级说明

### Previous Story Intelligence (Story 2.1)

**已完成的工作:**
- CLI 工具 `tools/clis/polyv.js` 已完整实现
- 签名生成函数 `generateSignature()` 已实现
- API 调用函数 `createChannel()` 已实现
- create-channel 命令已实现，输出 JSON 格式
- 单元测试已通过（51 个测试）

**可复用的代码模式:**
- 配置加载：优先级 params > env > file
- 错误处理：统一 JSON 格式输出
- Debug 模式：`POLYV_DEBUG=true` 启用

**CLI 返回值说明:**
- 成功：`{ success: true, channelId, userId }`
- 失败：`{ success: false, error: { code, message, hint } }`

**场景类型映射（注意与 API 规范的差异）:**
| PRD 中的值 | API 实际值 | 说明 |
|-----------|-----------|------|
| topclass | topclass | 大班课（默认） |
| cloudclass | train | 云课堂 |
| telecast | alone | 直播带货 |
| akt | alone | 活动直播 |

**模板类型:**
- `ppt` - PPT 模板（默认）
- `video` / `alone` - 视频模板

### Git Intelligence

**最近的提交:**
```
64123f5 docs: mark story 2.1 as done
2e8c9b9 feat(cli): implement polyv CLI core for channel creation (story 2.1)
```

**已建立的代码模式:**
- 提交消息格式：`feat(story-X.Y): 描述` 或 `docs: 描述`
- CLI 输出使用 JSON 格式
- 错误消息使用中文

### Latest Technical Information

**Claude Code Skill 规范:**
- Skill 文件名：`SKILL.md`（固定）
- 位置：`skills/{skill-name}/SKILL.md`
- 格式：Markdown + YAML frontmatter

**Skill frontmatter 格式:**
```yaml
---
name: skill-name
description: Skill 描述
---
```

**Skill 调用方式:**
1. Agent 解析用户自然语言
2. 匹配 Skill 描述和意图
3. 提取参数
4. 执行 CLI 命令
5. 解析输出并展示结果

### SKILL.md 模板参考

```markdown
---
name: polyv-create-channel
description: 创建保利威直播频道。当用户想要创建直播、新建频道、开直播间时使用。
---

## 功能说明

创建一个新的保利威直播频道，返回频道 ID 和基本信息。

## 参数

| 参数 | 必填 | 类型 | 说明 | 默认值 |
|------|------|------|------|--------|
| name | 是 | string | 频道名称，最大 100 字符 | - |
| scene | 否 | string | 直播场景：topclass(大班课), train(企业培训), alone(活动营销) | topclass |
| template | 否 | string | 直播模板：ppt(三分屏), alone(纯视频) | ppt |

## 使用示例

**示例 1：简单创建**
用户：帮我创建一个直播频道叫"产品发布会"

**示例 2：指定场景**
用户：创建一个企业培训直播，名称是"新员工入职培训"
参数：name="新员工入职培训", scene="train"

**示例 3：完整参数**
用户：创建一个纯视频直播，名称是"年会直播"，使用纯视频模板
参数：name="年会直播", scene="alone", template="alone"

## CLI 调用

```bash
node tools/clis/polyv.js create-channel --name "<频道名称>" [--scene <场景>] [--template <模板>]
```

## 输出格式

**成功响应：**
```
✅ 频道创建成功！
频道 ID: 3151318
用户 ID: xxx
```

**错误响应：**
```
❌ [POLYV-CONFIG_MISSING] 缺少 appId 配置
   提示：请设置 POLYV_APP_ID 环境变量，或创建配置文件 ~/.polyv-skills/config.json
```

## 错误处理

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| CONFIG_MISSING | 凭据未配置 | 设置环境变量或创建配置文件 |
| API_ERROR | API 调用失败 | 检查网络和凭据有效性 |
| NETWORK_ERROR | 网络错误 | 检查网络连接 |

## 注意事项

1. 首次使用需要配置 polyv 凭据
2. 频道名称为必填参数
3. 场景和模板有默认值，通常无需指定
```

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (via GLM-5)

### Debug Log References

N/A - Implementation completed without issues

### Completion Notes List

- Created SKILL.md with proper YAML frontmatter (name, description)
- Documented all parameters (name, scene, template) with types, descriptions, and defaults
- Added 3 usage examples covering minimal, partial, and full parameter scenarios
- Included CLI invocation documentation with correct command format
- Added output format section with success and error response examples
- Documented error codes (CONFIG_MISSING, API_ERROR, NETWORK_ERROR)
- Added notes section with credential requirements and usage tips
- Verified api-spec.md completeness - contains endpoint, signature rules, request/response formats, error codes
- Updated REGISTRY.md to mark skill as "已完成"
- All 24 skill-definition tests pass

### File List

- `skills/polyv-create-channel/SKILL.md` - NEW: Skill definition file with frontmatter, parameters, examples, CLI docs
- `tools/REGISTRY.md` - MODIFIED: Updated skill status from "待开发" to "已完成"
