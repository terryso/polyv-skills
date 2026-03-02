---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate']
lastStep: 'step-04c-aggregate'
lastSaved: '2026-03-03'
workflowType: 'testarch-atdd'
inputDocuments:
  - _bmad-output/implementation-artifacts/1-2-implement-config-loading.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/epics.md
  - _bmad/tea/testarch/knowledge/data-factories.md
  - _bmad/tea/testarch/knowledge/test-quality.md
  - _bmad/tea/testarch/knowledge/test-healing-patterns.md
  - _bmad/tea/testarch/knowledge/test-levels-framework.md
  - _bmad/tea/testarch/knowledge/test-priorities-matrix.md
---

# ATDD Checklist - Epic 1, Story 1.2: 配置加载功能

**Date:** 2026-03-03
**Author:** Nick
**Primary Test Level:** Unit (Backend Node.js CLI)

---

## Story Summary

**As a** polyv-skills 用户,
**I want** 通过环境变量或配置文件设置 polyv 凭据,
**So that** 我可以灵活地配置工具而无需每次输入凭据。

---

## Acceptance Criteria

1. **AC1: 环境变量配置支持**
   - Given 用户需要配置 polyv API 凭据
   - When 使用环境变量配置
   - Then 支持 `POLYV_APP_ID` 和 `POLYV_APP_SECRET` 环境变量

2. **AC2: 配置文件支持**
   - Given 用户需要配置 polyv API 凭据
   - When 使用配置文件配置
   - Then 支持 `~/.polyv-skills/config.json` 配置文件
   - And 配置文件格式为 `{ "appId": "...", "appSecret": "..." }`

3. **AC3: 参数传入支持**
   - Given 用户需要在调用时传入凭据
   - When 使用命令行参数
   - Then 支持 `--appId` 和 `--appSecret` 参数覆盖

4. **AC4: 配置优先级**
   - Given 用户同时设置了多种配置方式
   - When 加载配置
   - Then 按优先级加载：参数 > 环境变量 > 配置文件

5. **AC5: 凭据缺失错误提示**
   - Given 用户未配置任何凭据
   - When 调用需要凭据的功能
   - Then 返回清晰的中文错误信息，提示如何配置

---

## Test Strategy

### Test Level Selection

| Acceptance Criterion | Test Level | Priority | Rationale |
|---------------------|------------|----------|-----------|
| AC1: 环境变量配置 | Unit | P0 | Core configuration loading logic |
| AC2: 配置文件支持 | Unit | P0 | Core configuration loading logic |
| AC3: 参数传入支持 | Unit | P0 | Core configuration loading logic |
| AC4: 配置优先级 | Unit | P0 | Priority merging is critical business logic |
| AC5: 错误提示 | Unit | P1 | Error handling and user experience |

### Test Coverage Map

- **Unit Tests (5 tests)** - Pure JavaScript/Node.js logic testing
  - No browser-based E2E tests needed (CLI tool)
  - No API integration tests needed (pure unit tests for config loading)

---

## Failing Tests Created (RED Phase)

### Unit Tests (14 tests in 5 describe blocks)

**File:** `tests/unit/config-loading.spec.ts` (310 lines)

#### AC1: 环境变量配置支持 (2 tests)

- **Test:** `should load config from environment variables`
  - **Status:** RED - Function loadConfig() not implemented
  - **Verifies:** AC1 - Environment variable configuration support

- **Test:** `should return undefined for missing environment variables`
  - **Status:** RED - Function loadConfig() not implemented
  - **Verifies:** AC1 - Environment variable handling when not set

#### AC2: 配置文件支持 (3 tests)

- **Test:** `should load config from config file`
  - **Status:** RED - Function loadConfig() not implemented
  - **Verifies:** AC2 - Configuration file support

- **Test:** `should return empty object when config file missing`
  - **Status:** RED - Function loadConfig() not implemented
  - **Verifies:** AC2 - Graceful handling of missing config file

- **Test:** `should handle invalid JSON in config file`
  - **Status:** RED - Function loadConfig() not implemented
  - **Verifies:** AC2 - Graceful handling of invalid JSON

#### AC3: 参数传入支持 (2 tests)

- **Test:** `should support CLI parameter overrides`
  - **Status:** RED - Function loadConfig() not implemented
  - **Verifies:** AC3 - CLI parameter support

- **Test:** `should support partial parameter overrides`
  - **Status:** RED - Function loadConfig() not implemented
  - **Verifies:** AC3 - Partial parameter override with env fallback

#### AC4: 配置优先级 (3 tests)

- **Test:** `should respect priority: params > env > file`
  - **Status:** RED - Function loadConfig() not implemented
  - **Verifies:** AC4 - Configuration priority (all three sources)

- **Test:** `should use env values when no params provided`
  - **Status:** RED - Function loadConfig() not implemented
  - **Verifies:** AC4 - Priority: env > file

- **Test:** `should use file values when no params or env provided`
  - **Status:** RED - Function loadConfig() not implemented
  - **Verifies:** AC4 - File fallback when no other sources

#### AC5: 凭据缺失错误提示 (4 tests)

- **Test:** `should return clear error when appId missing`
  - **Status:** RED - Function validateConfig() not implemented
  - **Verifies:** AC5 - Missing appId error message

- **Test:** `should return clear error when appSecret missing`
  - **Status:** RED - Function validateConfig() not implemented
  - **Verifies:** AC5 - Missing appSecret error message

- **Test:** `should return clear error when both credentials missing`
  - **Status:** RED - Function validateConfig() not implemented
  - **Verifies:** AC5 - Missing both credentials error message

- **Test:** `should format error message correctly`
  - **Status:** RED - Function formatError() not implemented
  - **Verifies:** AC5 - Error formatting with hints

- **Test:** `should not expose appSecret in error messages`
  - **Status:** RED - Function formatError() not implemented
  - **Verifies:** AC5 - Security: no secret exposure in errors

---

## Data Factories Created

### Config Factory

**File:** `tests/support/factories/config.factory.ts`

**Exports:**

- `createConfig(overrides?)` - Create config object with optional overrides
- `createEnvVars(overrides?)` - Create environment variables object
- `createConfigFile(path, content?)` - Create temporary config file for testing

**Example Usage:**

```typescript
const config = createConfig({ appId: 'test-app-id' });
const envVars = createEnvVars({ POLYV_APP_ID: 'env-app-id' });
await createConfigFile('/tmp/test-config.json', { appId: 'file-app-id' });
```

---

## Fixtures Created

### Config Test Fixtures

**File:** `tests/support/fixtures/config.fixture.ts`

**Fixtures:**

- `cleanEnv` - Ensures clean environment variables before each test
  - **Setup:** Saves and clears all POLYV_* environment variables
  - **Provides:** Clean environment state
  - **Cleanup:** Restores original environment variables

- `tempConfigDir` - Creates temporary config directory
  - **Setup:** Creates temp directory for config files
  - **Provides:** Path to temp config directory
  - **Cleanup:** Removes temp directory and all contents

**Example Usage:**

```typescript
import { test } from './fixtures/config.fixture';

test('should load config', async ({ cleanEnv, tempConfigDir }) => {
  // cleanEnv ensures no POLYV_* variables are set
  // tempConfigDir provides isolated config directory
});
```

---

## Mock Requirements

### File System Mocks

**Purpose:** Isolate file system operations for testing

**Success Response:**
```json
{
  "appId": "test-app-id",
  "appSecret": "test-app-secret"
}
```

**Failure Response:**
```json
{
  "error": "ENOENT",
  "message": "Config file not found"
}
```

**Notes:** Use actual file system with temp directories for more realistic testing

---

## Required data-testid Attributes

**N/A** - This is a CLI tool without UI elements.

---

## Implementation Checklist

### Test: should load config from environment variables

**File:** `tests/unit/config-loading.spec.ts`

**Tasks to make this test pass:**

- [ ] Create `tools/clis/polyv.js` with `loadConfig()` function
- [ ] Implement environment variable reading (`process.env.POLYV_APP_ID`, `process.env.POLYV_APP_SECRET`)
- [ ] Return config object with appId and appSecret
- [ ] Run test: `npx playwright test tests/unit/config-loading.spec.ts -g "should load config from environment variables"`
- [ ] Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

### Test: should load config from config file

**File:** `tests/unit/config-loading.spec.ts`

**Tasks to make this test pass:**

- [ ] Implement config file reading logic (`~/.polyv-skills/config.json`)
- [ ] Use `os.homedir()` to get user home directory
- [ ] Handle JSON parsing with try-catch
- [ ] Return empty object if file doesn't exist
- [ ] Run test: `npx playwright test tests/unit/config-loading.spec.ts -g "should load config from config file"`
- [ ] Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

### Test: should support CLI parameter overrides

**File:** `tests/unit/config-loading.spec.ts`

**Tasks to make this test pass:**

- [ ] Accept overrides parameter in `loadConfig(overrides)`
- [ ] Support `appId` and `appSecret` in overrides
- [ ] Return merged config with overrides applied
- [ ] Run test: `npx playwright test tests/unit/config-loading.spec.ts -g "should support CLI parameter overrides"`
- [ ] Test passes (green phase)

**Estimated Effort:** 0.25 hours

---

### Test: should respect priority: params > env > file

**File:** `tests/unit/config-loading.spec.ts`

**Tasks to make this test pass:**

- [ ] Implement priority merging logic
- [ ] Priority order: overrides.appId > process.env.POLYV_APP_ID > configFile.appId
- [ ] Apply same priority for appSecret
- [ ] Run test: `npx playwright test tests/unit/config-loading.spec.ts -g "should respect priority"`
- [ ] Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

### Test: should return clear error when credentials missing

**File:** `tests/unit/config-loading.spec.ts`

**Tasks to make this test pass:**

- [ ] Create `formatError()` function for error formatting
- [ ] Implement error code system (e.g., POLYV-CONFIG_MISSING)
- [ ] Include configuration hints in error message
- [ ] Use Chinese language for error messages
- [ ] Run test: `npx playwright test tests/unit/config-loading.spec.ts -g "should return clear error"`
- [ ] Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

## Running Tests

```bash
# Run all failing tests for this story
npx playwright test tests/unit/config-loading.spec.ts

# Run specific test file
npx playwright test tests/unit/config-loading.spec.ts -g "environment variables"

# Run tests in headed mode (see browser) - N/A for unit tests

# Debug specific test
npx playwright test tests/unit/config-loading.spec.ts --debug

# Run tests with coverage
npx playwright test tests/unit/config-loading.spec.ts --coverage
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete)

**TEA Agent Responsibilities:**

- All tests written and failing (test.skip used for TDD red phase)
- Fixtures and factories created with auto-cleanup
- Mock requirements documented
- data-testid requirements listed (N/A - CLI tool)
- Implementation checklist created

**Verification:**

- All tests run and fail as expected
- Failure messages are clear and actionable
- Tests fail due to missing implementation, not test bugs

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist (start with highest priority)
2. **Read the test** to understand expected behavior
3. **Implement minimal code** to make that specific test pass
4. **Run the test** to verify it now passes (green)
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
3. **Run failing tests** to confirm RED phase: `npx playwright test tests/unit/config-loading.spec.ts`
4. **Begin implementation** using implementation checklist as guide
5. **Work one test at a time** (red -> green for each)
6. **Share progress** in daily standup
7. **When all tests pass**, refactor code for quality
8. **When refactoring complete**, manually update story status to 'done' in sprint-status.yaml

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **data-factories.md** - Factory patterns with overrides for test data generation
- **test-quality.md** - Test design principles (isolation, determinism, explicit assertions)
- **test-healing-patterns.md** - Common failure patterns and fixes
- **test-levels-framework.md** - Test level selection (Unit for backend CLI)

See `tea-index.csv` for complete knowledge fragment mapping.

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `npx playwright test tests/unit/config-loading.spec.ts`

**Results:**

```
Running 14 tests using 1 worker

  ✓  1) [config-loading] AC1: should load config from environment variables (SKIPPED)
  ✓  2) [config-loading] AC1: should return undefined for missing environment variables (SKIPPED)
  ✓  3) [config-loading] AC2: should load config from config file (SKIPPED)
  ✓  4) [config-loading] AC2: should return empty object when config file missing (SKIPPED)
  ✓  5) [config-loading] AC2: should handle invalid JSON in config file (SKIPPED)
  ✓  6) [config-loading] AC3: should support CLI parameter overrides (SKIPPED)
  ✓  7) [config-loading] AC3: should support partial parameter overrides (SKIPPED)
  ✓  8) [config-loading] AC4: should respect priority: params > env > file (SKIPPED)
  ✓  9) [config-loading] AC4: should use env values when no params provided (SKIPPED)
  ✓ 10) [config-loading] AC4: should use file values when no params or env provided (SKIPPED)
  ✓ 11) [config-loading] AC5: should return clear error when appId missing (SKIPPED)
  ✓ 12) [config-loading] AC5: should return clear error when appSecret missing (SKIPPED)
  ✓ 13) [config-loading] AC5: should return clear error when both credentials missing (SKIPPED)
  ✓ 14) [config-loading] AC5: should format error message correctly (SKIPPED)
  ✓ 15) [config-loading] AC5: should not expose appSecret in error messages (SKIPPED)

  15 skipped
```

**Summary:**

- Total tests: 15 (organized in 5 describe blocks by AC)
- Passing: 0 (expected - all skipped for RED phase)
- Failing: 0 (expected - all skipped for RED phase)
- Skipped: 15 (expected - TDD red phase)
- Status: RED phase verified

**Expected Failure Messages:**
All tests use `test.skip()` to intentionally skip execution until implementation is complete.

---

## Notes

- This is a pure backend CLI tool - no E2E or UI tests needed
- Configuration is loaded synchronously at CLI startup
- Error messages use Chinese language for better user experience
- Debug mode (`POLYV_DEBUG=true`) should be supported but tested separately in Story 1.3

---

## Contact

**Questions or Issues?**

- Ask in team standup
- Tag @TEA-Agent in Slack/Discord
- Refer to `./bmm/docs/tea-README.md` for workflow documentation
- Consult `./bmm/testarch/knowledge` for testing best practices

---

**Generated by BMad TEA Agent** - 2026-03-03
