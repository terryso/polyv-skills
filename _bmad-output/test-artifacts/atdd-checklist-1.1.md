---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: 2026-03-03
inputDocuments:
  - /Users/nick/projects/polyv/polyv-skills-story-1.1/_bmad-output/implementation-artifacts/1.1.md
  - /Users/nick/projects/polyv/polyv-skills-story-1.1/_bmad/tea/config.yaml
  - /Users/nick/projects/polyv/polyv-skills-story-1.1/_bmad/tea/testarch/knowledge/data-factories.md
  - /Users/nick/projects/polyv/polyv-skills-story-1.1/_bmad/tea/testarch/knowledge/test-quality.md
  - /Users/nick/projects/polyv/polyv-skills-story-1.1/_bmad/tea/testarch/knowledge/test-healing-patterns.md
  - /Users/nick/projects/polyv/polyv-skills-story-1.1/_bmad/tea/testarch/knowledge/test-levels-framework.md
---

# ATDD Checklist - Story 1.1: 创建项目结构和插件配置

---

**Date:** 2026-03-03
**Author:** Nick
**Primary Test Level:** E2E

---

## Story Summary

这是一个绿色field项目，需要创建 polyv-skills 插件的基础项目结构和配置文件。该 Story 綆盖创建目录结构、JSON 配置文件和文档文件,支持通过 Claude Code 市场、 npx skills、 Git Submodule 或 Clone & Copy 等多种方式安装。

**As a** polyv-skills 开发者
**I want** 创建标准的项目结构和 Claude Code 插件配置文件
**So that** 项目可以通过多种方式安装和使用。

## Acceptance Criteria
### AC1: 项目目录结构
- 验证 `.claude-plugin/marketplace.json` 文件存在
- 验证 `.claude-plugin/plugin.json` 文件存在
- 验证 `skills/` 目录存在
- 验证 `tools/clis/` 目录存在
- 验证 `tools/integrations/` 目录存在
- 验证 `tools/REGISTRY.md` 文件存在
- 验证 `README.md` 文件存在
- 验证 `AGENTS.md` 文件存在
- 验证 `.gitignore` 文件存在
- 验证 `LICENSE` 文件存在
- 验证 `config/config.example.json` 文件存在

### AC2: marketplace.json 配置正确
- 验证 `name` 字段为 "polyv-skills"
- 验证 `owner.name` 字段为 "Nick"
- 验证 `metadata.description` 包含 polyv 相关描述
- 验证 `plugins` 数组包含正确的插件定义

### AC3: plugin.json 配置正确
- 验证 `name` 字段为 "polyv-skills"
- 验证 `version` 字段为 "1.0.0"
- 验证 `skills` 数组包含 `"./skills/"`

---

## Failing Tests Created (RED Phase)

### API Tests (15 tests)
**File:** `tests/api/project-structure.spec.ts` (102 lines)
- Tests verify directory and file existence (AC1)
- All tests use `test.skip()` to mark as RED phase
- Expected failure: Feature not implemented yet
**File:** `tests/api/marketplace-config.spec.ts` (75 lines)
- Tests verify marketplace.json structure and required fields (AC2)
- All tests use `test.skip()` to mark as RED phase
- Expected failure: Feature not implemented yet
**File:** `tests/api/plugin-config.spec.ts` (90 lines)
- Tests verify plugin.json structure and required fields (AC3)
- All tests use `test.skip()` to mark as RED phase
- Expected failure: Feature not implemented yet
### E2E Tests (3 tests)
**File:** `tests/e2e/plugin-installation.spec.ts` (85 lines)
- Tests verify end-to-end plugin installation workflow
- All tests use `test.skip()` to mark as RED phase
- Expected failure: Feature not implemented yet

---

## Data Factories Created
### Test Data Factory
**File:** `tests/support/fixtures/test-data.ts`
**Exports:**
- `createMarketplaceConfig(overrides?)` - Create marketplace config with optional overrides
- `createPluginConfig(overrides?)` - Create plugin config with optional overrides
- `createProjectStructure()` - Create complete project structure object
**Example Usage:**
```typescript
import { createMarketplaceConfig, createPluginConfig } from './fixtures/test-data';

const marketplace = createMarketplaceConfig({
  owner: { name: 'CustomOwner' }
});
```

---

## Fixtures Created
### Test Data Fixtures
**File:** `tests/support/fixtures/test-data.ts`
**Fixtures:**
- Test data generators for marketplace and plugin configs
- Uses `@faker-js/faker` for unique test data
- **Setup:** Factory functions create test objects
- **Provides:** Consistent test data across test suites
- **Cleanup:** No cleanup needed (pure functions)

**Example Usage:**
```typescript
import { createMarketplaceConfig } from './fixtures/test-data';

test('should validate marketplace config', async () => {
  const marketplace = createMarketplaceConfig();
  expect(marketplace.name).toBe('polyv-skills');
});
```

---

## Mock Requirements
No external services need mocking - all tests use local file system operations.

---

## Required data-testid Attributes
Not applicable - these tests use file system and JSON parsing, not UI interactions.

---

## Implementation Checklist
### Test: should create all required directories
**File:** `tests/api/project-structure.spec.ts`
**Tasks to make this test pass:**
- [ ] Create `.claude-plugin/` directory
- [ ] Create `skills/` directory
- [ ] Create `tools/clis/` directory
- [ ] Create `tools/integrations/` directory
- [ ] Create `config/` directory
- [ ] Run test: `npx playwright test project-structure.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.5 hours

---
### Test: should create .claude-plugin/marketplace.json
**File:** `tests/api/project-structure.spec.ts`
**Tasks to make this test pass:**
- [ ] Create `.claude-plugin/marketplace.json` file
- [ ] Add required fields: name, owner, metadata, plugins
- [ ] Run test: `npx playwright test project-structure.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.5 hours

---
### Test: should create .claude-plugin/plugin.json
**File:** `tests/api/project-structure.spec.ts`
**Tasks to make this test pass:**
- [ ] Create `.claude-plugin/plugin.json` file
- [ ] Add required fields: name, version, skills
- [ ] Run test: `npx playwright test project-structure.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.5 hours
---
### Test: should create README.md
**File:** `tests/api/project-structure.spec.ts`
**Tasks to make this test pass:**
- [ ] Create `README.md` with installation instructions
- [ ] Include all installation methods (marketplace, npx, git submodule, clone)
- [ ] Run test: `npx playwright test project-structure.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.5 hours
---
### Test: should create AGENTS.md
**File:** `tests/api/project-structure.spec.ts`
**Tasks to make this test pass:**
- [ ] Create `AGENTS.md` with agent usage instructions
- [ ] Run test: `npx playwright test project-structure.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should create tools/REGISTRY.md
**File:** `tests/api/project-structure.spec.ts`
**Tasks to make this test pass:**
- [ ] Create `tools/REGISTRY.md` with tool registry
- [ ] Run test: `npx playwright test project-structure.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should create LICENSE file
**File:** `tests/api/project-structure.spec.ts`
**Tasks to make this test pass:**
- [ ] Create `LICENSE` file with MIT license text
- [ ] Run test: `npx playwright test project-structure.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should create .gitignore
**File:** `tests/api/project-structure.spec.ts`
**Tasks to make this test pass:**
- [ ] Create `.gitignore` with common ignore patterns
- [ ] Include: node_modules/, config files, IDE files, OS files
- [ ] Run test: `npx playwright test project-structure.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should create config/config.example.json
**File:** `tests/api/project-structure.spec.ts`
**Tasks to make this test pass:**
- [ ] Create `config/config.example.json` with example configuration
- [ ] Run test: `npx playwright test project-structure.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should have owner configuration in marketplace.json
**File:** `tests/api/marketplace-config.spec.ts`
**Tasks to make this test pass:**
- [ ] Ensure marketplace.json has owner object
- [ ] Ensure owner.name is "Nick"
- [ ] Run test: `npx playwright test marketplace-config.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should have description in metadata
**File:** `tests/api/marketplace-config.spec.ts`
**Tasks to make this test pass:**
- [ ] Ensure marketplace.json has metadata object
- [ ] Ensure metadata.description contains polyv reference
- [ ] Run test: `npx playwright test marketplace-config.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should have correct plugins array
**File:** `tests/api/marketplace-config.spec.ts`
**Tasks to make this test pass:**
- [ ] Ensure plugins array exists and has at least one item
- [ ] Ensure plugin has name, source, license fields
- [ ] Run test: `npx playwright test marketplace-config.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should have name in plugin.json
**File:** `tests/api/plugin-config.spec.ts`
**Tasks to make this test pass:**
- [ ] Ensure plugin.json exists
- [ ] Ensure name is "polyv-skills"
- [ ] Run test: `npx playwright test plugin-config.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should have version in plugin.json
**File:** `tests/api/plugin-config.spec.ts`
**Tasks to make this test pass:**
- [ ] Ensure version is "1.0.0"
- [ ] Run test: `npx playwright test plugin-config.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should have skills array pointing to ./skills/
**File:** `tests/api/plugin-config.spec.ts`
**Tasks to make this test pass:**
- [ ] Ensure skills array exists
- [ ] Ensure skills contains "./skills/"
- [ ] Run test: `npx playwright test plugin-config.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.25 hours
---
### Test: should support marketplace installation workflow
**File:** `tests/e2e/plugin-installation.spec.ts`
**Tasks to make this test pass:**
- [ ] Verify marketplace.json has correct plugin references
- [ ] Run test: `npx playwright test plugin-installation.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.5 hours
---
### Test: should have valid plugin.json structure for skills loading
**File:** `tests/e2e/plugin-installation.spec.ts`
**Tasks to make this test pass:**
- [ ] Verify plugin.json skills array points to skills directory
- [ ] Verify skills directory exists
- [ ] Run test: `npx playwright test plugin-installation.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.5 hours
---
### Test: should support multiple installation methods as documented
**File:** `tests/e2e/plugin-installation.spec.ts`
**Tasks to make this test pass:**
- [ ] Verify README.md documents all installation methods
- [ ] Run test: `npx playwright test plugin-installation.spec.ts`
- [ ] Test passes (green phase)
**Estimated Effort:** 0.5 hours

---

## Running Tests
```bash
# Run all failing tests for this story
npx playwright test tests/api/
npx playwright test tests/e2e/

# Run specific test file
npx playwright test tests/api/project-structure.spec.ts

# Run tests in headed mode (see browser)
npx playwright test tests/api/project-structure.spec.ts --headed

# Debug specific test
npx playwright test tests/api/project-structure.spec.ts --debug
# Run tests with coverage
npx playwright test tests/api/project-structure.spec.ts --coverage
```

---

## Red-Green-Refactor Workflow
### RED Phase (Complete)
**TEA Agent Responsibilities:**
- All tests written and failing (using test.skip())
- Fixtures and factories created with auto-cleanup
- Mock requirements documented
- data-testid requirements listed
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
3. **Run failing tests** to confirm RED phase: `npx playwright test tests/`
4. **Begin implementation** using implementation checklist as guide
5. **Work one test at a time** (red to green for each)
6. **Share progress** in daily standup
7. **When all tests pass**, refactor code for quality
8. **When refactoring complete**, manually update story status to 'done' in sprint-status.yaml
---

## Knowledge Base References Applied
This ATDD workflow consulted the following knowledge fragments:
- **data-factories.md** - Factory patterns using `@faker-js/faker` for random test data generation with overrides support
- **test-quality.md** - Test design principles (Given-When-Then, one assertion per test, determinism, isolation)
- **test-levels-framework.md** - Test level selection framework (E2E vs API vs Component vs Unit)
- **test-healing-patterns.md** - Common failure patterns and automated fixes

See `tea-index.csv` for complete knowledge fragment mapping.
---

## Notes
- This is a greenfield project - no existing test infrastructure
- Tests use Playwright with `test.skip()` to mark RED phase
- Total estimated effort: ~3 hours

- Priority: P1 (critical path for plugin functionality)

---

## Contact
**Questions or Issues?**
- Ask in team standup
- Tag TEA Agent in Slack/Discord
- Refer to `./bmm/docs/tea-README.md` for workflow documentation
- Consult `./bmm/testarch/knowledge` for testing best practices
---

**Generated by BMad TEA Agent** - 2026-03-03
