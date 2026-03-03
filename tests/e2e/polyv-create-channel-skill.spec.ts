/**
 * ATDD E2E Test Suite: polyv-create-channel Skill Definition
 * Story: 2.2 - 创建 polyv-create-channel Skill 定义
 * TDD Phase: RED (tests will fail until SKILL.md is created)
 *
 * Acceptance Criteria:
 * - AC1: Skill 自动调用 - Agent 能够识别并调用 Skill
 * - AC2: 参数解析 - Skill 正确解析 name, scene, template 参数
 * - AC3: 缺失参数询问 - 当缺少必填参数时提示用户
 * - AC4: 成功结果展示 - 显示频道 ID 和基本信息
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SKILL_FILE_PATH = path.join(process.cwd(), 'skills', 'polyv-create-channel', 'SKILL.md');
const ADVANCED_PARAMS_PATH = path.join(process.cwd(), 'skills', 'polyv-create-channel', 'references', 'advanced-parameters.md');

test.describe('polyv-create-channel Skill Definition E2E Tests (ATDD)', () => {

  test.describe('AC1: Skill 自动调用', () => {

    test('[P0] should have valid SKILL.md file structure', async () => {
      // THIS TEST WILL FAIL - SKILL.md file does not exist yet

      // Verify the SKILL.md file exists
      expect(fs.existsSync(SKILL_FILE_PATH)).toBe(true);

      // Read the file content
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Verify it's not empty
      expect(content.length).toBeGreaterThan(100);

      // Verify it contains expected sections
      expect(content).toContain('---'); // YAML frontmatter delimiter
      expect(content).toContain('name:');
      expect(content).toContain('description:');
    });

    test('[P0] should have correct skill name in frontmatter', async () => {
      // THIS TEST WILL FAIL - SKILL.md frontmatter not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      expect(frontmatterMatch).not.toBeNull();

      const frontmatter = frontmatterMatch![1];

      // Verify name field
      expect(frontmatter).toContain('name: polyv-create-channel');
    });

    test('[P0] should have descriptive description in frontmatter', async () => {
      // THIS TEST WILL FAIL - description not written yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      const frontmatter = frontmatterMatch![1];

      // Verify description exists and is meaningful
      expect(frontmatter).toContain('description:');
      expect(frontmatter).toMatch(/description:.{10,}/); // At least 10 chars

      // Should mention key functionality
      expect(frontmatter.toLowerCase()).toMatch(/创建|频道|直播|channel/);
    });

  });

  test.describe('AC2: 参数解析', () => {

    test('[P1] should document name parameter as required', async () => {
      // THIS TEST WILL FAIL - parameter documentation not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have a parameters section
      expect(content.toLowerCase()).toMatch(/##?\s*参数|##?\s*parameters/);

      // Should document the name parameter
      expect(content).toContain('name');
      expect(content).toMatch(/必填|required/);
    });

    test('[P1] should document scene parameter with defaults', async () => {
      // THIS TEST WILL FAIL - scene parameter documentation not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should document the scene parameter
      expect(content).toContain('scene');

      // Should list valid values
      expect(content).toMatch(/topclass|train|alone/);

      // Should mention default value
      expect(content).toMatch(/默认|default.*topclass/);
    });

    test('[P1] should document template parameter with defaults', async () => {
      // THIS TEST WILL FAIL - template parameter documentation not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should document the template parameter
      expect(content).toContain('template');

      // Should list valid values
      expect(content).toMatch(/ppt|video|alone/);

      // Should mention default value
      expect(content).toMatch(/默认|default.*ppt/);
    });

    test('[P1] should have parameter table with all fields', async () => {
      // THIS TEST WILL FAIL - parameter table not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have a table structure
      expect(content).toContain('|');

      // Table should have headers
      expect(content).toMatch(/\|\s*参数|\|\s*Parameter/);
      expect(content).toMatch(/\|\s*必填|\|\s*Required/);
      expect(content).toMatch(/\|\s*说明|\|\s*Description/);
    });

  });

  test.describe('AC3: 缺失参数询问', () => {

    test('[P1] should include usage examples showing parameter extraction', async () => {
      // THIS TEST WILL FAIL - usage examples not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have examples section
      expect(content.toLowerCase()).toMatch(/##?\s*示例|##?\s*usage|##?\s*example/);

      // Should have at least one example
      expect(content).toMatch(/示例\s*1|Example\s*1|用户：/);
    });

    test('[P2] should show example with only name parameter', async () => {
      // THIS TEST WILL FAIL - simplified example not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have a simple example using just name
      expect(content).toMatch(/创建.*频道.*"|帮我创建/);
    });

  });

  test.describe('AC4: 成功结果展示', () => {

    test('[P1] should document expected output format', async () => {
      // THIS TEST WILL FAIL - output format documentation not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have output section
      expect(content.toLowerCase()).toMatch(/##?\s*输出|##?\s*output|##?\s*响应/);

      // Should mention channelId
      expect(content).toMatch(/channelId|频道\s*ID/);
    });

    test('[P1] should document error handling', async () => {
      // THIS TEST WILL FAIL - error handling documentation not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have error section
      expect(content.toLowerCase()).toMatch(/##?\s*错误|##?\s*error/);

      // Should mention common error codes
      expect(content).toMatch(/CONFIG_MISSING|API_ERROR/);
    });

    test('[P2] should document CLI invocation command', async () => {
      // THIS TEST WILL FAIL - CLI documentation not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have CLI section
      expect(content.toLowerCase()).toMatch(/##?\s*cli|##?\s*调用/);

      // Should show the command
      expect(content).toContain('node scripts/polyv.js create-channel');
    });

  });

  test.describe('File Structure', () => {

    test('[P2] should have references directory', async () => {
      // THIS TEST WILL FAIL - references directory verification

      const referencesDir = path.join(process.cwd(), 'skills', 'polyv-create-channel', 'references');
      expect(fs.existsSync(referencesDir)).toBe(true);
    });

    test('[P2] should have advanced-parameters.md in references', async () => {
      // Advanced parameters guide should exist

      expect(fs.existsSync(ADVANCED_PARAMS_PATH)).toBe(true);
    });

  });

  test.describe('SKILL.md Content Quality', () => {

    test('[P2] should have clear description of functionality', async () => {
      // THIS TEST WILL FAIL - functionality description not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have a功能说明 section
      expect(content.toLowerCase()).toMatch(/##?\s*功能|##?\s*说明|##?\s*overview/);
    });

    test('[P2] should include notes or cautions section', async () => {
      // THIS TEST WILL FAIL - notes section not created yet

      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have notes section
      expect(content.toLowerCase()).toMatch(/##?\s*注意|##?\s*notes/);
    });

  });

});
