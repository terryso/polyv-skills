/**
 * ATDD Unit Test Suite: polyv-create-channel Skill Definition
 * Story: 2.2 - 创建 polyv-create-channel Skill 定义
 * TDD Phase: RED (tests will fail until SKILL.md is created)
 *
 * These tests verify the SKILL.md file structure and content programmatically.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const SKILL_FILE_PATH = path.join(__dirname, '../../skills/polyv-create-channel/SKILL.md');

describe('Skill Definition - Story 2.2', () => {

  describe('File Existence', () => {

    it('[P0] should have SKILL.md file at correct location', () => {
      // THIS TEST WILL FAIL - SKILL.md does not exist yet
      assert.ok(fs.existsSync(SKILL_FILE_PATH), `SKILL.md should exist at ${SKILL_FILE_PATH}`);
    });

    it('[P0] should have non-empty SKILL.md file', () => {
      // THIS TEST WILL FAIL - file does not exist yet
      const stats = fs.statSync(SKILL_FILE_PATH);
      assert.ok(stats.size > 100, 'SKILL.md should have meaningful content (> 100 bytes)');
    });

  });

  describe('YAML Frontmatter', () => {

    it('[P0] should have valid YAML frontmatter', () => {
      // THIS TEST WILL FAIL - frontmatter not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Frontmatter should start with ---
      assert.ok(content.startsWith('---'), 'Content should start with ---');

      // Find closing ---
      const endIndex = content.indexOf('---', 3);
      assert.ok(endIndex > 3, 'Frontmatter should be closed with ---');
    });

    it('[P0] should have required name field in frontmatter', () => {
      // THIS TEST WILL FAIL - name field not defined yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');
      const frontmatter = extractFrontmatter(content);

      assert.ok(frontmatter.name, 'Frontmatter should have name field');
      assert.strictEqual(frontmatter.name, 'polyv-create-channel', 'Name should be polyv-create-channel');
    });

    it('[P0] should have required description field in frontmatter', () => {
      // THIS TEST WILL FAIL - description field not defined yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');
      const frontmatter = extractFrontmatter(content);

      assert.ok(frontmatter.description, 'Frontmatter should have description field');
      assert.ok(frontmatter.description.length >= 10, 'Description should be meaningful (>= 10 chars)');
    });

    it('[P1] description should mention channel creation', () => {
      // THIS TEST WILL FAIL - description content not defined yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');
      const frontmatter = extractFrontmatter(content);

      const descLower = frontmatter.description.toLowerCase();
      const hasKeywords = descLower.includes('创建') ||
                          descLower.includes('频道') ||
                          descLower.includes('channel') ||
                          descLower.includes('直播');

      assert.ok(hasKeywords, 'Description should mention channel creation');
    });

  });

  describe('Parameter Documentation', () => {

    it('[P1] should have parameter section', () => {
      // THIS TEST WILL FAIL - parameter section not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');
      const hasParamSection = /##?\s*参数|##?\s*Parameters/i.test(content);

      assert.ok(hasParamSection, 'Should have parameter section');
    });

    it('[P1] should document name parameter', () => {
      // THIS TEST WILL FAIL - name parameter not documented yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      assert.ok(content.includes('name'), 'Should mention name parameter');
      assert.ok(/必填|required/i.test(content), 'Should indicate name is required');
    });

    it('[P1] should document scene parameter with valid values', () => {
      // THIS TEST WILL FAIL - scene parameter not documented yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      assert.ok(content.includes('scene'), 'Should mention scene parameter');

      // Should list at least one valid value
      const hasValidValue = /topclass|train|alone|cloudclass|telecast|akt/.test(content);
      assert.ok(hasValidValue, 'Should list valid scene values');
    });

    it('[P1] should document template parameter with valid values', () => {
      // THIS TEST WILL FAIL - template parameter not documented yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      assert.ok(content.includes('template'), 'Should mention template parameter');

      // Should list valid values
      const hasValidValue = /ppt|video|alone/.test(content);
      assert.ok(hasValidValue, 'Should list valid template values');
    });

    it('[P1] should have parameter table format', () => {
      // THIS TEST WILL FAIL - parameter table not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have table delimiters
      const hasTable = content.includes('|') && content.split('|').length > 5;
      assert.ok(hasTable, 'Should have parameter table with | delimiters');
    });

  });

  describe('CLI Invocation Documentation', () => {

    it('[P1] should have CLI invocation section', () => {
      // THIS TEST WILL FAIL - CLI section not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');
      const hasCLISection = /##?\s*CLI|##?\s*调用|##?\s*命令/i.test(content);

      assert.ok(hasCLISection, 'Should have CLI invocation section');
    });

    it('[P1] should show correct CLI command', () => {
      // THIS TEST WILL FAIL - CLI command not documented yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      assert.ok(content.includes('node scripts/polyv.js'), 'Should show node command');
      assert.ok(content.includes('create-channel'), 'Should show create-channel command');
    });

    it('[P2] should show CLI command with name parameter', () => {
      // THIS TEST WILL FAIL - CLI example not documented yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      assert.ok(content.includes('--name'), 'Should show --name parameter');
    });

  });

  describe('Usage Examples', () => {

    it('[P1] should have usage examples section', () => {
      // THIS TEST WILL FAIL - examples section not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');
      const hasExamplesSection = /##?\s*示例|##?\s*Usage|##?\s*Example/i.test(content);

      assert.ok(hasExamplesSection, 'Should have usage examples section');
    });

    it('[P1] should have at least 2 usage examples', () => {
      // THIS TEST WILL FAIL - examples not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Count example markers
      const exampleCount = (content.match(/示例\s*\d|Example\s*\d|用户：/gi) || []).length;
      assert.ok(exampleCount >= 2, 'Should have at least 2 usage examples');
    });

    it('[P2] should include example with minimal parameters', () => {
      // THIS TEST WILL FAIL - minimal example not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have example with just name
      const hasMinimalExample = /创建.*频道|帮我创建|产品发布会/.test(content);
      assert.ok(hasMinimalExample, 'Should have example with minimal parameters');
    });

    it('[P2] should include example with all parameters', () => {
      // THIS TEST WILL FAIL - full example not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should have example with name, scene, and template
      const paramSectionMatch = content.match(/示例\s*3|Example\s*3|完整参数/i);
      assert.ok(paramSectionMatch, 'Should have example with all parameters');
    });

  });

  describe('Error Handling Documentation', () => {

    it('[P1] should have error handling section', () => {
      // THIS TEST WILL FAIL - error section not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');
      const hasErrorSection = /##?\s*错误|##?\s*Error|##?\s*注意事项/i.test(content);

      assert.ok(hasErrorSection, 'Should have error handling section');
    });

    it('[P2] should document common error codes', () => {
      // THIS TEST WILL FAIL - error codes not documented yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      const hasConfigError = content.includes('CONFIG_MISSING');
      const hasApiError = content.includes('API_ERROR');

      assert.ok(hasConfigError || hasApiError, 'Should document common error codes');
    });

  });

  describe('Output Format Documentation', () => {

    it('[P1] should document success output format', () => {
      // THIS TEST WILL FAIL - output format not documented yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');
      const hasOutputSection = /##?\s*输出|##?\s*Output|##?\s*响应/i.test(content);

      assert.ok(hasOutputSection, 'Should have output format section');
    });

    it('[P2] should show example success output', () => {
      // THIS TEST WILL FAIL - success output example not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      // Should show channelId in output
      const hasChannelId = content.includes('channelId') || content.includes('频道 ID');
      assert.ok(hasChannelId, 'Should show channelId in output example');
    });

  });

  describe('Content Quality', () => {

    it('[P2] should have notes or cautions section', () => {
      // THIS TEST WILL FAIL - notes section not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');
      const hasNotesSection = /##?\s*注意|##?\s*Notes|##?\s*提示/i.test(content);

      assert.ok(hasNotesSection, 'Should have notes or cautions section');
    });

    it('[P2] should mention credential requirements', () => {
      // THIS TEST WILL FAIL - credential notes not created yet
      const content = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

      const mentionsCredentials = content.includes('凭据') ||
                                   content.includes('appId') ||
                                   content.includes('配置');

      assert.ok(mentionsCredentials, 'Should mention credential requirements');
    });

  });

});

/**
 * Helper function to extract YAML frontmatter from content
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {};
  }

  const frontmatterText = match[1];
  const frontmatter = {};

  // Simple YAML parsing for key: value pairs
  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}
