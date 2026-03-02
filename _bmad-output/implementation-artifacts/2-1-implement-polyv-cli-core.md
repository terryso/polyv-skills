# Story 2.1: 实现 polyv CLI 核心（签名和 API 调用）

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a polyv-skills 开发者,
I want 实现签名生成和 API 调用的核心逻辑,
So that 可以与 polyv API 进行安全通信。

## Acceptance Criteria

1. **AC1: MD5 签名生成**
   - Given 有效的 appId 和 appSecret
   - When 调用签名生成函数
   - Then 生成与 polyv API v4 兼容的 MD5 签名
   - And 参数按字典序排序
   - And 拼接格式：`key1value1key2value2...`
   - And 追加 appSecret 后计算 MD5

2. **AC2: API 调用实现**
   - Given 有效的签名和参数
   - When 调用 polyv 创建频道 API
   - Then 发送 POST 请求到 `https://api.polyv.net/live/v4/channel/create`
   - And Content-Type: application/json
   - And 请求体包含 appId, timestamp, sign, name, scene, template

3. **AC3: 成功响应解析**
   - Given API 返回成功响应
   - When 解析响应
   - Then 提取 channelId 和 userId

4. **AC4: 错误响应解析**
   - Given API 返回错误响应
   - When 解析响应
   - Then 提取错误码和错误信息

5. **AC5: 安全性要求**
   - And appSecret 不在任何日志中明文显示 (NFR1)
   - And 使用 HTTPS 传输 (NFR3)
   - And 时间戳为毫秒级，5 分钟有效期 (NFR4)

## Tasks / Subtasks

- [x] Task 1: 实现 MD5 签名生成函数 (AC: 1, 5)
  - [x] 1.1 在 `tools/clis/polyv.js` 中添加 `crypto` 模块引用
  - [x] 1.2 创建 `generateSignature(params, appSecret)` 函数
  - [x] 1.3 实现参数字典序排序逻辑
  - [x] 1.4 实现 `key1value1key2value2...` 拼接格式
  - [x] 1.5 实现 MD5 计算并返回签名
  - [x] 1.6 添加时间戳生成函数 `generateTimestamp()` (毫秒级)

- [x] Task 2: 实现 API 调用函数 (AC: 2, 5)
  - [x] 2.1 定义 API 基础 URL 常量 `API_BASE_URL = 'https://api.polyv.net'`
  - [x] 2.2 创建 `callApi(endpoint, params, config)` 异步函数
  - [x] 2.3 实现请求参数组装（添加 appId, timestamp, sign）
  - [x] 2.4 使用 Node.js 原生 `fetch` 发送 POST 请求
  - [x] 2.5 设置正确的 Content-Type 头
  - [x] 2.6 在 debug 模式下输出请求详情（脱敏 appSecret）

- [x] Task 3: 实现响应解析函数 (AC: 3, 4)
  - [x] 3.1 创建 `parseApiResponse(response)` 函数
  - [x] 3.2 实现成功响应解析（code === 200）
  - [x] 3.3 实现错误响应解析（code !== 200）
  - [x] 3.4 提取 channelId 和 userId
  - [x] 3.5 将 polyv 错误码转换为中文错误信息

- [x] Task 4: 实现 create-channel 命令 (AC: 2, 3, 4)
  - [x] 4.1 添加 `create-channel` 命令处理
  - [x] 4.2 解析命令行参数：`--name`, `--scene`, `--template`
  - [x] 4.3 调用签名生成函数
  - [x] 4.4 调用 API 并处理响应
  - [x] 4.5 输出 JSON 格式结果

- [x] Task 5: 编写单元测试
  - [x] 5.1 测试签名生成函数（参数排序、拼接、MD5 计算）
  - [x] 5.2 测试时间戳生成（毫秒级）
  - [x] 5.3 测试 API 响应解析（成功和错误场景）
  - [x] 5.4 测试 create-channel 命令（使用 mock）

## Dev Notes

### Architecture Patterns and Constraints

**技术栈:**
- 纯 JavaScript (ES2022+) + Node.js 18+
- 无需编译，直接通过 `node` 执行
- 使用 Node.js 内置模块：`crypto` (MD5), `fs`, `path`, `os`, `process`
- 使用 Node.js 18+ 原生 `fetch` API

**签名算法规范 (polyv API v4):**
```javascript
// 签名生成步骤:
// 1. 收集所有请求参数
// 2. 按 key 字典序排序
// 3. 拼接为 key1value1key2value2... 格式
// 4. 追加 appSecret
// 5. 计算 MD5 值

function generateSignature(params, appSecret) {
  // 1. 排序参数
  const sortedKeys = Object.keys(params).sort();
  // 2. 拼接
  let signStr = '';
  for (const key of sortedKeys) {
    signStr += key + params[key];
  }
  // 3. 追加 appSecret
  signStr += appSecret;
  // 4. MD5
  return crypto.createHash('md5').update(signStr).digest('hex');
}
```

**API 端点:**
- 创建频道: `POST https://api.polyv.net/live/v4/channel/create`

**请求参数 (创建频道):**
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
// 成功
{
  "code": 200,
  "status": "success",
  "data": {
    "channelId": 3151318,
    "userId": "xxx"
  }
}

// 失败
{
  "code": 400,
  "status": "error",
  "msg": "错误信息"
}
```

### Source Tree Components to Touch

```
polyv-skills/
├── tools/
│   └── clis/
│       └── polyv.js           # 主要修改：添加签名和 API 调用逻辑
└── tests/
    └── unit/
        └── polyv.test.js      # 新增：单元测试
```

### Testing Standards

**单元测试 (Mocha):**
```bash
# 运行单元测试
npm run test:unit

# 运行所有测试
npm test
```

**手动测试命令:**
```bash
# 测试签名生成
POLYV_DEBUG=true node tools/clis/polyv.js create-channel --name "测试频道"

# 使用环境变量配置
POLYV_APP_ID=xxx POLYV_APP_SECRET=xxx node tools/clis/polyv.js create-channel --name "测试频道"

# 使用参数覆盖
node tools/clis/polyv.js create-channel --appId xxx --appSecret xxx --name "测试频道" --scene topclass --template ppt
```

### Project Structure Notes

- 项目已在 Story 1.1 和 1.2 中创建基础结构和配置加载功能
- `tools/clis/polyv.js` 已包含配置加载逻辑，需要扩展签名和 API 调用功能
- 遵循统一的项目结构（paths, modules, naming）
- 输出使用 JSON 格式，便于 Skill 解析

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR9-FR12] - API 集成功能需求
- [Source: _bmad-output/planning-artifacts/architecture.md#签名算法] - 签名算法详细说明
- [Source: _bmad-output/planning-artifacts/architecture.md#API端点] - API 端点定义
- [Source: _bmad-output/planning-artifacts/architecture.md#错误处理模式] - 错误处理代码模式
- [Source: project-context.md#API集成] - API 集成说明
- [Source: project-context.md#签名算法] - 签名算法公式

### Previous Story Intelligence (Story 1.2)

**已完成的工作:**
- 配置加载功能已实现（`loadConfig()`, `readConfigFile()`, `readConfigEnv()`）
- 错误处理模式已建立（`formatError()`, `validateConfig()`）
- Debug 模式已实现（`debug()`, `maskSensitiveData()`）
- CLI 参数解析已实现（`parseCliArgs()`）

**代码模式:**
- 使用纯 JavaScript，无需 TypeScript 编译
- 错误消息使用中文格式：`❌ [POLYV-{CODE}] {中文错误描述}`
- Debug 输出通过 `POLYV_DEBUG` 环境变量控制
- appSecret 在日志中脱敏显示（`ab****yz`）

**可复用的函数:**
- `loadConfig()` - 加载配置（优先级：参数 > 环境变量 > 配置文件）
- `formatError()` - 格式化错误消息
- `debug()` - Debug 输出
- `maskSensitiveData()` - 敏感数据脱敏

**注意事项:**
- 签名参数不包含 appSecret 本身，只在最后追加
- 时间戳使用毫秒级（13 位）
- 所有 API 调用使用 HTTPS
- 响应必须验证 code === 200 才算成功

### Git Intelligence

**最近的提交:**
```
feat(story-1.2): 实现配置加载功能
feat(story-1.1): 创建项目结构和插件配置
```

**已建立的代码模式:**
- 提交消息格式：`feat(story-X.Y): 描述`
- 项目使用 Git 进行版本控制
- 使用 CommonJS 模块格式

### Latest Technical Information

**Node.js 18+ 特性可用:**
- `fetch` API 原生支持（无需 axios 或 node-fetch）
- `crypto` 模块内置 MD5 支持
- `fs/promises` 模块用于异步文件操作

**polyv API v4 规范:**
- 时间戳有效期：5 分钟
- 签名算法：MD5
- 传输协议：HTTPS
- 请求格式：JSON
- 响应格式：JSON

**场景类型 (scene):**
- `topclass` - 大班课（默认）
- `cloudclass` - 云课堂
- `telecast` - 直播带货
- `akt` - 活动直播

**模板类型 (template):**
- `ppt` - PPT 模板（默认）
- `video` - 视频模板

### Error Code Mapping

| polyv 错误码 | 中文错误信息 | 解决建议 |
|-------------|-------------|---------|
| 400 | 请求参数错误 | 检查请求参数是否正确 |
| 401 | 签名验证失败 | 检查 appId 和 appSecret 是否正确 |
| 403 | 无权限访问 | 检查账号权限 |
| 429 | 请求过于频繁 | 请稍后重试 |
| 500 | 服务器内部错误 | 请稍后重试或联系技术支持 |

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GLM-5 via Claude Code)

### Debug Log References

- All 51 unit tests pass
- Signature generation functions implemented: generateSignature, buildSignatureString, generateTimestamp, validateTimestamp
- API functions implemented: createChannel, buildRequestBody, buildRequestConfig, parseApiResponse, parseApiError, handleNetworkError
- CLI create-channel command implemented with JSON output

### Completion Notes List

- Completed Task 1: MD5 signature generation with proper sorting and concatenation
- Completed Task 2: API calling with Node.js fetch, timeout handling, and debug output
- Completed Task 3: Response parsing for both success and error cases
- Completed Task 4: create-channel CLI command with parameter parsing and JSON output
- Completed Task 5: Unit tests for all functions (signature.test.js, api-client.test.js)

### File List

- `tools/clis/polyv.js` - Modified: Added signature generation, API calling, and create-channel command
- `tests/unit/signature.test.js` - Modified: Enabled all tests (removed .skip)
- `tests/unit/api-client.test.js` - Modified: Enabled all tests (removed .skip)
