---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04-generate-tests
  - step-04c-aggregate
  - step-05-validate-and-complete
lastStep: step-05-validate-and-complete
lastSaved: '2026-03-03'
workflowType: 'testarch-atdd'
inputDocuments:
  - _bmad-output/implementation-artifacts/2-3-implement-error-handling-and-debug-mode.md
  - _bmad/tea/testarch/knowledge/data-factories.md
  - _bmad/tea/testarch/knowledge/test-quality.md
  - _bmad/tea/testarch/knowledge/test-healing-patterns.md
---

# ATDD Checklist - Epic 2, Story 3: 实现错误处理和 Debug 模式

**Date:** 2026-03-03
**Author:** Nick
**Primary Test Level:** Unit (with E2E coverage)

---

## Story Summary

As a polyv-skills 用户,
I want 在出错时收到清晰的中文错误提示,
So that 我可以快速定位和解决问题。

---

## Acceptance Criteria

1. **AC1: 凭据缺失错误提示** - 返回格式化的 CONFIG_MISSING 错误，包含错误码、中文描述和解决提示
2. **AC2: API 错误处理** - 返回中文错误信息和解决建议
3. **AC3: 网络错误处理** - 返回清晰的错误信息，程序不崩溃 (NFR10)
4. **AC4: Debug 模式** - POLYV_DEBUG=true 时输出详细调试信息（脱敏 appSecret）
5. **AC5: API 限流处理** - 返回友好的等待提示 (NFR11)

---

## Failing Tests Created (RED Phase)

### Unit Tests (26 tests)

**File:** `tests/unit/error-handling.test.js` (26 tests)

#### AC1: 凭据缺失错误提示 (5 tests)
- [P0] should return CONFIG_MISSING error for missing appId
- [P0] should return CONFIG_MISSING error for missing appSecret
- [P0] should return CONFIG_MISSING error for missing both
- [P1] should format error with code and hint
- [P1] should include error indicator emoji

#### AC2: API 错误处理 (6 tests)
- [P0] should return Chinese error message for 400
- [P0] should return Chinese error message for 401
- [P1] should include hint for resolution
- [P1] should have complete ERROR_CODE_MESSAGES mapping
- [P1] should have complete ERROR_CODE_HINTS mapping

#### AC3: 网络错误处理 (4 tests)
- [P0] should handle DNS errors
- [P0] should handle connection refused
- [P0] should handle timeout errors
- [P1] should not crash on unknown network errors

#### AC4: Debug 模式 (5 tests)
- [P0] should output debug logs when POLYV_DEBUG=true
- [P0] should mask appSecret in debug output
- [P1] should mask appSecret with correct format
- [P1] should handle short appSecret
- [P2] should not output when POLYV_DEBUG not set

#### AC5: API 限流处理 (4 tests)
- [P0] should return friendly message for 429 status
- [P0] should set isRateLimit flag for 429
- [P1] should include wait hint for rate limiting
- [P1] should not set isRateLimit for non-429 errors

#### NFR1: 敏感信息脱敏 (3 tests)
- [P0] should not expose full appSecret in masked output
- [P1] should handle null data gracefully
- [P1] should handle non-object data gracefully

### E2E Tests (22 tests)

**File:** `tests/e2e/error-handling-and-debug.spec.ts` (22 tests)

#### AC1: 凭据缺失错误提示 (4 tests)
- [P0] should show CONFIG_MISSING error for missing appId
- [P0] should show CONFIG_MISSING error for missing appSecret
- [P1] should show config file hint in error message
- [P1] should show environment variable hint

#### AC2: API 错误处理 (2 tests)
- [P0] should return Chinese error for API 400
- [P1] should include hint for API errors

#### AC3: 网络错误处理 (2 tests)
- [P0] should handle network timeout gracefully
- [P1] should not crash on network errors

#### AC4: Debug 模式 (6 tests)
- [P0] should show debug info when POLYV_DEBUG=true
- [P0] should mask appSecret in debug output
- [P1] should show request URL in debug mode
- [P1] should show request params in debug mode
- [P1] should show response in debug mode
- [P2] should not show debug when POLYV_DEBUG not set

#### AC5: API 限流处理 (2 tests)
- [P0] should return friendly message for 429
- [P1] should include wait hint for rate limit

#### Error Output Format (3 tests)
- [P0] should format errors with JSON structure
- [P1] should include error code in JSON output
- [P1] should include hint in JSON output

#### NFR10: 网络错误时返回清晰错误信息 (2 tests)
- [P0] should not crash on network error
- [P1] should return clear error message on network error

---

## Test File Summary

| Test Level | File | Tests | Status |
|------------|------|-------|--------|
| Unit | tests/unit/error-handling.test.js | 26 | RED (test.skip) |
| E2E | tests/e2e/error-handling-and-debug.spec.ts | 22 | RED (test.skip) |
| **Total** | | **48** | |

---

## Implementation Checklist

### Test: AC1 - 凭据缺失错误提示

**Tasks to make these tests pass:**

- [ ] Verify `formatError()` outputs correct format:
  ```
  [POLYV-{CODE}] {中文错误描述}
     提示：{解决方案}
  ```
- [ ] Verify `validateConfig()` returns correct error object structure
- [ ] Verify error messages mention both config.json and environment variables
- [ ] Run test: `npm run test:unit -- --grep "AC1"`
- [ ] Run E2E test: `npm run test:e2e -- --grep "AC1"`

**Estimated Effort:** 1 hour

---

### Test: AC2 - API 错误处理

**Tasks to make these tests pass:**

- [ ] Verify `ERROR_CODE_MESSAGES` has all common codes (400, 401, 403, 429, 500)
- [ ] Verify `ERROR_CODE_HINTS` has corresponding hints
- [ ] Verify `parseApiError()` returns Chinese messages
- [ ] Add more error codes if needed
- [ ] Run test: `npm run test:unit -- --grep "AC2"`

**Estimated Effort:** 1 hour

---

### Test: AC3 - 网络错误处理

**Tasks to make these tests pass:**

- [ ] Verify `handleNetworkError()` handles DNS errors (ENOTFOUND)
- [ ] Verify `handleNetworkError()` handles connection refused (ECONNREFUSED)
- [ ] Verify `handleNetworkError()` handles timeouts (ETIMEDOUT)
- [ ] Verify graceful handling of unknown errors
- [ ] Run test: `npm run test:unit -- --grep "AC3"`
- [ ] Run E2E test: `npm run test:e2e -- --grep "AC3"`

**Estimated Effort:** 1 hour

---

### Test: AC4 - Debug 模式

**Tasks to make these tests pass:**

- [ ] Verify `debug()` outputs logs when POLYV_DEBUG=true
- [ ] Verify `maskSensitiveData()` correctly masks appSecret
- [ ] Verify `maskAppSecret()` format: `ab****yz`
- [ ] Verify debug output includes request URL
- [ ] Verify debug output includes request params
- [ ] Verify debug output includes response
- [ ] Verify no output when POLYV_DEBUG not set
- [ ] Run test: `npm run test:unit -- --grep "AC4"`
- [ ] Run E2E test: `npm run test:e2e -- --grep "AC4"`

**Estimated Effort:** 2 hours

---

### Test: AC5 - API 限流处理

**Tasks to make these tests pass:**

- [ ] Verify 429 status returns friendly message
- [ ] Verify `parseApiError()` sets `isRateLimit: true` for 429
- [ ] Verify rate limit hint includes "稍后" or "重试"
- [ ] Run test: `npm run test:unit -- --grep "AC5"`

**Estimated Effort:** 0.5 hour

---

### Test: NFR1 - 敏感信息脱敏

**Tasks to make these tests pass:**

- [ ] Verify full appSecret never appears in masked output
- [ ] Verify null data handled gracefully
- [ ] Verify non-object data handled gracefully
- [ ] Run test: `npm run test:unit -- --grep "NFR1"`

**Estimated Effort:** 0.5 hour

---

## Running Tests

```bash
# Run all unit tests for this story
npm run test:unit -- --grep "Error Handling"

# Run all E2E tests for this story
npm run test:e2e -- --grep "Error Handling"

# Run specific AC tests
npm run test:unit -- --grep "AC1"
npm run test:unit -- --grep "AC4"

# Run E2E tests in headed mode
npm run test:e2e:ui

# Debug specific E2E test
npm run test:e2e:debug -- --grep "AC1"
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete)

**TEA Agent Responsibilities:**

- [x] All tests written with test.skip()
- [x] Tests assert expected behavior
- [x] Tests organized by acceptance criteria
- [x] Implementation checklist created

**Verification:**

- All tests are skipped (test.skip)
- Tests will fail until implementation is verified/enhanced
- Failure messages are clear and actionable

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist
2. **Verify or enhance the implementation** to make test pass
3. **Remove test.skip()** from that test
4. **Run the test** to verify it passes
5. **Check off the task** in implementation checklist
6. **Move to next test** and repeat

**Key Principles:**

- One test at a time
- Verify existing implementation first (most functions exist)
- Add enhancements only where needed
- Run tests frequently

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. **Verify all tests pass** (green phase complete)
2. **Review code quality** (readability, maintainability)
3. **Ensure no hardcoded test data**
4. **Update SKILL.md documentation** if needed
5. **Run full test suite** after refactoring

---

## Next Steps

1. **Review this checklist** with team
2. **Run failing tests** to confirm RED phase:
   ```bash
   npm run test:unit
   npm run test:e2e
   ```
3. **Begin implementation verification** using checklist
4. **Work one AC at a time** (AC1 -> AC5)
5. **Update SKILL.md** with error codes and debug usage
6. **Mark story as done** when all tests pass

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **data-factories.md** - Factory patterns for test data generation
- **test-quality.md** - Test design principles (Given-When-Then, one assertion per test)
- **test-healing-patterns.md** - Common failure patterns and fixes

---

## Notes

- Most error handling functions already exist in `tools/clis/polyv.js`
- This story focuses on **verifying and enhancing** existing implementation
- Key security requirement: appSecret must never appear in logs
- Debug mode should be opt-in (POLYV_DEBUG environment variable)

---

## Contact

**Questions or Issues?**

- Refer to `_bmad-output/implementation-artifacts/2-3-implement-error-handling-and-debug-mode.md`
- Refer to `tools/clis/polyv.js` for existing implementation

---

**Generated by BMad TEA Agent** - 2026-03-03
