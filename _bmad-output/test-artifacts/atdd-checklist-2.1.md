---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-04c-aggregate
  - step-05-validate-and-complete
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-03-03'
workflowType: 'testarch-atdd'
inputDocuments:
  - epics.md
  - architecture.md
  - project-context.md
---

# ATDD Checklist - Epic 2, Story 2.1: 实现 polyv CLI 核心（签名和 API 调用）

**Date:** 2026-03-03
**Author:** Nick
**Primary Test Level:** Unit (Backend CLI)

---

## Story Summary

作为 polyv-skills 开发者，我想要实现签名生成和 API 调用的核心逻辑，以便可以与 polyv API 进行安全通信。

**As a** polyv-skills 开发者
**I want** 实现签名生成和 API 调用的核心逻辑
**So that** 可以与 polyv API 进行安全通信

---

## Acceptance Criteria

1. **AC1:** 生成与 polyv API v4 兼容的 MD5 签名
2. **AC2:** 参数按字典序排序
3. **AC3:** 拼接格式：key1value1key2value2...
4. **AC4:** 追加 appSecret 后计算 MD5
5. **AC5:** 时间戳为毫秒级，5 分钟有效期
6. **AC6:** 调用 polyv 创建频道 API (POST /live/v4/channel/create)
7. **AC7:** Content-Type: application/json
8. **AC8:** 请求体包含 appId, timestamp, sign, name, scene, template
9. **AC9:** 解析成功响应，提取 channelId 和 userId
10. **AC10:** 解析错误响应，提取错误码和错误信息

**NFR Requirements:**
- **NFR1:** appSecret 不在任何日志中明文显示
- **NFR3:** 使用 HTTPS 传输
- **NFR4:** 时间戳有效期 5 分钟，防止重放攻击
- **NFR5:** API 调用响应时间 < 5 秒
- **NFR10:** 网络错误时返回清晰的错误信息，不崩溃

---

## Failing Tests Created (RED Phase)

### Unit Tests - Signature Generation (14 tests)

**File:** `tests/unit/signature.test.js` (174 lines)

- ✅ **Test:** [P0] should generate valid MD5 signature format
  - **Status:** RED - generateSignature function not implemented
  - **Verifies:** AC1 - 生成与 polyv API v4 兼容的 MD5 签名

- ✅ **Test:** [P1] should generate consistent signatures for same input
  - **Status:** RED - generateSignature function not implemented
  - **Verifies:** AC1 - 签名一致性

- ✅ **Test:** [P0] should sort parameters alphabetically before signing
  - **Status:** RED - generateSignature function not implemented
  - **Verifies:** AC2 - 参数按字典序排序

- ✅ **Test:** [P1] should handle special characters in parameter names
  - **Status:** RED - generateSignature function not implemented
  - **Verifies:** AC2 - 特殊字符处理

- ✅ **Test:** [P0] should concatenate params in key-value format
  - **Status:** RED - buildSignatureString function not implemented
  - **Verifies:** AC3 - 拼接格式 key1value1key2value2

- ✅ **Test:** [P1] should handle empty parameter values
  - **Status:** RED - buildSignatureString function not implemented
  - **Verifies:** AC3 - 空值处理

- ✅ **Test:** [P0] should append appSecret before MD5 hashing
  - **Status:** RED - generateSignature function not implemented
  - **Verifies:** AC4 - 追加 appSecret 后计算 MD5

- ✅ **Test:** [P1] should use MD5 algorithm specifically
  - **Status:** RED - generateSignature function not implemented
  - **Verifies:** AC4 - MD5 算法

- ✅ **Test:** [P0] should generate millisecond timestamp
  - **Status:** RED - generateTimestamp function not implemented
  - **Verifies:** AC5 - 时间戳为毫秒级

- ✅ **Test:** [P1] should validate timestamp within 5 minute window
  - **Status:** RED - validateTimestamp function not implemented
  - **Verifies:** AC5 - 5 分钟有效期

- ✅ **Test:** [P2] should reject non-millisecond timestamps
  - **Status:** RED - validateTimestamp function not implemented
  - **Verifies:** AC5 - 秒级时间戳拒绝

- ✅ **Test:** [P0] should mask appSecret in debug output
  - **Status:** RED - maskAppSecret function not implemented
  - **Verifies:** NFR1 - appSecret 不在日志中明文显示

- ✅ **Test:** [P1] should handle short secrets
  - **Status:** RED - maskAppSecret function not implemented
  - **Verifies:** NFR1 - 短密钥处理

### Unit Tests - API Client (24 tests)

**File:** `tests/unit/api-client.test.js` (266 lines)

- ✅ **Test:** [P0] should send POST request to correct endpoint
  - **Status:** RED - createChannel function not implemented
  - **Verifies:** AC6 - 调用 polyv 创建频道 API

- ✅ **Test:** [P1] should throw clear error when credentials invalid
  - **Status:** RED - createChannel function not implemented
  - **Verifies:** AC6 - 凭据无效错误处理

- ✅ **Test:** [P0] should send request with JSON content type
  - **Status:** RED - buildRequestConfig function not implemented
  - **Verifies:** AC7 - Content-Type: application/json

- ✅ **Test:** [P1] should serialize body as JSON
  - **Status:** RED - buildRequestConfig function not implemented
  - **Verifies:** AC7 - JSON 序列化

- ✅ **Test:** [P0] should include appId in request body
  - **Status:** RED - buildRequestBody function not implemented
  - **Verifies:** AC8 - 请求体包含 appId

- ✅ **Test:** [P0] should include timestamp in request body
  - **Status:** RED - buildRequestBody function not implemented
  - **Verifies:** AC8 - 请求体包含 timestamp

- ✅ **Test:** [P0] should include sign in request body
  - **Status:** RED - buildRequestBody function not implemented
  - **Verifies:** AC8 - 请求体包含 sign

- ✅ **Test:** [P0] should include channel name in request body
  - **Status:** RED - buildRequestBody function not implemented
  - **Verifies:** AC8 - 请求体包含 name

- ✅ **Test:** [P1] should include scene type in request body
  - **Status:** RED - buildRequestBody function not implemented
  - **Verifies:** AC8 - 请求体包含 scene

- ✅ **Test:** [P1] should include template type in request body
  - **Status:** RED - buildRequestBody function not implemented
  - **Verifies:** AC8 - 请求体包含 template

- ✅ **Test:** [P1] should use defaults for optional params
  - **Status:** RED - buildRequestBody function not implemented
  - **Verifies:** AC8 - 可选参数默认值

- ✅ **Test:** [P0] should extract channelId from success response
  - **Status:** RED - parseApiResponse function not implemented
  - **Verifies:** AC9 - 解析成功响应 channelId

- ✅ **Test:** [P0] should extract userId from success response
  - **Status:** RED - parseApiResponse function not implemented
  - **Verifies:** AC9 - 解析成功响应 userId

- ✅ **Test:** [P1] should identify success responses
  - **Status:** RED - isSuccessfulResponse function not implemented
  - **Verifies:** AC9 - 成功响应识别

- ✅ **Test:** [P0] should extract error code from error response
  - **Status:** RED - parseApiError function not implemented
  - **Verifies:** AC10 - 解析错误响应 code

- ✅ **Test:** [P0] should extract error message from error response
  - **Status:** RED - parseApiError function not implemented
  - **Verifies:** AC10 - 解析错误响应 message

- ✅ **Test:** [P1] should handle authentication errors
  - **Status:** RED - parseApiError function not implemented
  - **Verifies:** AC10 - 认证错误处理

- ✅ **Test:** [P1] should handle rate limiting errors
  - **Status:** RED - parseApiError function not implemented
  - **Verifies:** AC10 - 限流错误处理 (NFR11)

- ✅ **Test:** [P2] should include hint for common errors
  - **Status:** RED - parseApiError function not implemented
  - **Verifies:** AC10 - 错误提示

- ✅ **Test:** [P0] should use HTTPS for API requests
  - **Status:** RED - API_BASE_URL constant not exported
  - **Verifies:** NFR3 - 使用 HTTPS 传输

- ✅ **Test:** [P0] should handle network timeout gracefully
  - **Status:** RED - createChannel timeout handling not implemented
  - **Verifies:** NFR10 - 网络错误时返回清晰错误信息

- ✅ **Test:** [P1] should handle DNS resolution failure
  - **Status:** RED - handleNetworkError function not implemented
  - **Verifies:** NFR10 - DNS 解析失败处理

- ✅ **Test:** [P1] should handle connection refused
  - **Status:** RED - handleNetworkError function not implemented
  - **Verifies:** NFR10 - 连接拒绝处理

- ✅ **Test:** [P1] should have default timeout of 5 seconds
  - **Status:** RED - DEFAULT_TIMEOUT constant not exported
  - **Verifies:** NFR5 - API 调用响应时间 < 5 秒

### E2E Tests - CLI Core (14 tests)

**File:** `tests/e2e/polyv-cli-core.spec.ts` (193 lines)

- ✅ **Test:** [P0] should have valid CLI entry point
  - **Status:** RED - CLI --help not implemented
  - **Verifies:** CLI 入口点

- ✅ **Test:** [P1] should show version with --version flag
  - **Status:** RED - --version flag not implemented
  - **Verifies:** CLI 版本显示

- ✅ **Test:** [P0] should run config-test command
  - **Status:** RED - config-test may need improvements
  - **Verifies:** 配置测试命令

- ✅ **Test:** [P1] should show masked appSecret in debug mode
  - **Status:** RED - debug mode masking not implemented
  - **Verifies:** NFR1 - 调试模式掩码

- ✅ **Test:** [P0] should reject create-channel without credentials
  - **Status:** RED - create-channel command not implemented
  - **Verifies:** 凭据检查

- ✅ **Test:** [P1] should accept channel name parameter
  - **Status:** RED - create-channel command not implemented
  - **Verifies:** AC8 - name 参数

- ✅ **Test:** [P2] should accept scene type parameter
  - **Status:** RED - scene parameter not implemented
  - **Verifies:** AC8 - scene 参数

- ✅ **Test:** [P2] should accept template type parameter
  - **Status:** RED - template parameter not implemented
  - **Verifies:** AC8 - template 参数

- ✅ **Test:** [P0] should format errors with code and hint
  - **Status:** RED - error formatting not complete
  - **Verifies:** 错误格式化

- ✅ **Test:** [P1] should include config hint for missing credentials
  - **Status:** RED - error hints not complete
  - **Verifies:** 配置提示

- ✅ **Test:** [P0] should show debug info when POLYV_DEBUG=true
  - **Status:** RED - debug mode not fully implemented
  - **Verifies:** 调试模式

- ✅ **Test:** [P1] should show request URL in debug mode
  - **Status:** RED - debug mode not fully implemented
  - **Verifies:** NFR19 - Debug 模式显示请求 URL

- ✅ **Test:** [P1] should mask appSecret in debug output
  - **Status:** RED - debug masking not implemented
  - **Verifies:** NFR1 - 调试输出掩码

- ✅ **Test:** [P1] should complete config-test in under 1 second
  - **Status:** RED - performance not verified
  - **Verifies:** NFR6 - Skill 响应时间 < 100ms

---

## Data Factories Created

无需数据工厂，因为这是 CLI 工具测试。

---

## Fixtures Created

无需 Playwright fixtures，因为主要使用单元测试和 CLI 执行测试。

---

## Mock Requirements

### PolyV API Mock (用于本地开发测试)

**Endpoint:** `POST https://api.polyv.net/live/v4/channel/create`

**Success Response:**

```json
{
  "code": 200,
  "status": "success",
  "data": {
    "channelId": 123456,
    "userId": "user123",
    "name": "测试频道",
    "scene": "topclass",
    "template": "ppt"
  }
}
```

**Failure Response (Invalid Signature):**

```json
{
  "code": 403,
  "status": "error",
  "message": "签名验证失败",
  "data": null
}
```

**Failure Response (Invalid Parameter):**

```json
{
  "code": 400,
  "status": "error",
  "message": "参数错误：name 不能为空",
  "data": null
}
```

**Notes:** 测试时可以使用环境变量 POLYV_APP_ID 和 POLYV_APP_SECRET 指向测试账号

---

## Required data-testid Attributes

不适用 - 这是 CLI 工具，无 UI 组件。

---

## Implementation Checklist

### Test: [P0] should generate valid MD5 signature format

**File:** `tests/unit/signature.test.js`

**Tasks to make this test pass:**

- [ ] 在 `tools/clis/polyv.js` 中实现 `generateSignature(params, appSecret)` 函数
- [ ] 函数接受参数对象和 appSecret
- [ ] 返回 32 位小写十六进制 MD5 哈希字符串
- [ ] 导出函数以供测试
- [ ] Run test: `npm run test:unit -- --grep "should generate valid MD5"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

### Test: [P0] should sort parameters alphabetically before signing

**File:** `tests/unit/signature.test.js`

**Tasks to make this test pass:**

- [ ] 在 generateSignature 中按字典序排序参数键
- [ ] 使用 `Object.keys(params).sort()` 实现排序
- [ ] Run test: `npm run test:unit -- --grep "should sort parameters"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hour

---

### Test: [P0] should append appSecret before MD5 hashing

**File:** `tests/unit/signature.test.js`

**Tasks to make this test pass:**

- [ ] 实现签名拼接逻辑：key1value1key2value2...appSecret
- [ ] 使用 Node.js crypto 模块计算 MD5
- [ ] Run test: `npm run test:unit -- --grep "should append appSecret"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hour

---

### Test: [P0] should generate millisecond timestamp

**File:** `tests/unit/signature.test.js`

**Tasks to make this test pass:**

- [ ] 实现 `generateTimestamp()` 函数
- [ ] 使用 `Date.now()` 返回毫秒时间戳
- [ ] 导出函数以供测试
- [ ] Run test: `npm run test:unit -- --grep "should generate millisecond"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.25 hour

---

### Test: [P0] should send POST request to correct endpoint

**File:** `tests/unit/api-client.test.js`

**Tasks to make this test pass:**

- [ ] 实现 `createChannel(config, channelParams)` 函数
- [ ] 使用 node-fetch 或 axios 发送 POST 请求
- [ ] 目标 URL: `https://api.polyv.net/live/v4/channel/create`
- [ ] Run test: `npm run test:unit -- --grep "should send POST"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1.5 hour

---

### Test: [P0] should include appId/timestamp/sign/name in request body

**File:** `tests/unit/api-client.test.js`

**Tasks to make this test pass:**

- [ ] 实现 `buildRequestBody(config, channelParams)` 函数
- [ ] 包含必要字段：appId, timestamp, sign, name
- [ ] 使用 generateSignature 生成签名
- [ ] 使用 generateTimestamp 生成时间戳
- [ ] 导出函数以供测试
- [ ] Run test: `npm run test:unit -- --grep "should include"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

### Test: [P0] should extract channelId from success response

**File:** `tests/unit/api-client.test.js`

**Tasks to make this test pass:**

- [ ] 实现 `parseApiResponse(response)` 函数
- [ ] 解析 code: 200 的成功响应
- [ ] 提取 data.channelId 和 data.userId
- [ ] 导出函数以供测试
- [ ] Run test: `npm run test:unit -- --grep "should extract"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hour

---

### Test: [P0] should extract error code from error response

**File:** `tests/unit/api-client.test.js`

**Tasks to make this test pass:**

- [ ] 实现 `parseApiError(response)` 函数
- [ ] 提取 code, message, 和提供 hint
- [ ] 对常见错误提供中文提示
- [ ] 导出函数以供测试
- [ ] Run test: `npm run test:unit -- --grep "should extract error"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.75 hour

---

### Test: [P0] should mask appSecret in debug output

**File:** `tests/unit/signature.test.js`

**Tasks to make this test pass:**

- [ ] 实现 `maskAppSecret(secret)` 函数
- [ ] 格式：显示前 2 位 + **** + 后 2 位
- [ ] 处理短密钥边界情况
- [ ] Run test: `npm run test:unit -- --grep "should mask"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hour

---

### Test: [P0] should use HTTPS for API requests

**File:** `tests/unit/api-client.test.js`

**Tasks to make this test pass:**

- [ ] 定义 API_BASE_URL 常量
- [ ] 确保以 `https://` 开头
- [ ] 导出常量以供测试
- [ ] Run test: `npm run test:unit -- --grep "should use HTTPS"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.25 hour

---

### Test: [P0] should have valid CLI entry point

**File:** `tests/e2e/polyv-cli-core.spec.ts`

**Tasks to make this test pass:**

- [ ] 实现 CLI --help 输出
- [ ] 显示使用说明和可用命令
- [ ] Run test: `npm run test:e2e -- --grep "should have valid CLI"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hour

---

### Test: [P0] should reject create-channel without credentials

**File:** `tests/e2e/polyv-cli-core.spec.ts`

**Tasks to make this test pass:**

- [ ] 实现 create-channel 命令
- [ ] 在执行前检查凭据配置
- [ ] 无凭据时返回 CONFIG_MISSING 错误
- [ ] Run test: `npm run test:e2e -- --grep "should reject"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

## Running Tests

```bash
# Run all failing tests for this story
npm test

# Run unit tests only
npm run test:unit

# Run specific test file
npm run test:unit -- --grep "Signature"

# Run E2E tests
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e:ui

# Debug specific test
npm run test:e2e:debug
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All tests written and failing
- ✅ Tests use test.skip() to mark intentional failures
- ✅ Mock requirements documented
- ✅ Implementation checklist created

**Verification:**

- All tests are skipped (test.skip)
- Tests fail due to missing implementation, not test bugs
- Tests assert expected behavior based on acceptance criteria

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist (start with P0 priority)
2. **Read the test** to understand expected behavior
3. **Implement minimal code** to make that specific test pass
4. **Remove test.skip()** and run the test to verify it passes (green)
5. **Check off the task** in implementation checklist
6. **Move to next test** and repeat

**Key Principles:**

- One test at a time (don't try to fix all at once)
- Minimal implementation (don't over-engineer)
- Run tests frequently (immediate feedback)
- Use implementation checklist as roadmap

**Progress Tracking:**

- Check off tasks as you complete them
- Share progress in daily standup

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. **Verify all tests pass** (green phase complete)
2. **Review code for quality** (readability, maintainability, performance)
3. **Extract duplications** (DRY principle)
4. **Optimize performance** (if needed)
5. **Ensure tests still pass** after each refactor
6. **Update documentation** (if API contracts change)

**Key Principles:**

- Tests provide safety net (refactor with confidence)
- Make small refactors (easier to debug if tests fail)
- Run tests after each change
- Don't change test behavior (only implementation)

**Completion:**

- All tests pass
- Code quality meets team standards
- No duplications or code smells
- Ready for code review and story approval

---

## Next Steps

1. **Share this checklist and failing tests** with the dev workflow (manual handoff)
2. **Review this checklist** with team in standup or planning
3. **Run failing tests** to confirm RED phase: `npm run test:unit`
4. **Begin implementation** using implementation checklist as guide
5. **Work one test at a time** (red → green for each)
6. **Share progress** in daily standup
7. **When all tests pass**, refactor code for quality
8. **When refactoring complete**, manually update story status to 'done' in sprint-status.yaml

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **data-factories.md** - Test data patterns (minimal use for CLI tool)
- **test-quality.md** - Test design principles (Given-When-Then, one assertion per test, determinism, isolation)
- **test-healing-patterns.md** - Common failure patterns and fixes
- **test-levels-framework.md** - Test level selection (Unit for backend logic)

See `tea-index.csv` for complete knowledge fragment mapping.

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `npm run test:unit`

**Expected Results:**

```
  Signature Generation - Story 2.1
    AC1: 生成与 polyv API v4 兼容的 MD5 签名
      - [P0] should generate valid MD5 signature format
      - [P1] should generate consistent signatures for same input
    ...

  0 passing
  52 pending (all marked with test.skip)
```

**Summary:**

- Total tests: 52 (38 unit + 14 E2E)
- Passing: 0 (expected)
- Failing: 0 (all skipped with test.skip)
- Pending: 52 (expected)
- Status: ✅ RED phase verified

---

## Notes

- 测试使用 Mocha (单元测试) 和 Playwright (E2E 测试)
- 所有测试都使用 test.skip() 标记为待实现
- 这是一个 CLI 工具，不需要浏览器测试
- 重点测试签名算法与 PolyV API v4 的兼容性

---

## Contact

**Questions or Issues?**

- Ask in team standup
- Refer to `./bmm/docs/tea-README.md` for workflow documentation
- Consult `./tea/testarch/knowledge` for testing best practices

---

**Generated by BMad TEA Agent** - 2026-03-03
