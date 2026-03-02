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
  - _bmad-output/implementation-artifacts/2-2-create-polyv-create-channel-skill.md
  - _bmad/tea/testarch/knowledge/data-factories.md
  - _bmad/tea/testarch/knowledge/test-quality.md
  - _bmad/tea/testarch/knowledge/test-healing-patterns.md
---

# ATDD Checklist - Epic 2, Story 2.2: 创建 polyv-create-channel Skill 定义

**Date:** 2026-03-03
**Author:** Nick
**Primary Test Level:** E2E + Unit

---

## Story Summary

本 Story 旨在创建 `polyv-create-channel` Skill 定义文件（SKILL.md），使 Claude Code Agent 能够通过自然语言识别并调用该 Skill 来创建保利威直播频道。

**As a** polyv-skills 用户
**I want** 通过自然语言创建直播频道
**So that** 无需记忆复杂的 CLI 命令即可完成操作

---

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

---

## Failing Tests Created (RED Phase)

### E2E Tests (5 tests)

**File:** `tests/e2e/polyv-create-channel-skill.spec.ts` (约 200 行)

- **Test:** `[P0] should have valid SKILL.md file structure`
  - **Status:** RED - SKILL.md file does not exist yet
  - **Verifies:** AC1 - Skill 文件存在且格式正确

- **Test:** `[P0] should have correct skill name in frontmatter`
  - **Status:** RED - SKILL.md frontmatter not created
  - **Verifies:** AC1 - Skill name 必须为 `polyv-create-channel`

- **Test:** `[P1] should document name parameter as required`
  - **Status:** RED - 参数文档未创建
  - **Verifies:** AC2 - name 参数说明

- **Test:** `[P1] should document scene parameter with defaults`
  - **Status:** RED - 参数文档未创建
  - **Verifies:** AC2 - scene 参数说明和默认值

- **Test:** `[P1] should document template parameter with defaults`
  - **Status:** RED - 参数文档未创建
  - **Verifies:** AC2 - template 参数说明和默认值

### Unit Tests (7 tests)

**File:** `tests/unit/skill-definition.test.js` (约 180 行)

- **Test:** `[P0] should have valid YAML frontmatter in SKILL.md`
  - **Status:** RED - SKILL.md 不存在
  - **Verifies:** AC1 - YAML 格式正确

- **Test:** `[P0] should have required name field in frontmatter`
  - **Status:** RED - frontmatter 未创建
  - **Verifies:** AC1

- **Test:** `[P0] should have required description field in frontmatter`
  - **Status:** RED - frontmatter 未创建
  - **Verifies:** AC1

- **Test:** `[P1] should have CLI invocation section`
  - **Verifies:** AC1 - CLI 调用说明存在

- **Test:** `[P1] should document all parameters in table format`
  - **Status:** RED - 参数表未创建
  - **Verifies:** AC2

- **Test:** `[P1] should include usage examples`
  - **Status:** RED - 示例未创建
  - **Verifies:** AC1, AC3

- **Test:** `[P2] should document error handling guidance`
  - **Status:** RED - 错误处理文档未创建
  - **Verifies:** AC4

---

## Test Strategy

### Test Level Selection

| Acceptance Criteria | Test Level | Priority | Rationale |
|---------------------|------------|----------|-----------|
| AC1: Skill 自动调用 | E2E + Unit | P0 | 需要验证文件结构和 Agent 识别 |
| AC2: 参数解析 | Unit | P1 | 参数文档验证 |
| AC3: 缺失参数询问 | Unit | P1 | 交互逻辑验证 |
| AC4: 成功结果展示 | E2E | P1 | CLI 输出格式验证 |

### Priority Distribution

- **P0 (Critical):** 4 tests - 核心功能验证
- **P1 (High):** 6 tests - 重要功能验证
- **P2 (Medium):** 2 tests - 次要功能验证
- **P3 (Low):** 0 tests

---

## Required data-testid Attributes

由于 Skill 定义是 Markdown 文件，不涉及 UI 组件，因此不需要 data-testid 属性。

---

## Implementation Checklist

### Test: `[P0] should have valid SKILL.md file structure`

**File:** `tests/e2e/polyv-create-channel-skill.spec.ts`

**Tasks to make this test pass:**

- [ ] 创建 `skills/polyv-create-channel/SKILL.md` 文件
- [ ] 添加 YAML frontmatter（name, description）
- [ ] 添加功能说明部分
- [ ] 添加参数表部分
- [ ] 添加使用示例部分
- [ ] 运行测试: `npx playwright test tests/e2e/polyv-create-channel-skill.spec.ts`
- [ ] 测试通过（green phase）

**Estimated Effort:** 1 hour

---

### Test: `[P0] should have correct skill name in frontmatter`

**File:** `tests/e2e/polyv-create-channel-skill.spec.ts`

**Tasks to make this test pass:**

- [ ] 在 frontmatter 中设置 `name: polyv-create-channel`
- [ ] 确保名称与文件夹名称匹配
- [ ] 运行测试验证
- [ ] 测试通过（green phase）

**Estimated Effort:** 0.5 hour

---

### Test: `[P0] should have valid YAML frontmatter in SKILL.md`

**File:** `tests/unit/skill-definition.test.js`

**Tasks to make this test pass:**

- [ ] 确保 YAML frontmatter 格式正确
- [ ] 使用 YAML 解析器验证
- [ ] 运行测试: `npm run test:unit`
- [ ] 测试通过（green phase）

**Estimated Effort:** 0.5 hour

---

### Test: `[P1] should document all parameters in table format`

**File:** `tests/unit/skill-definition.test.js`

**Tasks to make this test pass:**

- [ ] 添加参数表，包含 name、scene、template
- [ ] 标注必填/可选
- [ ] 添加默认值说明
- [ ] 运行测试验证
- [ ] 测试通过（green phase）

**Estimated Effort:** 1 hour

---

## Running Tests

```bash
# Run all failing tests for this story
npm test

# Run E2E tests only
npm run test:e2e

# Run specific E2E test file
npx playwright test tests/e2e/polyv-create-channel-skill.spec.ts

# Run unit tests only
npm run test:unit

# Run tests in headed mode (see browser)
npm run test:e2e:ui

# Debug specific test
npx playwright test tests/e2e/polyv-create-channel-skill.spec.ts --debug
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete)

**TEA Agent Responsibilities:**

- All tests written and failing
- Tests designed to verify SKILL.md structure and content
- Implementation checklist created

**Verification:**

- All tests run and fail as expected
- Failure messages are clear and actionable
- Tests fail due to missing SKILL.md, not test bugs

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist (start with P0)
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

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. **Verify all tests pass** (green phase complete)
2. **Review SKILL.md for quality** (clarity, completeness)
3. **Ensure consistent formatting** throughout the document
4. **Add any missing examples** or clarifications
5. **Update references** if needed

---

## Next Steps

1. **Review this checklist** with team in standup or planning
2. **Run failing tests** to confirm RED phase: `npm test`
3. **Begin implementation** using implementation checklist as guide
4. **Work one test at a time** (red to green for each)
5. **When all tests pass**, update story status to 'done'

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **data-factories.md** - Factory patterns for test data generation
- **test-quality.md** - Test design principles (determinism, isolation, explicit assertions)
- **test-healing-patterns.md** - Common failure patterns and fixes

---

## Notes

- 本 Story 主要创建 Markdown 文件（SKILL.md），不涉及代码实现
- CLI 工具已在 Story 2.1 中完成实现
- 测试重点验证 Skill 定义的完整性和格式正确性
- 参考 Agent Skills 规范：https://agentskills.io

---

**Generated by BMad TEA Agent** - 2026-03-03
